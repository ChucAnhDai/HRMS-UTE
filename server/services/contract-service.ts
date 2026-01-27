import { contractRepo } from '@/server/repositories/contract-repo'

export const contractService = {
  async getContracts(employeeId: number) {
    const contracts = await contractRepo.getContractsByEmployeeId(employeeId)
    
    // Format hiển thị
    return contracts?.map(c => ({
      ...c,
      StartDateFormatted: new Date(c.start_date).toLocaleDateString('vi-VN'),
      EndDateFormatted: c.end_date ? new Date(c.end_date).toLocaleDateString('vi-VN') : 'Vô thời hạn',
      Status: c.end_date && new Date(c.end_date) < new Date() ? 'Hết hạn' : 'Hiệu lực'
    }))
  },

  async createContract(formData: FormData) {
    const employee_id = Number(formData.get('employee_id'))
    const contract_type = formData.get('contract_type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') ? formData.get('end_date') as string : null
    const notes = formData.get('notes') as string
    const salary = formData.get('salary') ? Number(formData.get('salary')) : 0

    // Validation chi tiết
    if (!employee_id || isNaN(employee_id)) {
      throw new Error('Thiếu thông tin nhân viên')
    }
    
    if (!contract_type || contract_type.trim() === '') {
      throw new Error('Thiếu loại hợp đồng')
    }
    
    if (!start_date || start_date.trim() === '') {
      throw new Error('Thiếu ngày bắt đầu')
    }

    return await contractRepo.createContract({
      employee_id,
      contract_type,
      start_date,
      end_date,
      notes,
      salary
    })
  },

  async updateContract(contractId: number, formData: FormData) {
    const contract_type = formData.get('contract_type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') ? formData.get('end_date') as string : null
    const notes = formData.get('notes') as string
    const salary = formData.get('salary') ? Number(formData.get('salary')) : 0

    // Validation
    if (!contract_type || contract_type.trim() === '') {
      throw new Error('Thiếu loại hợp đồng')
    }
    
    if (!start_date || start_date.trim() === '') {
      throw new Error('Thiếu ngày bắt đầu')
    }

    return await contractRepo.updateContract(contractId, {
      contract_type,
      start_date,
      end_date,
      notes,
      salary
    })
  },

  async deleteContract(contractId: number) {
    return await contractRepo.deleteContract(contractId)
  }
}
