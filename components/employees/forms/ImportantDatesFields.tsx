import { Calendar, AlertCircle } from "lucide-react";
import { Employee, EmploymentStatus } from "@/types";
import { useState } from "react";

interface Props {
  defaultValues?: Partial<Employee>;
  status: EmploymentStatus;
  draftValues?: Record<string, unknown> | null;
  isMounted?: boolean;
}

export default function ImportantDatesFields({
  defaultValues = {},
  status,
  draftValues,
  isMounted = false,
}: Props) {
  const val = (key: keyof Employee) => {
    if (isMounted && draftValues && draftValues[key as string] !== undefined) {
      return draftValues[key as string] as string | number;
    }
    return defaultValues?.[key] as string | number;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const [hireDate, setHireDate] = useState<string>(
    formatDate(val("hire_date") as string),
  );
  const [probationEndDate, setProbationEndDate] = useState<string>(
    formatDate(val("probation_end_date") as string),
  );
  const [terminationDate, setTerminationDate] = useState<string>(
    formatDate(val("termination_date") as string),
  );

  const [autoFilledProbation, setAutoFilledProbation] = useState(false);

  const handleHireDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHireDate = e.target.value;
    setHireDate(newHireDate);

    // Auto-fill probation end date (2 months from new hire date) if in probation & no manual date set
    if (
      newHireDate &&
      !val("probation_end_date") &&
      status === "Probation" &&
      !probationEndDate
    ) {
      const hDate = new Date(newHireDate);
      if (!isNaN(hDate.getTime())) {
        hDate.setMonth(hDate.getMonth() + 2);
        setProbationEndDate(hDate.toISOString().split("T")[0]);
        setAutoFilledProbation(true);
      }
    }
  };

  const isResigned = status === "Resigned" || status === "Terminated";
  const isProbation = status === "Probation";

  // Tính thâm niên
  const getSeniority = () => {
    if (!hireDate) return null;
    const start = new Date(hireDate);
    const end =
      isResigned && terminationDate ? new Date(terminationDate) : new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    if (months <= 0) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ngày`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return remainingMonths > 0
        ? `${years} năm ${remainingMonths} tháng`
        : `${years} năm`;
    }
    return `${months} tháng`;
  };

  const getProbationStatus = () => {
    if (!probationEndDate) return null;
    const end = new Date(probationEndDate);
    const now = new Date();
    if (isNaN(end.getTime())) return null;

    // So sánh theo ngày (bỏ qua giờ)
    now.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < now) return "Đã qua thử việc";
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `Còn ${diffDays} ngày`;
  };

  // Cross-validations
  const isTerminationBeforeProbation =
    terminationDate &&
    probationEndDate &&
    new Date(terminationDate) < new Date(probationEndDate);

  const maxHireDate = new Date();
  maxHireDate.setFullYear(maxHireDate.getFullYear() + 1);
  const maxHireDateStr = maxHireDate.toISOString().split("T")[0];

  return (
    <div className="mb-8">
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-600" />
        Ngày tháng quan trọng
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hire Date */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex justify-between items-end">
            <span>
              Ngày vào làm <span className="text-red-500">*</span>
            </span>
            {hireDate && (
              <span className="text-xs font-normal text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full">
                Thâm niên: {getSeniority()}
              </span>
            )}
          </label>
          <input
            type="date"
            name="hire_date"
            key={`hire_date-${isMounted}`}
            value={hireDate}
            onChange={handleHireDateChange}
            required
            max={maxHireDateStr}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black"
          />
        </div>

        {/* Probation End Date */}
        <div className="space-y-2">
          <label className="text-sm font-bold flex justify-between items-end">
            <span
              className={
                isProbation && !probationEndDate
                  ? "text-red-600"
                  : "text-gray-700"
              }
            >
              Ngày kết thúc thử việc{" "}
              {isProbation && <span className="text-red-500">*</span>}
            </span>
            {probationEndDate && (
              <span className="text-xs font-normal text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {getProbationStatus()}
              </span>
            )}
          </label>
          <input
            type="date"
            name="probation_end_date"
            key={`probation_end_date-${isMounted}`}
            value={probationEndDate}
            onChange={(e) => {
              setProbationEndDate(e.target.value);
              setAutoFilledProbation(false);
            }}
            min={hireDate || undefined}
            required={isProbation}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black ${
              isProbation && !probationEndDate
                ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
          />
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500">
              Phải sau hoặc bằng ngày vào làm
            </p>
            {autoFilledProbation && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                Tự động điền (2 tháng)
              </p>
            )}
          </div>
          {status === "Active" &&
            probationEndDate &&
            new Date(probationEndDate) > new Date() && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium bg-amber-50 p-1.5 rounded-md border border-amber-200/50">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                <span className="leading-snug">
                  Chức vụ là &quot;Chính thức&quot; nhưng chưa bước qua ngày kết
                  thúc thử việc.
                </span>
              </p>
            )}
        </div>

        {/* Termination Date */}
        <div className="space-y-2">
          <label className="text-sm font-bold flex justify-between items-end">
            <span
              className={
                isResigned && !terminationDate
                  ? "text-red-600"
                  : "text-gray-700"
              }
            >
              Ngày nghỉ việc (Nếu có){" "}
              {isResigned && <span className="text-red-500">*</span>}
            </span>
          </label>
          <input
            type="date"
            name="termination_date"
            key={`termination_date-${isMounted}`}
            value={terminationDate}
            onChange={(e) => setTerminationDate(e.target.value)}
            min={hireDate || undefined}
            required={isResigned}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500 text-black ${
              isResigned && !terminationDate
                ? "border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
          />
          <p className="text-xs text-gray-500">Phải sau ngày vào làm</p>
          {isTerminationBeforeProbation && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium bg-amber-50 p-1.5 rounded-md border border-amber-200/50">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
              <span className="leading-snug">
                Lưu ý: Nhân viên nghỉ việc trước khi kết thúc thời gian thử
                việc.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
