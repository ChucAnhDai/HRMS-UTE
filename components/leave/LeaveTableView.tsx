'use client'

import React, { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { approveLeaveAction, rejectLeaveAction } from "@/server/actions/leave-actions";
import { useRouter } from "next/navigation";

interface LeaveRequest {
  id: number
  leave_type: string
  start_date: string
  end_date: string
  reason: string | null
  status: string
  employees: {
     first_name: string
     last_name: string
     avatar: string | null
  }
}

export default function LeaveTableView({ leaves }: { leaves: any[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handleApprove = async (id: number) => {
      setLoadingId(id)
      await approveLeaveAction(id)
      setLoadingId(null)
      router.refresh()
  }

  const handleReject = async (id: number) => {
      if(!confirm('Bạn có chắc chắn muốn từ chối đơn này?')) return;
      setLoadingId(id)
      await rejectLeaveAction(id)
      setLoadingId(null)
      router.refresh()
  }

  // Tính số ngày nghỉ
  const calculateDays = (start: string, end: string) => {
      const d1 = new Date(start)
      const d2 = new Date(end)
      const diffTime = Math.abs(d2.getTime() - d1.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 
      return `${diffDays} ngày`
  }

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-blue-600">Nghỉ phép</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Quản lý nghỉ phép</h3>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm">Danh sách đơn</button>
          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-gray-600 border border-gateway-100 hover:bg-gray-50 flex items-center gap-2">
             Báo cáo nghỉ phép
          </button>
        </div>
        <button 
            onClick={() => document.getElementById('leave-form-modal')?.classList.remove('hidden')}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Tạo đơn nghỉ
        </button>
      </div>

      {/* Leave Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h4 className="text-lg font-bold text-gray-800">Danh sách đơn từ</h4>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-64"
              />
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Nhân viên</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Loại nghỉ</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Từ ngày</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Đến ngày</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">Số ngày</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Lý do</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Thao tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {leaves.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="text-center py-8 text-sm text-gray-500">Chưa có dữ liệu nghỉ phép</td>
                    </tr>
                ) : leaves.map((leave: LeaveRequest) => (
                <tr key={leave.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                            <Image 
                                src={leave.employees.avatar || `https://ui-avatars.com/api/?name=${leave.employees.first_name}+${leave.employees.last_name}&background=random`} 
                                alt="avatar" 
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-800">{leave.employees.last_name} {leave.employees.first_name}</span>
                    </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{leave.leave_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(leave.start_date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(leave.end_date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-bold text-center">{calculateDays(leave.start_date, leave.end_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate" title={leave.reason || ''}>{leave.reason || '---'}</td>
                    <td className="px-6 py-4 text-center">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                        leave.status === "Approved" ? "bg-green-100 text-green-700" : 
                        leave.status === "Pending" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                    )}>
                        {leave.status === 'Approved' ? 'Đã duyệt' : leave.status === 'Pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {leave.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => handleApprove(leave.id)}
                                    disabled={loadingId === leave.id}
                                    className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-50" title="Duyệt"
                                >
                                    {loadingId === leave.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />}
                                </button>
                                <button 
                                    onClick={() => handleReject(leave.id)}
                                    disabled={loadingId === leave.id}
                                    className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50" title="Từ chối"
                                >
                                    {loadingId === leave.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <X className="w-4 h-4" />}
                                </button>
                            </div>
                        ) : (
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
