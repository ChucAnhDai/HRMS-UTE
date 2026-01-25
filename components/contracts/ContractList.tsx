'use client'

import { createContractAction } from '@/server/actions/create-contract'
import { useActionState, useState } from 'react'
import { Plus, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  employeeId: number
  contracts: any[]
}

const initialState = {
  error: '',
  success: false,
  message: ''
}

export default function ContractList({ employeeId, contracts }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [state, formAction, isPending] = useActionState(createContractAction, initialState)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Hợp đồng lao động
        </h3>
        <button 
            onClick={() => setShowForm(!showForm)}
            className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
        >
            <Plus className="w-4 h-4" />
            {showForm ? 'Đóng' : 'Thêm mới'}
        </button>
      </div>

      <div className="p-6">
        {/* Form Thêm Hợp Đồng */}
        {showForm && (
            <form action={formAction} className="mb-8 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <input type="hidden" name="employee_id" value={employeeId} />
                
                {state?.error && (
                    <div className="mb-4 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {state.error}
                    </div>
                )}
                
                {state?.success && !isPending && (
                    <div className="mb-4 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Thêm hợp đồng thành công!
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Loại hợp đồng</label>
                        <select name="contract_type" className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900">
                            <option value="Thử việc">Hợp đồng thử việc</option>
                            <option value="Chính thức 1 năm">Chính thức 1 năm</option>
                            <option value="Chính thức 3 năm">Chính thức 3 năm</option>
                            <option value="Không thời hạn">Không xác định thời hạn</option>
                            <option value="Thực tập">Thực tập sinh</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Mức lương cơ bản (VND)</label>
                        <input type="number" name="salary" required min="0" placeholder="0" className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                        <input type="date" name="start_date" required className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ngày kết thúc (Để trống nếu vô hạn)</label>
                        <input type="date" name="end_date" className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                        <input type="text" name="notes" placeholder="Ghi chú thêm..." className="w-full text-sm border-gray-300 rounded-md py-2 px-3 border focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-400" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        {isPending ? 'Đang lưu...' : 'Lưu hợp đồng'}
                    </button>
                </div>
            </form>
        )}

        {/* Danh sách hợp đồng */}
        {contracts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có hợp đồng nào.</p>
        ) : (
            <div className="space-y-3">
                {contracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{contract.contract_type}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {contract.StartDateFormatted} - {contract.EndDateFormatted}
                            </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            contract.Status === 'Hiệu lực' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {contract.Status}
                        </span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
