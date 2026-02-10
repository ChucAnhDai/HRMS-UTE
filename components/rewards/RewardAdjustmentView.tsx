"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { createRewardPenaltyAction } from "@/server/actions/reward-actions";
import { Employee, Department } from "@/types";

interface Reward {
  id: number;
  employee_id: number;
  amount: number;
  type: "Reward" | "Penalty";
  date: string;
  reason?: string | null;
  employees?: {
    id: number;
    first_name: string;
    last_name: string;
    departments?: {
      name: string;
    } | null;
  } | null;
}

interface RewardAdjustmentProps {
  employees: Employee[];
  rewards: Reward[];
  departments: Department[];
  month: number;
  year: number;
}

export default function RewardAdjustmentView({
  employees,
  rewards,
  departments,
  month,
  year,
}: RewardAdjustmentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fix Search: Check for null/undefined before accessing properties
  const filteredRewards = useMemo(() => {
    return rewards.filter((reward) => {
      const term = searchTerm.toLowerCase();
      const emp = reward.employees;

      if (!emp) return false;

      const fullName = `${emp.last_name} ${emp.first_name}`.toLowerCase();
      const id = emp.id.toString();
      const department = emp.departments?.name?.toLowerCase() || "";

      return (
        fullName.includes(term) ||
        id.includes(term) ||
        department.includes(term)
      );
    });
  }, [rewards, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thưởng & Phạt</h1>
          <p className="text-gray-500">
            Quản lý các khoản điều chỉnh lương cho tháng {month}/{year}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã NV hoặc phòng ban..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Mã NV
                </th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Họ và Tên
                </th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-center font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-right font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase tracking-wider">
                  Lý do
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRewards.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không tìm thấy dữ liệu nào.
                  </td>
                </tr>
              ) : (
                filteredRewards.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{item.employees?.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.employees?.last_name} {item.employees?.first_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.employees?.departments?.name || "---"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.type === "Reward"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.type === "Reward" ? "Thưởng" : "Phạt"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        item.type === "Reward"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.type === "Reward" ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-600 max-w-xs truncate"
                      title={item.reason || ""}
                    >
                      {item.reason || "---"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <RewardModal
          employees={employees}
          departments={departments}
          close={() => setIsModalOpen(false)}
          defaultDate={`${year}-${month.toString().padStart(2, "0")}-01`}
        />
      )}
    </div>
  );
}

function RewardModal({
  employees,
  departments,
  close,
  defaultDate,
}: {
  employees: Employee[];
  departments: Department[];
  close: () => void;
  defaultDate: string;
}) {
  const [loading, setLoading] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<number | "">("");
  const [selectedEmpId, setSelectedEmpId] = useState<number | "">("");

  // Filter employees by selected department
  const filteredEmployees = useMemo(() => {
    if (!selectedDeptId) return [];
    return employees.filter((emp) => {
      // Supabase join returns an object or null for single relation
      return emp.departments?.id === Number(selectedDeptId);
    });
  }, [employees, selectedDeptId]);

  // Find selected employee to get email
  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === Number(selectedEmpId));
  }, [employees, selectedEmpId]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await createRewardPenaltyAction(formData);
    if (res.success) {
      close();
      window.location.reload();
    } else {
      alert(res.message);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            Thêm khoản điều chỉnh
          </h3>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Phòng ban <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value ? Number(e.target.value) : "");
                setSelectedEmpId(""); // Reset employee when department changes
              }}
              required
            >
              <option value="">Chọn phòng ban...</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nhân viên <span className="text-red-500">*</span>
            </label>
            <select
              name="employee_id"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              value={selectedEmpId}
              onChange={(e) =>
                setSelectedEmpId(e.target.value ? Number(e.target.value) : "")
              }
              disabled={!selectedDeptId}
            >
              <option value="">
                {!selectedDeptId
                  ? "-- Vui lòng chọn phòng ban trước --"
                  : "Chọn nhân viên..."}
              </option>
              {filteredEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.last_name} {e.first_name} (#{e.id})
                </option>
              ))}
            </select>
            {/* Display Email Separately */}
            {selectedEmployee && (
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 bg-gray-50 p-2 rounded border border-dashed border-gray-200">
                <span className="font-medium">Email:</span>{" "}
                {selectedEmployee.email}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Loại <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="Reward">Thưởng</option>
                <option value="Penalty">Phạt</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số tiền <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ngày ghi nhận <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              defaultValue={defaultDate}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lý do</label>
            <textarea
              name="reason"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows={3}
              placeholder="Nhập lý do thưởng/phạt..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Đang lưu..." : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
