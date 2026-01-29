'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { createRewardPenaltyAction } from '@/server/actions/reward-actions'
import { Employee } from '@/types'

interface RewardAdjustmentProps {
  employees: Employee[]
  month: number
  year: number
}

// Simple view for demo purposes
export default function RewardAdjustmentView({ employees, month, year }: RewardAdjustmentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Thưởng & Phạt</h1>
           <p className="text-gray-500">Quản lý các khoản điều chỉnh lương cho tháng {month}/{year}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">Chức năng hiển thị danh sách đang hoàn thiện. Vui lòng sử dụng nút &quot;Thêm mới&quot; để ghi nhận.</p>
      </div>

      {isModalOpen && (
        <RewardModal 
            employees={employees} 
            close={() => setIsModalOpen(false)} 
            defaultDate={`${year}-${month.toString().padStart(2, '0')}-01`} 
        />
      )}
    </div>
  )
}

function RewardModal({ employees, close, defaultDate }: { employees: Employee[], close: () => void, defaultDate: string }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createRewardPenaltyAction(formData)
        if (res.success) {
            alert(res.message)
            close()
        } else {
            alert(res.message)
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Thêm khoản điều chỉnh</h3>
                    <button onClick={close} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <form action={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nhân viên</label>
                        <select name="employee_id" className="w-full p-2 border border-gray-200 rounded-lg" required>
                            <option value="">Chọn nhân viên...</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Loại</label>
                            <select name="type" className="w-full p-2 border border-gray-200 rounded-lg" required>
                                <option value="Reward">Thưởng</option>
                                <option value="Penalty">Phạt</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700">Số tiền</label>
                             <input type="number" name="amount" className="w-full p-2 border border-gray-200 rounded-lg" required min="0" />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Ngày ghi nhận</label>
                         <input type="date" name="date" defaultValue={defaultDate} className="w-full p-2 border border-gray-200 rounded-lg" required />
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Lý do</label>
                         <textarea name="reason" className="w-full p-2 border border-gray-200 rounded-lg" rows={3}></textarea>
                    </div>

                     <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={close} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
