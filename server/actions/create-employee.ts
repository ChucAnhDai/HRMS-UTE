'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEmployeeAction(prevState: any, formData: FormData) {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được tạo nhân viên
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])
    
    await employeeService.createEmployee(formData)
    
    // Xóa cache của trang danh sách để nó hiện dữ liệu mới ngay lập tức
    revalidatePath('/employees')
    
  } catch (error: any) {
    return {
      error: error.message || 'Đã có lỗi xảy ra khi tạo nhân viên'
    }
  }

  // Chuyển hướng về trang danh sách (redirect phải nằm ngoài try/catch)
  redirect('/employees')
}
