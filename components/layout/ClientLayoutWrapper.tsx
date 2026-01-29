"use client";

import Header, { HeaderUserProps } from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import React from "react";

function DashboardLayoutContent({
  children,
  user,
}: {
  children: React.ReactNode;
  user: HeaderUserProps | null;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header user={user} />
      <main
        className={cn(
          "pt-20 px-4 pb-4 transition-all duration-300 min-h-screen",
          isCollapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function ClientLayoutWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user: HeaderUserProps | null;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent user={user}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
