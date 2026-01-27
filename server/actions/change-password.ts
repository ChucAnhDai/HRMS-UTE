'use server'

import { getCurrentUser } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase.server'

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Vui lòng đăng nhập lại' }
    }

    // Validate
    if (newPassword.length < 6) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }
    }

    if (currentPassword === newPassword) {
      return { success: false, error: 'Mật khẩu mới phải khác mật khẩu cũ' }
    }

    const supabase = await createClient()

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: currentPassword
    })

    if (signInError) {
      return { success: false, error: 'Mật khẩu hiện tại không đúng' }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, message: 'Đổi mật khẩu thành công!' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
  }
}
