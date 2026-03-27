'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'
import { activityService } from '@/server/services/activity-service'

export async function deleteEmployeeAction(id: number) {
  try {
    // Kiểm tra quyền: Chỉ Admin mới được xóa nhân viên
    const { requireAdmin } = await import('@/lib/auth-helpers')
    await requireAdmin()
    
    await employeeService.deleteEmployee(id)
    await activityService.logActivity('XÓA', 'Nhân viên', id, `Đã xóa hồ sơ nhân viên ID ${id}`)
    
    revalidatePath('/employees')
    return { success: true }
  } catch (error: unknown) {
    // Đồng bộ lại UI trong trường hợp nhân viên đã bị xóa trước đó
    revalidatePath('/employees')
    return {
      error: error instanceof Error ? error.message : 'Xóa nhân viên thất bại'
    }
  }
}
