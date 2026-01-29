'use server'

import { revalidatePath } from 'next/cache'
import { settingRepo } from '../repositories/setting-repo'
import { requireRole } from '@/lib/auth-helpers'

// --- Settings ---
export async function updateSettingsAction(formData: FormData) {
  await requireRole(['ADMIN'])

  // 1. Basic Key-Values
  const simpleKeys = [
    'base_salary_min', 'insurance_percent', 'standard_work_days',
    'personal_deduction', 'dependent_deduction',
    'work_start_time', 'work_end_time',
    'penalty_late', 'penalty_absence', // New Penalty Keys
    'tax_brackets' // Expected as JSON string from hidden input
  ]

  const updates = simpleKeys.map(key => ({
      key, 
      value: formData.get(key) as string
  }))

  // 2. Handle Checkboxes (Weekend Days)
  // formData.getAll returns an array of values for checked boxes
  const weekendDays = formData.getAll('weekend_days')
  updates.push({
      key: 'weekend_days',
      value: JSON.stringify(weekendDays)
  })

  // 3. Save to DB
  for (const update of updates) {
    if (update.value !== null && update.value !== undefined) {
      await settingRepo.updateSetting(update.key, update.value)
    }
  }

  revalidatePath('/settings')
  return { success: true, message: 'Cập nhật cấu hình thành công' }
}

// --- Holidays ---
export async function addHolidayAction(formData: FormData) {
    await requireRole(['ADMIN'])

    const name = formData.get('name') as string
    const date = formData.get('date') as string

    if (!name || !date) {
        return { success: false, message: 'Vui lòng nhập đầy đủ thông tin' }
    }

    try {
        await settingRepo.addHoliday(name, date)
        revalidatePath('/settings')
        return { success: true, message: 'Thêm ngày lễ thành công' }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Lỗi khi thêm ngày lễ' }
    }
}

export async function deleteHolidayAction(id: number) {
    await requireRole(['ADMIN'])
    
    try {
        await settingRepo.deleteHoliday(id)
        revalidatePath('/settings')
        return { success: true, message: 'Xóa ngày lễ thành công' }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Lỗi không xác định' }
    }
}
