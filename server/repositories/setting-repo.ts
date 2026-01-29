import { createClient } from '@/lib/supabase.server'

export const settingRepo = {
  async getSettings() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('settings').select('*')
    if (error) throw new Error(error.message)
    
    // Transform array to object for easier access
    const settingsMap: Record<string, string> = {}
    data?.forEach(item => {
        settingsMap[item.key] = item.value
    })
    return settingsMap
  },

  async updateSetting(key: string, value: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })
    if (error) throw new Error(error.message)
  },

  async getHolidays(year: number) {
    const supabase = await createClient()
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`
    
    const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
    
    if (error) throw new Error(error.message)
    return data
  },

  async addHoliday(name: string, date: string) {
      const supabase = await createClient()
      const { error } = await supabase.from('holidays').insert({ name, date })
      if (error) throw new Error(error.message)
  },

  async deleteHoliday(id: number) {
      const supabase = await createClient()
      const { error } = await supabase.from('holidays').delete().eq('id', id)
      if (error) throw new Error(error.message)
  }
}
