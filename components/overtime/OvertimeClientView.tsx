'use client'

import { useState } from 'react'
import { OvertimeRequest } from '@/types'
import { Check, X, Clock, Calendar, Plus } from 'lucide-react'
import { approveOvertimeRequestAction, rejectOvertimeRequestAction } from '@/server/actions/overtime-actions'
import OvertimeRequestModal from './OvertimeRequestModal'

interface Props {
  initialRequests: OvertimeRequest[]
  isAdmin: boolean
  userId: number | string
}

export default function OvertimeClientView({ initialRequests, isAdmin }: Props) {
  const [requests] = useState<OvertimeRequest[]>(initialRequests)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')
  const [processingId, setProcessingId] = useState<number | null>(null)

  const handleSuccess = () => {
    // Refresh data logic could be here, but for now we rely on server action revalidation 
    // and maybe router.refresh() if we imported useRouter.
    // However, simplest is to just reload or let Next.js handle it if this was a server component parent updating.
    // Since this is client view, we might want to trigger a refresh.
    window.location.reload() 
  }

  const handleApprove = async (id: number) => {
    if (!confirm('Xác nhận DUYỆT yêu cầu này?')) return
    setProcessingId(id)
    const res = await approveOvertimeRequestAction(id)
    if (res.success) {
        window.location.reload()
    } else {
        alert(res.error)
    }
    setProcessingId(null)
  }

  const handleReject = async (id: number) => {
    if (!confirm('Xác nhận TỪ CHỐI yêu cầu này?')) return
    setProcessingId(id)
    const res = await rejectOvertimeRequestAction(id)
    if (res.success) {
        window.location.reload()
    } else {
        alert(res.error)
    }
    setProcessingId(null)
  }

  const filteredRequests = requests.filter(r => {
      if (filterStatus !== 'All' && r.status !== filterStatus) return false
      return true
  })

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Làm thêm giờ (OT)</h1>
                <p className="text-gray-500">
                    {isAdmin ? 'Quản lý và phê duyệt các yêu cầu OT của nhân viên.' : 'Đăng ký và theo dõi lịch sử làm thêm giờ của bạn.'}
                </p>
            </div>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 font-medium"
            >
                <Plus className="w-5 h-5" />
                Đăng ký OT
            </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 w-fit">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(status => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        filterStatus === status 
                        ? 'bg-gray-100 text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {status === 'All' ? 'Tất cả' : 
                     status === 'Pending' ? 'Chờ duyệt' : 
                     status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                </button>
            ))}
        </div>

        {/* Table */}
        <div className="bg-white border boundary-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nhân viên</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Ngày & Giờ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-center">Tổng giờ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Lý do</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-center">Trạng thái</th>
                            {isAdmin && <th className="px-6 py-4 font-semibold text-gray-700 text-right">Hành động</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Không có dữ liệu nào
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {req.employees?.last_name} {req.employees?.first_name}
                                        </div>
                                        <div className="text-xs text-gray-500">MNV: #{req.employees?.id || req.employee_id}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{req.employees?.departments?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{new Date(req.date).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mt-1.5 ml-0.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{req.start_time.slice(0, 5)} - {req.end_time.slice(0, 5)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-12 px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                                            {req.hours}h
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-600" title={req.reason}>
                                        {req.reason}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                                            req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                            req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                            {req.status === 'Approved' && <Check className="w-3 h-3" />}
                                            {req.status === 'Rejected' && <X className="w-3 h-3" />}
                                            {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                                            {req.status === 'Approved' ? 'Đã duyệt' : 
                                             req.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            {req.status === 'Pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleApprove(req.id)}
                                                        disabled={processingId === req.id}
                                                        className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 border border-green-200 transition-colors"
                                                        title="Duyệt"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(req.id)}
                                                        disabled={processingId === req.id}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200 transition-colors"
                                                        title="Từ chối"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <OvertimeRequestModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={handleSuccess}
        />
    </div>
  )
}
