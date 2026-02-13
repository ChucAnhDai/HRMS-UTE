import { createClient } from '@/lib/supabase.server'

export const attendanceRepo = {
  // Lấy dữ liệu logs chấm công theo ngày cụ thể
  async getAttendanceByDate(date: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('attendances')
      .select(`
        *,
        employees (
          first_name,
          last_name,
          avatar,
          department_id
        )
      `)
      .eq('date', date)
      .order('check_in_time', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

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
  async checkIn(employeeId: number, date: string, time: string, status: 'Present' | 'Late' = 'Present') {
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
        status: status
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
  },

  // Lấy thống kê chấm công theo tháng cho tính lương
  async getMonthlyStats(employeeId: number, month: number, year: number) {
    const supabase = await createClient()
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    // Xử lý ngày cuối tháng cho chính xác
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`

    const { data, error } = await supabase
      .from('attendances')
      .select('status')
      .eq('employee_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) throw new Error(error.message)

    // Tính toán
    const totalWorkDays = data.length
    const totalLate = data.filter(a => a.status === 'Late').length

    return {
        work_days: totalWorkDays,
        late_days: totalLate
    }
  },

  // Admin: Update attendance record trực tiếp theo ID
  async updateAttendance(id: number, data: { 
    check_in_time?: string, 
    check_out_time?: string | null, 
    status?: 'Present' | 'Late' 
  }) {
    const supabase = await createClient()
    const { data: updated, error } = await supabase
      .from('attendances')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return updated
  },

  // Admin: Xóa attendance record theo ID
  async deleteAttendance(id: number) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('attendances')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }
}
