"use client";

import { useState } from "react";
import { X, Clock, Calendar, FileText } from "lucide-react";
import { createOvertimeRequestAction } from "@/server/actions/overtime-actions";

import { Employee } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employees?: Employee[];
}

export default function OvertimeRequestModal({
  isOpen,
  onClose,
  onSuccess,
  employees = [],
}: Props) {
  const [formData, setFormData] = useState({
    employee_id: 0,
    date: new Date().toISOString().split("T")[0],
    start_time: "17:00",
    end_time: "18:00",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate hours dynamically
  const calculateHours = () => {
    if (formData.start_time && formData.end_time) {
      const today = new Date().toISOString().split("T")[0];
      const start = new Date(`${today}T${formData.start_time}`);
      const end = new Date(`${today}T${formData.end_time}`);

      let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
      if (diff < 0) {
        diff = 0;
      }
      return diff > 0 ? Number(diff.toFixed(2)) : 0;
    }
    return 0;
  };

  const hours = calculateHours();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (hours <= 0) {
      setError("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
      setLoading(false);
      return;
    }

    const res = await createOvertimeRequestAction({
      ...formData,
      hours,
    });

    if (res.success) {
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        employee_id: 0,
        date: new Date().toISOString().split("T")[0],
        start_time: "17:00",
        end_time: "18:00",
        reason: "",
      });
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            Đăng ký làm thêm giờ (OT)
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2 border border-red-100">
              <div className="shrink-0">⚠️</div>
              <div>{error}</div>
            </div>
          )}

          {/* Admin: Employee Selector */}
          {employees.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-blue-500">👤</span> Chọn nhân viên
              </label>
              <select
                value={formData.employee_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employee_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.last_name} {emp.first_name} (MNV: {emp.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> Ngày làm thêm
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Bắt đầu
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" /> Kết thúc
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg text-blue-900 text-sm flex justify-between items-center border border-blue-100">
            <span className="font-medium">Tổng số giờ ước tính:</span>
            <span className="font-bold text-2xl text-blue-700">{hours}h</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" /> Lý do / Công việc
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              rows={3}
              placeholder="Mô tả công việc cần làm thêm..."
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:shadow-none font-bold"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
