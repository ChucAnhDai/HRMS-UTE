import { Briefcase } from "lucide-react";
import { Employee, Department, EmploymentStatus } from "@/types";
import { useState } from "react";

interface Props {
  departments: Department[];
  defaultValues?: Partial<Employee>;
  status: EmploymentStatus;
  onStatusChange: (status: EmploymentStatus) => void;
  draftValues?: Record<string, unknown> | null;
  isMounted?: boolean;
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
  status,
  onStatusChange,
  draftValues,
  isMounted = false,
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

  const [jobTitle, setJobTitle] = useState<string>(
    val("job_title")?.toString() || "",
  );

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
            key={`department_id-${isMounted}`}
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
            key={`job_title-${isMounted}`}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
            placeholder="VD: Software Engineer"
          />
          {status === "Active" &&
            jobTitle.toLowerCase().includes("thử việc") && (
              <p className="text-xs text-amber-600 mt-1 font-medium">
                ⚠️ Lưu ý: Nhân viên chính thức thường không để chức danh là
                &quot;Thử việc&quot;.
              </p>
            )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Trạng thái nhân viên
          </label>
          <select
            name="employment_status"
            key={`employment_status-${isMounted}`}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as EmploymentStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all focus:border-blue-500 text-black"
          >
            {EMPLOYMENT_STATUSES.map((statusItem) => (
              <option key={statusItem.value} value={statusItem.value}>
                {statusItem.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
