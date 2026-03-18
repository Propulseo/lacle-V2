"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface AdminHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminHeader({ breadcrumbs }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-filet bg-nuit-profond/50 px-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} />
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-cendre">
          {user?.firstName} {user?.lastName}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-cendre hover:text-erreur hover:bg-erreur/10 transition-colors"
          title="Déconnexion"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
