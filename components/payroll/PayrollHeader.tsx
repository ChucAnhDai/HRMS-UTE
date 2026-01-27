'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { generatePayrollAction } from '@/server/actions/payroll-actions'
import { Loader2, Calculator } from 'lucide-react'

export default function PayrollHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Lấy tháng/năm từ URL hoặc mặc định hiện tại
  const currentMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1
  const currentYear = Number(searchParams.get('year')) || new Date().getFullYear()

  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)
  const [isGenerating, setIsGenerating] = useState(false)

  // Xử lý filter
  const handleFilter = () => {
    router.push(`/payroll?month=${month}&year=${year}`)
  }

  // Xử lý tính lương
  const handleGenerate = async () => {
    if (!confirm(`Bạn có chắc chắn muốn TÍNH LẠI lương tháng ${month}/${year}? Dữ liệu cũ của tháng này sẽ bị ghi đè.`)) {
        return
    }

    setIsGenerating(true)
    const res = await generatePayrollAction(month, year)
    setIsGenerating(false)

    if (res.success) {
        alert(res.message)
        router.refresh()
    } else {
        alert(res.error)
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Bảng Lương</h2>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-gray-700"
            >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Tháng {m}</option>
                ))}
            </select>
            <span className="text-gray-300">|</span>
            <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-gray-700"
            >
                {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
            <button 
                onClick={handleFilter}
                className="px-3 py-1 bg-white shadow-sm border border-gray-200 rounded text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200"
            >
                Xem
            </button>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-lg shadow-blue-600/20"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
        {isGenerating ? 'Đang tính toán...' : 'Tính lương tháng này'}
      </button>
    </div>
  )
}
