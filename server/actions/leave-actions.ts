'use server'

import { leaveService } from '@/server/services/leave-service'
import { revalidatePath } from 'next/cache'
import { requireRole, getCurrentUser } from '@/lib/auth-helpers'

export type ActionState = {
    success?: boolean
    message?: string
    error?: string
}

export async function createLeaveRequestAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { LeaveRequestSchema } = await import('@/lib/schemas/leave.schema');
    const rawData = Object.fromEntries(formData.entries());
    
    const result = LeaveRequestSchema.safeParse(rawData);
    
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
      return { error: errorMessages };
    }

    await leaveService.submitLeaveRequest(formData)
    revalidatePath('/leave')
    revalidatePath('/profile')
    return { success: true, message: 'Gửi đơn xin nghỉ thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi gửi đơn'
    return { error: message }
  }
}

export async function approveLeaveAction(id: number) {
  try {
    // Kiểm tra quyền: Chỉ ADMIN, MANAGER mới được duyệt đơn
    await requireRole(['ADMIN', 'MANAGER'])
    
    // Lấy thông tin người duyệt
    const currentUser = await getCurrentUser()
    const actionByEmployeeId = currentUser?.employeeId || undefined
    
    await leaveService.approveLeave(id, actionByEmployeeId)
    revalidatePath('/leave')
    revalidatePath('/profile')
    return { success: true, message: 'Đã duyệt đơn' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi duyệt đơn'
    return { error: message }
  }
}

export async function rejectLeaveAction(id: number, rejectionReason: string) {
  try {
    // Kiểm tra quyền: Chỉ ADMIN, MANAGER mới được từ chối đơn
    await requireRole(['ADMIN', 'MANAGER'])
    
    // Validate lý do từ chối
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return { error: 'Vui lòng nhập lý do từ chối' }
    }
    
    // Lấy thông tin người từ chối
    const currentUser = await getCurrentUser()
    const actionByEmployeeId = currentUser?.employeeId || undefined
    
    await leaveService.rejectLeave(id, rejectionReason, actionByEmployeeId)
    revalidatePath('/leave')
    revalidatePath('/profile')
    return { success: true, message: 'Đã từ chối đơn' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi từ chối đơn'
    return { error: message }
  }
}

