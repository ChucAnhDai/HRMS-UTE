'use client'

import React, { useState } from "react";
import { Edit, Mail, Phone, MapPin, Calendar, Briefcase, User, Shield, FileText, DollarSign, Clock, Monitor } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ContractList from "@/components/contracts/ContractList";
import PayrollTable from "@/components/payroll/PayrollTable";
import LeaveTableView from "@/components/leave/LeaveTableView";
import EmployeeAssetList from "@/components/assets/EmployeeAssetList";
import GrantAccountButton from "@/components/employees/GrantAccountButton";
import RoleManager from "@/components/employees/RoleManager";

interface Props {
  employee: any
  contracts: any[]
  payrolls: any[]
  leaves: any[]
  assets: any[]
  isOwnProfile?: boolean // Nếu true, đang xem profile của chính mình
  currentUserRole?: string // Role của user đang đăng nhập
}

const profileTabs = [
  { id: "overview", name: "Tổng quan", icon: User },
  { id: "documents", name: "Hợp đồng", icon: FileText },
  { id: "payroll", name: "Lương thưởng", icon: DollarSign },
  { id: "timeoff", name: "Nghỉ phép", icon: Clock },
  { id: "assets", name: "Tài sản", icon: Monitor },
];

export default function EmployeeProfileView({ employee, contracts, payrolls, leaves, assets, isOwnProfile = false, currentUserRole = 'EMPLOYEE' }: Props) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/employees" className="hover:text-blue-600 transition-colors">
            Nhân viên
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-blue-600">Hồ sơ</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Hồ sơ nhân viên</h3>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-blue-600/10 to-blue-500/10"></div>
        <div className="px-8 pb-4">
          <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg bg-white overflow-hidden relative">
                   <Image 
                        src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.first_name}+${employee.last_name}&background=random`} 
                        alt="Profile" 
                        fill
                        className="object-cover"
                    />
              </div>
            </div>
            <div className="flex-1 pb-2 space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{employee.last_name} {employee.first_name}</h2>
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                <Briefcase className="h-4 w-4 text-blue-600" />
                {employee.job_title || 'Chưa có chức vụ'} - {employee.departments?.name || 'Chưa phân phòng'}
              </p>
            </div>
            <div className="flex gap-3 pb-2 w-full md:w-auto justify-center items-center">
              {!isOwnProfile && (
                <>
                  <RoleManager 
                    employeeId={employee.id}
                    currentRole={employee.role || 'EMPLOYEE'}
                    employeeName={`${employee.last_name} ${employee.first_name}`}
                  />
                  <GrantAccountButton 
                      employeeId={employee.id} 
                      email={employee.email} 
                      hasAccount={!!employee.auth_user_id} 
                  />
                  <Link href={`/employees/${employee.id}/edit`} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 h-fit">
                    <Edit className="w-4 h-4" /> Sửa hồ sơ
                  </Link>
                </>
              )}
              <a href={`mailto:${employee.email}`} className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-fit bg-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
            {profileTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2",
                  activeTab === tab.id ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-blue-600"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* About Card */}
                <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h4>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {[
                        { label: "Họ và tên", value: `${employee.last_name} ${employee.first_name}`, icon: User },
                        { label: "Email", value: employee.email, icon: Mail },
                        { label: "Số điện thoại", value: employee.phone || 'Chưa cập nhật', icon: Phone },
                        ].map((item) => (
                        <div key={item.label} className="flex gap-4">
                            <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl h-fit shrink-0">
                            <item.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                            <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="space-y-6">
                        {[
                        { label: "Mã số thuế", value: employee.tax_code || '---', icon: Shield },
                        { label: "Ngày vào làm", value: new Date(employee.hire_date).toLocaleDateString('vi-VN'), icon: Calendar },
                        { label: "Chức vụ", value: employee.job_title || 'Nhân viên', icon: Briefcase },
                        ].map((item) => (
                        <div key={item.label} className="flex gap-4">
                            <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl h-fit shrink-0">
                            <item.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                            <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                </div>

                {/* Stats/Summary Card */}
                <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden border border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Thống kê ngày phép</h4>
                    <div className="space-y-4">
                    {[
                        { label: "Tổng phép năm", value: `${employee.annual_leave_quota} ngày`, color: "text-blue-600" },
                        { label: "Đã sử dụng", value: "0 ngày", color: "text-orange-500" }, // Demo data
                        { label: "Còn lại", value: `${employee.annual_leave_quota} ngày`, color: "text-green-600" },
                    ].map((item) => (
                        <div key={item.label} className="p-4 bg-gray-50 rounded-2xl space-y-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
                        <p className={cn("text-xl font-bold", item.color)}>{item.value}</p>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
        )}

        {activeTab === 'documents' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Danh sách hợp đồng</h4>
                    <Link href="/contracts/create" className="text-sm text-blue-600 hover:underline font-medium">Tạo hợp đồng mới</Link>
                </div>
                <ContractList employeeId={employee.id} contracts={contracts} />
            </div>
        )}

        {activeTab === 'payroll' && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Lịch sử trả lương</h4>
                <PayrollTable payrolls={payrolls} />
            </div>
        )}
        
        {activeTab === 'timeoff' && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Lịch sử nghỉ phép</h4>
                <LeaveTableView 
                  leaves={leaves}
                  employees={[employee]}
                  currentUser={isOwnProfile ? {
                    employeeId: employee.id,
                    role: currentUserRole,
                    employeeData: employee
                  } : null}
                />
            </div>
        )}
        
        {activeTab === 'assets' && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Tài sản đang sử dụng</h4>
                <EmployeeAssetList assets={assets} employeeId={employee.id} />
            </div>
        )}
      </div>
    </div>
  );
}
