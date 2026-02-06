import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-helpers";

import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Payroll System",
  description: "HRM Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/api/auth/logout");
  }

  // Fetch employee details to get avatar
  // Optimization: Avatar is now fetched in getCurrentUser, no need to refetch

  interface EmployeeData {
    first_name: string;
    last_name: string;
    avatar: string | null;
    job_title: string;
  }

  const employeeData = currentUser.employeeData as unknown as
    | EmployeeData
    | undefined;

  const avatar = currentUser.avatar || employeeData?.avatar || null;

  const headerUser = {
    name: employeeData
      ? `${employeeData.last_name} ${employeeData.first_name}`
      : currentUser.name || currentUser.email,
    email: currentUser.email,
    avatar: avatar,
    role: currentUser.role,
    job_title: employeeData?.job_title || undefined,
    id: currentUser.employeeId || undefined,
  };

  return (
    <ClientLayoutWrapper user={headerUser}>{children}</ClientLayoutWrapper>
  );
}
