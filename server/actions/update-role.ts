'use server'

import { requireAdmin } from '@/lib/auth-helpers'
import { supabaseAdmin } from '@/lib/supabase.admin'
import { revalidatePath } from 'next/cache'

type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

export async function updateEmployeeRoleAction(employeeId: number, newRole: UserRole) {
  try {
    // Kiểm tra quyền: Chỉ Admin mới được thay đổi role
    await requireAdmin()

    // Validate role
    const validRoles: UserRole[] = ['ADMIN', 'MANAGER', 'EMPLOYEE']
    if (!validRoles.includes(newRole)) {
      return { success: false, error: 'Role không hợp lệ' }
    }

    // Update role in employees table
    const { error } = await supabaseAdmin
      .from('employees')
      .update({ role: newRole })
      .eq('id', employeeId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/employees/${employeeId}`)
    revalidatePath('/employees')
    
    return { success: true, message: `Đã cập nhật role thành ${newRole}` }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
  }
}
