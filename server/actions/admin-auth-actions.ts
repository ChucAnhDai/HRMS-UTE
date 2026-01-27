'use server'

import { adminAuthService } from '@/server/services/admin-auth-service'
import { revalidatePath } from 'next/cache'

export async function createEmployeeAccountAction(employeeId: number, email: string, password: string) {
    try {
        // Kiểm tra quyền: Chỉ Admin mới được cấp tài khoản
        const { requireAdmin } = await import('@/lib/auth-helpers')
        await requireAdmin()
        
        if (password.length < 6) {
            return { success: false, error: 'Mật khẩu phải từ 6 ký tự trở lên' }
        }

        await adminAuthService.createUserForEmployee(employeeId, email, password)
        
        revalidatePath(`/employees/${employeeId}`)
        return { success: true, message: 'Đã cấp tài khoản thành công!' }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
