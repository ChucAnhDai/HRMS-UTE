import { Calendar } from 'lucide-react'
import { Employee } from '@/types'

interface Props {
  defaultValues?: Partial<Employee>
}

export default function ImportantDatesFields({ defaultValues = {} }: Props) {
  const val = (key: keyof Employee) => defaultValues?.[key]

  const formatDate = (date: string | null | undefined) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-600" />
        Ngày tháng quan trọng
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Ngày vào làm <span className="text-red-500">*</span></label>
            <input type="date" name="hire_date" defaultValue={formatDate(val('hire_date') as string)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Ngày kết thúc thử việc</label>
            <input type="date" name="probation_end_date" defaultValue={formatDate(val('probation_end_date') as string)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
        </div>
        <div className="space-y-2">
             <label className="text-sm font-bold text-gray-700">Ngày nghỉ việc (Nếu có)</label>
             <input type="date" name="termination_date" defaultValue={formatDate(val('termination_date') as string)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
        </div>
      </div>
    </div>
  )
}
