import { createClient } from '@/lib/supabase.server'

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

export interface CurrentUser {
  id: string
  email: string
  role: UserRole
  employeeId: number | null
  employeeData?: any
}

/**
 * Lấy thông tin user hiện tại từ session
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Lấy thông tin nhân viên từ bảng employees
  const { data: employee } = await supabase
    .from('employees')
    .select('id, role, first_name, last_name, email, department_id, job_title')
    .eq('auth_user_id', user.id)
    .single()

  if (!employee) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    role: (employee.role || 'EMPLOYEE') as UserRole,
    employeeId: employee.id,
    employeeData: employee
  }
}

/**
 * Kiểm tra xem user có quyền Admin không
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

/**
 * Kiểm tra xem user có quyền Manager hoặc cao hơn không
 */
export async function isManagerOrAbove(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN' || user?.role === 'MANAGER'
}

/**
 * Kiểm tra xem user có một trong các role được chỉ định không
 */
export async function hasRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Throw error nếu user không có quyền
 */
export async function requireRole(roles: UserRole[]) {
  const hasPermission = await hasRole(roles)
  if (!hasPermission) {
    throw new Error('Bạn không có quyền thực hiện thao tác này')
  }
}

/**
 * Throw error nếu user không phải Admin
 */
export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Chỉ Admin mới có quyền thực hiện thao tác này')
  }
}

/**
 * Kiểm tra user đã đăng nhập chưa, redirect về login nếu chưa
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/login')
    throw new Error('Unauthorized') // Never reached, but satisfies TypeScript
  }
  return user
}

/**
 * Kiểm tra user có một trong các role được chỉ định không
 * Nếu không, redirect về trang forbidden
 */
export async function requireRoleForPage(roles: UserRole[]) {
  const user = await requireAuth()
  
  if (!roles.includes(user.role)) {
    const { redirect } = await import('next/navigation')
    redirect('/forbidden')
  }
  
  return user
}

