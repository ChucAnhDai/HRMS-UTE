'use client'

import { useState } from 'react'
import EditPayslipModal from './EditPayslipModal'
import { Edit2, Eye, Printer } from 'lucide-react'
import Link from 'next/link'
import { Payslip } from '@/types'

const formatMoney = (amount: number | string | undefined | null) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0)
}

interface Props {
  payslips: Payslip[]
}

export default function PayrollTable({ payslips }: Props) {
  const [editingPayslip, setEditingPayslip] = useState<Payslip | null>(null)

  if (!payslips || payslips.length === 0) {
      return (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200 mt-4">
              Chưa có dữ liệu lương cho tháng này. Vui lòng bấm &quot;Tính lương&quot; để tạo.
          </div>
      )
  }

  return (
    <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-4 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-4 py-4 min-w-[200px]">Nhân viên</th>
                            <th className="px-4 py-4 min-w-[120px]">Bộ phận</th>
                            <th className="px-4 py-4 text-right min-w-[120px]">Lương cơ bản</th>
                            <th className="px-4 py-4 text-center min-w-[80px]">Giờ OT</th>
                            <th className="px-4 py-4 text-right text-blue-600 min-w-[100px]">Tiền OT</th>
                            <th className="px-4 py-4 text-right text-green-600 min-w-[100px]">Thưởng</th>
                            <th className="px-4 py-4 text-right text-red-600 min-w-[100px]">Tạm ứng</th>
                            <th className="px-4 py-4 text-right text-red-600 min-w-[100px]">Phạt</th>
                            <th className="px-4 py-4 text-left text-red-600 min-w-[150px]">Thuế + BHXH</th>
                            <th className="px-4 py-4 text-right text-green-600 font-black min-w-[120px]">Thực nhận (NET)</th>
                            <th className="px-4 py-4 text-center min-w-[100px]">Trạng thái</th>
                            <th className="px-4 py-4 text-right min-w-[120px]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payslips.map((ps) => (
                            <tr key={ps.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase shrink-0">
                                            {ps.employees?.first_name?.[0]}
                                        </div>
                                        <div>
                                            <div className='font-bold whitespace-nowrap'>{ps.employees?.last_name} {ps.employees?.first_name}</div>
                                            <div className="text-xs text-gray-500">MNV: #{ps.employee_id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {ps.employees?.departments?.name || '---'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right text-gray-600">
                                    {formatMoney(ps.salary)}
                                </td>
                                <td className="px-4 py-4 text-center text-gray-600">
                                    {ps.ot_hours}h
                                </td>
                                <td className="px-4 py-4 text-right text-blue-600 font-medium">
                                    +{formatMoney(ps.ot_salary)}
                                </td>
                                <td className="px-4 py-4 text-right text-green-600 font-medium">
                                    {Number(ps.bonus) > 0 ? '+' : ''}{formatMoney(ps.bonus)}
                                </td>
                                <td className="px-4 py-4 text-right text-red-500">
                                    {Number(ps.advance_amount) > 0 ? '-' : ''}{formatMoney(ps.advance_amount)}
                                </td>
                                <td className="px-4 py-4 text-right text-red-500">
                                    {Number(ps.penalties) > 0 ? '-' : ''}{formatMoney(ps.penalties)}
                                </td>
                                <td className="px-4 py-4 text-xs">
                                    <div className="text-red-500 whitespace-nowrap">Tax: {formatMoney(ps.tax)}</div>
                                    <div className="text-red-500 whitespace-nowrap">BHXH: {formatMoney(ps.social_insurance)}</div>
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-green-700 text-base">
                                    {formatMoney(ps.net_pay)}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        ps.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {ps.status === 'Paid' ? 'Paid' : 'Generated'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justifying-end gap-2">
                                        <Link 
                                            href={`/print/payslip/${ps.id}`}
                                            target="_blank"
                                            className="inline-flex items-center justify-center p-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            title="In phiếu lương"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => setEditingPayslip(ps)}
                                            className="inline-flex items-center justify-center p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setEditingPayslip(ps)}
                                            className="inline-flex items-center justify-center p-1.5 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {editingPayslip && (
            <EditPayslipModal 
                payslip={editingPayslip} 
                onClose={() => setEditingPayslip(null)} 
            />
        )}
    </>
  )
}
