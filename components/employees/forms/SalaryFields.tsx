import { DollarSign } from "lucide-react";
import { Employee } from "@/types";

interface Props {
  defaultValues?: Partial<Employee>;
  draftValues?: Record<string, unknown> | null;
  isMounted?: boolean;
}

export default function SalaryFields({ 
  defaultValues = {},
  draftValues,
  isMounted = false
}: Props) {
  const val = (key: keyof Employee, fallback: string | number = "") => {
    if (isMounted && draftValues && draftValues[key as string] !== undefined) {
      return draftValues[key as string] as string | number;
    }
    return (defaultValues?.[key] ?? fallback) as string | number;
  };

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-blue-600" />
        Lương & Thuế
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Lương cơ bản (VND)
          </label>
          <input
            type="number"
            name="salary"
            key={`salary-${isMounted}`}
            defaultValue={val("salary")}
            placeholder="0"
            min="0" // Chặn số âm
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Mã số thuế</label>
          <input
            type="text"
            name="tax_code"
            key={`tax_code-${isMounted}`}
            defaultValue={val("tax_code")}
            placeholder="VD: 123456789"
            pattern="[0-9]*" // Chỉ cho nhập số (mobile keyboard)
            inputMode="numeric"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Số người phụ thuộc
          </label>
          <input
            type="number"
            name="dependents"
            key={`dependents-${isMounted}`}
            defaultValue={val("dependents", 0)}
            min="0" // Chặn số âm
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
          />
        </div>
      </div>
    </div>
  );
}
