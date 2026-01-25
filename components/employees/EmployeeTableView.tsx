'use client'

import React, { useState } from "react";
import Link from "next/link";
import { Grid, List, Filter, Plus, Edit2, Trash2, Search, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { deleteEmployeeAction } from "@/server/actions/delete-employee";
import { useRouter } from "next/navigation";

interface Employee {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar: string | null
  job_title: string | null
  department_id: number | null
  departments: { name: string } | null
  status?: string // Có thể thêm state status sau này
  employee_code?: string // Nếu có mã nhân viên
}

export default function EmployeeTableView({ employees }: { employees: any[] }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if(!confirm('Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.')) return;
    setDeletingId(id)
    await deleteEmployeeAction(id)
    setDeletingId(null)
    router.refresh()
  }

  // Filter employees
  const filteredEmployees = employees.filter(emp => 
    `${emp.last_name} ${emp.first_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="font-semibold text-blue-600">Nhân viên</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Danh sách nhân viên</h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative hidden md:block">
            <input 
                type="text" 
                placeholder="Tìm kiếm nhân viên..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 text-sm" 
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-lg border", viewMode === 'list' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50")}
          >
            <List className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-lg border", viewMode === 'grid' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50")}
          >
            <Grid className="w-5 h-5" />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm">
            <Filter className="w-4 h-4" /> Bộ lọc
          </button>
          <Link href="/employees/create" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 ml-2">
            <Plus className="w-4 h-4" /> Thêm nhân viên
          </Link>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và tên</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã NV</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chức vụ</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phòng ban</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {filteredEmployees.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy nhân viên nào</td></tr>
                ) : filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                        <Link href={`/employees/${emp.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                <Image
                                    src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=random`} 
                                    alt="avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 block text-sm">{emp.last_name} {emp.first_name}</span>
                                <span className="text-xs text-gray-400 md:hidden">{emp.job_title}</span>
                            </div>
                        </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">#{emp.id}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{emp.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{emp.job_title || '---'}</td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {emp.departments?.name || 'Chưa phân phòng'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/employees/${emp.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Sửa">
                                <Edit2 className="w-4 h-4" />
                            </Link>
                            <button 
                                onClick={() => handleDelete(emp.id)}
                                disabled={deletingId === emp.id}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50" 
                                title="Xóa"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/employees/${emp.id}/edit`} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                </div>
                <Link href={`/employees/${emp.id}`} className="mb-4 relative block mx-auto">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 mx-auto">
                        <Image
                            src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.first_name}+${emp.last_name}&background=random`} 
                            alt="avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{emp.last_name} {emp.first_name}</h4>
                <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">{emp.job_title || 'N/A'}</p>
                
                <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
                   <span>ID: #{emp.id}</span>
                   <span className="truncate max-w-[120px]" title={emp.departments?.name}>{emp.departments?.name || '---'}</span>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
}
