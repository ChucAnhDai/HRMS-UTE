// Checked: All actions have requireRole(['ADMIN'])


import { departmentService } from '@/server/services/department-service'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export type ActionState = {
  success?: boolean
  message?: string
  error?: string
}

// Tạo phòng ban mới
export async function createDepartmentAction(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  try {
    // Kiểm tra quyền: Chỉ ADMIN mới được tạo phòng ban
    await requireRole(['ADMIN'])
    
    // Validate
    const { DepartmentSchema } = await import('@/lib/schemas/department.schema');
    const rawData = Object.fromEntries(formData.entries());
    const result = DepartmentSchema.safeParse(rawData);

    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
      return { error: errorMessages };
    }

    const name = result.data.name;
    
    await departmentService.createDepartment(name)
    
    revalidatePath('/departments')
    
    return { success: true, message: 'Tạo phòng ban thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi tạo phòng ban'
    return { error: message }
  }
}

// Cập nhật phòng ban
export async function updateDepartmentAction(
  id: number,
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  try {
    // Kiểm tra quyền: Chỉ ADMIN mới được sửa phòng ban
    await requireRole(['ADMIN'])
    
    // Validate
    const { DepartmentSchema } = await import('@/lib/schemas/department.schema');
    const rawData = Object.fromEntries(formData.entries());
    const result = DepartmentSchema.safeParse(rawData);
    
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
      return { error: errorMessages };
    }

    const name = result.data.name;
    
    await departmentService.updateDepartment(id, name)
    
    revalidatePath('/departments')
    
    return { success: true, message: 'Cập nhật phòng ban thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi cập nhật phòng ban'
    return { error: message }
  }
}

// Xóa phòng ban
export async function deleteDepartmentAction(id: number): Promise<ActionState> {
  try {
    // Kiểm tra quyền: Chỉ ADMIN mới được xóa phòng ban
    await requireRole(['ADMIN'])
    
    await departmentService.deleteDepartment(id)
    
    revalidatePath('/departments')
    
    return { success: true, message: 'Xóa phòng ban thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi xóa phòng ban'
    return { error: message }
  }
}

// Redirect helper cho form submit (sử dụng sau khi tạo/sửa thành công)
export async function redirectToDepartments() {
  redirect('/departments')
}
