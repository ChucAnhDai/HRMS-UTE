"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  updateSettingsAction,
  addHolidayAction,
  deleteHolidayAction,
} from "@/server/actions/setting-actions";

interface Holiday {
  id: number;
  name: string;
  date: string;
}

interface SettingsPageProps {
  settings: Record<string, string>;
  holidays: Holiday[];
  readOnly?: boolean;
}

export default function SettingsView({
  settings,
  holidays,
  readOnly,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<"general" | "holidays">("general");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình hệ thống</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab("holidays")}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "holidays"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Ngày lễ ({holidays.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {activeTab === "general" ? (
          <GeneralSettingsForm settings={settings} readOnly={readOnly} />
        ) : (
          <HolidaysManager holidays={holidays} readOnly={readOnly} />
        )}
      </div>
    </div>
  );
}

const DEFAULT_TAX_BRACKETS = [
  { limit: 5000000, rate: 5 },
  { limit: 10000000, rate: 10 },
  { limit: 18000000, rate: 15 },
  { limit: 32000000, rate: 20 },
  { limit: 52000000, rate: 25 },
  { limit: 80000000, rate: 30 },
  { limit: 0, rate: 35 }, // 0 means infinity
];

function GeneralSettingsForm({
  settings,
  readOnly,
}: {
  settings: Record<string, string>;
  readOnly?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  // Parse Tax Brackets
  const [taxBrackets, setTaxBrackets] = useState<
    { limit: number; rate: number }[]
  >(() => {
    try {
      return settings["tax_brackets"]
        ? JSON.parse(settings["tax_brackets"])
        : DEFAULT_TAX_BRACKETS;
    } catch {
      return DEFAULT_TAX_BRACKETS;
    }
  });

  // Parse Weekend Days (Active IDs: 0=Sun, 1=Mon, ..., 6=Sat)
  const [weekendDays, setWeekendDays] = useState<string[]>(() => {
    try {
      return settings["weekend_days"]
        ? JSON.parse(settings["weekend_days"])
        : ["0", "6"]; // Default Sat, Sun
    } catch {
      return ["0", "6"];
    }
  });

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await updateSettingsAction(formData);
    alert(res.message);
    setLoading(false);
  }

  const DAYS_OF_WEEK = [
    { id: "1", label: "Thứ 2" },
    { id: "2", label: "Thứ 3" },
    { id: "3", label: "Thứ 4" },
    { id: "4", label: "Thứ 5" },
    { id: "5", label: "Thứ 6" },
    { id: "6", label: "Thứ 7" },
    { id: "0", label: "Chủ Nhật" },
  ];

  return (
    <form action={handleSubmit} className="space-y-10 divide-y divide-gray-200">
      {/* 1. Working Time & Weekend */}
      <div className="pt-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Thời gian & Ngày nghỉ
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Cấu hình lịch làm việc chuẩn của công ty.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 block">
            Ngày nghỉ cố định trong tuần
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DAYS_OF_WEEK.map((d) => (
              <label
                key={d.id}
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all ${weekendDays.includes(d.id) ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"}`}
              >
                <input
                  type="checkbox"
                  name="weekend_days"
                  value={d.id}
                  checked={weekendDays.includes(d.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWeekendDays([...weekendDays, d.id]);
                    } else {
                      setWeekendDays(weekendDays.filter((id) => id !== d.id));
                    }
                  }}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span
                  className={`text-sm font-medium ${weekendDays.includes(d.id) ? "text-blue-900" : "text-gray-700"}`}
                >
                  {d.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Giờ vào làm (Start Time)
            </label>
            <input
              type="time"
              name="work_start_time"
              defaultValue={settings["work_start_time"] || "08:00"}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Giờ tan làm (End Time)
            </label>
            <input
              type="time"
              name="work_end_time"
              defaultValue={settings["work_end_time"] || "17:00"}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Penalties */}
      <div className="pt-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-red-500 text-lg">⚠️</span>
            Quy định Phạt
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Thiết lập mức phạt tự động cho các vi phạm chấm công.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Phạt đi trễ (VNĐ / lần)
            </label>
            <div className="relative">
              <input
                type="number"
                name="penalty_late"
                defaultValue={settings["penalty_late"] || "50000"}
                className="w-full p-3 pl-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-sm"
                placeholder="0"
              />
              <span className="absolute right-4 top-3 text-gray-400 text-sm font-medium">
                VNĐ
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Phạt vắng không phép (VNĐ / ngày)
            </label>
            <div className="relative">
              <input
                type="number"
                name="penalty_absence"
                defaultValue={settings["penalty_absence"] || "200000"}
                className="w-full p-3 pl-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-sm"
                placeholder="0"
              />
              <span className="absolute right-4 top-3 text-gray-400 text-sm font-medium">
                VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Salary & Tax */}
      <div className="pt-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-green-600 text-lg">Easy</span>
            Lương & Thuế
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Các tham số cơ bản để tính lương Net và thuế TNCN.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Tỷ lệ trích đóng Bảo hiểm (%)
            </label>
            <input
              type="number"
              step="0.1"
              name="insurance_percent"
              defaultValue={settings["insurance_percent"]}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Số ngày công chuẩn (Ngày/Tháng)
            </label>
            <input
              type="number"
              name="standard_work_days"
              defaultValue={settings["standard_work_days"]}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Giảm trừ bản thân (VNĐ)
            </label>
            <input
              type="number"
              name="personal_deduction"
              defaultValue={settings["personal_deduction"]}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">
              Giảm trừ gia cảnh (VNĐ/người)
            </label>
            <input
              type="number"
              name="dependent_deduction"
              defaultValue={settings["dependent_deduction"]}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Tax Table */}
        <div className="space-y-4 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Biểu thuế Lũy tiến
          </h2>
          <input
            type="hidden"
            name="tax_brackets"
            value={JSON.stringify(taxBrackets)}
          />

          <div className="space-y-3">
            {taxBrackets.map((row, idx) => {
              const prevLimit = idx > 0 ? taxBrackets[idx - 1].limit : 0;
              const isLast = idx === taxBrackets.length - 1 && row.limit === 0;

              return (
                <div key={idx} className="flex shadow-sm h-10 group">
                  {/* Label: Bậc X (...) */}
                  <div className="w-[300px] px-3 bg-gray-100 border border-gray-300 border-r-0 rounded-l-md flex items-center text-sm text-gray-800 transition-colors group-hover:bg-gray-200">
                    <span className="font-bold mr-1 whitespace-nowrap">
                      Bậc {idx + 1}
                    </span>
                    <div className="flex items-center text-gray-600">
                      {idx === 0 ? (
                        <span>(Đến&nbsp;</span>
                      ) : isLast ? (
                        <span>
                          (Trên {(prevLimit / 1000000).toLocaleString()}tr
                        </span>
                      ) : (
                        <span>
                          (Trên {(prevLimit / 1000000).toLocaleString()}tr
                          -&nbsp;
                        </span>
                      )}

                      {!isLast && (
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={row.limit / 1000000}
                            onChange={(e) => {
                              const val = Number(e.target.value) * 1000000;
                              const newVal = [...taxBrackets];
                              newVal[idx].limit = val;
                              setTaxBrackets(newVal);
                            }}
                            style={{
                              width: `${(row.limit / 1000000).toString().length + 0.6}ch`,
                            }}
                            className="p-0 text-center bg-transparent outline-none text-blue-700 font-bold text-sm h-4 min-w-[2ch] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span>tr</span>
                        </div>
                      )}
                      <span>)</span>
                    </div>
                  </div>

                  {/* Label: Thuế suất */}
                  <div className="w-[100px] px-3 bg-gray-100 border border-gray-300 border-r-0 flex items-center justify-center text-sm font-medium text-gray-700">
                    Thuế suất
                  </div>

                  {/* Input: Rate */}
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) => {
                      const newVal = [...taxBrackets];
                      newVal[idx].rate = Number(e.target.value);
                      setTaxBrackets(newVal);
                    }}
                    step="0.1"
                    className="flex-1 min-w-0 px-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  {/* Suffix: % */}
                  <div className="px-3 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md flex items-center text-gray-600 font-medium">
                    %
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 -mx-6 -mb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <button
          type="submit"
          disabled={loading || readOnly}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {readOnly ? "Chỉ xem" : "Lưu toàn bộ Cài đặt"}
        </button>
      </div>
    </form>
  );
}

function HolidaysManager({
  holidays,
  readOnly,
}: {
  holidays: Holiday[];
  readOnly?: boolean;
}) {
  // Basic optimistic add roughly implemented via revalidatePath in action

  async function handleDelete(id: number) {
    if (confirm("Bạn có chắc chắn muốn xóa ngày lễ này?")) {
      await deleteHolidayAction(id);
    }
  }

  return (
    <div className="space-y-6">
      {!readOnly && <HolidayAddForm />}

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          Danh sách ngày lễ ({new Date().getFullYear()})
        </h3>
        {holidays.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Chưa có ngày lễ nào.</p>
        ) : (
          <div className="grid gap-3">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                    <span className="text-xs text-gray-500 uppercase">
                      {new Date(h.date).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{h.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(h.date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {!readOnly && (
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HolidayAddForm() {
  // Use simple form action
  // In real app, consider useFormState for error handling
  return (
    <form
      action={async (formData) => {
        await addHolidayAction(formData);
      }}
      className="flex gap-4 items-end bg-blue-50/50 p-4 rounded-xl border border-blue-100"
    >
      <div className="flex-1 space-y-1">
        <label className="text-xs font-semibold text-blue-700 uppercase">
          Tên ngày lễ
        </label>
        <input
          type="text"
          name="name"
          placeholder="Ví dụ: Giỗ tổ Hùng Vương"
          required
          className="w-full p-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-blue-700 uppercase">
          Ngày
        </label>
        <input
          type="date"
          name="date"
          required
          className="p-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Thêm
      </button>
    </form>
  );
}
