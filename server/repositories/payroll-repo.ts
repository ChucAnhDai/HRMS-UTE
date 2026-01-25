import { createClient } from '@/lib/supabase.server'

export const payrollRepo = {
  async createPayroll(data: any) {
    const supabase = await createClient()
    const { data: result, error } = await supabase
      .from('payrolls')
      .upsert(data, { onConflict: 'employee_id, month' })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return result
  },

  async getPayrollsByMonth(month: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payrolls')
      .select(`
        *,
        employees (
          id,
          first_name,
          last_name,
          department_id,
          avatar,
          departments ( name )
        )
      `)
      .eq('month', month)

    if (error) throw new Error(error.message)
    return data
  },

  async getPayrollById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payrolls')
      .select(`
        *,
        employees (
          *,
          departments ( name )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async getPayrollsByEmployeeId(employeeId: number) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('payrolls')
      .select(`*`)
      .eq('employee_id', employeeId)
      .order('month', { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }
}
