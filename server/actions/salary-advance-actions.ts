'use server'

import { getCurrentUser } from '@/lib/auth-helpers'
import { salaryAdvanceRepo } from '@/server/repositories/salary-advance-repo'
import { revalidatePath } from 'next/cache'

export async function createSalaryAdvanceAction(prevState: { error?: string; success?: boolean }, formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.employeeId) {
        throw new Error('Không tìm thấy thông tin nhân viên')
    }

    const amount = Number(formData.get('amount'))
    const reason = formData.get('reason') as string
    const request_date = new Date().toISOString().split('T')[0] // today

    if (!amount || amount <= 0) {
        throw new Error('Số tiền tạm ứng không hợp lệ')
    }

    if (!reason || reason.trim().length === 0) {
        throw new Error('Vui lòng nhập lý do tạm ứng')
    }

    // Optional: Max advance check? E.g. max 50% salary. 
    // For now we skip strict validation on amount vs salary, just basic checks.

    await salaryAdvanceRepo.createRequest({
        employee_id: user.employeeId,
        amount,
        reason,
        request_date
    })

    revalidatePath('/salary-advances')
    return { success: true }
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function approveSalaryAdvanceAction(requestId: number) {
    try {
        const user = await getCurrentUser()
        if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
            throw new Error('Không có quyền thực hiện')
        }
        if (!user.employeeId) {
             throw new Error('Không tìm thấy thông tin nhân viên (Employee ID)')
        }

        await salaryAdvanceRepo.updateStatus(requestId, 'Approved', user.employeeId)
        revalidatePath('/salary-advances')
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function rejectSalaryAdvanceAction(requestId: number, reason: string) {
    try {
        const user = await getCurrentUser()
        if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
            throw new Error('Không có quyền thực hiện')
        }
        if (!user.employeeId) {
             throw new Error('Không tìm thấy thông tin nhân viên (Employee ID)')
        }

        await salaryAdvanceRepo.updateStatus(requestId, 'Rejected', user.employeeId, reason)
        revalidatePath('/salary-advances')
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
