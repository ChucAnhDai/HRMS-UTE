import { attendanceRepo } from '@/server/repositories/attendance-repo'

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

  // Xử lý logic Check-in
  async performCheckIn(employeeId: number) {
    const now = new Date()
    const date = now.toISOString().split('T')[0] // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0] // HH:mm:ss

    // Logic tính đi muộn (Ví dụ: Quy định 8:30 là muộn)
    // Tạm thời bỏ qua logic phức tạp, cứ lưu vào đã
    
    return await attendanceRepo.checkIn(employeeId, date, time)
  },

  async performCheckOut(employeeId: number) {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0]

    return await attendanceRepo.checkOut(employeeId, date, time)
  }
}
