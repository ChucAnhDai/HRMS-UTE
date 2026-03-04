"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  hire_date: string;
  employment_status: string;
}

interface Department {
  id: number;
  name: string;
  created_at: string;
}

interface Props {
  department: Department;
  employees: Employee[];
}

export default function DepartmentDetailView({ department, employees }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc nhân viên
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.last_name} ${emp.first_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/departments"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Phòng ban
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-blue-600">{department.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/departments")}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Quay lại danh sách"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {department.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thành lập:{" "}
                  {new Date(department.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Tổng nhân sự</p>
            <p className="text-2xl font-bold text-gray-800">
              {employees.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Đang làm việc</p>
            <p className="text-2xl font-bold text-gray-800">
              {
                employees.filter((e) => e.employment_status !== "Terminated")
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Employee Table Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            Danh sách nhân sự
          </h4>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Nhân viên
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Ngày vào làm
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Không tìm thấy nhân viên nào</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/employees/${emp.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {emp.first_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {emp.last_name} {emp.first_name}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            #{emp.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {emp.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {emp.email}
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {emp.phone}
                          </div>
                        )}
                        {!emp.email && !emp.phone && (
                          <span className="text-sm text-gray-400 italic">
                            Chưa cập nhật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {new Date(emp.hire_date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          emp.employment_status !== "Terminated"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.employment_status !== "Terminated"
                          ? "Đang làm việc"
                          : "Đã nghỉ"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
