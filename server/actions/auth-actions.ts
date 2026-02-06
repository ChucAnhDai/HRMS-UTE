'use server'

import { authService } from '@/server/services/auth-service'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: { error?: string } | undefined, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let role = 'EMPLOYEE';

  try {
    // Gọi Service thay vì gọi trực tiếp DB
    const result = await authService.login({ email, password })
    
    // Check role safely
    if (result && typeof result === 'object' && 'role' in result) {
        role = (result as { role: string }).role
    }
  } catch (error: unknown) {
    // Trả lỗi về cho UI hiển thị
    const message = error instanceof Error ? error.message : 'Đăng nhập thất bại'
    return { error: message }
  }

  // Redirect phải nằm ngoài try/catch trong Next.js Server Actions
  if (role === 'EMPLOYEE') {
    redirect('/profile')
  } else {
    redirect('/dashboard')
  }
}

export async function logoutAction() {
    await authService.logout()
    redirect('/login')
}

export async function getCurrentUserAction() {
    return await authService.getProfile()
}
