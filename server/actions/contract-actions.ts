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
    
    // Validate
    const rawData = Object.fromEntries(formData.entries());
    const { ContractSchema } = await import('@/lib/schemas/contract.schema');
    
    // Schema yêu cầu employee_id, nhưng khi update có thể form không gửi employee_id hoặc contract_id đầy đủ trong body
    // Ta merge thêm contract_id cho đủ
    const fullParse = ContractSchema.safeParse({
         ...rawData,
         // Đảm bảo các field số được convert đúng nếu formData gửi string rỗng
         salary: rawData.salary === '' ? undefined : rawData.salary,
    });
    
     if (!fullParse.success) {
      const errorMessages = fullParse.error.issues.map(issue => issue.message).join(', ');
      return { error: errorMessages };
    }

    const contractId = Number(formData.get('contract_id'))
    const employeeId = Number(formData.get('employee_id'))
    
    await contractService.updateContract(contractId, formData)
    
    // Refresh lại trang
    revalidatePath(`/employees/${employeeId}`)
    
    return { success: true, message: 'Cập nhật hợp đồng thành công' }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Lỗi khi cập nhật hợp đồng'
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
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Lỗi khi xóa hợp đồng'
    }
  }
}
