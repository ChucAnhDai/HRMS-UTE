import { leaveRepo } from '@/server/repositories/leave-repo'

export const leaveService = {
  // Lấy danh sách (Format lại ngày tháng cho đẹp)
  async getLeaveList() {
    const raw = await leaveRepo.getLeaveRequests()
    return raw?.map(req => ({
      ...req,
      StartDateFormatted: new Date(req.start_date).toLocaleDateString('vi-VN'),
      EndDateFormatted: new Date(req.end_date).toLocaleDateString('vi-VN'),
      EmployeeName: `${req.employees?.first_name} ${req.employees?.last_name}`,
      Avatar: req.employees?.avatar,
      Duration: Math.ceil((new Date(req.end_date).getTime() - new Date(req.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
    }))
  },

  async getLeavesByEmployeeId(id: number) {
    const raw = await leaveRepo.getLeavesByEmployeeId(id)
    return raw?.map(req => ({
      ...req,
      StartDateFormatted: new Date(req.start_date).toLocaleDateString('vi-VN'),
      EndDateFormatted: new Date(req.end_date).toLocaleDateString('vi-VN'),
      Duration: Math.ceil((new Date(req.end_date).getTime() - new Date(req.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
    }))
  },

  // Gửi đơn xin nghỉ
  async submitLeaveRequest(formData: FormData) {
    const employee_id = Number(formData.get('employee_id'))
    const leave_type = formData.get('leave_type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const reason = formData.get('reason') as string

    // Validate
    if (!employee_id || !leave_type || !start_date || !end_date) {
      throw new Error('Thiếu thông tin bắt buộc')
    }

    if (new Date(end_date) < new Date(start_date)) {
      throw new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
    }

    return await leaveRepo.createLeaveRequest({
      employee_id,
      leave_type,
      start_date,
      end_date,
      reason
    })
  },

  // Duyệt / Từ chối
  async approveLeave(id: number) {
    return await leaveRepo.updateLeaveStatus(id, 'Approved')
  },

  async rejectLeave(id: number) {
    return await leaveRepo.updateLeaveStatus(id, 'Rejected')
  }
}
