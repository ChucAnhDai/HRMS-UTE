'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'

export async function deleteEmployeeAction(id: number) {
  try {
    // Kiểm tra quyền: Chỉ Admin mới được xóa nhân viên
    const { requireAdmin } = await import('@/lib/auth-helpers')
    await requireAdmin()
    
    await employeeService.deleteEmployee(id)
    revalidatePath('/employees')
    return { success: true }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Xóa nhân viên thất bại'
    }
  }
}
