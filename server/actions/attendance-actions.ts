'use server'

import { attendanceService } from '@/server/services/attendance-service'
import { attendanceRepo } from '@/server/repositories/attendance-repo'
import { requireRole } from '@/lib/auth-helpers'
import { AdminAttendanceSchema, AdminEditAttendanceSchema } from '@/lib/schemas/attendance.schema'
import { revalidatePath } from 'next/cache'

// --- Employee self check-in/out (giữ nguyên) ---
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

// --- Admin/HR: Tạo mới attendance record cho nhân viên ---
export async function adminCreateAttendanceAction(formData: FormData) {
  await requireRole(['ADMIN', 'MANAGER'])

  const rawData = {
    employee_id: formData.get('employee_id'),
    date: formData.get('date'),
    check_in_time: formData.get('check_in_time'),
    check_out_time: formData.get('check_out_time') || undefined,
    status: formData.get('status'),
  }

  // Validate với Zod
  const result = AdminAttendanceSchema.safeParse(rawData)
  if (!result.success) {
    const firstError = result.error.issues[0]
    return { success: false, message: firstError.message }
  }

  try {
    const { employee_id, date, check_in_time, check_out_time, status } = result.data

    // Tạo record check-in
    await attendanceRepo.checkIn(employee_id, date, check_in_time, status)

    // Nếu có check_out_time thì update luôn
    if (check_out_time) {
      await attendanceRepo.checkOut(employee_id, date, check_out_time)
    }

    revalidatePath('/calendar')
    return { success: true, message: 'Chấm công thủ công thành công!' }
  } catch (error: unknown) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra' 
    }
  }
}

// --- Admin/HR: Sửa attendance record ---
export async function adminUpdateAttendanceAction(formData: FormData) {
  await requireRole(['ADMIN', 'MANAGER'])

  const rawData = {
    id: formData.get('id'),
    check_in_time: formData.get('check_in_time'),
    check_out_time: formData.get('check_out_time') || undefined,
    status: formData.get('status'),
  }

  // Validate với Zod
  const result = AdminEditAttendanceSchema.safeParse(rawData)
  if (!result.success) {
    const firstError = result.error.issues[0]
    return { success: false, message: firstError.message }
  }

  try {
    const { id, check_in_time, check_out_time, status } = result.data

    await attendanceRepo.updateAttendance(id, {
      check_in_time,
      check_out_time: check_out_time || null,
      status,
    })

    revalidatePath('/calendar')
    return { success: true, message: 'Cập nhật chấm công thành công!' }
  } catch (error: unknown) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra' 
    }
  }
}

// --- Admin/HR: Xóa attendance record ---
export async function adminDeleteAttendanceAction(id: number) {
  await requireRole(['ADMIN', 'MANAGER'])

  try {
    await attendanceRepo.deleteAttendance(id)
    revalidatePath('/calendar')
    return { success: true, message: 'Đã xóa bản ghi chấm công!' }
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra'
    }
  }
}
