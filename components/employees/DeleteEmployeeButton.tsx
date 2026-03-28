'use client'

import { deleteEmployeeAction } from '@/server/actions/delete-employee'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function DeleteEmployeeButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleDelete = () => {
    setIsConfirmOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    const result = await deleteEmployeeAction(id)
    setIsDeleting(false)

    if (result.success) {
      toast({
        title: "Thành công",
        description: "Đã xóa nhân viên thành công",
      });
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể xóa nhân viên",
        variant: "destructive",
      });
    }
    setIsDeleting(false)
  }

  return (
    <>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-400 hover:text-red-600 font-medium text-sm transition-colors disabled:opacity-50"
      >
        {isDeleting ? '...' : 'Xóa'}
      </button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận xóa nhân viên"
        description="Bạn có chắc chắn muốn xóa nhân viên này không? Thao tác này sẽ xóa vĩnh viễn dữ liệu hồ sơ nhân viên."
        onConfirm={confirmDelete}
        variant="danger"
        confirmText="Xác nhận xóa"
      />
    </>
  )
}
