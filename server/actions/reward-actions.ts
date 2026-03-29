'use server'

import { revalidatePath } from 'next/cache'
import { rewardPenaltyRepo } from '../repositories/reward-penalty-repo'
import { requireRole } from '@/lib/auth-helpers'

export async function createRewardPenaltyAction(formData: FormData) {
  await requireRole(['ADMIN', 'MANAGER'])

  const employee_id = Number(formData.get('employee_id'))
  const type = formData.get('type') as 'Reward' | 'Penalty'
  const amount = Number(formData.get('amount'))
  const reason = formData.get('reason') as string
  const date = formData.get('date') as string
  const viewMonth = formData.get('month') ? Number(formData.get('month')) : null
  const viewYear = formData.get('year') ? Number(formData.get('year')) : null

  if (!employee_id || !type || !amount || !date) {
    return { success: false, message: 'Vui lòng điền đầy đủ thông tin' }
  }

  // Validate loại điều chỉnh hợp lệ (Security check)
  const VALID_TYPES = ['Reward', 'Penalty'] as const
  if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    return { success: false, message: `Loại không hợp lệ: "${type}". Chỉ cho phép: Thưởng (Reward) hoặc Phạt (Penalty).` }
  }

  // Validate nhân viên tồn tại trong hệ thống
  const { employeeRepo } = await import('@/server/repositories/employee-repo')
  const employee = await employeeRepo.getEmployeeById(employee_id)
  if (!employee) {
    return { success: false, message: 'Nhân viên không tồn tại trong hệ thống' }
  }

  // Server-side validation: ensure date matches the management context
  if (viewMonth && viewYear) {
    const selectedDate = new Date(date)
    const selectedMonth = selectedDate.getMonth() + 1
    const selectedYear = selectedDate.getFullYear()

    if (selectedMonth !== viewMonth || selectedYear !== viewYear) {
      return { success: false, message: 'Thời gian chọn không hợp lệ. Vui lòng chọn ngày trong tháng hiện tại.' }
    }
  }

  try {
    await rewardPenaltyRepo.create({
      employee_id,
      type,
      amount,
      reason,
      date
    })
    revalidatePath('/payroll/adjustments')
    return { success: true, message: 'Thêm mới thành công' }
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Lỗi khi thêm mới' }
  }
}

export async function getRewardsPenaltiesAction(month: number, year: number) {
    await requireRole(['ADMIN', 'MANAGER', 'EMPLOYEE'])
    // This fetches simplified list
    // In real app we might want to fetch with Employee relations
    return await rewardPenaltyRepo.getByMonth(month, year)
}
