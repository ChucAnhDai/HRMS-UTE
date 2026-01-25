'use client'

import { updateEmployeeAction } from '@/server/actions/update-employee'
import { useActionState } from 'react'
import { Save, ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

interface Props {
  departments: any[]
  employee: any
}

const initialState = {
  error: '',
  success: false
}

export default function EditEmployeeForm({ departments, employee }: Props) {
  // Bind ID vào action
  const updateActionWithId = updateEmployeeAction.bind(null, employee.id)
  const [state, formAction, isPending] = useActionState(updateActionWithId, initialState)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
            <Edit className="w-5 h-5 text-blue-600" />
            Sửa thông tin nhân viên
        </h3>
        <Link href="/employees" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
      </div>

      <div className="p-8">
        <form action={formAction}>
            {state?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Họ đệm <span className="text-red-500">*</span></label>
                    <input type="text" name="last_name" defaultValue={employee.last_name} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Tên <span className="text-red-500">*</span></label>
                    <input type="text" name="first_name" defaultValue={employee.first_name} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" defaultValue={employee.email} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                    <input type="tel" name="phone" defaultValue={employee.phone || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phòng ban</label>
                    <select name="department_id" defaultValue={employee.department_id || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all focus:border-blue-500 text-black">
                        <option value="">-- Chọn phòng ban --</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Chức vụ (Job Title)</label>
                    <input type="text" name="job_title" defaultValue={employee.job_title || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Ngày vào làm <span className="text-red-500">*</span></label>
                    <input type="date" name="hire_date" defaultValue={employee.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : ''} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Mã số thuế</label>
                    <input type="text" name="tax_code" defaultValue={employee.tax_code || ''} placeholder="VD: 123456789" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Người phụ thuộc</label>
                    <input type="number" name="dependents" defaultValue={employee.dependents || 0} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Lương cơ bản (VND)</label>
                    <input type="number" name="salary" defaultValue={employee.salary || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center gap-2 hover:-translate-y-0.5"
                >
                    {isPending ? 'Đang lưu...' : (
                        <>
                            <Save className="w-4 h-4" /> Lưu thay đổi
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
