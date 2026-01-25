import { assetRepo } from '@/server/repositories/asset-repo'

export const assetService = {
  async getAssets() {
    const assets = await assetRepo.getAssets()
    return assets?.map(a => ({
      ...a,
      PurchaseDateFormatted: a.purchase_date ? new Date(a.purchase_date).toLocaleDateString('vi-VN') : '',
      CostFormatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a.purchase_cost)
    }))
  },

  async createAsset(formData: FormData) {
    const name = formData.get('name') as string
    const asset_tag = formData.get('asset_tag') as string
    const purchase_date = formData.get('purchase_date') as string
    const purchase_cost = Number(formData.get('purchase_cost'))
    const status = formData.get('status') as string

    if (!name || !asset_tag) throw new Error('Thiếu thông tin bắt buộc')

    return await assetRepo.createAsset({
      name,
      asset_tag,
      purchase_date,
      purchase_cost,
      status
    })
  },

  async deleteAsset(id: number) {
    return await assetRepo.deleteAsset(id)
  }
}
