'use client'

import { useActionState } from 'react'
import { Building2, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createDepartmentAction, updateDepartmentAction } from '@/server/actions/department-actions'

interface Props {
  mode: 'create' | 'edit'
  department?: {
    id: number
    name: string
  }
}

const initialState = {
  error: '',
  success: false,
  message: ''
}

export default function DepartmentForm({ mode, department }: Props) {
  // Tạo action phù hợp với mode
  const action = mode === 'edit' && department
    ? updateDepartmentAction.bind(null, department.id)
    : createDepartmentAction
  
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
          <Building2 className="w-5 h-5 text-blue-600" />
          {mode === 'create' ? 'Thêm phòng ban mới' : 'Chỉnh sửa phòng ban'}
        </h3>
        <Link href="/departments" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
      </div>

      <div className="p-8">
        <form action={formAction}>
          {/* Error Message */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {state.error}
            </div>
          )}
          
          {/* Success Message */}
          {state?.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {state.message}
            </div>
          )}

          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Tên phòng ban <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name" 
                required
                defaultValue={department?.name || ''}
                placeholder="VD: Phòng Kỹ Thuật, Phòng Nhân Sự..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black text-base"
              />
              <p className="text-xs text-gray-500">
                Tên phòng ban nên rõ ràng và dễ nhận biết (2-100 ký tự)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link 
              href="/departments"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </Link>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center gap-2 hover:-translate-y-0.5"
            >
              {isPending ? 'Đang lưu...' : (
                <>
                  <Save className="w-4 h-4" /> 
                  {mode === 'create' ? 'Tạo phòng ban' : 'Lưu thay đổi'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
