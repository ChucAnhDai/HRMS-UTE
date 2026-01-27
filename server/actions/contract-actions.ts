'use server'

import { contractService } from '@/server/services/contract-service'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  success?: boolean
  message?: string
  error?: string
}

export async function updateContractAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được sửa hợp đồng
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])
    
    const contractId = Number(formData.get('contract_id'))
    const employeeId = Number(formData.get('employee_id'))
    
    await contractService.updateContract(contractId, formData)
    
    // Refresh lại trang
    revalidatePath(`/employees/${employeeId}`)
    
    return { success: true, message: 'Cập nhật hợp đồng thành công' }
  } catch (error: any) {
    return {
      error: error.message || 'Lỗi khi cập nhật hợp đồng'
    }
  }
}

export async function deleteContractAction(contractId: number, employeeId: number): Promise<ActionState> {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được xóa hợp đồng
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])
    
    await contractService.deleteContract(contractId)
    
    // Refresh lại trang
    revalidatePath(`/employees/${employeeId}`)
    
    return { success: true, message: 'Xóa hợp đồng thành công' }
  } catch (error: any) {
    return {
      error: error.message || 'Lỗi khi xóa hợp đồng'
    }
  }
}
