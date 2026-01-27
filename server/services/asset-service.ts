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

  async updateAsset(id: number, formData: FormData) {
    const name = formData.get('name') as string
    const asset_tag = formData.get('asset_tag') as string
    const purchase_date = formData.get('purchase_date') as string
    const purchase_cost = Number(formData.get('purchase_cost'))
    const status = formData.get('status') as string

    if (!name || !asset_tag) throw new Error('Thiếu thông tin bắt buộc')

    return await assetRepo.updateAsset(id, {
      name,
      asset_tag,
      purchase_date,
      purchase_cost,
      status
    })
  },

  async deleteAsset(id: number) {
    // Check nếu tài sản đang được sử dụng
    const assets = await assetRepo.getAssets()
    const asset = assets?.find(a => a.id === id)
    
    if (asset && asset.assigned_to) {
      throw new Error('Không thể xóa tài sản đang được sử dụng. Vui lòng thu hồi trước.')
    }

    return await assetRepo.deleteAsset(id)
  },

  async getAssetsByEmployeeId(employeeId: number) {
    const assets = await assetRepo.getAssetsByEmployeeId(employeeId)
    return assets?.map(a => ({
      ...a,
      PurchaseDateFormatted: a.purchase_date ? new Date(a.purchase_date).toLocaleDateString('vi-VN') : '',
      AssignedDateFormatted: a.assigned_date ? new Date(a.assigned_date).toLocaleDateString('vi-VN') : '',
      CostFormatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a.purchase_cost)
    }))
  },

  async assignAsset(assetId: number, employeeId: number) {
    // Validate: Kiểm tra tài sản có đang được sử dụng không
    const assets = await assetRepo.getAssets()
    const asset = assets?.find(a => a.id === assetId)
    
    if (!asset) throw new Error('Không tìm thấy tài sản')
    if (asset.assigned_to) throw new Error('Tài sản đang được sử dụng bởi nhân viên khác')
    
    return await assetRepo.assignAsset(assetId, employeeId)
  },

  async unassignAsset(assetId: number) {
    return await assetRepo.unassignAsset(assetId)
  }
}
