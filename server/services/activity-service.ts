import { getCurrentUser } from '@/lib/auth-helpers'
import { supabaseAdmin } from '@/lib/supabase.admin'

export const activityService = {
  /**
   * Add a new activity log entry
   * @param action Trạng thái hoặc hành động (ví dụ: 'LOGIN', 'CREATE', 'UPDATE', 'DELETE')
   * @param entityType Loại dữ liệu tương tác (ví dụ: 'Auth', 'Employee', 'LeaveRequest')
   * @param entityId ID của dữ liệu tương tác (nếu có)
   * @param details Chi tiết hoạt động
   */
  async logActivity(action: string, entityType: string, entityId?: number, details?: string) {
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Dùng supabaseAdmin để bypass RLS
      const { error } = await supabaseAdmin
        .from('activity_logs')
        .insert({
          employee_id: user.employeeId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details
        })

      if (error) {
        console.error('Lỗi khi ghi activity log:', error.message)
      }
    } catch (e) {
       console.error('Exception khi ghi activity log:', e)
    }
  }
}
