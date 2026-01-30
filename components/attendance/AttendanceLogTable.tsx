"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Calendar as CalendarIcon,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AttendanceLog {
  id: number;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  employeeName: string;
  avatar: string | null;
}

export default function AttendanceLogTable({
  logs,
  currentDate,
}: {
  logs: AttendanceLog[];
  currentDate: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State filter local (client side)
  const [searchTerm, setSearchTerm] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    startTransition(() => {
      router.push(`/calendar?date=${newDate}`);
    });
  };

  const handleClearFilter = () => {
    setSearchTerm("");
    const today = new Date().toISOString().split("T")[0];
    router.push(`/calendar?date=${today}`);
  };

  // Filter logs client-side by name
  const filteredLogs = logs.filter((log) =>
    log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string, checkOut: string | null) => {
    if (status === "Late") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1">
          <AlertCircle className="w-3 h-3" /> Đi muộn
        </span>
      );
    }
    if (!checkOut) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 gap-1">
          <Clock className="w-3 h-3" /> Đang làm việc
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
        <CheckCircle className="w-3 h-3" /> Đúng giờ
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Quản lý Chấm công
        </h3>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Chọn ngày:
            </label>
            <div className="relative">
              <input
                type="date"
                value={currentDate}
                onChange={handleDateChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Tìm theo tên nhân viên:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button className="px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800">
                Lọc
              </button>
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 bg-gray-500 text-white text-sm font-bold rounded-lg hover:bg-gray-600"
              >
                Xóa lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-16 text-center">
                #
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Tên nhân viên
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Ngày
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Giờ Check In
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Giờ Check Out
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isPending ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Không có dữ liệu chấm công cho ngày này.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200">
                        {log.avatar ? (
                          <Image
                            src={log.avatar}
                            alt={log.employeeName}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        {log.employeeName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(log.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {log.check_in_time?.slice(0, 5)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.check_out_time ? (
                      <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {log.check_out_time?.slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">--:--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(log.status, log.check_out_time)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
