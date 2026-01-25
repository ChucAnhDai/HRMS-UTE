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
  }
}
