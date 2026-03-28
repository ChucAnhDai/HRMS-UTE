'use client'

import React, { useState } from 'react'
import { Shield, Crown, User, Check } from 'lucide-react'
import { updateEmployeeRoleAction } from '@/server/actions/update-role'
import { toast } from '@/hooks/use-toast'

type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

interface Props {
  employeeId: number
  currentRole: UserRole
  employeeName: string
}

const roleOptions = [
  { 
    value: 'ADMIN' as UserRole, 
    label: 'Admin', 
    icon: Crown,
    color: 'purple',
    description: 'Toàn quyền quản trị hệ thống'
  },
  { 
    value: 'MANAGER' as UserRole, 
    label: 'Manager', 
    icon: Shield,
    color: 'blue',
    description: 'Quản lý nhân viên và duyệt đơn'
  },
  { 
    value: 'EMPLOYEE' as UserRole, 
    label: 'Employee', 
    icon: User,
    color: 'gray',
    description: 'Nhân viên thông thường'
  }
]

export default function RoleManager({ employeeId, currentRole, employeeName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit() {
    if (selectedRole === currentRole) {
      toast({
        title: "Cảnh báo",
        description: "Vui lòng chọn role khác",
        variant: "destructive",
      });
      setMessage({ type: 'error', text: 'Vui lòng chọn role khác' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const result = await updateEmployeeRoleAction(employeeId, selectedRole)
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Thành công",
        description: result.message || "Cập nhật quyền thành công",
      });
      setMessage({ type: 'success', text: result.message || 'Cập nhật thành công!' })
      setTimeout(() => {
        setIsOpen(false)
        window.location.reload()
      }, 1500)
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể cập nhật quyền",
        variant: "destructive",
      });
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' })
    }
  }

  const currentRoleData = roleOptions.find(r => r.value === currentRole)
  const CurrentIcon = currentRoleData?.icon || User

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-2 bg-${currentRoleData?.color}-100 text-${currentRoleData?.color}-700 border border-${currentRoleData?.color}-200 rounded-lg hover:bg-${currentRoleData?.color}-200 transition-colors flex items-center gap-2 text-sm font-bold`}
        style={{
          backgroundColor: currentRoleData?.color === 'purple' ? '#f3e8ff' : 
                          currentRoleData?.color === 'blue' ? '#dbeafe' : '#f3f4f6',
          color: currentRoleData?.color === 'purple' ? '#7c3aed' : 
                 currentRoleData?.color === 'blue' ? '#2563eb' : '#4b5563',
          borderColor: currentRoleData?.color === 'purple' ? '#e9d5ff' : 
                       currentRoleData?.color === 'blue' ? '#bfdbfe' : '#e5e7eb'
        }}
      >
        <CurrentIcon className="w-4 h-4" />
        {currentRoleData?.label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Quản lý quyền truy cập</h3>
              <p className="text-sm text-gray-600 mt-1">
                Thay đổi quyền cho <span className="font-bold">{employeeName}</span>
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.value
                  
                  return (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          role.color === 'purple' ? 'bg-purple-100' :
                          role.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            role.color === 'purple' ? 'text-purple-600' :
                            role.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900">{role.label}</h4>
                            {currentRole === role.value && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                Hiện tại
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{role.description}</p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-600 shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || selectedRole === currentRole}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
