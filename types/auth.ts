export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    success: boolean
    message?: string
    error?: string
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

export interface CurrentUser {
  id: string
  userId?: number
  email: string
  role: UserRole
  employeeId: number | null
  employeeData?: Record<string, unknown>
  name?: string
  avatar?: string | null
}
