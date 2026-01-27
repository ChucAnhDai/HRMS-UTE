import { createClient } from '@/lib/supabase.server'
import { Database } from '@/types/database'

export const contractRepo = {
  // Lấy danh sách hợp đồng của một nhân viên
  async getContractsByEmployeeId(employeeId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('employee_id', employeeId)
      .order('start_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  },

  // Tạo hợp đồng mới
  async createContract(contractData: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contracts')
      .insert(contractData)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Cập nhật hợp đồng
  async updateContract(contractId: number, contractData: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contracts')
      .update(contractData)
      .eq('id', contractId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Xóa hợp đồng
  async deleteContract(contractId: number) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId)

    if (error) throw new Error(error.message)
    return true
  }
}
