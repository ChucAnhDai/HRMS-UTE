import { authRepo } from '@/server/repositories/auth-repo'
import { LoginCredentials } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials) {
    // 1. Validate Input (Security Layer 1)
    if (!credentials.email || !credentials.password) {
        throw new Error('Vui lòng nhập đầy đủ email và mật khẩu')
    }

    if (credentials.password.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
    }

    // 2. Call Repository
    try {
        const data = await authRepo.signInWithPassword(credentials)
        return data
    } catch (error: any) {
        // Debugging: In lỗi chi tiết ra console server để xem nguyên nhân
        console.error('Login Error Details:', error)

        // 3. Error Handling & Sanitization (Security Layer 2)
        // Không trả nguyên lỗi của DB/Auth provider ra ngoài UI
        if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email hoặc mật khẩu không chính xác')
        }
        if (error.message.includes('Email not confirmed')) {
            throw new Error('Vui lòng xác thực email trước khi đăng nhập')
        }
        
        throw new Error(`Đăng nhập thất bại: ${error.message}`) // Tạm thời hiện lỗi chi tiết để debug
    }
  },

  async logout() {
    try {
        await authRepo.signOut()
    } catch (error: any) {
        console.error('Logout error:', error)
        // Logout lỗi thì thôi, không cần throw cho user biết
    }
  },

  async getProfile() {
      const user = await authRepo.getCurrentUser()
      if (!user) return null
      
      const employee = await authRepo.getUserProfile(user.id)
      return {
          ...employee,
          email: user.email
      }
  }
}
