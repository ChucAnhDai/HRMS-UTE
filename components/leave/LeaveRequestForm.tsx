"use client";

import { createLeaveRequestAction } from "@/server/actions/leave-actions";
import { useActionState } from "react";
import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Employee, Department } from "@/types";
import { useState, useMemo } from "react";

interface Props {
  employees: Employee[];
  departments?: Department[];
  currentUser?: {
    employeeId: number | null;
    role: string;
    employeeData?: Employee;
  } | null;
}

const initialState = {
  error: "",
  success: false,
  message: "",
};

export default function LeaveRequestForm({
  employees,
  departments = [],
  currentUser,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    createLeaveRequestAction,
    initialState,
  );

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const isEmployee = currentUser?.role === "EMPLOYEE";
  const currentEmployeeId = currentUser?.employeeId;

  // Filter employees based on selected department
  const filteredEmployees = useMemo(() => {
    if (!selectedDepartmentId) return employees;
    return employees.filter(
      (emp) => emp.department_id === Number(selectedDepartmentId),
    );
  }, [employees, selectedDepartmentId]);

  const selectedEmployee = useMemo(() => {
    return employees.find((emp) => emp.id === Number(selectedEmployeeId));
  }, [employees, selectedEmployeeId]);

  return (
    <div
      id="leave-form-modal"
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl m-4 overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* ... (Header remains same) */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("leave-form-modal");
            el?.classList.add("hidden");
            el?.classList.remove("flex");
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
        >
          {/* ... (SVG) ... */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-6 border-b border-gray-100 bg-blue-50/30">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            Tạo đơn xin nghỉ phép mới
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Điền thông tin bên dưới để gửi yêu cầu lên quản lý xét duyệt.
          </p>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form action={formAction}>
            {state?.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {state.error}
              </div>
            )}

            {state?.success && !isPending && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {state.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Employee Selection - Only for Admin/Manager */}
              {isEmployee ? (
                <input
                  type="hidden"
                  name="employee_id"
                  value={currentEmployeeId || ""}
                />
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Lọc theo phòng ban
                    </label>
                    <select
                      value={selectedDepartmentId}
                      onChange={(e) => {
                        setSelectedDepartmentId(e.target.value);
                        setSelectedEmployeeId("");
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                    >
                      <option value="">-- Tất cả phòng ban --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nhân viên gửi đơn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="employee_id"
                      required
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {filteredEmployees?.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.last_name} {emp.first_name} (#{emp.id})
                        </option>
                      ))}
                    </select>
                    {filteredEmployees.length === 0 && (
                      <p className="text-xs text-red-500">
                        Không tìm thấy nhân viên nào trong phòng ban này.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email nhân viên
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 truncate h-[42px] flex items-center">
                      {selectedEmployee?.email || "---"}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Loại nghỉ <span className="text-red-500">*</span>
                </label>
                <select
                  name="leave_type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                >
                  <option value="Annual Leave">
                    Nghỉ phép năm (Annual Leave)
                  </option>
                  <option value="Sick Leave">Nghỉ ốm (Sick Leave)</option>
                  <option value="Unpaid Leave">
                    Nghỉ không lương (Unpaid Leave)
                  </option>
                  <option value="Maternity Leave">Nghỉ thai sản</option>
                  <option value="Other">Lý do khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Đến ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Lý do nghỉ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  placeholder="Ví dụ: Đi khám bệnh, việc gia đình..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("leave-form-modal");
                  el?.classList.add("hidden");
                  el?.classList.remove("flex");
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isPending ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {isPending ? "Đang gửi..." : "Gửi đơn xin nghỉ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
