'use server'

import { payrollService } from '@/server/services/payroll-service'
import { revalidatePath } from 'next/cache'

export async function calculatePayrollAction(month: number, year: number) {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được tính lương
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])
    
    await payrollService.calculateMonthlyPayroll(month, year)
    revalidatePath('/payroll')
    return { success: true, message: 'Đã tính lương xong!' }
  } catch (error: any) {
    console.error('Lỗi tính lương:', error)
    return { success: false, error: error.message || 'Có lỗi xảy ra khi tính lương' }
  }
}
