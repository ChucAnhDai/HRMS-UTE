'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateEmployeeAction(id: number, prevState: { error?: string; success?: boolean }, formData: FormData) {
  try {
    await employeeService.updateEmployee(id, formData)
    
    // Xóa cache của trang danh sách và trang chi tiết
    revalidatePath('/employees')
    revalidatePath(`/employees/${id}`)
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi cập nhật nhân viên'
    return {
      error: message
    }
  }

  // Chuyển hướng về trang danh sách
  redirect('/employees')
}

