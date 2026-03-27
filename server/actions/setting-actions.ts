'use server'

import { revalidatePath } from 'next/cache'
import { settingRepo } from '../repositories/setting-repo'
import { requireRole } from '@/lib/auth-helpers'
import { SettingsSchema } from '@/lib/schemas/setting.schema'
import { activityService } from '@/server/services/activity-service'

// --- Settings ---
export async function updateSettingsAction(formData: FormData) {
  await requireRole(['ADMIN'])

  // 1. Extract raw form data
  const rawData = {
    base_salary_min: formData.get('base_salary_min'),
    insurance_percent: formData.get('insurance_percent'),
    personal_deduction: formData.get('personal_deduction'),
    dependent_deduction: formData.get('dependent_deduction'),
    work_start_time: formData.get('work_start_time'),
    work_end_time: formData.get('work_end_time'),
    penalty_late: formData.get('penalty_late'),
    penalty_absence: formData.get('penalty_absence'),
    tax_brackets: formData.get('tax_brackets'),
  }

  // 2. Validate with Zod
  const result = SettingsSchema.safeParse(rawData)
  if (!result.success) {
    const firstError = result.error.issues[0]
    return { success: false, message: firstError.message }
  }

  // 3. Prepare updates (key-value pairs for DB)
  const simpleKeys = [
    'base_salary_min', 'insurance_percent',
    'personal_deduction', 'dependent_deduction',
    'work_start_time', 'work_end_time',
    'penalty_late', 'penalty_absence',
    'tax_brackets'
  ]

  const updates = simpleKeys.map(key => ({
    key,
    value: formData.get(key) as string
  }))

  // 4. Handle Checkboxes (Weekend Days)
  const weekendDays = formData.getAll('weekend_days')
  updates.push({
    key: 'weekend_days',
    value: JSON.stringify(weekendDays)
  })

  // 5. Save to DB
  for (const update of updates) {
    if (update.value !== null && update.value !== undefined) {
      await settingRepo.updateSetting(update.key, update.value)
    }
  }

  await activityService.logActivity('CẬP NHẬT', 'Hệ thống', undefined, 'Đã thay đổi cấu hình cài đặt hệ thống')

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
        await activityService.logActivity('THÊM MỚI', 'Hệ thống', undefined, `Thêm ngày nghỉ lễ mới: ${name}`)
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
        await activityService.logActivity('XÓA', 'Hệ thống', id, `Xóa thông tin ngày nghỉ lễ ID ${id}`)
        revalidatePath('/settings')
        return { success: true, message: 'Xóa ngày lễ thành công' }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Lỗi không xác định' }
    }
}
