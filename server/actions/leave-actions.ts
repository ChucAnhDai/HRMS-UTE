'use server'

import { leaveService } from '@/server/services/leave-service'
import { revalidatePath } from 'next/cache'

export type ActionState = {
    success?: boolean
    message?: string
    error?: string
}

export async function createLeaveRequestAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await leaveService.submitLeaveRequest(formData)
    revalidatePath('/leave')
    return { success: true, message: 'Gửi đơn xin nghỉ thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Lỗi khi gửi đơn' }
  }
}

export async function approveLeaveAction(id: number) {
  try {
    await leaveService.approveLeave(id)
    revalidatePath('/leave')
    return { success: true, message: 'Đã duyệt đơn' }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function rejectLeaveAction(id: number) {
  try {
    await leaveService.rejectLeave(id)
    revalidatePath('/leave')
    return { success: true, message: 'Đã từ chối đơn' }
  } catch (error: any) {
    return { error: error.message }
  }
}
