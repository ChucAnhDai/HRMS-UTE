import { createClient } from '@/lib/supabase.server'
import { LoginCredentials } from '@/types/auth' // Sẽ tạo type này sau

export const authRepo = {
  // Đăng nhập
  async signInWithPassword({ email, password }: LoginCredentials) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw new Error(error.message)
    return data
  },

  // Đăng xuất
  async signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) throw new Error(error.message)
  },

  // Lấy user hiện tại (Server-side)
  async getCurrentUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Không throw error ở đây vì việc không có user (null) là bình thường
    return user
  },

  // Lấy User profile đầy đủ (bao gồm thông tin nhân viên)
  async getUserProfile(userId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('auth_user_id', userId)
        .single()
    
    return data
  }
}
