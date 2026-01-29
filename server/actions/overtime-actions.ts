'use server'

import { overtimeRepo } from '@/server/repositories/overtime-repo'
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
        
        await overtimeRepo.updateStatus(id, 'Approved', Number(currentUser.id))
        revalidatePath('/overtime')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}

export async function rejectOvertimeRequestAction(id: number): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER'])
        const currentUser = await getCurrentUser()
        if (!currentUser) throw new Error('User not found')

        await overtimeRepo.updateStatus(id, 'Rejected', Number(currentUser.id))
        revalidatePath('/overtime')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}
