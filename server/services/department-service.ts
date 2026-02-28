import { departmentRepo } from '@/server/repositories/department-repo'

export const departmentService = {
  // Lấy danh sách phòng ban (kèm số lượng nhân viên)
  async getDepartmentsList() {
    return await departmentRepo.getDepartmentsWithStats()
  },

  // Lấy danh sách phòng ban đơn giản (cho dropdown)
  async getDepartmentsForDropdown() {
    return await departmentRepo.getDepartments()
  },

  // Lấy chi tiết phòng ban
  async getDepartment(id: number) {
    return await departmentRepo.getDepartmentById(id)
  },

  // Tạo phòng ban mới
  async createDepartment(name: string) {
    // Validate
    if (!name || name.trim().length === 0) {
      throw new Error('Tên phòng ban không được để trống')
    }
    
    if (name.trim().length < 2) {
      throw new Error('Tên phòng ban phải có ít nhất 2 ký tự')
    }
    
    if (name.trim().length > 100) {
      throw new Error('Tên phòng ban không được quá 100 ký tự')
    }

    // Kiểm tra trùng tên phòng ban
    const existingDept = await departmentRepo.getDepartmentByName(name)
    if (existingDept) {
      throw new Error(`Tên phòng ban "${name.trim()}" đã tồn tại trong hệ thống. Vui lòng chọn tên khác.`)
    }
    
    return await departmentRepo.createDepartment(name)
  },

  // Cập nhật phòng ban
  async updateDepartment(id: number, name: string) {
    // Validate
    if (!name || name.trim().length === 0) {
      throw new Error('Tên phòng ban không được để trống')
    }
    
    if (name.trim().length < 2) {
      throw new Error('Tên phòng ban phải có ít nhất 2 ký tự')
    }
    
    if (name.trim().length > 100) {
      throw new Error('Tên phòng ban không được quá 100 ký tự')
    }
    
    // Kiểm tra phòng ban tồn tại
    const existing = await departmentRepo.getDepartmentById(id)
    if (!existing) {
      throw new Error('Phòng ban không tồn tại')
    }

    // Kiểm tra trùng tên phòng ban (loại trừ chính phòng ban đang sửa)
    const duplicateDept = await departmentRepo.getDepartmentByName(name, id)
    if (duplicateDept) {
      throw new Error(`Tên phòng ban "${name.trim()}" đã tồn tại trong hệ thống. Vui lòng chọn tên khác.`)
    }
    
    return await departmentRepo.updateDepartment(id, name)
  },

  // Xóa phòng ban
  async deleteDepartment(id: number) {
    // Kiểm tra phòng ban tồn tại
    const existing = await departmentRepo.getDepartmentById(id)
    if (!existing) {
      throw new Error('Phòng ban không tồn tại')
    }
    
    return await departmentRepo.deleteDepartment(id)
  }
}
