import { createClient } from '@/lib/supabase.server'
import { Database } from '@/types/database'
import { countBusinessDays, parseWeekendDays } from '@/lib/working-days'
import { settingRepo } from './setting-repo'

export const leaveRepo = {
  // Lấy danh sách đơn nghỉ phép (Có thể lọc theo trạng thái)
  async getLeaveRequests(status?: string) {
    const supabase = await createClient()
    let query = supabase
      .from('leave_requests')
      .select(`
        *,
        employees!leave_requests_employee_id_fkey (
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

  // Lấy thông tin chi tiết 1 đơn nghỉ phép theo ID
  async getLeaveRequestById(id: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Tạo đơn xin nghỉ mới
  async createLeaveRequest(data: Database['public']['Tables']['leave_requests']['Insert']) {
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

  // NEW: Cập nhật đơn nghỉ phép (chỉ khi status = Pending)
  async updateLeaveRequest(
    id: number,
    data: {
      leave_type?: string
      start_date?: string
      end_date?: string
      reason?: string
    }
  ) {
    const supabase = await createClient()

    // 1. Kiểm tra trạng thái hiện tại
    const { data: existing, error: fetchError } = await supabase
      .from('leave_requests')
      .select('status')
      .eq('id', id)
      .single()

    if (fetchError) throw new Error(fetchError.message)
    if (!existing) throw new Error('Không tìm thấy đơn nghỉ phép')
    
    // Bảo mật BE: Chỉ cho phép sửa nếu đang ở trạng thái Pending
    if (existing.status !== 'Pending') {
      throw new Error('Chỉ có thể chỉnh sửa đơn ở trạng thái "Chờ duyệt"')
    }

    // 2. Thực hiện cập nhật
    const { data: updated, error } = await supabase
      .from('leave_requests')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        employees!leave_requests_employee_id_fkey (
          first_name,
          last_name,
          avatar
        )
      `)
      .single()

    if (error) throw new Error(error.message)
    return updated
  },

  // Cập nhật trạng thái đơn (Duyệt / Từ chối)
  async updateLeaveStatus(
    id: number, 
    status: 'Approved' | 'Rejected', 
    actionByEmployeeId?: number,
    rejectionReason?: string
  ) {
    const supabase = await createClient()
    
    // Chuẩn bị dữ liệu cập nhật
    const updateData: Record<string, unknown> = { 
      status,
      action_at: new Date().toISOString()
    }
    
    // Nếu có người duyệt, lưu lại (dùng ID của employee)
    if (actionByEmployeeId) {
      updateData.action_by_employee_id = actionByEmployeeId
    }
    
    // Nếu từ chối, lưu lý do từ chối
    if (status === 'Rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason
    }
    
    // Nếu duyệt, xóa lý do từ chối cũ (nếu có)
    if (status === 'Approved') {
      updateData.rejection_reason = null
    }
    
    const { data, error } = await supabase
      .from('leave_requests')
      .update(updateData)
      .eq('id', id)
      .eq('status', 'Pending')
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Đơn nghỉ phép này đã được xử lý trước đó (đã duyệt hoặc từ chối). Vui lòng tải lại trang.')
      }
      throw new Error(error.message)
    }
    return data
  },

  // Lấy danh sách nghỉ phép được duyệt theo tháng (cho Payroll)
  async getApprovedLeaves(month: number, year: number, employeeId: number) {
    const supabase = await createClient()
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

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
      .select(`
        *,
        employees!leave_requests_employee_id_fkey (
          first_name,
          last_name,
          avatar
        )
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  // NEW: Lấy danh sách tất cả các loại nghỉ phép được duyệt trong năm (để tránh N+1 Query)
  async getAllYearlyApprovedLeaves(year: number, employeeId: number) {
    const supabase = await createClient()
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('status', 'Approved')
      .gte('start_date', startDate)
      .lte('start_date', endDate) 

    if (error) throw new Error(error.message)
    return data
  },

  // NEW: Lấy danh sách nghỉ phép được duyệt trong năm (theo loại)
  async getYearlyApprovedLeaves(year: number, employeeId: number, leaveType: string = 'Annual') {
    const supabase = await createClient()
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('status', 'Approved')
      .eq('leave_type', leaveType)
      .gte('start_date', startDate)
      .lte('start_date', endDate) 

    if (error) throw new Error(error.message)
    return data
  },

  // Theo logic cũ nhưng fix số ngày làm việc bị tính cuối tuần/lễ
  async getUsedLeaveDays(year: number, employeeId: number, leaveType: string): Promise<number> {
      const leaves = await this.getYearlyApprovedLeaves(year, employeeId, leaveType)
      if (!leaves || leaves.length === 0) return 0

      // Để đếm ngày làm việc cần thông tin về settings và holidays
      const settingsTable = await settingRepo.getSettings()
      const weekendDays = parseWeekendDays(settingsTable['weekend_days'])
      const holidays = await settingRepo.getHolidays(year)

      let totalDays = 0
      leaves.forEach(leave => {
          const start = new Date(leave.start_date)
          const end = new Date(leave.end_date)
          const days = countBusinessDays(start, end, weekendDays, holidays)
          totalDays += days
      })
      return totalDays
  }
}
