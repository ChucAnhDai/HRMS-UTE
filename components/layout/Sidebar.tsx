"use client";

import React from "react";
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
  ChevronRight
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Employees", icon: Users, href: "/employees" },
  { name: "Instruments", icon: Building2, href: "/instruments" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Leave", icon: Briefcase, href: "/leave" },
  { name: "Review", icon: Star, href: "/review" },
  { name: "Report", icon: FileText, href: "/report" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Profile", icon: User, href: "/profile" },
];

export default function Sidebar() {
  const { isOpen, isCollapsed, toggleCollapse, close } = useSidebar();
  const pathname = usePathname();

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
          "fixed top-0 left-0 z-50 h-full bg-white shadow-lg transition-all duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn(
          "flex h-16 items-center px-6 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            {/* Placeholder Logo */}
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
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

        <nav className="mt-6 px-4 pb-4 overflow-y-auto h-[calc(100%-80px)] overflow-x-hidden no-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => {
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

          <div className="mt-auto pt-10 border-t border-gray-100">
            <Link
              href="/login"
              className={cn(
                "flex items-center gap-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 group",
                isCollapsed ? "px-2 justify-center" : "px-4"
              )}
              title={isCollapsed ? "Log out" : ""}
            >
              <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500" />
              {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
