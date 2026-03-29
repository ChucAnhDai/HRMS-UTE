"use client";

import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  ChevronRight,
  MoreHorizontal,
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
  userName?: string;
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
      end_date: string;
      leave_type: string;
      status: string;
      employees: { first_name: string; last_name: string; avatar: string | null } | null;
    }[];
    recentActivities: {
      id: number;
      action: string;
      entity_type: string;
      details: string;
      created_at: string;
      employees: {
        first_name: string;
        last_name: string;
        avatar: string | null;
      } | null;
    }[];
    salaryData: { name: string; received: number; pending: number }[];
    departmentCount: number;
  };
}

export default function DashboardView({ stats, userName }: DashboardProps) {
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
      value: stats.departmentCount,
      icon: Building2,
      color: "bg-red-100 text-[#DC3545]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "Admin")}&background=random`}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
          Xin chào: {userName || "Admin"}
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

              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
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
            Biến động quỹ lương
          </h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.salaryData}
                margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
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
                  width={50}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number | string | undefined) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(value || 0))
                  }
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="rect"
                  formatter={(value) => (
                    <span className="text-sm font-medium text-gray-600 ml-2 capitalize">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="received"
                  name="Đã chi"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  name="Dự kiến"
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
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h4 className="text-lg font-bold mb-6 text-gray-800">
            Hoạt động gần đây
          </h4>
          <div className="space-y-6">
            {stats.recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Chưa có hoạt động nào.
              </p>
            ) : (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="flex gap-4">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                    <Image
                      src={
                        act.employees?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(act.employees?.last_name || "System")}&background=random`
                      }
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800 font-medium leading-tight">
                      <span className="font-bold">
                        {act.employees?.last_name || "Hệ thống"}
                      </span>{" "}
                      đã {act.action.toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {act.details} •{" "}
                      {new Date(act.created_at).toLocaleString("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
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
                  {/* Avatar nhân viên */}
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0">
                    <Image
                      src={
                        leave.employees?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          (leave.employees?.last_name || "") +
                            " " +
                            (leave.employees?.first_name || "")
                        )}&background=random`
                      }
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 truncate">
                      {leave.employees?.last_name} {leave.employees?.first_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {leave.leave_type} •{" "}
                      {new Date(leave.start_date).toLocaleDateString("vi-VN")}{" "}
                      → {new Date(leave.end_date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {/* Badge trạng thái */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {leave.status === "Approved" ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
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
