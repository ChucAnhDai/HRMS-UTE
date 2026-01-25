import { payrollRepo } from '@/server/repositories/payroll-repo'
import { employeeRepo } from '@/server/repositories/employee-repo'
import { contractRepo } from '@/server/repositories/contract-repo'
import { attendanceRepo } from '@/server/repositories/attendance-repo'
import { leaveRepo } from '@/server/repositories/leave-repo'

export const payrollService = {
  // Lấy bảng lương của tháng
  async getPayrollByMonth(month: number, year: number) {
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`
    return await payrollRepo.getPayrollsByMonth(monthStr)
  },

  async getPayrollById(id: string) {
    return await payrollRepo.getPayrollById(id)
  },

  async getPayrollsByEmployeeId(id: number) {
    return await payrollRepo.getPayrollsByEmployeeId(id)
  },

  // Tính lương cho toàn bộ nhân viên trong tháng
  async calculateMonthlyPayroll(month: number, year: number) {
    const employees = await employeeRepo.getEmployees()
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`
    const results = []

    for (const emp of employees) {
      if (!emp) continue

      // 1. Lương cơ bản từ hợp đồng
      const contracts = await contractRepo.getContractsByEmployeeId(emp.id)
      // Lấy hợp đồng hiệu lực mới nhất
      const activeContract = contracts?.find((c: any) => c.salary > 0 && 
        new Date(c.start_date) <= new Date(year, month - 1, 31) && 
        (!c.end_date || new Date(c.end_date) >= new Date(year, month - 1, 1))
      )

      const baseSalary = activeContract ? Number(activeContract.salary) : 0

      // 2. Số ngày đi làm thực tế
      const attendances = await attendanceRepo.getAttendances(month, year, emp.id)
      const workDays = attendances ? attendances.length : 0

      // 3. Số ngày nghỉ có phép
      const leaves = await leaveRepo.getApprovedLeaves(month, year, emp.id)
      let leaveDays = 0
      
      if (leaves) {
        // Tính toán đơn giản số ngày nghỉ trùng với tháng này
        const startOfMonth = new Date(year, month - 1, 1)
        const endOfMonth = new Date(year, month, 0) // Ngày cuối tháng

        leaves.forEach((l: any) => {
            const lStart = new Date(l.start_date)
            const lEnd = new Date(l.end_date)
            
            // Tìm khoảng giao nhau
            const effectiveStart = lStart < startOfMonth ? startOfMonth : lStart
            const effectiveEnd = lEnd > endOfMonth ? endOfMonth : lEnd

            if (effectiveEnd >= effectiveStart) {
                // +1 vì trừ ngày phải cộng 1 (vd: 5-5 là 1 ngày)
                const days = (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 3600 * 24) + 1
                leaveDays += days
            }
        })
      }

      // 4. Tính toán
      const standardWorkDays = 26
      // Lương 1 ngày = Lương CB / 26
      const dailySalary = standardWorkDays > 0 ? baseSalary / standardWorkDays : 0
      
      const totalSalary = Math.round((workDays + leaveDays) * dailySalary)

      // 5. Lưu vào DB
      const payload = {
        employee_id: emp.id,
        month: monthStr,
        base_salary: baseSalary,
        work_days: workDays,
        leave_days: Math.round(leaveDays * 10) / 10, // Làm tròn 1 số lẻ
        bonus: 0,
        deduction: 0,
        total_salary: totalSalary,
        status: 'Draft'
      }

      const saved = await payrollRepo.createPayroll(payload)
      results.push(saved)
    }

    return results
  }
}
