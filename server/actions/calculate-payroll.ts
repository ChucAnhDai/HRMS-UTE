'use server'

import { payrollService } from '@/server/services/payroll-service'
import { revalidatePath } from 'next/cache'

export async function calculatePayrollAction(month: number, year: number) {
  try {
    await payrollService.calculateMonthlyPayroll(month, year)
    revalidatePath('/payroll')
    return { success: true, message: 'Đã tính lương xong!' }
  } catch (error: any) {
    console.error('Lỗi tính lương:', error)
    return { success: false, error: error.message || 'Có lỗi xảy ra khi tính lương' }
  }
}
