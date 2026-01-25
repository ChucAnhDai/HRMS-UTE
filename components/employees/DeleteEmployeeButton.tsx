'use client'

import { deleteEmployeeAction } from '@/server/actions/delete-employee'
import { useState } from 'react'

export default function DeleteEmployeeButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) return

    setIsDeleting(true)
    const result = await deleteEmployeeAction(id)
    setIsDeleting(false)

    if (result.error) {
      alert(result.error)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-600 font-medium text-sm transition-colors disabled:opacity-50"
    >
      {isDeleting ? '...' : 'Xóa'}
    </button>
  )
}
