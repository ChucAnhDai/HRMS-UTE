import { createClient } from '@/lib/supabase.server'
import { OvertimeRequest } from '@/types'

export const overtimeRepo = {
  // Tạo request mới
  async createRequest(data: Partial<OvertimeRequest>) {
    const supabase = await createClient()
    const { data: res, error } = await supabase
      .from('overtime_requests')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return res as OvertimeRequest
  },

  // Lấy danh sách requests (có filter)
  async getRequests(filters?: { employee_id?: number; status?: string; month?: number; year?: number }) {
    const supabase = await createClient()
    let query = supabase
      .from('overtime_requests')
      .select(`
        *,
        employees!overtime_requests_employee_id_fkey (
          first_name,
          last_name,
          avatar,
          department_id,
          departments(name)
        )
      `)
      .order('date', { ascending: false })

    if (filters?.employee_id) {
      query = query.eq('employee_id', filters.employee_id)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    // Filter theo tháng/năm nếu cần
    if (filters?.month && filters?.year) {
        const startDate = `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`
        const lastDay = new Date(filters.year, filters.month, 0).getDate()
        const endDate = `${filters.year}-${filters.month.toString().padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
        query = query.gte('date', startDate).lte('date', endDate)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data 
  },

  // Lấy chi tiết 1 request theo ID
  async getRequestById(id: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('overtime_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data as OvertimeRequest
  },

  // Cập nhật trạng thái (Approve/Reject)
  async updateStatus(id: number, status: 'Approved' | 'Rejected', approverId: number, rejectionReason?: string) {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
      status,
      approved_by: approverId,
      rejection_reason: status === 'Rejected' && rejectionReason ? rejectionReason : null
    }

    const { data, error } = await supabase
      .from('overtime_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as OvertimeRequest
  },

  // Lấy tổng giờ OT đã duyệt trong tháng của nhân viên
  async getMonthlyApprovedHours(employeeId: number, month: number, year: number) {
      const supabase = await createClient()
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

      const { data, error } = await supabase
          .from('overtime_requests')
          .select('hours')
          .eq('employee_id', employeeId)
          .eq('status', 'Approved')
          .gte('date', startDate)
          .lte('date', endDate)

    if (error) throw new Error(error.message)
    
    // Tính tổng
    const totalHours = data?.reduce((sum, item) => sum + Number(item.hours), 0) || 0
    return totalHours
  }
}
