'use server'

import { employeeService } from '@/server/services/employee-service'
import { revalidatePath } from 'next/cache'

export async function deleteEmployeeAction(id: number) {
  try {
    await employeeService.deleteEmployee(id)
    revalidatePath('/employees')
    return { success: true }
  } catch (error: any) {
    return {
      error: error.message || 'Xóa nhân viên thất bại'
    }
  }
}
