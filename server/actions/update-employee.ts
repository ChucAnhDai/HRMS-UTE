'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { EmployeeSchema } from '@/lib/schemas/employee.schema'

export async function updateEmployeeAction(id: number, prevState: { error?: string; success?: boolean }, formData: FormData) {
  try {
    // Convert FormData to Object for Zod
    const rawData = Object.fromEntries(formData.entries());
    
    // Validate with Zod
    const result = EmployeeSchema.safeParse(rawData);

    if (!result.success) {
        // Gom nhóm lỗi để hiển thị gọn
        const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
        return { error: errorMessages };
    }

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

