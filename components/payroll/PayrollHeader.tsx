'use client'

import { calculatePayrollAction } from '@/server/actions/calculate-payroll'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Calculator, Calendar, Loader2 } from 'lucide-react'

export default function PayrollHeader({ month, year }: { month: number, year: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const handleCalculate = async () => {
    startTransition(async () => {
        const res = await calculatePayrollAction(month, year)
        if (res.success) {
            alert(res.message)
            router.refresh()
        } else {
            alert(res.error)
        }
    })
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value
    router.push(`/payroll?month=${newMonth}&year=${year}`)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value
    router.push(`/payroll?month=${month}&year=${newYear}`)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
       <div>
           <h1 className="text-2xl font-bold text-gray-800">Quản lý lương</h1>
           <p className="text-gray-500 text-sm">Xem và tính toán bảng lương hàng tháng</p>
       </div>

       <div className="flex flex-wrap items-center gap-3">
           {/* Filters */}
           <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-200">
               <Calendar className="w-4 h-4 text-gray-400 ml-2" />
               <select 
                value={month} 
                onChange={handleMonthChange}
                className="text-sm border-none focus:ring-0 bg-transparent text-gray-700 py-1"
               >
                   {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                       <option key={m} value={m}>Tháng {m}</option>
                   ))}
               </select>
               <span className="text-gray-300">/</span>
               <select 
                value={year} 
                onChange={handleYearChange}
                className="text-sm border-none focus:ring-0 bg-transparent text-gray-700 py-1"
               >
                   <option value="2024">2024</option>
                   <option value="2025">2025</option>
                   <option value="2026">2026</option>
               </select>
           </div>

           {/* Button */}
           <button 
             onClick={handleCalculate}
             disabled={isPending}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
           >
             {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
             Tính lương
           </button>
       </div>
    </div>
  )
}
