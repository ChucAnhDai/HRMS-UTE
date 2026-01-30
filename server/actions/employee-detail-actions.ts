'use server'

import { contractRepo } from '@/server/repositories/contract-repo'
import { assetRepo } from '@/server/repositories/asset-repo'
import { salaryHistoryRepo } from '@/server/repositories/salary-history-repo'
import { revalidatePath } from 'next/cache'
import { requireRole, getCurrentUser } from '@/lib/auth-helpers'

export type ActionState = {
  success?: boolean
  message?: string
  error?: string
}

// ============ CONTRACTS ============

// Tạo hợp đồng mới
export async function createContractAction(
  employeeId: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireRole(['ADMIN'])
    
    const contract_type = formData.get('contract_type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string || null
    const notes = formData.get('notes') as string || null
    // TODO: Handle file upload separately
    
    if (!contract_type || !start_date) {
      return { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' }
    }
    
    await contractRepo.createContract({
      employee_id: employeeId,
      contract_type,
      start_date,
      end_date,
      notes
    })
    
    revalidatePath(`/employees/${employeeId}/edit`)
    
    return { success: true, message: 'Đã thêm hợp đồng mới!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi tạo hợp đồng'
    return { error: message }
  }
}

// Xóa hợp đồng
export async function deleteContractAction(contractId: number, employeeId: number): Promise<ActionState> {
  try {
    await requireRole(['ADMIN'])
    
    await contractRepo.deleteContract(contractId)
    
    revalidatePath(`/employees/${employeeId}/edit`)
    
    return { success: true, message: 'Đã xóa hợp đồng!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi xóa hợp đồng'
    return { error: message }
  }
}

// ============ ASSETS ============

// Cấp phát tài sản
export async function assignAssetAction(
  employeeId: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireRole(['ADMIN'])
    
    const asset_id = Number(formData.get('asset_id'))

    
    if (!asset_id) {
      return { error: 'Vui lòng chọn tài sản' }
    }
    
    await assetRepo.assignAsset(asset_id, employeeId)
    
    revalidatePath(`/employees/${employeeId}/edit`)
    revalidatePath('/instruments')
    
    return { success: true, message: 'Đã cấp phát tài sản!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi cấp phát tài sản'
    return { error: message }
  }
}

// Thu hồi tài sản
export async function returnAssetAction(assetId: number, employeeId: number): Promise<ActionState> {
  try {
    await requireRole(['ADMIN'])
    
    await assetRepo.unassignAsset(assetId)
    
    revalidatePath(`/employees/${employeeId}/edit`)
    revalidatePath('/instruments')
    
    return { success: true, message: 'Đã thu hồi tài sản!' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi thu hồi tài sản'
    return { error: message }
  }
}

// ============ SALARY HISTORY ============

// Thêm lịch sử thay đổi lương (được gọi tự động khi cập nhật lương trong employee-service)
export async function addSalaryHistoryAction(
  employeeId: number,
  oldSalary: number | null,
  newSalary: number,
  reason?: string
): Promise<ActionState> {
  try {
    const currentUser = await getCurrentUser()
    
    await salaryHistoryRepo.createSalaryHistory({
      employee_id: employeeId,
      old_salary: oldSalary,
      new_salary: newSalary,
      reason: reason || 'Cập nhật lương',
      changed_by_employee_id: currentUser?.employeeId || null
    })
    
    revalidatePath(`/employees/${employeeId}/edit`)
    
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi khi lưu lịch sử lương'
    return { error: message }
  }
}
