'use server'

import { attendanceService } from '@/server/services/attendance-service'
import { revalidatePath } from 'next/cache'

export async function checkInAction(employeeId: number) {
  try {
    await attendanceService.performCheckIn(employeeId)
    revalidatePath('/calendar')
    return { success: true, message: 'Check-in thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Lỗi Check-in' }
  }
}

export async function checkOutAction(employeeId: number) {
  try {
    await attendanceService.performCheckOut(employeeId)
    revalidatePath('/calendar')
    return { success: true, message: 'Check-out thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Lỗi Check-out' }
  }
}
