"use client";

import React from "react";
import {
  Search,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  AlignLeft,
  Globe,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { cn, getUserAvatarUrl } from "@/lib/utils";
import { logoutAction } from "@/server/actions/auth-actions";
import UserAvatar from "@/components/common/UserAvatar";

export interface HeaderUserProps {
  name: string;
  avatar: string | null;
  role: string | null;
  id?: string | number;
  job_title?: string;
}

export default function Header({ user }: { user: HeaderUserProps | null }) {
  const { toggle, toggleCollapse, isCollapsed } = useSidebar();

  const displayName = user?.name || "Admin User";
  const avatarSrc = getUserAvatarUrl(user?.avatar);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-white shadow-sm px-4 lg:px-8 flex items-center justify-between transition-all duration-300",
        isCollapsed ? "lg:w-[calc(100%-80px)]" : "lg:w-[calc(100%-256px)]",
        "w-full",
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              toggle();
            } else {
              toggleCollapse();
            }
          }}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
          title="Toggle Sidebar"
        >
          <AlignLeft className="h-6 w-6" />
        </button>

        <div className="hidden sm:flex items-center relative gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 lg:w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors">
            <UserAvatar
              avatarUrl={avatarSrc}
              name={displayName}
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <span className="hidden md:block text-sm font-semibold text-gray-700">
              {displayName}
            </span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Globe className="h-4 w-4" /> Trang chủ
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserIcon className="h-4 w-4" /> Hồ sơ cá nhân
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" /> Cài đặt
            </Link>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={() => logoutAction()}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut className="h-4 w-4" /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
