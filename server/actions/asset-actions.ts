'use server'

import { assetService } from '@/server/services/asset-service'
import { revalidatePath } from 'next/cache'

export async function createAssetAction(prevState: any, formData: FormData) {
  try {
    await assetService.createAsset(formData)
    revalidatePath('/instruments')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteAssetAction(id: number) {
  try {
    await assetService.deleteAsset(id)
    revalidatePath('/instruments')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
