'use server'

import { overtimeRepo } from '@/server/repositories/overtime-repo'
import { settingRepo } from '@/server/repositories/setting-repo'
import { attendanceRepo } from '@/server/repositories/attendance-repo'
import { revalidatePath } from 'next/cache'
import { requireRole, getCurrentUser } from '@/lib/auth-helpers'
import { OvertimeRequest } from '@/types'

// Helper for error handling
const handleError = (error: unknown): { success: false; error: string } => {
    console.error('Action Error:', error)
    if (error instanceof Error) {
        return { success: false, error: error.message }
    }
    return { success: false, error: 'Đã xảy ra lỗi không xác định' }
}

export async function createOvertimeRequestAction(data: Partial<OvertimeRequest>): Promise<{ success: true; data: OvertimeRequest } | { success: false; error: string }> {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) throw new Error('Unauthorized')

        // Nếu là employee, chỉ được tạo cho chính mình
        if (currentUser.role === 'EMPLOYEE') {
            data.employee_id = Number(currentUser.employeeId)
            data.status = 'Pending' // Luôn pending
        } else {
             // Admin/Manager tạo hộ
             if (!data.employee_id) {
                 return { success: false, error: 'Vui lòng chọn nhân viên' }
             }
             data.status = 'Pending' // Vẫn cần duyệt hoặc auto approve tùy ý. Để Pending cho an toàn.
        }

        // Validate: Giới hạn độ dài lý do (tối đa 500 ký tự)
        const MAX_REASON_LENGTH = 500
        if (data.reason && data.reason.length > MAX_REASON_LENGTH) {
            return {
                success: false,
                error: `Lý do không được vượt quá ${MAX_REASON_LENGTH} ký tự. Hiện tại: ${data.reason.length} ký tự.`
            }
        }

        // Validate Time
        if (data.start_time && data.end_time) {
            if (data.end_time <= data.start_time) {
                return { success: false, error: 'Giờ kết thúc phải lớn hơn giờ bắt đầu' }
            }
        }

        // Validate: Không cho đăng ký OT cho ngày trong quá khứ
        if (data.date) {
            const today = new Date()
            // Lấy ngày hiện tại theo múi giờ Việt Nam (UTC+7)
            const todayStr = new Date(today.getTime() + 7 * 60 * 60 * 1000)
                .toISOString().split('T')[0]
            
            if (data.date < todayStr) {
                return { 
                    success: false, 
                    error: `Không thể đăng ký OT cho ngày trong quá khứ (${data.date}). Vui lòng chọn ngày hôm nay hoặc trong tương lai.` 
                }
            }
        }

        // Validate: Giờ bắt đầu OT phải >= giờ tan làm (không trùng giờ hành chính)
        if (data.start_time) {
            const settings = await settingRepo.getSettings()
            const workEndTime = settings['work_end_time'] || '17:00'
            
            if (data.start_time < workEndTime) {
                return { 
                    success: false, 
                    error: `Giờ bắt đầu OT (${data.start_time}) không được trước giờ tan làm (${workEndTime}). Tăng ca chỉ được đăng ký sau giờ hành chính.` 
                }
            }
        }

        // Đã xóa validate check-in lúc đăng ký để cho phép nhân viên đăng ký trước cho ngày tương lai.
        // Việc kiểm tra sẽ được thực hiện khi Admin/Manager duyệt đơn.

        const res = await overtimeRepo.createRequest(data)
        revalidatePath('/overtime')
        return { success: true, data: res }
    } catch (error) {
        return handleError(error)
    }
}

export async function approveOvertimeRequestAction(id: number): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER'])
        const currentUser = await getCurrentUser()
        if (!currentUser) throw new Error('User not found')
        
        // --- Bắt đầu Validate Check-in khi Duyệt ---
        const request = await overtimeRepo.getRequestById(id)
        if (!request) throw new Error('Không tìm thấy đơn đăng ký OT')

        const requestDate = new Date(request.date)
        const year = requestDate.getFullYear()
        
        // Lấy dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const dayOfWeek = requestDate.getDay().toString()

        // 1. Kiểm tra ngày cấu hình là weekend (VD: ["0", "6"] là T7, CN)
        const settings = await settingRepo.getSettings()
        const weekendDaysStr = settings['weekend_days']
        let isWeekend = false
        if (weekendDaysStr) {
            try {
                const weekendDaysArray: string[] = JSON.parse(weekendDaysStr)
                isWeekend = weekendDaysArray.includes(dayOfWeek)
            } catch (e) {
                console.error("Error parsing weekend_days config", e)
            }
        }

        // 2. Kiểm tra ngày lễ
        let isHoliday = false
        const holidays = await settingRepo.getHolidays(year)
        if (holidays.some(h => h.date === request.date)) {
            isHoliday = true
        }

        // 3. Nếu không phải ngày Lễ/Cuối tuần thì bắt buộc phải check-in
        if (!isWeekend && !isHoliday) {
            const hasCheckedIn = await attendanceRepo.hasCheckedIn(request.employee_id, request.date)
            if (!hasCheckedIn) {
                return {
                    success: false,
                    error: `Nhân viên chưa check-in ngày ${request.date}. Không thể duyệt tăng ca khi nhân viên chưa có mặt.`
                }
            }
        }
        // --- Kết thúc Validate Check-in khi Duyệt ---

        await overtimeRepo.updateStatus(id, 'Approved', Number(currentUser.id))
        revalidatePath('/overtime')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}

export async function rejectOvertimeRequestAction(id: number, rejectionReason: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER'])
        const currentUser = await getCurrentUser()
        if (!currentUser) throw new Error('User not found')

        if (!rejectionReason || rejectionReason.trim().length === 0) {
            return { success: false, error: 'Vui lòng nhập lý do từ chối.' }
        }

        if (rejectionReason.length > 500) {
            return { success: false, error: `Lý do từ chối không được vượt quá 500 ký tự. Hiện tại: ${rejectionReason.length} ký tự.` }
        }

        await overtimeRepo.updateStatus(id, 'Rejected', Number(currentUser.id), rejectionReason.trim())
        revalidatePath('/overtime')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}
