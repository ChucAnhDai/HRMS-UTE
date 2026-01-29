import { Briefcase } from "lucide-react";
import { Employee, Department, EmploymentStatus } from "@/types";

interface Props {
  departments: Department[];
  defaultValues?: Partial<Employee>;
}

const EMPLOYMENT_STATUSES: { value: EmploymentStatus; label: string }[] = [
  { value: "Probation", label: "Thử việc" },
  { value: "Active", label: "Chính thức" },
  { value: "Intern", label: "Thực tập sinh" },
  { value: "Part-time", label: "Bán thời gian" },
  { value: "Resigned", label: "Đã nghỉ" },
  { value: "Terminated", label: "Đã chấm dứt" },
  { value: "On Leave", label: "Nghỉ phép dài hạn" },
];

export default function JobInfoFields({
  departments,
  defaultValues = {},
}: Props) {
  const val = (
    key: keyof Employee,
    fallback: string | number = "",
  ): string | number => {
    const value = defaultValues?.[key];
    if (value === null || value === undefined) return fallback;
    if (typeof value === "object") return "";
    return value as string | number;
  };

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-blue-600" />
        Thông tin công việc
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Phòng ban</label>
          <select
            name="department_id"
            defaultValue={val("department_id")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all focus:border-blue-500 text-black"
          >
            <option value="">-- Chọn phòng ban --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Chức vụ</label>
          <input
            type="text"
            name="job_title"
            defaultValue={val("job_title")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
            placeholder="VD: Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Trạng thái nhân viên
          </label>
          <select
            name="employment_status"
            defaultValue={val("employment_status", "Probation")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all focus:border-blue-500 text-black"
          >
            {EMPLOYMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
