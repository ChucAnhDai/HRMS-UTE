'use server'

import { assetService } from '@/server/services/asset-service'
import { revalidatePath } from 'next/cache'

// Action chung cho cả tạo mới và cập nhật
export async function saveAssetAction(prevState: { success?: boolean; error?: string }, formData: FormData) {
  try {
    const id = formData.get('id')
    if (id) {
      // Update
      await assetService.updateAsset(Number(id), formData)
    } else {
      // Create
      await assetService.createAsset(formData)
    }
    revalidatePath('/instruments')
    return { success: true, error: '' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
  }
}

// Giữ lại createAssetAction cũ nếu cần hoặc xóa đi để dùng chung
export async function createAssetAction(prevState: { success?: boolean; error?: string }, formData: FormData) {
  try {
    await assetService.createAsset(formData)
    revalidatePath('/instruments')
    return { success: true, error: '' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
  }
}

export async function updateAssetAction(id: number, prevState: { success?: boolean; error?: string }, formData: FormData) {
  try {
    await assetService.updateAsset(id, formData)
    revalidatePath('/instruments')
    return { success: true, error: '' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Có lỗi xảy ra' }
  }
}

export async function deleteAssetAction(id: number) {
  try {
    await assetService.deleteAsset(id)
    revalidatePath('/instruments')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
