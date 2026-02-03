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
    
    // Validate
    const rawData = Object.fromEntries(formData.entries());
    const { ContractSchema } = await import('@/lib/schemas/contract.schema');
    
    // Chuyển đổi dữ liệu và validate (Vì formData.get trả về string, coerce trong schema sẽ lo việc chuyển số)
    const result = ContractSchema.safeParse(rawData);
    
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
      return { error: errorMessages };
    }

    await contractService.createContract(formData)
    
    // Refresh lại trang hiện tại (dựa trên employee_id gửi lên)
    const employeeId = formData.get('employee_id')
    revalidatePath(`/employees/${employeeId}/edit`)
    
    return { success: true, message: 'Thêm hợp đồng thành công' }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : 'Lỗi khi tạo hợp đồng'
    }
  }
}
