'use server'

import { assetService } from '@/server/services/asset-service'
import { revalidatePath } from 'next/cache'

export async function assignAssetAction(assetId: number, employeeId: number) {
  try {
    await assetService.assignAsset(assetId, employeeId)
    revalidatePath('/instruments')
    revalidatePath(`/employees/${employeeId}`)
    return { success: true, message: 'Cấp phát tài sản thành công' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function unassignAssetAction(assetId: number, employeeId?: number) {
  try {
    await assetService.unassignAsset(assetId)
    revalidatePath('/instruments')
    if (employeeId) {
      revalidatePath(`/employees/${employeeId}`)
    }
    return { success: true, message: 'Thu hồi tài sản thành công' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
