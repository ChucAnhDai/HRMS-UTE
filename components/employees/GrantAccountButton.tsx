'use client'

import React, { useState } from 'react'
import { Key, ShieldCheck, Loader2, X } from 'lucide-react'
import { createEmployeeAccountAction } from '@/server/actions/admin-auth-actions'

interface Props {
  employeeId: number
  email: string
  hasAccount: boolean
}

export default function GrantAccountButton({ employeeId, email, hasAccount }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('123456') // Default password
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const result = await createEmployeeAccountAction(employeeId, email, password)

    if (result.success) {
      setSuccess('Đã cấp tài khoản thành công!')
      setTimeout(() => {
          setIsOpen(false)
          window.location.reload() // Reload để cập nhật UI
      }, 1500)
    } else {
      setError(result.error || 'Có lỗi xảy ra')
    }
    
    setIsLoading(false)
  }

  if (hasAccount) {
    return (
      <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2 text-sm font-medium">
        <ShieldCheck className="w-4 h-4" />
        Đã có tài khoản
      </div>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <Key className="w-4 h-4" />
        Cấp tài khoản
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Cấp tài khoản đăng nhập</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                      {error}
                  </div>
               )}
               {success && (
                  <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                      {success}
                  </div>
               )}

               <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email đăng nhập</label>
                  <input 
                    type="email" 
                    value={email} 
                    disabled 
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Sử dụng email cá nhân của nhân viên làm tài khoản.</p>
               </div>

               <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu khởi tạo</label>
                  <input 
                    type="text" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                    placeholder="Nhập mật khẩu..."
                    required
                    minLength={6}
                  />
               </div>

               <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Xác nhận cấp
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
