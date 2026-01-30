"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Plus, Clock, Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EventContentArg } from "@fullcalendar/core";

interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  extendedProps: {
    type: string;
    status: string;
  };
}

interface CalendarViewProps {
  events: CalendarEvent[];
  employees: { id: number; first_name: string; last_name: string }[];
}

const eventCategories = [
  {
    label: "Đi làm đúng giờ",
    color: "bg-green-100 text-green-800",
    icon: Clock,
  },
  {
    label: "Đi muộn / Về sớm",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
  },
  { label: "Nghỉ phép", color: "bg-blue-100 text-blue-800", icon: Briefcase },
  { label: "Vắng mặt", color: "bg-red-100 text-red-800", icon: Clock },
];

export default function CalendarView({ events, employees }: CalendarViewProps) {
  const [loading, setLoading] = React.useState(false);
  const [selectedEmpId, setSelectedEmpId] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [msg, setMsg] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.last_name} ${emp.first_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emp.id.toString().includes(searchTerm),
  );

  const handleCheckIn = async () => {
    if (!selectedEmpId) return;
    setLoading(true);
    setMsg(null);

    try {
      const { checkInAction } =
        await import("@/server/actions/attendance-actions");
      const res = await checkInAction(Number(selectedEmpId));
      if (res?.error) {
        setMsg({ type: "error", text: res.error });
      } else {
        setMsg({ type: "success", text: res.message || "Thành công" });
      }
    } catch {
      setMsg({ type: "error", text: "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  // Custom render sự kiện trên lịch
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div
        className={cn(
          "px-2 py-1 rounded text-[10px] font-bold truncate w-full text-black", // Force text-black
          eventInfo.event.extendedProps.type === "Leave"
            ? "bg-blue-200 border-l-2 border-blue-600"
            : eventInfo.event.extendedProps.status === "Present"
              ? "bg-green-200 border-l-2 border-green-600"
              : eventInfo.event.extendedProps.status === "Late"
                ? "bg-orange-200 border-l-2 border-orange-600"
                : "bg-red-200 border-l-2 border-red-600",
        )}
      >
        {eventInfo.timeText && (
          <span className="mr-1 opacity-75 font-medium">
            {eventInfo.timeText}
          </span>
        )}
        {eventInfo.event.title}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-700 transition-colors"
          >
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-bold text-blue-700">Lịch làm việc</span>
        </div>
        <h3 className="text-xl font-extrabold text-black">
          Lịch chấm công & Sự kiện
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Actions & Legend */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-black uppercase">
                Chọn nhân viên chấm công
              </label>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tìm tên hoặc mã NV..."
                />
                {searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmpId(emp.id.toString());
                            setSearchTerm(`${emp.last_name} ${emp.first_name}`);
                          }}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-black"
                        >
                          <span className="font-bold">#{emp.id}</span> -{" "}
                          {emp.last_name} {emp.first_name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Không tìm thấy
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Info */}
              {selectedEmpId && (
                <div className="text-xs text-blue-700 font-medium bg-blue-50 p-2 rounded">
                  Đang chọn: ID {selectedEmpId}
                </div>
              )}
            </div>

            <button
              onClick={handleCheckIn}
              disabled={loading || !selectedEmpId}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Đang xử lý..." : "Chấm công ngay"}
            </button>

            {msg && (
              <div
                className={cn(
                  "p-3 rounded-lg text-xs font-bold flex items-center gap-2",
                  msg.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200",
                )}
              >
                {msg.text}
              </div>
            )}

            <div className="mt-8 space-y-4">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider">
                Chú thích
              </h4>
              <ul className="space-y-2">
                {eventCategories.map((cat, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      "px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-3 transition-transform hover:scale-[1.02] cursor-default",
                      cat.color,
                    )}
                  >
                    <cat.icon className="w-4 h-4 opacity-70" />
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Kéo thả sự kiện để cập nhật nhanh (Tính năng sắp ra mắt)
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-4">
            <style jsx global>{`
              .fc .fc-toolbar-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1f2937;
              }
              .fc .fc-button-primary {
                background-color: white;
                color: #4b5563;
                border: 1px solid #e5e7eb;
                font-weight: 600;
                text-transform: capitalize;
                padding: 0.5rem 1rem;
              }
              .fc .fc-button-primary:hover {
                background-color: #f9fafb;
                color: #111827;
              }
              .fc .fc-button-primary:disabled {
                opacity: 0.5;
              }
              .fc .fc-button-group > .fc-button {
                border-radius: 0.5rem;
                margin-left: 4px;
              }
              .fc .fc-button-active {
                background-color: #eff6ff !important;
                color: #2563eb !important;
                border-color: #dbeafe !important;
              }
              .fc .fc-daygrid-day-number {
                font-size: 0.875rem;
                font-weight: 600;
                color: #4b5563;
                padding: 0.5rem;
                text-decoration: none;
              }
              .fc .fc-col-header-cell-cushion {
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                color: #9ca3af;
                padding: 1rem 0;
              }
              .fc-theme-standard td,
              .fc-theme-standard th {
                border-color: #f3f4f6;
              }
            `}</style>

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "title",
                right: "prev,next today dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventContent={renderEventContent}
              height="auto"
              contentHeight="auto"
              aspectRatio={1.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
