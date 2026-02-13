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

    const start = new Date(start_date)
    const end = new Date(end_date)

    if (end < start) {
      throw new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
    }

    // --- Clean Code: Extract Quota Logic ---
    const calculateDuration = (d1: Date, d2: Date) => {
        const diffTime = Math.abs(d2.getTime() - d1.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 
    }

    const requestDuration = calculateDuration(start, end)
    
    // 1. Validate Max Duration Per Request (Safety Check)
    const MAX_DURATION_PER_REQUEST = 30
    if (requestDuration > MAX_DURATION_PER_REQUEST) {
        throw new Error(`Bạn không thể xin nghỉ quá ${MAX_DURATION_PER_REQUEST} ngày trong một lần gửi.`)
    }

    // 2. Validate Quota Availability
    // Fetch employee info to get quota limits
    const { employeeRepo } = await import('@/server/repositories/employee-repo')
    const employee = await employeeRepo.getEmployeeById(employee_id)
    
    if (employee) {
        let limit = 0
        if (leave_type === 'Annual Leave' || leave_type === 'Annual') limit = employee.annual_leave_quota || 12
        else if (leave_type === 'Sick Leave' || leave_type === 'Sick') limit = employee.sick_leave_quota || 5
        else limit = employee.other_leave_quota || 5

        const currentYear = new Date().getFullYear()
        const usedDays = await leaveRepo.getUsedLeaveDays(currentYear, employee_id, leave_type)
        
        if (usedDays + requestDuration > limit) {
             throw new Error(`Bạn đã dùng quá số ngày nghỉ phép quy định. (Hạn mức: ${limit}, Đã dùng: ${usedDays}, Đang xin: ${requestDuration})`)
        }
    }

    return await leaveRepo.createLeaveRequest({
      employee_id,
      leave_type,
      start_date,
      end_date,
      reason
    })
  },

  // Duyệt đơn nghỉ phép
  async approveLeave(id: number, actionByEmployeeId?: number) {
    return await leaveRepo.updateLeaveStatus(id, 'Approved', actionByEmployeeId)
  },

  // Từ chối đơn nghỉ phép (bắt buộc phải có lý do)
  async rejectLeave(id: number, rejectionReason: string, actionByEmployeeId?: number) {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error('Vui lòng nhập lý do từ chối')
    }
    return await leaveRepo.updateLeaveStatus(id, 'Rejected', actionByEmployeeId, rejectionReason)
  }
}
