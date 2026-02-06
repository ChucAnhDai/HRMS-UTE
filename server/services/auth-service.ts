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
        const authData = await authRepo.signInWithPassword(credentials)
        
        // 2.1 Fetch User Profile to get Role
        if (authData.user) {
             const profile = await authRepo.getUserProfile(authData.user.id)
             return {
                 ...authData,
                 role: profile?.role || 'EMPLOYEE' // Default role
             }
        }

        return authData
    } catch (error: unknown) {
        // Debugging: In lỗi chi tiết ra console server để xem nguyên nhân
        console.error('Login Error Details:', error)

        const message = error instanceof Error ? error.message : String(error)

        // 3. Error Handling & Sanitization (Security Layer 2)
        // Không trả nguyên lỗi của DB/Auth provider ra ngoài UI
        if (message.includes('Invalid login credentials')) {
            throw new Error('Email hoặc mật khẩu không chính xác')
        }
        if (message.includes('Email not confirmed')) {
            throw new Error('Vui lòng xác thực email trước khi đăng nhập')
        }
        
        throw new Error(`Đăng nhập thất bại: ${message}`) // Tạm thời hiện lỗi chi tiết để debug
    }
  },

  async logout() {
    try {
        await authRepo.signOut()
    } catch (error: unknown) {
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
