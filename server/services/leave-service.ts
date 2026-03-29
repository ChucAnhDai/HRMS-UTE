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

    // Validate loại nghỉ phép hợp lệ (Defense-in-depth)
    const VALID_LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Unpaid Leave', 'Maternity Leave', 'Other'] as const
    if (!VALID_LEAVE_TYPES.includes(leave_type as typeof VALID_LEAVE_TYPES[number])) {
      throw new Error(`Loại nghỉ phép không hợp lệ: "${leave_type}"`)
    }

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
  async approveLeave(id: number, actionByEmployeeId?: number, forceApprove?: boolean) {
    // 1. Lấy thông tin đơn nghỉ phép
    const leaveRequest = await leaveRepo.getLeaveRequestById(id)
    if (!leaveRequest) {
      throw new Error('Không tìm thấy đơn nghỉ phép')
    }

    // 2. Kiểm tra trạng thái - chỉ được duyệt đơn Pending
    if (leaveRequest.status !== 'Pending') {
      throw new Error('Chỉ có thể duyệt đơn ở trạng thái "Chờ duyệt"')
    }

    // 3. Kiểm tra ngày nghỉ đã qua chưa
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const endDate = new Date(leaveRequest.end_date)
    endDate.setHours(0, 0, 0, 0)

    if (endDate < today && !forceApprove) {
      console.log(`[LeaveService] Late approval warning for request ${id} (End: ${leaveRequest.end_date})`)
      // Trả về warning thay vì throw error
      return {
        warning: true,
        message: `⚠️ Đơn nghỉ phép này đã quá hạn (${new Date(leaveRequest.start_date).toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}). Bạn có chắc chắn muốn duyệt không?`,
        leaveId: id
      }
    }

    if (forceApprove) {
      console.log(`[LeaveService] Force approving expired request ${id} by admin/manager`)
    } else {
      console.log(`[LeaveService] Approving request ${id}`)
    }

    return await leaveRepo.updateLeaveStatus(id, 'Approved', actionByEmployeeId)
  },

  // Từ chối đơn nghỉ phép (bắt buộc phải có lý do)
  async rejectLeave(id: number, rejectionReason: string, actionByEmployeeId?: number) {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error('Vui lòng nhập lý do từ chối')
    }

    // Defense-in-depth: Kiểm tra trạng thái trước khi từ chối
    const leaveRequest = await leaveRepo.getLeaveRequestById(id)
    if (!leaveRequest) {
      throw new Error('Không tìm thấy đơn nghỉ phép')
    }
    if (leaveRequest.status !== 'Pending') {
      throw new Error('Chỉ có thể từ chối đơn ở trạng thái "Chờ duyệt"')
    }

    return await leaveRepo.updateLeaveStatus(id, 'Rejected', actionByEmployeeId, rejectionReason)
  },

  // NEW: Cập nhật đơn nghỉ phép (chỉ khi Pending)
  async updateLeaveRequest(id: number, formData: FormData, currentEmployeeId: number) {
    const leave_type = formData.get('leave_type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const reason = formData.get('reason') as string

    // Validate loại nghỉ phép hợp lệ (Defense-in-depth)
    const VALID_LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Unpaid Leave', 'Maternity Leave', 'Other'] as const
    if (!VALID_LEAVE_TYPES.includes(leave_type as typeof VALID_LEAVE_TYPES[number])) {
      throw new Error(`Loại nghỉ phép không hợp lệ: "${leave_type}"`)
    }

    // 1. Validate cơ bản
    if (!leave_type || !start_date || !end_date) {
      throw new Error('Thiếu thông tin bắt buộc')
    }

    const start = new Date(start_date)
    const end = new Date(end_date)

    if (end < start) {
      throw new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
    }

    // 2. Kiểm tra nghiệp vụ & Bảo mật
    const existingLeave = await leaveRepo.getLeaveRequestById(id)
    if (!existingLeave) {
      throw new Error('Không tìm thấy đơn nghỉ phép')
    }

    // Bảo mật: Đảm bảo nhân viên chỉ sửa đơn của chính mình
    if (existingLeave.employee_id !== currentEmployeeId) {
      throw new Error('Bạn không có quyền chỉnh sửa đơn này')
    }

    // Nghiệp vụ: Chỉ cho phép sửa khi chưa duyệt (Pending)
    if (existingLeave.status !== 'Pending') {
      throw new Error('Chỉ có thể chỉnh sửa đơn ở trạng thái "Chờ duyệt"')
    }

    return await leaveRepo.updateLeaveRequest(id, {
      leave_type,
      start_date,
      end_date,
      reason
    })
  }
}
