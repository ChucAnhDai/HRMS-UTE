import { supabaseAdmin } from '@/lib/supabase.admin'

export const adminAuthService = {
  // Cấp tài khoản cho nhân viên
  async createUserForEmployee(employeeId: number, email: string, password: string, role: string = 'EMPLOYEE') {
    // 1. Tạo User bên Auth System
    // Helper function để tạo user
    const attemptCreate = async () => {
        return await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { role: role }
        })
    }

    let { data: userData, error: createError } = await attemptCreate()

    // Xử lý trường hợp "Email đã tồn tại" (Có thể do rác/zombie user từ lần xóa trước bị lỗi)
    if (createError && createError.message.includes('already been registered')) {
        console.log(`Email ${email} đã tồn tại. Đang kiểm tra xem có phải Zombie User không...`)
        
        try {
            // Tìm user trong Auth
            const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
            const zombieUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase())

            if (zombieUser) {
                // Kiểm tra xem User này có đang gắn với nhân viên nào không
                const { data: linkedEmp } = await supabaseAdmin
                    .from('employees')
                    .select('id')
                    .eq('auth_user_id', zombieUser.id)
                    .maybeSingle() // Dùng maybeSingle để không throw error nếu null

                if (!linkedEmp) {
                    console.log(`Phát hiện Zombie User (ID: ${zombieUser.id}) không gắn với Employee nào. Tiến hành xóa và tạo lại.`)
                    // Xóa Zombie User
                    await supabaseAdmin.auth.admin.deleteUser(zombieUser.id)
                    
                    // Thử tạo lại lần nữa
                    const retryResult = await attemptCreate()
                    userData = retryResult.data
                    createError = retryResult.error
                } else {
                    console.log(`User này đang gắn với Employee ID: ${linkedEmp.id}. Không thể ghi đè.`)
                }
            }
        } catch (err) {
            console.error('Lỗi khi xử lý Zombie User:', err)
        }
    }

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
  },

  // Đổi mật khẩu nhân viên
  async updateEmployeePassword(employeeId: number, newPassword: string) {
    const { data: emp, error: fetchError } = await supabaseAdmin
      .from('employees')
      .select('auth_user_id')
      .eq('id', employeeId)
      .single()

    if (fetchError || !emp?.auth_user_id) {
      throw new Error("Không tìm thấy tài khoản liên kết với nhân viên này.")
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      emp.auth_user_id,
      { password: newPassword }
    )

    if (updateError) {
      throw new Error(`Lỗi cập nhật mật khẩu: ${updateError.message}`)
    }

    return { success: true }
  }
}
