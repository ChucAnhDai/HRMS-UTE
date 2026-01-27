'use server'

import { contractService } from '@/server/services/contract-service'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  success?: boolean
  message?: string
  error?: string
}

export async function createContractAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    // Kiểm tra quyền: Chỉ Admin và Manager mới được tạo hợp đồng
    const { requireRole } = await import('@/lib/auth-helpers')
    await requireRole(['ADMIN', 'MANAGER'])
    
    await contractService.createContract(formData)
    
    // Refresh lại trang hiện tại (dựa trên employee_id gửi lên)
    const employeeId = formData.get('employee_id')
    revalidatePath(`/employees/${employeeId}/edit`)
    
    return { success: true, message: 'Thêm hợp đồng thành công' }
  } catch (error: any) {
    return {
      error: error.message || 'Lỗi khi tạo hợp đồng'
    }
  }
}
