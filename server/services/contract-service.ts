import { contractRepo } from '@/server/repositories/contract-repo'

export const contractService = {
  async getContracts(employeeId: number) {
    const contracts = await contractRepo.getContractsByEmployeeId(employeeId)
    
    // Format hiển thị
    return contracts?.map(c => ({
      ...c,
      StartDateFormatted: new Date(c.start_date).toLocaleDateString('vi-VN'),
      EndDateFormatted: c.end_date ? new Date(c.end_date).toLocaleDateString('vi-VN') : 'Vô thời hạn',
      Status: c.end_date && new Date(c.end_date) < new Date() ? 'Hết hạn' : 'Hiệu lực',
      salary: c.salary ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.salary) : '0 ₫'
    }))
  },

  async createContract(formData: FormData) {
    const employee_id = Number(formData.get('employee_id'))
    const contract_type = formData.get('contract_type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') ? formData.get('end_date') as string : null
    const notes = formData.get('notes') as string
    const salary = formData.get('salary') ? Number(formData.get('salary')) : 0

    if (!employee_id || !contract_type || !start_date) {
      throw new Error('Thiếu thông tin bắt buộc')
    }

    return await contractRepo.createContract({
      employee_id,
      contract_type,
      start_date,
      end_date,
      notes,
      salary
    })
  }
}
