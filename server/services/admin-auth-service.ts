import { supabaseAdmin } from '@/lib/supabase.admin'

export const adminAuthService = {
  // Cấp tài khoản cho nhân viên
  async createUserForEmployee(employeeId: number, email: string, password: string, role: string = 'EMPLOYEE') {
    // 1. Tạo User bên Auth System
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto confirm (bỏ qua bước xác nhận email)
        user_metadata: { role: role }
    })

    if (createError) {
        throw new Error(`Lỗi tạo user: ${createError.message}`)
    }

    if (!userData.user) {
        throw new Error('Không tạo được user (Unknown error)')
    }

    // 2. Link User ID về bảng Employee
    const { error: updateError } = await supabaseAdmin
        .from('employees')
        .update({ 
            auth_user_id: userData.user.id,
            role: role // Cập nhật role luôn
        })
        .eq('id', employeeId)
    
    if (updateError) {
        // Nếu update lỗi thì nên xóa user vừa tạo để tránh rác (Rollback)
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
        throw new Error(`Lỗi cập nhật hồ sơ: ${updateError.message}`)
    }

    return { success: true, user: userData.user }
  }
}
