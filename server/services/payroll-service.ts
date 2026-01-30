import { employeeRepo } from '../repositories/employee-repo'
import { payrollRepo } from '../repositories/payroll-repo'
import { attendanceRepo } from '../repositories/attendance-repo'
import { overtimeRepo } from '../repositories/overtime-repo'
import { leaveRepo } from '../repositories/leave-repo'
import { settingRepo } from '../repositories/setting-repo'
import { rewardPenaltyRepo } from '../repositories/reward-penalty-repo'
import { salaryAdvanceRepo } from '../repositories/salary-advance-repo'
import { Payslip, PayslipUpdateDTO, LeaveRequest } from '../../types'

export const payrollService = {
  // Hàm chính: Tính lương cho toàn bộ nhân viên trong tháng
  async generateMonthlyPayroll(month: number, year: number) {
    // 1. Lấy danh sách nhân viên đang active
    const employees = await employeeRepo.getEmployees()
    const activeEmployees = employees?.filter(e => e.employment_status === 'Active' || e.employment_status === 'Probation') || []

    if (activeEmployees.length === 0) {
        throw new Error('Không có nhân viên nào để tính lương')
    }

    // 2. Fetch Global Settings & Data
    await payrollRepo.deleteMonthlyPayroll(month, year)
    const settings = await settingRepo.getSettings()
    
    // Parse settings
    // Parse settings
    const insurancePercent = parseFloat(settings['insurance_percent'] || '10.5') / 100
    const standardWorkDays = parseInt(settings['standard_work_days'] || '22')
    const personalDeduction = parseInt(settings['personal_deduction'] || '11000000')
    const dependentDeductionVal = parseInt(settings['dependent_deduction'] || '4400000')
    
    // Penalties settings
    const penaltyLateAmount = parseInt(settings['penalty_late'] || '50000')

    // Tax Brackets
    let taxBrackets = [
        { limit: 5000000, rate: 5 },
        { limit: 10000000, rate: 10 },
        { limit: 18000000, rate: 15 },
        { limit: 32000000, rate: 20 },
        { limit: 52000000, rate: 25 },
        { limit: 80000000, rate: 30 },
        { limit: 0, rate: 35 }
    ]
    try {
        if (settings['tax_brackets']) {
            taxBrackets = JSON.parse(settings['tax_brackets'])
        }
    } catch (e) {
        console.error('Error parsing tax brackets', e)
    }

    // Helper calculate Tax
    const calculateTax = (income: number) => {
        if (income <= 0) return 0
        let tax = 0
        let previousLimit = 0
        
        for (const bracket of taxBrackets) {
            const limit = bracket.limit
            const rate = bracket.rate / 100
            
            if (limit === 0) { // Infinite bracket
                tax += (income - previousLimit) * rate
                break
            }
            
            if (income > limit) {
                tax += (limit - previousLimit) * rate
                previousLimit = limit
            } else {
                tax += (income - previousLimit) * rate
                break
            }
        }
        return tax
    }

    const payslips: Partial<Payslip>[] = []

    // 3. Loop qua từng nhân viên để tính toán
    for (const emp of activeEmployees) {
        const salaryBase = Number(emp.salary) || 0
        const dailySalary = salaryBase / standardWorkDays

        // --- A. Thu nhập ---
        // 1. Attendance
        const attendanceStats = await attendanceRepo.getMonthlyStats(emp.id, month, year)
        const actualWorkDays = attendanceStats.work_days
        const lateCount = attendanceStats.late_days
        
        // 2. Approved Leaves
        const approvedLeaves = await leaveRepo.getApprovedLeaves(month, year, emp.id)
        let paidLeaveDays = 0
        if (approvedLeaves && approvedLeaves.length > 0) {
             (approvedLeaves as LeaveRequest[]).forEach((leave: LeaveRequest) => {
                const start = new Date(leave.start_date)
                const end = new Date(leave.end_date)
                const diffTime = Math.abs(end.getTime() - start.getTime())
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 
                paidLeaveDays += days
            })
        }

        // 3. Overtime
        const otHours = await overtimeRepo.getMonthlyApprovedHours(emp.id, month, year)
        const hourlyRate = dailySalary / 8
        const otSalary = Math.round(hourlyRate * 1.5 * otHours)
        
        // 4. Rewards & Penalties (NEW)
        const rewardsPenalties = await rewardPenaltyRepo.getByEmployeeAndMonth(emp.id, month, year)
        const totalRewards = rewardsPenalties
            ?.filter(rp => rp.type === 'Reward' && rp.status !== 'Pending') 
            .reduce((sum, rp) => sum + Number(rp.amount), 0) || 0
            
        const totalSpecificPenalties = rewardsPenalties
            ?.filter(rp => rp.type === 'Penalty') 
            .reduce((sum, rp) => sum + Number(rp.amount), 0) || 0

        // Bonus = Total Rewards
        const bonus = totalRewards
        
        // Income Calculation
        const totalBillableDays = actualWorkDays + paidLeaveDays
        const grossSalaryByWorkDays = dailySalary * totalBillableDays

        // --- B. Khấu trừ ---
        // Bảo hiểm
        const socialInsurance = salaryBase * insurancePercent
        
        // Phạt đi muộn (Dynamic setting)
        const latePenalty = lateCount * penaltyLateAmount
        
        // Tổng phạt = Phạt đi muộn + Phạt riêng (kỷ luật, vv)
        const penalties = latePenalty + totalSpecificPenalties
        
        // 5. Salary Advances (NEW)
        const advanceAmount = await salaryAdvanceRepo.getTotalApprovedAdvances(emp.id, month, year)

        // Thuế TNCN
        const totalIncome = grossSalaryByWorkDays + otSalary + bonus 
        const dependentDeduction = (emp.dependents || 0) * dependentDeductionVal
        const taxableIncome = Math.max(0, totalIncome - socialInsurance - personalDeduction - dependentDeduction)
        
        const tax = calculateTax(taxableIncome)

        // --- C. Thực lĩnh ---
        const totalDeductions = socialInsurance + tax + penalties + advanceAmount
        const netPay = totalIncome - totalDeductions

        payslips.push({
            employee_id: emp.id,
            month,
            year,
            salary: salaryBase,
            ot_hours: otHours,
            ot_salary: otSalary,
            bonus,
            tax,
            social_insurance: socialInsurance,
            penalties,
            advance_amount: advanceAmount,
            net_pay: netPay,
            status: 'Pending', 
            notes: `Công: ${actualWorkDays}/${standardWorkDays}. Nghỉ: ${paidLeaveDays}. Trễ: ${lateCount}. ${advanceAmount > 0 ? `Tạm ứng: ${advanceAmount.toLocaleString('vi-VN')}đ.` : ''}`
        })
    }
    
    // 4. Lưu xuống DB
    if (payslips.length > 0) {
        return (await payrollRepo.createPayslips(payslips)) as Payslip[]
    }
    
    return [] as Payslip[]
  },

  // Lấy danh sách bảng lương
  async getPayrollList(month: number, year: number) {
      return await payrollRepo.getPayslips(month, year)
  },

  // Cập nhật phiếu lương và tính lại các số liệu
  // Cập nhật phiếu lương và tính lại các số liệu
  async updatePayslip(id: number, data: PayslipUpdateDTO) {
      const current = await payrollRepo.getPayslipById(id)
      if (!current) throw new Error('Không tìm thấy phiếu lương')

      // Fetch settings
      const settings = await settingRepo.getSettings()
      const insurancePercent = parseFloat(settings['insurance_percent'] || '10.5') / 100
      const standardWorkDays = parseInt(settings['standard_work_days'] || '22')
      const personalDeduction = parseInt(settings['personal_deduction'] || '11000000')
      const dependentDeductionVal = parseInt(settings['dependent_deduction'] || '4400000')

      // Tax Brackets
      let taxBrackets = [
          { limit: 5000000, rate: 5 },
          { limit: 10000000, rate: 10 },
          { limit: 18000000, rate: 15 },
          { limit: 32000000, rate: 20 },
          { limit: 52000000, rate: 25 },
          { limit: 80000000, rate: 30 },
          { limit: 0, rate: 35 }
      ]
      try {
          if (settings['tax_brackets']) {
              taxBrackets = JSON.parse(settings['tax_brackets'])
          }
      } catch (e) {
          console.error('Error parsing tax brackets', e)
      }

      const calculateTax = (income: number) => {
          if (income <= 0) return 0
          let tax = 0
          let previousLimit = 0
          for (const bracket of taxBrackets) {
              const limit = bracket.limit
              const rate = bracket.rate / 100
              if (limit === 0) { tax += (income - previousLimit) * rate; break; }
              if (income > limit) {
                  tax += (limit - previousLimit) * rate
                  previousLimit = limit
              } else {
                  tax += (income - previousLimit) * rate
                  break
              }
          }
          return tax
      }
      
      // Convert all inputs to number strictly
      const safeNum = (val: number | string | null | undefined) => val ? Number(val) : 0

      // Giữ nguyên các giá trị cũ nếu không update
      const newSalaryBase = data.salary !== undefined ? Number(data.salary) : safeNum(current.salary)
      const newOtHours = data.ot_hours !== undefined ? Number(data.ot_hours) : safeNum(current.ot_hours)
      
      // Auto calculate OT Salary based on formula to ensure integrity
      const hourlyRate = newSalaryBase / standardWorkDays / 8
      const newOtSalary = Math.round(hourlyRate * 1.5 * newOtHours)

      const newBonus = data.bonus !== undefined ? Number(data.bonus) : safeNum(current.bonus)
      const newAdvance = data.advance_amount !== undefined ? Number(data.advance_amount) : safeNum(current.advance_amount)
      const newPenalties = data.penalties !== undefined ? Number(data.penalties) : safeNum(current.penalties)
      const newNote = data.note !== undefined ? data.note : current.notes

      // Tính lại các chỉ số dẫn xuất
      // 1. BHXH 
      const socialInsurance = newSalaryBase * insurancePercent

      // 2. Thu nhập từ công (Recalculate logic)
      // GrossFromWorkOld = NetOld + DedOld - OtOld - BonusOld
      const oldDeductions = safeNum(current.social_insurance) + safeNum(current.tax) + safeNum(current.penalties) + safeNum(current.advance_amount)
      const oldGrossTotal = safeNum(current.net_pay) + oldDeductions
      const oldGrossStart = oldGrossTotal - safeNum(current.ot_salary) - safeNum(current.bonus)
      
      // Nếu Salary Base thay đổi, GrossFromWork cũng phải đổi theo tỷ lệ
      let newGrossFromWork = oldGrossStart
      const oldSalaryBase = safeNum(current.salary)
      if (oldSalaryBase !== newSalaryBase && oldSalaryBase > 0) {
          const ratio = newSalaryBase / oldSalaryBase
          newGrossFromWork = oldGrossStart * ratio
      } else if (oldSalaryBase === 0 && newSalaryBase > 0) {
          // Trường hợp cũ là 0 (lỗi data?), giờ nhập mới -> tính full công??
          // Tạm thời coi như full công
          newGrossFromWork = newSalaryBase 
      }

      const totalIncome = newGrossFromWork + newOtSalary + newBonus
      
      // 3. Thuế
      // Lấy dependents từ relation employees
      const dependents = Number(current.employees?.dependents) || 0
      const dependentDeduction = dependents * dependentDeductionVal
      
      const taxableIncome = Math.max(0, totalIncome - socialInsurance - personalDeduction - dependentDeduction)
      
      const tax = calculateTax(taxableIncome)

      // 4. Net Pay
      const totalDeductions = socialInsurance + tax + newPenalties + newAdvance
      const netPay = totalIncome - totalDeductions

      // Update
      await payrollRepo.updatePayslip(id, {
          salary: newSalaryBase,
          ot_hours: newOtHours,
          ot_salary: newOtSalary,
          bonus: newBonus,
          advance_amount: newAdvance,
          penalties: newPenalties,
          social_insurance: socialInsurance,
          tax: tax,
          net_pay: netPay,
          notes: newNote
      })

      return { success: true }
  },

  // Lấy lịch sử lương của nhân viên
  async getPayrollsByEmployeeId(employeeId: number): Promise<Payslip[]> {
      return await payrollRepo.getPayslipsByEmployeeId(employeeId)
  },

  // Lấy chi tiết phiếu lương
  async getPayslipById(id: number): Promise<Payslip | null> {
      return await payrollRepo.getPayslipById(id)
  },

  // Đánh dấu bảng lương đã thanh toán
  async markPayrollAsPaid(month: number, year: number) {
      // Có thể thêm validation rule ở đây (VD: chỉ cho phép khi đã generate xong)
      // Nhưng tạm thời cứ update status
      await payrollRepo.updateMonthStatus(month, year, 'Paid')
  }
}
