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
  workEndTime?: string;
}

export default function OvertimeRequestModal({
  isOpen,
  onClose,
  onSuccess,
  employees = [],
  workEndTime = "17:00",
}: Props) {
  // Tính giờ kết thúc mặc định = giờ bắt đầu + 1 tiếng
  const calculateDefaultEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = Math.min(hours + 1, 23); // Không vượt quá 23:xx
    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const [formData, setFormData] = useState({
    employee_id: 0,
    date: new Date().toISOString().split("T")[0],
    start_time: workEndTime,
    end_time: calculateDefaultEndTime(workEndTime),
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hằng số giới hạn độ dài lý do
  const MAX_REASON_LENGTH = 500;

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

    // Validate: Không cho đăng ký OT cho ngày trong quá khứ
    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      setError(
        `Không thể đăng ký OT cho ngày trong quá khứ (${formData.date}). Vui lòng chọn ngày hôm nay hoặc trong tương lai.`,
      );
      setLoading(false);
      return;
    }

    if (hours <= 0) {
      setError("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
      setLoading(false);
      return;
    }

    // Validate: Giới hạn độ dài lý do
    if (formData.reason.length > MAX_REASON_LENGTH) {
      setError(
        `Lý do không được vượt quá ${MAX_REASON_LENGTH} ký tự. Hiện tại: ${formData.reason.length} ký tự.`,
      );
      setLoading(false);
      return;
    }

    // Validate: Giờ bắt đầu OT phải >= giờ tan làm (không trùng giờ hành chính)
    if (formData.start_time < workEndTime) {
      setError(
        `Giờ bắt đầu OT (${formData.start_time}) không được trước giờ tan làm (${workEndTime}). Tăng ca chỉ được đăng ký sau giờ hành chính.`,
      );
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
        start_time: workEndTime,
        end_time: calculateDefaultEndTime(workEndTime),
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
              min={new Date().toISOString().split("T")[0]}
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
              maxLength={MAX_REASON_LENGTH}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                formData.reason.length > MAX_REASON_LENGTH * 0.9
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              rows={3}
              placeholder="Mô tả công việc cần làm thêm..."
              required
            />
            <div
              className={`text-xs text-right mt-1 ${
                formData.reason.length > MAX_REASON_LENGTH * 0.9
                  ? "text-red-500 font-medium"
                  : "text-gray-400"
              }`}
            >
              {formData.reason.length}/{MAX_REASON_LENGTH} ký tự
            </div>
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
