"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  Building2, 
  Calendar, 
  Briefcase, 
  Star, 
  FileText, 
  Settings, 
  User,
  LogOut,
  X,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { getCurrentUserAction, logoutAction } from "@/server/actions/auth-actions";
import Image from "next/image";

type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/", roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[] },
  { name: "Profile", icon: User, href: "/profile", roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[] },
  { name: "Employees", icon: Users, href: "/employees", roles: ['ADMIN', 'MANAGER'] as UserRole[] },
  { name: "Departments", icon: Building2, href: "/departments", roles: ['ADMIN', 'MANAGER'] as UserRole[] },
  { name: "Instruments", icon: ChevronRight, href: "/instruments", roles: ['ADMIN', 'MANAGER'] as UserRole[] },
  { name: "Calendar", icon: Calendar, href: "/calendar", roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[] },
  { name: "Leave", icon: Briefcase, href: "/leave", roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] as UserRole[] },
  { name: "Payroll", icon: CreditCard, href: "/payroll", roles: ['ADMIN', 'MANAGER'] as UserRole[] },
  { name: "Review", icon: Star, href: "/review", roles: ['ADMIN', 'MANAGER'] as UserRole[] },
  { name: "Report", icon: FileText, href: "/report", roles: ['ADMIN'] as UserRole[] },
  { name: "Settings", icon: Settings, href: "/settings", roles: ['ADMIN'] as UserRole[] },
];

export default function Sidebar() {
  const { isOpen, isCollapsed, toggleCollapse, close } = useSidebar();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
        const userProfile = await getCurrentUserAction();
        setUser(userProfile);
    }
    fetchUser();
  }, []);

  // Lọc menu theo quyền
  const visibleMenuItems = menuItems.filter(item => {
    if (!user?.role) return true; // Hiển thị tất cả nếu chưa load user
    return item.roles.includes(user.role as UserRole);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white shadow-lg transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn(
          "flex h-16 items-center px-6 transition-all duration-300 flex-shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            {/* Logo */}
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                C
            </div>
            {!isCollapsed && <span className="font-bold text-xl text-gray-800">Crextio</span>}
          </Link>
          {!isCollapsed && (
            <button onClick={close} className="lg:hidden">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          )}
        </div>

        {/* User Profile Summary (New Feature) */}
        {!isCollapsed && user && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                <Image 
                   src={user.avatar || `https://ui-avatars.com/api/?name=${user.last_name}+${user.first_name}&background=random`} 
                   alt="User" 
                   fill 
                   className="object-cover" 
                />
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user.last_name} {user.first_name}</p>
                <p className="text-xs text-gray-500 font-medium truncate">{user.role || 'Employee'}</p>
             </div>
          </div>
        )}

        {/* Menu */}
        <nav className="mt-4 px-4 pb-4 overflow-y-auto flex-1 overflow-x-hidden no-scrollbar">
          <ul className="space-y-1">
            {visibleMenuItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 py-3 rounded-lg text-sm font-medium transition-all group",
                      isCollapsed ? "px-2 justify-center" : "px-4",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    title={isCollapsed ? item.name : ""}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-gray-500")} />
                    {!isCollapsed && <span className="whitespace-nowrap opacity-100 transition-opacity duration-300">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className={cn("p-4 border-t border-gray-100 mt-auto flex-shrink-0", isCollapsed ? 'items-center flex flex-col gap-2' : '')}>
             {/* Profile Link */}
             <Link
                href={`/employees/${user?.id}`}
                className={cn(
                  "flex items-center gap-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all",
                   isCollapsed ? "justify-center px-2" : "px-4"
                )}
                title={isCollapsed ? "Profile" : ""}
            >
               <User className="h-5 w-5 text-gray-500" />
               {!isCollapsed && <span>Profile</span>}
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => logoutAction()}
              className={cn(
                "flex items-center gap-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full",
                 isCollapsed ? "justify-center px-2" : "px-4"
              )}
              title={isCollapsed ? "Log out" : ""}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}
            </button>
        </div>
      </aside>
    </>
  );
}
