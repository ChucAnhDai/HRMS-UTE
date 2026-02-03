'use server'

import { assetService } from '@/server/services/asset-service'
import { revalidatePath } from 'next/cache'

// Action chung cho cả tạo mới và cập nhật
export async function saveAssetAction(prevState: { success?: boolean; error?: string }, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { AssetSchema } = await import('@/lib/schemas/asset.schema');
    
    // Nếu là update, ID có thể null trong schema nhưng bắt buộc có trong logic if(id).
    // Tuy nhiên AssetSchema đã define id optional.
    const result = AssetSchema.safeParse(rawData);
    
    if (!result.success) {
      const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
      return { success: false, error: errorMessages };
    }

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
    return { success: false, error: message }
  }
}

// Giữ lại createAssetAction cũ nếu cần hoặc xóa đi để dùng chung
export async function createAssetAction(prevState: { success?: boolean; error?: string }, formData: FormData) {
  try {
    await assetService.createAsset(formData)
    revalidatePath('/instruments')
    return { success: true, error: '' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
    return { success: false, error: message }
  }
}

export async function updateAssetAction(id: number, prevState: { success?: boolean; error?: string }, formData: FormData) {
  try {
    await assetService.updateAsset(id, formData)
    revalidatePath('/instruments')
    return { success: true, error: '' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
    return { success: false, error: message }
  }
}

export async function deleteAssetAction(id: number) {
  try {
    await assetService.deleteAsset(id)
    revalidatePath('/instruments')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
    return { success: false, error: message }
  }
}
