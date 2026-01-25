import { FileText, CheckCircle, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Payroll {
  id: string
  month: string
  base_salary: number
  work_days: number
  leave_days: number
  total_salary: number
  status: string
  employees: {
    first_name: string
    last_name: string
    avatar: string | null
    departments: { name: string } | null
  }
}

export default function PayrollTable({ payrolls }: { payrolls: Payroll[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhân viên</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lương cơ bản</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày công</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Nghỉ phép</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng thực nhận</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payrolls.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm">
                        Chưa có dữ liệu lương cho tháng này. <br/>
                        Vui lòng nhấn nút &quot;Tính lương&quot; để tạo bảng lương.
                    </td>
                </tr>
            ) : payrolls.map((item: Payroll) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                       <Image 
                          src={item.employees.avatar || `https://ui-avatars.com/api/?name=${item.employees.first_name}+${item.employees.last_name}&background=random`} 
                          alt="Avatar" 
                          fill 
                          className="object-cover"
                       />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{item.employees.last_name} {item.employees.first_name}</p>
                      <p className="text-xs text-gray-500">{item.employees.departments?.name || 'Chưa phân phòng'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatCurrency(item.base_salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-700">
                  {item.work_days}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                  {item.leave_days}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                  {formatCurrency(item.total_salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                       item.status === 'Paid' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                   }`}>
                       {item.status === 'Paid' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                       {item.status === 'Paid' ? 'Đã thanh toán' : 'Bản nháp'}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                        href={`/payroll/${item.id}`} 
                        className="text-gray-400 hover:text-blue-600 transition-colors inline-block p-1"
                    >
                        <FileText className="w-4 h-4" />
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
