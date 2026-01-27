'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, AlertCircle, Calculator } from 'lucide-react'
import { updatePayslipAction } from '@/server/actions/payroll-actions'
import { Payslip, PayslipUpdateDTO } from '@/types'

interface Props {
  payslip: Payslip
  onClose: () => void
}

export default function EditPayslipModal({ payslip, onClose }: Props) {
  const [formData, setFormData] = useState({
      salary: payslip.salary,
      ot_hours: payslip.ot_hours,
      ot_salary: payslip.ot_salary,
      bonus: payslip.bonus,
      advance_amount: payslip.advance_amount,
      penalties: payslip.penalties,
      note: payslip.notes || '',
      status: payslip.status
  })
  
  // Các field hiển thị để user tham khảo (Read-only)
  const [readOnlyData] = useState({
      tax: payslip.tax,
      social_insurance: payslip.social_insurance,
      net_pay: payslip.net_pay
  })

  useEffect(() => {
    // Tự động tính tiền OT client-side để user ước lượng
    // Công thức: (Lương cơ bản / 22 / 8) * 1.5 * Giờ OT
    // Đây chỉ là ước tính UX, server sẽ tính lại chính xác.
    const hourlyRate = (Number(formData.salary) / 22 / 8)
    const estimatOtSalary = Math.round(hourlyRate * 1.5 * Number(formData.ot_hours))
    
    // Nếu user chưa sửa tiền OT tay, hoặc muốn auto update
    // Ở đây ta chỉ update nếu user thay đổi giờ. 
    // Tuy nhiên để đơn giản cho UX, ta hiển thị gợi ý hoặc tự set nếu cần.
    // Logic: Nếu giờ OT thay đổi -> tự update tiền OT.
     setFormData(prev => {
        if (prev.ot_hours !== payslip.ot_hours && prev.ot_salary === payslip.ot_salary) {
             return { ...prev, ot_salary: estimatOtSalary }
        }
        return prev
     })
  }, [formData.ot_hours, formData.salary, payslip.ot_hours, payslip.ot_salary])


  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
          ...prev,
          [name]: value
      }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
      try {
          const dataToUpdate: PayslipUpdateDTO = {
              salary: Number(formData.salary),
              ot_hours: Number(formData.ot_hours),
              ot_salary: Number(formData.ot_salary),
              bonus: Number(formData.bonus),
              advance_amount: Number(formData.advance_amount),
              penalties: Number(formData.penalties),
              note: formData.note, 
          }

          const res = await updatePayslipAction(payslip.id, dataToUpdate)
          if (!res.success) {
              // TypeScript narrowing workaround for Server Actions
              const errorMsg = 'error' in res ? res.error : 'Có lỗi xảy ra'
              throw new Error(errorMsg)
          }
          onClose()
      } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('Đã xảy ra lỗi không xác định')
          }
      } finally {
          setLoading(false)
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  Điều chỉnh Phiếu Lương
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                  Tháng {payslip.month}/{payslip.year}
              </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
            <form id="edit-payslip-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Section: Thông tin nhân viên (Read only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nhân viên:</label>
                        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium select-none text-sm">
                            {payslip.employees?.last_name} {payslip.employees?.first_name} <span className="text-gray-500 font-normal">(MNV: #{payslip.employee_id})</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Bộ phận:</label>
                        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium select-none text-sm">
                            {/* @ts-ignore */}
                            {payslip.employees?.departments?.name || '---'}
                        </div>
                    </div>
                </div>

                {/* Section: Lương cơ bản */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Lương Cơ bản (VNĐ):</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* OT */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Số giờ làm thêm (OT)</label>
                         <div className="relative">
                            <input
                                type="number"
                                name="ot_hours"
                                value={formData.ot_hours}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                             <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Calculator className="w-3 h-3" />
                                Thay đổi số giờ sẽ tự động gợi ý lại tiền OT
                             </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tiền lương OT (Tự động tính)</label>
                        <input
                            type="number"
                            name="ot_salary"
                            value={formData.ot_salary}
                            disabled
                            className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg text-gray-500 font-medium cursor-not-allowed outline-none"
                        />
                    </div>
                    
                    {/* Thưởng & Phạt */}
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Thưởng (VNĐ)</label>
                        <input
                            type="number"
                            name="bonus"
                            value={formData.bonus}
                            onChange={handleChange}
                             className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all text-green-700 font-medium"
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phạt / Khấu trừ khác (VNĐ)</label>
                        <input
                            type="number"
                            name="penalties"
                            value={formData.penalties}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all text-red-700 font-medium"
                        />
                    </div>

                    {/* Auto Calculated Fields (Read only) */}
                     <div className="space-y-2 opacity-75">
                        <label className="text-sm font-semibold text-gray-600">Thuế TNCN (Tự động tính)</label>
                        <input
                            type="text"
                            disabled
                            value={new Intl.NumberFormat('vi-VN').format(readOnlyData.tax)}
                            className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>
                     <div className="space-y-2 opacity-75">
                        <label className="text-sm font-semibold text-gray-600">BHXH (Tự động tính)</label>
                        <input
                            type="text"
                            disabled
                             value={new Intl.NumberFormat('vi-VN').format(readOnlyData.social_insurance)}
                            className="w-full px-4 py-3 bg-gray-200 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                 {/* Tạm ứng */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Số tiền tạm ứng (VNĐ)</label>
                    <input
                        type="number"
                        name="advance_amount"
                        value={formData.advance_amount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                </div>

                 {/* Note */}
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        placeholder="Nhập lý do điều chỉnh..."
                    />
                </div>
            </form>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
             <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-colors"
            >
                Hủy bỏ
            </button>
            <button
                type="submit"
                form="edit-payslip-form"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
            >
                {loading ? 'Đang xử lý...' : 'Cập nhật Phiếu lương'}
            </button>
        </div>
      </div>
    </div>
  )
}
