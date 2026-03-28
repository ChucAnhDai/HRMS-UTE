import { employeeRepo } from '../repositories/employee-repo'
import { payrollRepo } from '../repositories/payroll-repo'
import { attendanceRepo } from '../repositories/attendance-repo'
import { overtimeRepo } from '../repositories/overtime-repo'
import { leaveRepo } from '../repositories/leave-repo'
import { settingRepo } from '../repositories/setting-repo'
import { rewardPenaltyRepo } from '../repositories/reward-penalty-repo'
import { salaryAdvanceRepo } from '../repositories/salary-advance-repo'
import { Payslip, PayslipUpdateDTO, LeaveRequest, Employee } from '../../types'

// ─── Import helpers (clean code) ─────────────────────────────────────
import { calculateWorkingDays, parseWeekendDays, countBusinessDays } from '@/lib/working-days'
import {
  calculateProgressiveTax,
  calculateSocialInsurance,
  clampDeductions,
  parseTaxBrackets,
  TaxBracket,
  safeNum
} from '@/lib/payroll-helpers'
import pLimit from 'p-limit'

// ─── Types ────────────────────────────────────────────────────────────
interface PayrollSettings {
  insuranceRate: number
  standardWorkDays: number
  personalDeduction: number
  dependentDeductionVal: number
  penaltyLateAmount: number
  taxBrackets: TaxBracket[]
  weekendDays: number[]
  holidays: { date: string; name?: string }[]
}

// ─── Service ──────────────────────────────────────────────────────────
export const payrollService = {

  // ═══════════════════════════════════════════════════════════════════
  // Hàm chính: Tính lương cho toàn bộ nhân viên trong tháng
  // ═══════════════════════════════════════════════════════════════════
  async generateMonthlyPayroll(month: number, year: number) {
    // 1. Lấy danh sách nhân viên đang active
    const employees = await employeeRepo.getEmployees()
    const activeEmployees = employees?.filter(
      e => e.employment_status === 'Active' || e.employment_status === 'Probation'
    ) || []

    if (activeEmployees.length === 0) {
      throw new Error('Không có nhân viên nào để tính lương')
    }

    // 2. Fetch Global Settings & Data
    const settings = await settingRepo.getSettings()
    const holidays = await settingRepo.getHolidays(year)

    // Parse settings an toàn
    const payrollSettings = parsePayrollSettings(settings, month, year, holidays)
    const { standardWorkDays, taxBrackets } = payrollSettings

    // Bảo vệ: nếu không có ngày công nào (tháng toàn nghỉ?) → vẫn phải tính
    if (standardWorkDays === 0) {
      console.warn(`[Payroll] Tháng ${month}/${year}: 0 ngày công chuẩn. Kiểm tra cấu hình weekend/holidays.`)
    }

    // 3. Tính lương cho từng nhân viên (limited concurrency — tối đa 5 cùng lúc)
    const limit = pLimit(5)
    const payslips = await Promise.all(
      activeEmployees.map(emp =>
        limit(() => calculateEmployeePayslip(emp, month, year, payrollSettings, taxBrackets))
      )
    )

    // 4. Lưu xuống DB
    if (payslips.length > 0) {
      await payrollRepo.upsertPayslips(payslips as Partial<Payslip>[])
      return payslips as Payslip[]
    }

    return [] as Payslip[]
  },

  // ═══════════════════════════════════════════════════════════════════
  // Lấy danh sách bảng lương
  // ═══════════════════════════════════════════════════════════════════
  async getPayrollList(month: number, year: number) {
    return await payrollRepo.getPayslips(month, year)
  },

  // ═══════════════════════════════════════════════════════════════════
  // Cập nhật phiếu lương và tính lại các số liệu
  // ═══════════════════════════════════════════════════════════════════
  async updatePayslip(id: number, data: PayslipUpdateDTO) {
    const current = await payrollRepo.getPayslipById(id)
    if (!current) throw new Error('Không tìm thấy phiếu lương')

    // Fetch settings + dynamic working days
    const settings = await settingRepo.getSettings()
    const holidays = await settingRepo.getHolidays(current.year)
    const payrollSettings = parsePayrollSettings(
      settings, current.month, current.year, holidays
    )

    const { standardWorkDays, insuranceRate, personalDeduction, dependentDeductionVal } = payrollSettings
    const taxBrackets = payrollSettings.taxBrackets

    // Giữ nguyên các giá trị cũ nếu không update
    const newSalaryBase = data.salary !== undefined ? Number(data.salary) : safeNum(current.salary)
    const newOtHours = data.ot_hours !== undefined ? Number(data.ot_hours) : safeNum(current.ot_hours)

    // Auto calculate OT Salary based on formula
    const dailySalary = standardWorkDays > 0 ? newSalaryBase / standardWorkDays : 0
    const hourlyRate = dailySalary / 8
    const newOtSalary = Math.round(hourlyRate * 1.5 * newOtHours)

    const newBonus = data.bonus !== undefined ? Number(data.bonus) : safeNum(current.bonus)
    const newAdvance = data.advance_amount !== undefined ? Number(data.advance_amount) : safeNum(current.advance_amount)
    const inputPenalties = data.penalties !== undefined ? Number(data.penalties) : safeNum(current.penalties)
    const newNote = data.note !== undefined ? data.note : current.notes

    // Thu nhập từ công (Recalculate logic)
    let newGrossFromWork = safeNum(current.gross_from_work)
    const oldSalaryBase = safeNum(current.salary)
    
    // Fallback if legacy record without gross_from_work
    if (newGrossFromWork === 0 && Number(current.net_pay) > 0) {
      const oldDeductions = safeNum(current.social_insurance) + safeNum(current.tax) + safeNum(current.penalties) + safeNum(current.advance_amount)
      const oldGrossTotal = safeNum(current.net_pay) + oldDeductions
      newGrossFromWork = oldGrossTotal - safeNum(current.ot_salary) - safeNum(current.bonus)
    }

    if (oldSalaryBase !== newSalaryBase && oldSalaryBase > 0) {
      const ratio = newSalaryBase / oldSalaryBase
      newGrossFromWork = newGrossFromWork * ratio
    } else if (oldSalaryBase === 0 && newSalaryBase > 0) {
      newGrossFromWork = newSalaryBase
    }

    const totalIncome = newGrossFromWork + newOtSalary + newBonus

    // Tính BHXH — sử dụng helper (ước lượng totalBillableDays từ grossFromWork)
    const estimatedBillableDays = standardWorkDays > 0 && dailySalary > 0
      ? Math.round(newGrossFromWork / dailySalary)
      : 0
    const socialInsurance = calculateSocialInsurance(newSalaryBase, insuranceRate, estimatedBillableDays)

    // Tính thuế
    const dependents = Number(current.employees?.dependents) || 0
    const dependentDeduction = dependents * dependentDeductionVal
    const taxableIncome = Math.max(0, totalIncome - socialInsurance - personalDeduction - dependentDeduction)
    const tax = calculateProgressiveTax(taxableIncome, taxBrackets)

    // Clamp deductions (chống âm lương vô lý)
    const result = clampDeductions(
      { socialInsurance, tax, penalties: inputPenalties, advanceAmount: newAdvance, totalIncome },
      estimatedBillableDays > 0 ? estimatedBillableDays : 0
    )

    // Update
    await payrollRepo.updatePayslip(id, {
      salary: newSalaryBase,
      ot_hours: newOtHours,
      ot_salary: newOtSalary,
      bonus: newBonus,
      advance_amount: result.advanceAmount,
      penalties: result.penalties,
      social_insurance: result.socialInsurance,
      tax: result.tax,
      net_pay: result.netPay,
      notes: newNote
    })

    return { success: true }
  },

  // ═══════════════════════════════════════════════════════════════════
  // Lấy lịch sử lương của nhân viên
  // ═══════════════════════════════════════════════════════════════════
  async getPayrollsByEmployeeId(employeeId: number): Promise<Payslip[]> {
    return await payrollRepo.getPayslipsByEmployeeId(employeeId)
  },

  // ═══════════════════════════════════════════════════════════════════
  // Lấy chi tiết phiếu lương
  // ═══════════════════════════════════════════════════════════════════
  async getPayslipById(id: number): Promise<Payslip | null> {
    return await payrollRepo.getPayslipById(id)
  },

  // ═══════════════════════════════════════════════════════════════════
  // Đánh dấu bảng lương đã thanh toán
  // ═══════════════════════════════════════════════════════════════════
  async markPayrollAsPaid(month: number, year: number) {
    await payrollRepo.updateMonthStatus(month, year, 'Paid')
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Private helpers
// ═══════════════════════════════════════════════════════════════════════

/**
 * Parse settings từ DB thành PayrollSettings object.
 * Tính dynamic standardWorkDays thay vì dùng giá trị tĩnh.
 */
function parsePayrollSettings(
  settings: Record<string, string>,
  month: number,
  year: number,
  holidays: { date: string; name?: string }[]
): PayrollSettings {
  const weekendDays = parseWeekendDays(settings['weekend_days'])
  const standardWorkDays = calculateWorkingDays(month, year, weekendDays, holidays)

  return {
    insuranceRate: parseFloat(settings['insurance_percent'] || '10.5') / 100,
    standardWorkDays,
    personalDeduction: parseInt(settings['personal_deduction'] || '11000000'),
    dependentDeductionVal: parseInt(settings['dependent_deduction'] || '4400000'),
    penaltyLateAmount: parseInt(settings['penalty_late'] || '50000'),
    taxBrackets: parseTaxBrackets(settings['tax_brackets']),
    weekendDays,
    holidays
  }
}

/**
 * Tính lương cho 1 nhân viên trong tháng.
 * Logic chính đã tách helpers ra ngoài → clean, dễ maintain.
 */
async function calculateEmployeePayslip(
  emp: Employee,
  month: number,
  year: number,
  settings: PayrollSettings,
  taxBrackets: TaxBracket[]
): Promise<Partial<Payslip>> {
  const { standardWorkDays, insuranceRate, personalDeduction, dependentDeductionVal, penaltyLateAmount } = settings
  const salaryBase = Number(emp.salary) || 0

  // Bảo vệ chia cho 0
  const dailySalary = standardWorkDays > 0 ? salaryBase / standardWorkDays : 0

  // --- A. Thu nhập ---

  // 1. Attendance (ngày công thực tế)
  const attendanceStats = await attendanceRepo.getMonthlyStats(emp.id, month, year)
  const actualWorkDays = attendanceStats.work_days
  const lateCount = attendanceStats.late_days

  // 2. Approved Leaves & Quota Logic
  const { paidLeaveDays, unpaidLeaveDays } = await calculateLeaves(emp, month, year, settings.weekendDays, settings.holidays)

  // 3. Overtime
  const otHours = await overtimeRepo.getMonthlyApprovedHours(emp.id, month, year)
  const hourlyRate = dailySalary / 8
  const otSalary = Math.round(hourlyRate * 1.5 * otHours)

  // 4. Rewards & Penalties (khen thưởng / kỷ luật riêng)
  const rewardsPenalties = await rewardPenaltyRepo.getByEmployeeAndMonth(emp.id, month, year)
  const totalRewards = rewardsPenalties
    ?.filter(rp => rp.type === 'Reward' && rp.status !== 'Pending')
    .reduce((sum, rp) => sum + Number(rp.amount), 0) || 0

  const totalSpecificPenalties = rewardsPenalties
    ?.filter(rp => rp.type === 'Penalty')
    .reduce((sum, rp) => sum + Number(rp.amount), 0) || 0

  const bonus = totalRewards

  // Tính gross salary từ ngày công
  const totalBillableDays = actualWorkDays + paidLeaveDays
  const grossSalaryByWorkDays = dailySalary * totalBillableDays

  // --- B. Khấu trừ ---

  // 1. BHXH (theo luật VN: < 14 ngày → miễn)
  const socialInsurance = calculateSocialInsurance(salaryBase, insuranceRate, totalBillableDays)

  // 2. Phạt đi muộn (= 0 nếu không đi làm ngày nào)
  const latePenalty = lateCount * penaltyLateAmount
  const rawPenalties = latePenalty + totalSpecificPenalties

  // 3. Salary Advances (tạm ứng)
  const advanceAmount = await salaryAdvanceRepo.getTotalApprovedAdvances(emp.id, month, year)

  // 4. Thuế TNCN
  const totalIncome = grossSalaryByWorkDays + otSalary + bonus
  const dependentDeduction = (emp.dependents || 0) * dependentDeductionVal
  const taxableIncome = Math.max(0, totalIncome - socialInsurance - personalDeduction - dependentDeduction)
  const tax = calculateProgressiveTax(taxableIncome, taxBrackets)

  // --- C. Clamp deductions (chống âm lương vô lý) ---
  const result = clampDeductions(
    { socialInsurance, tax, penalties: rawPenalties, advanceAmount, totalIncome },
    actualWorkDays
  )

  return {
    employee_id: emp.id,
    month,
    year,
    salary: salaryBase,
    ot_hours: otHours,
    ot_salary: otSalary,
    bonus,
    tax: result.tax,
    social_insurance: result.socialInsurance,
    penalties: result.penalties,
    advance_amount: result.advanceAmount,
    net_pay: result.netPay,
    status: 'Pending',
    notes: `Công: ${actualWorkDays}/${standardWorkDays}. Nghỉ có lương: ${paidLeaveDays}. Nghỉ không lương: ${unpaidLeaveDays}. Trễ: ${lateCount}. Ngày công chuẩn tháng: ${standardWorkDays}.${advanceAmount > 0 ? ` Tạm ứng: ${advanceAmount.toLocaleString('vi-VN')}đ.` : ''}`,
    gross_from_work: grossSalaryByWorkDays,
    actual_work_days: actualWorkDays,
    paid_leave_days: paidLeaveDays
  }
}

/**
 * Tính toán nghỉ phép (có lương / không lương) cho 1 nhân viên trong tháng.
 */
async function calculateLeaves(
  emp: Employee, 
  month: number, 
  year: number,
  weekendDays: number[],
  holidays: { date: string; name?: string }[]
) {
  // Quotas
  const quotas = {
    'Annual': emp.annual_leave_quota || 12,
    'Sick': emp.sick_leave_quota || 5,
    'Other': emp.other_leave_quota || 5
  }

  // Helper: Tính số ngày nghỉ đã dùng year-to-date (trước tháng hiện tại)
  const allLeaves = await leaveRepo.getAllYearlyApprovedLeaves(year, emp.id)
  let usedAnnual = 0, usedSick = 0, usedOther = 0

  if (allLeaves && allLeaves.length > 0) {
    allLeaves.forEach(leave => {
      const start = new Date(leave.start_date)
      const leaveMonth = start.getMonth() + 1
      if (leaveMonth < month) {
        const end = new Date(leave.end_date)
        const days = countBusinessDays(start, end, weekendDays, holidays)
        if (leave.leave_type === 'Annual') usedAnnual += days
        else if (leave.leave_type === 'Sick') usedSick += days
        else usedOther += days
      }
    })
  }

  const remainingAnnual = Math.max(0, quotas['Annual'] - usedAnnual)
  const remainingSick = Math.max(0, quotas['Sick'] - usedSick)
  const remainingOther = Math.max(0, quotas['Other'] - usedOther)

  // Calculate leaves IN THIS MONTH
  const approvedLeaves = await leaveRepo.getApprovedLeaves(month, year, emp.id)

  let totalLeaveDaysInMonth_Annual = 0
  let totalLeaveDaysInMonth_Sick = 0
  let totalLeaveDaysInMonth_Other = 0

  if (approvedLeaves && approvedLeaves.length > 0) {
    (approvedLeaves as LeaveRequest[]).forEach((leave: LeaveRequest) => {
      const start = new Date(leave.start_date)
      const end = new Date(leave.end_date)
      const days = countBusinessDays(start, end, weekendDays, holidays)

      if (leave.leave_type === 'Annual') totalLeaveDaysInMonth_Annual += days
      else if (leave.leave_type === 'Sick') totalLeaveDaysInMonth_Sick += days
      else totalLeaveDaysInMonth_Other += days
    })
  }

  // Apply Quotas
  const processLeaveType = (total: number, remaining: number) => {
    const paid = Math.min(total, remaining)
    const unpaid = total - paid
    return { paid, unpaid }
  }

  const annualCalc = processLeaveType(totalLeaveDaysInMonth_Annual, remainingAnnual)
  const sickCalc = processLeaveType(totalLeaveDaysInMonth_Sick, remainingSick)
  const otherCalc = processLeaveType(totalLeaveDaysInMonth_Other, remainingOther)

  return {
    paidLeaveDays: annualCalc.paid + sickCalc.paid + otherCalc.paid,
    unpaidLeaveDays: annualCalc.unpaid + sickCalc.unpaid + otherCalc.unpaid,
  }
}
