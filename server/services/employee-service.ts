import { employeeRepo } from '@/server/repositories/employee-repo'

export const employeeService = {
  // Lấy danh sách nhân viên để hiển thị UI
  async getEmployeesList() {
    const rawEmployees = await employeeRepo.getEmployees()
    return rawEmployees
  },

  // Tạo nhân viên mới
  async createEmployee(formData: FormData) {
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const department_id = formData.get('department_id') ? Number(formData.get('department_id')) : null
    const hire_date = formData.get('hire_date') as string
    const salary = formData.get('salary') ? Number(formData.get('salary')) : null
    const job_title = formData.get('job_title') as string
    const tax_code = formData.get('tax_code') as string
    const dependents = formData.get('dependents') ? Number(formData.get('dependents')) : 0

    // Validate cơ bản
    if (!first_name || !last_name || !email || !hire_date) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc')
    }

    // Chuẩn bị data để lưu xuống DB
    const newEmployee = {
        first_name,
        last_name,
        email,
        phone,
        department_id,
        hire_date,
        salary,
        job_title,
        tax_code,
        dependents,
        employment_status: 'Active',
        annual_leave_quota: 12,
        sick_leave_quota: 5
    }

    return await employeeRepo.createEmployee(newEmployee)
  },

  // Lấy danh sách phòng ban cho Dropdown
  async getDepartments() {
    return await employeeRepo.getDepartments()
  },

  // Xóa nhân viên
  async deleteEmployee(id: number) {
    return await employeeRepo.deleteEmployee(id)
  },

  // Lấy chi tiết nhân viên để edit
  async getEmployee(id: number) {
    const emp = await employeeRepo.getEmployeeById(id)
    if (!emp) return null
    return emp
  },

  // Cập nhật nhân viên
  async updateEmployee(id: number, formData: FormData) {
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const department_id = formData.get('department_id') ? Number(formData.get('department_id')) : null
    const hire_date = formData.get('hire_date') as string
    const salary = formData.get('salary') ? Number(formData.get('salary')) : null
    const job_title = formData.get('job_title') as string
    const tax_code = formData.get('tax_code') as string
    const dependents = formData.get('dependents') ? Number(formData.get('dependents')) : 0

    const updateData = {
        first_name,
        last_name,
        email,
        phone,
        department_id,
        hire_date,
        salary,
        job_title,
        tax_code,
        dependents
    }

    return await employeeRepo.updateEmployee(id, updateData)
  }
}
