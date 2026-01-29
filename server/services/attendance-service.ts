import { attendanceRepo } from '@/server/repositories/attendance-repo'
import { settingRepo } from '@/server/repositories/setting-repo'

export const attendanceService = {
  // Lấy danh sách chấm công cho Calendar
  async getAttendanceEvents(month: number, year: number) {
    const rawData = await attendanceRepo.getAttendances(month, year)

    // Format dữ liệu để hiển thị lên lịch
    return rawData?.map(att => ({
      id: att.id,
      title: `${att.employees?.first_name} (${att.check_in_time?.slice(0, 5)} - ${att.check_out_time?.slice(0, 5) || '...'})`,
      start: att.date, // FullCalendar cần trường 'start' định dạng YYYY-MM-DD
      backgroundColor: att.status === 'Late' ? '#EF4444' : '#10B981', // Đỏ nếu muộn, Xanh nếu đúng giờ
      borderColor: 'transparent',
      extendedProps: {
        employeeName: `${att.employees?.first_name} ${att.employees?.last_name}`,
        avatar: att.employees?.avatar,
        status: att.status,
        checkIn: att.check_in_time,
        checkOut: att.check_out_time
      }
    }))
  },

  // Lấy logs chấm công theo ngày specific
  async getLogsByDate(date: string) {
    const rawData = await attendanceRepo.getAttendanceByDate(date)
    return rawData?.map(att => ({
        ...att,
        employeeName: `${att.employees?.last_name} ${att.employees?.first_name}`,
        avatar: att.employees?.avatar
    }))
  },

  // Xử lý logic Check-in
  async performCheckIn(employeeId: number) {
    const now = new Date()
    const date = now.toISOString().split('T')[0] // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0] // HH:mm:ss

    // 1. Fetch Global Settings
    const settings = await settingRepo.getSettings()
    
    // 2. Determine Late Status
    // Default 08:00 if not set
    const workStartTime = settings['work_start_time'] || '08:00' 
    
    // Simple comparison HH:mm:ss vs HH:mm
    // To be precise, let's append :00 if needed or just string compare
    // "08:15:00" > "08:00" => Late
    // "08:00:59" > "08:00:00" => Technically late or allow grace period?
    // Let's assume strict check for now: HH:mm compare.
    const checkInTimeStr = time.slice(0, 5) // HH:mm
    const workStartTimeStr = workStartTime // HH:mm
    
    let status: 'Present' | 'Late' = 'Present'
    if (checkInTimeStr > workStartTimeStr) {
        status = 'Late'
    }
    
    return await attendanceRepo.checkIn(employeeId, date, time, status)
  },

  async performCheckOut(employeeId: number) {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0]

    return await attendanceRepo.checkOut(employeeId, date, time)
  }
}
