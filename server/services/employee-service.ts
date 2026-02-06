import { employeeRepo } from '@/server/repositories/employee-repo'
import { requireManagerOrAbove } from '@/lib/auth-helpers'
import fs from 'fs/promises'
import path from 'path'

export const employeeService = {
  // Lấy danh sách nhân viên để hiển thị UI
  async getEmployeesList() {
    const rawEmployees = await employeeRepo.getEmployees()
    return rawEmployees
  },

  // Tạo nhân viên mới
  async createEmployee(formData: FormData) {
    // Security Check: Only Manager/Admin can create employees
    await requireManagerOrAbove()

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

    const employment_status = formData.get('employment_status') as string || 'Probation'
    const probation_end_date = formData.get('probation_end_date') as string || null
    const annual_leave_quota = formData.get('annual_leave_quota') ? Number(formData.get('annual_leave_quota')) : 12
    const sick_leave_quota = formData.get('sick_leave_quota') ? Number(formData.get('sick_leave_quota')) : 5
    const other_leave_quota = formData.get('other_leave_quota') ? Number(formData.get('other_leave_quota')) : 5

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
        probation_end_date,
        salary,
        job_title,
        tax_code,
        dependents,
        employment_status,
        annual_leave_quota,
        sick_leave_quota,
        other_leave_quota
    }

    return await employeeRepo.createEmployee(newEmployee)
  },

  // Lấy danh sách phòng ban cho Dropdown
  async getDepartments() {
    return await employeeRepo.getDepartments()
  },

  // Xóa nhân viên
  async deleteEmployee(id: number) {
    // Security Check
    await requireManagerOrAbove()

    // 1. Lấy thông tin nhân viên để lấy auth_user_id
    const emp = await employeeRepo.getEmployeeById(id)

    // 2. Xóa nhân viên trong DB
    await employeeRepo.deleteEmployee(id)

    // 3. Xóa tài khoản Supabase Auth (nếu có)
    const email = (emp as unknown as { email?: string })?.email
    
    if (email) {
        try {
            const { supabaseAdmin } = await import('@/lib/supabase.admin')
            
            // Tìm user trong danh sách Auth Users (Limit 1000 cho dự án nhỏ/vừa)
            const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
            
            if (error) throw error;

            const userToDelete = users.find(u => u.email === email)
            
            if (userToDelete) {
                await supabaseAdmin.auth.admin.deleteUser(userToDelete.id)
                console.log(`Deleted Auth User: ${userToDelete.id} (${email})`)
            } else {
                console.warn(`Không tìm thấy Auth User với email: ${email}`)
            }
        } catch (error) {
            console.error('Lỗi khi xóa Auth User:', error)
            // Không throw error để tránh chặn quy trình xóa nhân viên thành công
        }
    }
  },

  // Lấy chi tiết nhân viên để edit
  async getEmployee(id: number) {
    const emp = await employeeRepo.getEmployeeById(id)
    if (!emp) return null
    return emp
  },

  // Cập nhật nhân viên
  async updateEmployee(id: number, formData: FormData) {
    // Security Check
    await requireManagerOrAbove()

    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const department_id = formData.get('department_id') ? Number(formData.get('department_id')) : null
    const hire_date = formData.get('hire_date') as string
    const probation_end_date = formData.get('probation_end_date') as string || null
    const salary = formData.get('salary') ? Number(formData.get('salary')) : null
    const job_title = formData.get('job_title') as string
    const tax_code = formData.get('tax_code') as string
    const dependents = formData.get('dependents') ? Number(formData.get('dependents')) : 0
    const employment_status = formData.get('employment_status') as string || 'Active'
    const termination_date = formData.get('termination_date') as string || null
    const annual_leave_quota = formData.get('annual_leave_quota') ? Number(formData.get('annual_leave_quota')) : 12
    const sick_leave_quota = formData.get('sick_leave_quota') ? Number(formData.get('sick_leave_quota')) : 5
    const other_leave_quota = formData.get('other_leave_quota') ? Number(formData.get('other_leave_quota')) : 5
    
    // Handle Avatar Upload
    const avatarFile = formData.get('avatarFile') as File | null
    let avatar = formData.get('avatar') as string || null

    if (avatarFile && avatarFile.size > 0 && avatarFile.name !== 'undefined') {
        try {
            const bytes = await avatarFile.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Ensure directory exists
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
            try {
                await fs.access(uploadDir)
            } catch {
                await fs.mkdir(uploadDir, { recursive: true })
            }

            // Generate unique filename: empID-timestamp.ext
            const ext = path.extname(avatarFile.name) || '.jpg'
            const filename = `${id}-${Date.now()}${ext}`
            const filepath = path.join(uploadDir, filename)

            await fs.writeFile(filepath, buffer)
            
            // Set public URL
            avatar = `/uploads/avatars/${filename}`
        } catch (error) {
            console.error("Error uploading avatar:", error)
            // Keep previous avatar or null if failed, or throw? better to log and continue with old one if possible, but here we just ignore update
        }
    }

    const updateData = {
        first_name,
        last_name,
        email,
        phone,
        department_id,
        hire_date,
        probation_end_date,
        salary,
        job_title,
        tax_code,
        dependents,
        employment_status,
        termination_date,
        annual_leave_quota,
        sick_leave_quota,
        other_leave_quota,
        avatar
    }

    return await employeeRepo.updateEmployee(id, updateData)
  }
}
