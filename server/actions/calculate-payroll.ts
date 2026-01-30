'use server'

import { payrollService } from '@/server/services/payroll-service'
import { revalidatePath } from 'next/cache'

export async function calculatePayrollAction(month: number, year: number) {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được tính lương
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])
    
    await payrollService.generateMonthlyPayroll(month, year)
    revalidatePath('/payroll')
    return { success: true, message: 'Đã tính lương xong!' }
  } catch (error: unknown) {
    console.error('Lỗi tính lương:', error)
    const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tính lương'
    return { success: false, error: message }
  }
}
