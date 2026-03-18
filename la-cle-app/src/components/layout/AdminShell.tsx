"use client";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminShellProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminShell({ children, breadcrumbs }: AdminShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
