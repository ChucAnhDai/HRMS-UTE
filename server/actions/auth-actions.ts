'use server'

import { authService } from '@/server/services/auth-service'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    // Gọi Service thay vì gọi trực tiếp DB
    await authService.login({ email, password })
  } catch (error: any) {
    // Trả lỗi về cho UI hiển thị
    return { error: error.message }
  }

  // Redirect phải nằm ngoài try/catch trong Next.js Server Actions
  redirect('/')
}

export async function logoutAction() {
    await authService.logout()
    redirect('/login')
}

export async function getCurrentUserAction() {
    return await authService.getProfile()
}
