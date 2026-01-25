import { createClient } from '@/lib/supabase.server'

export const attendanceRepo = {
  // Lấy dữ liệu chấm công theo tháng (của tất cả nhân viên hoặc 1 người)
  async getAttendances(month: number, year: number, employeeId?: number) {
    const supabase = await createClient()
    
    // Tạo ngày bắt đầu và kết thúc tháng
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31` // Lấy dư ra chút cũng không sao

    let query = supabase
      .from('attendances')
      .select(`
        *,
        employees (
          first_name,
          last_name,
          avatar
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data
  },

  // Check-in (Tạo bản ghi mới)
  async checkIn(employeeId: number, date: string, time: string) {
    const supabase = await createClient()
    
    // Kiểm tra xem hôm nay đã check-in chưa
    const { data: existing } = await supabase
      .from('attendances')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('date', date)
      .single()

    if (existing) {
      throw new Error('Nhân viên này đã Check-in ngày hôm nay rồi!')
    }

    const { data, error } = await supabase
      .from('attendances')
      .insert({
        employee_id: employeeId,
        date: date,
        check_in_time: time,
        status: 'Present' // Tạm thời set là có mặt, service sẽ tính late sau
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // Check-out (Update bản ghi cũ)
  async checkOut(employeeId: number, date: string, time: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('attendances')
      .update({
        check_out_time: time
      })
      .eq('employee_id', employeeId)
      .eq('date', date)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
