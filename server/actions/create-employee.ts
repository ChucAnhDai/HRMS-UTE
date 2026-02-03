'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { EmployeeSchema } from '@/lib/schemas/employee.schema'

export async function createEmployeeAction(prevState: unknown, formData: FormData) {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được tạo nhân viên
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])

    // Convert FormData to Object for Zod
    const rawData = Object.fromEntries(formData.entries());
    
    // Validate with Zod
    const result = EmployeeSchema.safeParse(rawData);

    if (!result.success) {
        const errorMessages = result.error.issues.map(err => err.message).join(', ');
        return { error: errorMessages };
    }
    
    // Nếu validate OK, gọi service (Service vẫn nhận FormData cũ hoặc ta có thể refactor service sau)
    // Hiện tại để tương thích ta vẫn truyền formData, nhưng data đã chắc chắn sạch
    await employeeService.createEmployee(formData)
    
    // Xóa cache của trang danh sách để nó hiện dữ liệu mới ngay lập tức
    revalidatePath('/employees')
    
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi tạo nhân viên'
    }
  }

  // Chuyển hướng về trang danh sách (redirect phải nằm ngoài try/catch)
  redirect('/employees')
}
