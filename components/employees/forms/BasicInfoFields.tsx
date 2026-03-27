import { User } from "lucide-react";
import { Employee } from "@/types";

interface Props {
  defaultValues?: Partial<Employee>;
  draftValues?: Record<string, unknown> | null;
  isMounted?: boolean;
}

export default function BasicInfoFields({ 
  defaultValues = {},
  draftValues,
  isMounted = false
}: Props) {
  const val = (
    key: keyof Employee,
    fallback: string | number = "",
  ): string | number => {
    if (isMounted && draftValues && draftValues[key as string] !== undefined) {
      return draftValues[key as string] as string | number;
    }
    const value = defaultValues?.[key];
    if (value === null || value === undefined) return fallback;
    if (typeof value === "object") return "";
    return value as string | number;
  };

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <User className="w-4 h-4 text-blue-600" />
        Thông tin cơ bản
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Họ đệm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            key={`last_name-${isMounted}`}
            defaultValue={val("last_name") as string}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
            placeholder="Nguyễn Văn"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            key={`first_name-${isMounted}`}
            defaultValue={val("first_name") as string}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
            placeholder="A"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            key={`email-${isMounted}`}
            defaultValue={val("email") as string}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
            placeholder="example@company.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            key={`phone-${isMounted}`}
            defaultValue={val("phone") as string}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
            placeholder="0901234567"
          />
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2">
          <label className="text-sm font-bold text-gray-700">
            Ảnh đại diện
          </label>
          <div className="flex items-center gap-4">
            {val("avatar") && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={val("avatar") as string}
                  alt="Current Avatar"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              </>
            )}
            <input
              type="file"
              name="avatarFile"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-gray-500 italic">
            Hỗ trợ: JPG, PNG, GIF. (Để trống nếu không thay đổi)
          </p>
        </div>
      </div>
    </div>
  );
}
