import { Calendar } from 'lucide-react'
import { Employee } from '@/types'

interface Props {
  defaultValues?: Partial<Employee>
}

export default function LeaveQuotaFields({ defaultValues = {} }: Props) {
  const val = (key: keyof Employee, fallback: any = '') => defaultValues?.[key] ?? fallback

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-green-600" />
        Quota ngày phép (số ngày/năm)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Ngày phép năm</label>
            <input type="number" name="annual_leave_quota" defaultValue={val('annual_leave_quota', 12)} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Ngày phép ốm</label>
            <input type="number" name="sick_leave_quota" defaultValue={val('sick_leave_quota', 5)} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Ngày phép khác</label>
            <input type="number" name="other_leave_quota" defaultValue={val('other_leave_quota', 5)} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" />
        </div>
      </div>
    </div>
  )
}
