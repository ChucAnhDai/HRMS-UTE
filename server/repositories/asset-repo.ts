import { createClient } from '@/lib/supabase.server'

export const assetRepo = {
  // Lấy danh sách tài sản
  async getAssets() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  // Tạo tài sản mới
  async createAsset(asset: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Cập nhật tài sản
  async updateAsset(id: number, asset: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .update(asset)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Xóa tài sản
  async deleteAsset(id: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('assets').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
