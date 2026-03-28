'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { generatePayrollAction, markPayrollAsPaidAction } from '@/server/actions/payroll-actions'
import { Loader2, Calculator } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function PayrollHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Lấy tháng/năm từ URL hoặc mặc định hiện tại
  const currentMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1
  const currentYear = Number(searchParams.get('year')) || new Date().getFullYear()

  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [confirmType, setConfirmType] = useState<'generate' | 'pay' | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Xử lý filter
  const handleFilter = () => {
    router.push(`/payroll?month=${month}&year=${year}`)
  }

  // Xử lý tính lương (Tạo phiếu)
  const handleGenerate = () => {
    setConfirmType('generate')
    setIsConfirmOpen(true)
  }

  const confirmGenerate = async () => {
    setConfirmType(null)
    setIsGenerating(true)
    const res = await generatePayrollAction(month, year)
    setIsGenerating(false)

    if (res.success) {
        toast({
          title: "Thành công",
          description: res.message || "Đã tạo phiếu lương thành công",
        });
        router.refresh()
    } else {
        toast({
          title: "Lỗi",
          description: res.error || "Không thể tạo phiếu lương",
          variant: "destructive",
        });
    }
  }

  // Xử lý thanh toán
  const handlePay = () => {
    setConfirmType('pay')
    setIsConfirmOpen(true)
  }

  const confirmPay = async () => {
    setConfirmType(null)
    setIsPaying(true)
    const res = await markPayrollAsPaidAction(month, year)
    setIsPaying(false)

    if (res.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái đã thanh toán thành công!",
        });
        router.refresh()
    } else {
        toast({
          title: "Lỗi",
          description: res.error || "Không thể thanh toán lương",
          variant: "destructive",
        });
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

      <div className="flex gap-3">
        {/* Nút Thanh Toán */}
        <button
            onClick={handlePay}
            disabled={isPaying || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 shadow-lg shadow-green-600/20"
        >
            {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />} 
            {/* Note: Icon could be changed, but keeping simple for now. Let's assume CreditCard is handled via imports correction later if needed, or stick to existing icons to avoid import errors */}
            {isPaying ? 'Đang xử lý...' : 'Thanh toán lương'}
        </button>

        {/* Nút Tạo Phiếu */}
        <button
            onClick={handleGenerate}
            disabled={isGenerating || isPaying}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-lg shadow-blue-600/20"
        >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {isGenerating ? 'Đang tạo...' : 'Tạo phiếu lương'}
        </button>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={confirmType === 'generate' ? "Xác nhận tạo phiếu lương" : "Xác nhận thanh toán"}
        description={
          confirmType === 'generate' 
            ? `Bạn có chắc chắn muốn TẠO LẠI phiếu lương tháng ${month}/${year}? Dữ liệu cũ (nếu chưa thanh toán) sẽ bị ghi đè.`
            : `Xác nhận THANH TOÁN toàn bộ lương tháng ${month}/${year}? LƯU Ý: Trạng thái sẽ chuyển sang 'Paid' và KHÔNG THỂ CHỈNH SỬA nữa.`
        }
        onConfirm={confirmType === 'generate' ? confirmGenerate : confirmPay}
        variant={confirmType === 'generate' ? "warning" : "primary"}
        confirmText={confirmType === 'generate' ? "Tạo phiếu" : "Xác nhận thanh toán"}
      />
    </div>
  )
}
