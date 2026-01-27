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
