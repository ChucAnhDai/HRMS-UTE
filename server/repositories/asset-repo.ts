import { createClient } from '@/lib/supabase.server'

export const assetRepo = {
  // Lấy danh sách tài sản
  async getAssets() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        employees:assigned_to (
          id,
          first_name,
          last_name,
          department_id
        )
      `)
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
  },

  // Lấy danh sách tài sản của một nhân viên
  async getAssetsByEmployeeId(employeeId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('assigned_to', employeeId)
      .order('assigned_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  // Cấp phát tài sản cho nhân viên
  async assignAsset(assetId: number, employeeId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .update({
        assigned_to: employeeId,
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'Đang sử dụng'
      })
      .eq('id', assetId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Thu hồi tài sản
  async unassignAsset(assetId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assets')
      .update({
        assigned_to: null,
        assigned_date: null,
        status: 'Sẵn sàng'
      })
      .eq('id', assetId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
