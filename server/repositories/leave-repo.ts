import { createClient } from '@/lib/supabase.server'

export const leaveRepo = {
  // Lấy danh sách đơn nghỉ phép (Có thể lọc theo trạng thái)
  async getLeaveRequests(status?: string) {
    const supabase = await createClient()
    let query = supabase
      .from('leave_requests')
      .select(`
        *,
        employees (
          first_name,
          last_name,
          avatar
        )
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
  },

  // Tạo đơn xin nghỉ mới
  async createLeaveRequest(data: any) {
    const supabase = await createClient()
    const { data: request, error } = await supabase
      .from('leave_requests')
      .insert({
        ...data,
        status: 'Pending' // Mặc định là chờ duyệt
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return request
  },

  // Cập nhật trạng thái đơn (Duyệt / Từ chối)
  async updateLeaveStatus(id: number, status: 'Approved' | 'Rejected', managerId?: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leave_requests')
      .update({ status }) // Đáng lẽ lưu thêm approved_by nhưng bảng hiện tại chưa có cột này, tạm bỏ qua
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Lấy danh sách nghỉ phép được duyệt theo tháng (cho Payroll)
  async getApprovedLeaves(month: number, year: number, employeeId: number) {
    const supabase = await createClient()
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`

    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('status', 'Approved')
      // Đơn giản: bắt đầu hoặc kết thúc trong tháng này
      .or(`start_date.gte.${startDate},end_date.lte.${endDate}`)

    if (error) throw new Error(error.message)
    return data
  },

  async getLeavesByEmployeeId(employeeId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }
}
