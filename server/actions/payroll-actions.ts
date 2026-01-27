'use server'

import { payrollService } from '@/server/services/payroll-service'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth-helpers'
import { Payslip, PayslipUpdateDTO } from '@/types'

// Helper for error handling
const handleError = (error: unknown): { success: false; error: string } => {
    console.error('Action Error:', error)
    if (error instanceof Error) {
        return { success: false, error: error.message }
    }
    return { success: false, error: 'Đã xảy ra lỗi không xác định' }
}

// Action: Tính lương (Chỉ Admin/Header)
export async function generatePayrollAction(month: number, year: number): Promise<{ success: true; count: number; message: string } | { success: false; error: string }> {
  try {
    await requireRole(['ADMIN', 'MANAGER'])
    const result = await payrollService.generateMonthlyPayroll(month, year)
    revalidatePath('/payroll')
    return { success: true, count: result.length, message: `Đã tính lương xong cho ${result.length} nhân viên` }
  } catch (error) {
    return handleError(error)
  }
}

export async function getPayrollListAction(month: number, year: number): Promise<{ success: true; data: Payslip[] } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER', 'EMPLOYEE']) 
        const data = await payrollService.getPayrollList(month, year)
        return { success: true, data }
    } catch (error) {
        return handleError(error)
    }
}

export async function updatePayslipAction(id: number, data: PayslipUpdateDTO): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER'])
        await payrollService.updatePayslip(id, data)
        revalidatePath('/payroll')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}

export async function getPayslipDetailAction(id: number): Promise<{ success: true; data: Payslip } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER', 'EMPLOYEE'])
        const data = await payrollService.getPayslipById(id)
        if (!data) throw new Error('Không tìm thấy phiếu lương')
        return { success: true, data }
    } catch (error) {
        return handleError(error)
    }
}

export async function markPayrollAsPaidAction(month: number, year: number): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await requireRole(['ADMIN', 'MANAGER'])
        await payrollService.markPayrollAsPaid(month, year)
        revalidatePath('/payroll')
        return { success: true }
    } catch (error) {
        return handleError(error)
    }
}
