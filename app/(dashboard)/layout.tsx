'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import React from 'react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-20 px-4 pb-4 transition-all duration-300 min-h-screen",
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
