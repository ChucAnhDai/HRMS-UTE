import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth-helpers";
import { employeeService } from "@/server/services/employee-service";
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
    redirect("/login");
  }

  // Fetch employee details to get avatar
  let employee = null;
  if (currentUser.employeeId) {
    try {
      employee = await employeeService.getEmployee(currentUser.employeeId);
    } catch {
      // Ignore error
    }
  }

  const headerUser = {
    name: employee
      ? `${employee.last_name} ${employee.first_name}`
      : currentUser.name || currentUser.email,
    email: currentUser.email,
    avatar: employee?.avatar || currentUser.avatar || null,
    role: currentUser.role,
    job_title: employee?.job_title || undefined,
  };

  return (
    <ClientLayoutWrapper user={headerUser}>{children}</ClientLayoutWrapper>
  );
}
