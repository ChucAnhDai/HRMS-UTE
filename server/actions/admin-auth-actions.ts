'use server'

import { adminAuthService } from '@/server/services/admin-auth-service'
import { revalidatePath } from 'next/cache'
import { activityService } from '@/server/services/activity-service'

export async function createEmployeeAccountAction(employeeId: number, email: string, password: string) {
    try {
        // Kiểm tra quyền: Chỉ Admin mới được cấp tài khoản
        const { requireAdmin } = await import('@/lib/auth-helpers')
        await requireAdmin()
        
        if (password.length < 6) {
            return { success: false, error: 'Mật khẩu phải từ 6 ký tự trở lên' }
        }

        await adminAuthService.createUserForEmployee(employeeId, email, password)
        
        await activityService.logActivity('THÊM MỚI', 'Tài khoản', employeeId, `Cấp tài khoản mới cho email ${email}`)
        
        revalidatePath(`/employees/${employeeId}`)
        return { success: true, message: 'Đã cấp tài khoản thành công!' }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
        return { success: false, error: message }
    }
}

export async function updateEmployeePasswordAction(employeeId: number, email: string, newPassword: string) {
    try {
        const { requireAdmin } = await import('@/lib/auth-helpers')
        await requireAdmin()
        
        if (newPassword.length < 6) {
            return { success: false, error: 'Mật khẩu phải từ 6 ký tự trở lên' }
        }

        await adminAuthService.updateEmployeePassword(employeeId, newPassword)
        
        await activityService.logActivity('CẬP NHẬT', 'Bảo mật', employeeId, `Cấp lại mật khẩu cho tài khoản ${email}`)
        
        revalidatePath(`/employees/${employeeId}`)
        return { success: true, message: 'Đã đổi mật khẩu thành công!' }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
        return { success: false, error: message }
    }
}
