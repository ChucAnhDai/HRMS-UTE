import { employeeRepo } from '../repositories/employee-repo'
import { payrollRepo } from '../repositories/payroll-repo'
import { attendanceRepo } from '../repositories/attendance-repo'
import { overtimeRepo } from '../repositories/overtime-repo'
import { Payslip, PayslipUpdateDTO } from '../../types'

export const payrollService = {
  // Hàm chính: Tính lương cho toàn bộ nhân viên trong tháng
  async generateMonthlyPayroll(month: number, year: number) {
    // 1. Lấy danh sách nhân viên đang active
    const employees = await employeeRepo.getEmployees()
    const activeEmployees = employees?.filter(e => e.employment_status === 'Active' || e.employment_status === 'Probation') || []

    if (activeEmployees.length === 0) {
        throw new Error('Không có nhân viên nào để tính lương')
    }

    // 2. Xóa dữ liệu lương cũ của tháng này
    await payrollRepo.deleteMonthlyPayroll(month, year)

    const payslips: Partial<Payslip>[] = []

    // 3. Loop qua từng nhân viên để tính toán
    for (const emp of activeEmployees) {
        // Lấy thông tin cơ bản
        const salaryBase = Number(emp.salary) || 0
        const standardWorkDays = 22 // Chuẩn làm việc 22 ngày/tháng
        const dailySalary = salaryBase / standardWorkDays

        // --- A. Thu nhập ---
        // Tích hợp Attendance thực tế
        const attendanceStats = await attendanceRepo.getMonthlyStats(emp.id, month, year)
        const actualWorkDays = attendanceStats.work_days
        const lateCount = attendanceStats.late_days
        
        // Tích hợp OT (Lấy từ Overtime Requests đã duyệt)
        const otHours = await overtimeRepo.getMonthlyApprovedHours(emp.id, month, year)
        
        // Tính tiền OT: (L lương ngày / 8h) * 1.5 * Số giờ OT
        const hourlyRate = dailySalary / 8
        const otSalary = Math.round(hourlyRate * 1.5 * otHours)
        
        const bonus = 0 
        
        // Tính lương thực tế dựa trên ngày công
        // Nếu làm đủ 22 ngày -> Full lương. Nếu nghỉ -> Trừ tiền.
        // Công thức: Lương thực = (Lương cơ bản / 22) * Số ngày đi làm thực tế
        const grossSalaryByWorkDays = dailySalary * actualWorkDays

        // --- B. Khấu trừ ---
        // Bảo hiểm (BHXH, BHYT, BHTN): Tạm tính 10.5% trên lương cơ bản (Theo luật thường tính trên lương hợp đồng, k phụ thuộc ngày công nếu nghỉ ít)
        // Tuy nhiên để đơn giản, ta tính trên lương cơ bản cố định.
        const socialInsurance = salaryBase * 0.105
        
        // Phạt đi muộn (Ví dụ: 50.000 VND / lần)
        const latePenalty = lateCount * 50000
        const penalties = latePenalty
        const advanceAmount = 0 

        // Thuế TNCN (Tính đơn giản: (Tổng thu nhập - 11tr - Người phụ thuộc * 4.4tr) * Thuế suất 5%)
        const totalIncome = grossSalaryByWorkDays + otSalary + bonus // Thu nhập chịu thuế (Gross thực tế)
        const personalDeduction = 11_000_000
        const dependentDeduction = (emp.dependents || 0) * 4_400_000
        const taxableIncome = Math.max(0, totalIncome - socialInsurance - personalDeduction - dependentDeduction)
        
        let tax = 0
        if (taxableIncome > 0) {
            tax = taxableIncome * 0.05 
        }

        // --- C. Thực lĩnh ---
        const totalDeductions = socialInsurance + tax + penalties + advanceAmount
        const netPay = totalIncome - totalDeductions

        // Tạo object Payslip
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
            notes: `Lương tháng ${month}/${year}. Công: ${actualWorkDays}/${standardWorkDays}. Trễ: ${lateCount}`
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
  async updatePayslip(id: number, data: PayslipUpdateDTO) {
      const current = await payrollRepo.getPayslipById(id)
      if (!current) throw new Error('Không tìm thấy phiếu lương')
      
      // Convert all inputs to number strictly
      const safeNum = (val: number | string | null | undefined) => val ? Number(val) : 0

      // Giữ nguyên các giá trị cũ nếu không update
      const newSalaryBase = data.salary !== undefined ? Number(data.salary) : safeNum(current.salary)
      const newOtHours = data.ot_hours !== undefined ? Number(data.ot_hours) : safeNum(current.ot_hours)
      
      // Auto calculate OT Salary based on formula to ensure integrity
      const hourlyRate = newSalaryBase / 22 / 8
      const newOtSalary = Math.round(hourlyRate * 1.5 * newOtHours)

      const newBonus = data.bonus !== undefined ? Number(data.bonus) : safeNum(current.bonus)
      const newAdvance = data.advance_amount !== undefined ? Number(data.advance_amount) : safeNum(current.advance_amount)
      const newPenalties = data.penalties !== undefined ? Number(data.penalties) : safeNum(current.penalties)
      const newNote = data.note !== undefined ? data.note : current.notes

      // Tính lại các chỉ số dẫn xuất
      // 1. BHXH (10.5% lương cơ bản mới)
      const socialInsurance = newSalaryBase * 0.105

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
      const personalDeduction = 11_000_000
      // Lấy dependents từ relation employees
      const dependents = Number(current.employees?.dependents) || 0
      const dependentDeduction = dependents * 4_400_000
      
      const taxableIncome = Math.max(0, totalIncome - socialInsurance - personalDeduction - dependentDeduction)
      
      let tax = 0
       if (taxableIncome > 0) {
            tax = taxableIncome * 0.05 
        }

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
