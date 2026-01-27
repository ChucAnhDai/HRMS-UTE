import { createClient } from '@/lib/supabase.server'

export interface SalaryHistory {
  id: number
  employee_id: number
  old_salary: number | null
  new_salary: number
  change_date: string
  changed_by_employee_id: number | null
  reason: string | null
  created_at: string
  changed_by?: {
    first_name: string
    last_name: string
  }
}

export interface CreateSalaryHistoryInput {
  employee_id: number
  old_salary?: number | null
  new_salary: number
  change_date?: string
  changed_by_employee_id?: number | null
  reason?: string | null
}

export const salaryHistoryRepo = {
  // Lấy lịch sử thay đổi lương của nhân viên
  async getSalaryHistoryByEmployee(employeeId: number): Promise<SalaryHistory[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('salary_history')
      .select(`
        *,
        changed_by:changed_by_employee_id (
          first_name,
          last_name
        )
      `)
      .eq('employee_id', employeeId)
      .order('change_date', { ascending: false })
    
    if (error) throw new Error(error.message)
    return data || []
  },

  // Thêm bản ghi lịch sử thay đổi lương
  async createSalaryHistory(input: CreateSalaryHistoryInput): Promise<SalaryHistory> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('salary_history')
      .insert({
        ...input,
        change_date: input.change_date || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // Xóa bản ghi lịch sử (nếu cần)
  async deleteSalaryHistory(id: number): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('salary_history')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }
}
