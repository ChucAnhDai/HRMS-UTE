import { createClient } from '@/lib/supabase.server'
import { Payslip } from '@/types' 

export const payrollRepo = {
  // Lấy danh sách phiếu lương theo tháng/năm
  async getPayslips(month: number, year: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payslips')
      .select(`
        *,
        employees (
          first_name,
          last_name,
          department_id,
          avatar,
          departments ( name )
        )
      `)
      .eq('month', month)
      .eq('year', year)
      .order('id', { ascending: true })

    if (error) throw new Error(error.message)
    return data as Payslip[]
  },

  // Lấy chi tiết phiếu lương
  async getPayslipById(id: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payslips')
      .select(`
        *,
        employees (
          first_name,
          last_name,
          email,
          phone,
          department_id,
          job_title,
          hire_date,
          tax_code,
          dependents,
          departments ( name )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as Payslip
  },

  // Tạo hoặc cập nhật phiếu lương (cho trường hợp tính toán lại)
  async upsertPayslips(payslips: Partial<Payslip>[]) {
    const supabase = await createClient()
      // Xóa cũ trước khi insert mới để tránh duplicate nếu không có unique constraint
      if (payslips.length > 0) {
          const month = payslips[0].month
          const year = payslips[0].year
          
          await supabase.from('payslips').delete().eq('month', month).eq('year', year).neq('status', 'Paid')
          
          const { error } = await supabase.from('payslips').insert(payslips)
          if (error) throw new Error(error.message)
      }
  },

  // Xóa danh sách lương của tháng (để tính lại)
  async deleteMonthlyPayroll(month: number, year: number) {
      const supabase = await createClient()
      const { error } = await supabase
          .from('payslips')
          .delete()
          .eq('month', month)
          .eq('year', year)
          .neq('status', 'Paid') 
      
      if (error) throw new Error(error.message)
  },
  
  // Bulk Insert sau khi xóa
  async createPayslips(payslips: Partial<Payslip>[]) {
      const supabase = await createClient()
      const { data, error } = await supabase
          .from('payslips')
          .insert(payslips)
          .select()
          
      if (error) throw new Error(error.message)
      return data
  },

  // Update status (Ví dụ: Mark as Paid)
  async updatePayslipStatus(id: number, status: string) {
      const supabase = await createClient()
      const { error } = await supabase
          .from('payslips')
          .update({ status })
          .eq('id', id)
      
      if (error) throw new Error(error.message)
  },

  // Cập nhật phiếu lương thủ công
  async updatePayslip(id: number, data: Partial<Payslip>) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('payslips')
      .update(data)
      .eq('id', id)
      .neq('status', 'Paid') // Không cho sửa nếu đã thanh toán

    if (error) throw new Error(error.message)
  },

  // Cập nhật trạng thái cho toàn bộ bảng lương tháng
  async updateMonthStatus(month: number, year: number, status: 'Generated' | 'Pending' | 'Paid') {
      const supabase = await createClient()
      const { error } = await supabase
          .from('payslips')
          .update({ status })
          .eq('month', month)
          .eq('year', year)
          .neq('status', status) // Chỉ update cái chưa đúng status

      if (error) throw new Error(error.message)
  },

  // Lấy lịch sử lương của nhân viên
  async getPayslipsByEmployeeId(employeeId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payslips')
      .select('*')
      .eq('employee_id', employeeId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  // Lấy thống kê lương theo năm (cho Dashboard)
  async getYearlyStats(year: number) {
      const supabase = await createClient()
      const { data, error } = await supabase
          .from('payslips')
          .select('month, net_pay, status')
          .eq('year', year)
      
      if (error) throw new Error(error.message)
      return data
  }
}