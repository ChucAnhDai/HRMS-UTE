import { User } from 'lucide-react'
import { Employee } from '@/types'

interface Props {
  defaultValues?: Partial<Employee>
}

export default function BasicInfoFields({ defaultValues = {} }: Props) {
  const val = (key: keyof Employee, fallback: any = '') => defaultValues?.[key] ?? fallback

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <User className="w-4 h-4 text-blue-600" />
        Thông tin cơ bản
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Họ đệm <span className="text-red-500">*</span></label>
            <input type="text" name="last_name" defaultValue={val('last_name')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" placeholder="Nguyễn Văn" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Tên <span className="text-red-500">*</span></label>
            <input type="text" name="first_name" defaultValue={val('first_name')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" placeholder="A" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" defaultValue={val('email')} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" placeholder="example@company.com" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
            <input type="tel" name="phone" defaultValue={val('phone')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black" placeholder="0901234567" />
        </div>
      </div>
    </div>
  )
}
