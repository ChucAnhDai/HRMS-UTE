import { createClient } from '@/lib/supabase.server'

export const rewardPenaltyRepo = {
  async create(data: {
    employee_id: number,
    type: 'Reward' | 'Penalty',
    amount: number,
    reason?: string,
    date: string
  }) {
    const supabase = await createClient()
    const { error } = await supabase.from('rewards_penalties').insert(data)
    if (error) throw new Error(error.message)
  },

  async getByMonth(month: number, year: number) {
    const supabase = await createClient()
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    // Simple logic: get items where date is within the month
    // Note: Need to handle end of month correctly.
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`

    const { data, error } = await supabase
      .from('rewards_penalties')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) throw new Error(error.message)
    return data
  },

  async getByEmployeeAndMonth(employeeId: number, month: number, year: number) {
      const supabase = await createClient()
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`
  
      const { data, error } = await supabase
        .from('rewards_penalties')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
  
      if (error) throw new Error(error.message)
      return data
  }
}
