"use client";

import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  ChevronRight,
  MoreHorizontal,
  Trash2 as Trash2Icon,
  Edit3 as Edit3Icon,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Image from "next/image";
import Link from "next/link";

interface DashboardProps {
  stats: {
    totalEmployees: number;
    attendanceCount: number;
    pendingLeaves: number;
    newEmployees: {
      id: number;
      first_name: string;
      last_name: string;
      avatar: string | null;
      departments: { name: string } | null;
    }[];
    departmentStats: { name: string; value: number; color: string }[];
    upcomingLeaves: {
      id: number;
      start_date: string;
      employees: { first_name: string; last_name: string } | null;
    }[];
    salaryData: { name: string; received: number; pending: number }[];
  };
}

export default function DashboardView({ stats }: DashboardProps) {
  const statCards = [
    {
      label: "Tổng nhân viên",
      value: stats.totalEmployees,
      icon: Users,
      color: "bg-blue-100 text-[#2F47BA]",
    },
    {
      label: "Hiện diện hôm nay",
      value: stats.attendanceCount,
      icon: Clock,
      color: "bg-green-100 text-[#00882E]",
    },
    {
      label: "Đơn chờ duyệt",
      value: stats.pendingLeaves,
      icon: Briefcase,
      color: "bg-orange-100 text-[#FF8D07]",
    },
    {
      label: "Phòng ban",
      value: stats.departmentStats.length,
      icon: Building2,
      color: "bg-red-100 text-[#DC3545]",
    }, // Thay Salary bằng Department count tạm
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <Image
              src="https://ui-avatars.com/api/?name=Admin&background=random"
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
          Xin chào: Admin
        </h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-blue-600">Dashboard</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition">
            Quản trị viên
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 border border-gray-100">
            Cổng nhân viên
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={cn("p-4 rounded-xl", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Employees Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col h-[400px] border border-gray-100">
          <h4 className="text-lg font-bold mb-6 text-gray-800 uppercase tracking-wide">
            Nhân sự theo phòng ban
          </h4>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departmentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.departmentStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-6 text-center">
              <p className="text-xs text-gray-400 font-bold">Tổng</p>
              <p className="text-3xl font-black text-gray-800">
                {stats.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        {/* Total Salary Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col h-[400px] border border-gray-100">
          <h4 className="text-lg font-bold mb-6 text-gray-800 uppercase tracking-wide">
            Biến động quỹ lương (Demo)
          </h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.salaryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barSize={12}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="rect"
                  formatter={(value) => (
                    <span className="text-sm font-medium text-gray-600 ml-2 capitalize">
                      {value === "received" ? "Đã chi" : "Dự kiến"}
                    </span>
                  )}
                />
                <Bar
                  dataKey="received"
                  name="received"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  name="pending"
                  fill="#fbbf24"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6 text-gray-800">
            Nhân viên mới
          </h4>
          <div className="space-y-4">
            {stats.newEmployees.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={
                        member.avatar ||
                        `https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`
                      }
                      alt={member.last_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {member.last_name} {member.first_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.departments?.name || "Chưa phân phòng"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/employees/${member.id}/edit`}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit3Icon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities - Static for now */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold mb-6 text-gray-800">
            Hoạt động gần đây
          </h4>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                  {/* Placeholder avatar */}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-800 font-medium">
                    Hệ thống tự động cập nhật...
                  </p>
                  <p className="text-xs text-gray-500">{idx + 1} giờ trước</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Upcoming Leave */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-800">Sắp nghỉ phép</h4>
            <button className="text-gray-400 hover:bg-gray-50 p-1 rounded">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.upcomingLeaves.length === 0 ? (
              <p className="text-sm text-gray-500">Không có ai sắp nghỉ.</p>
            ) : (
              stats.upcomingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-800">
                      {new Date(leave.start_date).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {leave.employees?.last_name} {leave.employees?.first_name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/leave"
            className="w-full mt-6 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2"
          >
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
