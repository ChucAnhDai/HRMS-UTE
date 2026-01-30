'use server'

import { attendanceService } from '@/server/services/attendance-service'
import { revalidatePath } from 'next/cache'

export async function checkInAction(employeeId: number) {
  try {
    await attendanceService.performCheckIn(employeeId)
    revalidatePath('/calendar')
    return { success: true, message: 'Check-in thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi Check-in'
    return { error: message }
  }
}

export async function checkOutAction(employeeId: number) {
  try {
    await attendanceService.performCheckOut(employeeId)
    revalidatePath('/calendar')
    return { success: true, message: 'Check-out thành công!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi Check-out'
    return { error: message }
  }
}
