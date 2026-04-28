"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  MessageSquare,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  ClipboardList,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, SITE } from "@/lib/constants";

const navGroups = [
  {
    label: "Général",
    items: [
      { label: "Dashboard", href: ROUTES.admin.dashboard, icon: LayoutDashboard },
    ],
  },
  {
    label: "Gestion",
    items: [
      { label: "Apprenants", href: ROUTES.admin.apprenants, icon: Users },
      { label: "Engagement", href: ROUTES.admin.engagement, icon: Activity },
      { label: "Satisfaction", href: ROUTES.admin.satisfaction, icon: MessageSquare },
      { label: "Contenus", href: ROUTES.admin.contenus, icon: BookOpen },
      { label: "Sessions", href: ROUTES.admin.sessions, icon: Calendar },
      { label: "Documents", href: ROUTES.admin.documents, icon: FileText },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Paramètres", href: ROUTES.admin.parametres, icon: Settings },
      { label: "Moyens techniques", href: ROUTES.admin.moyensTechniques, icon: ClipboardList },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Menu"
        className="fixed left-4 top-4 z-50 rounded-lg bg-encre p-2 text-cendre lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-nuit-profond/60 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-filet bg-nuit-profond transition-all duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-filet px-4">
          {!collapsed && (
            <Link href="/admin" className="font-serif text-xl text-or">
              {SITE.name}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Deplier le menu" : "Replier le menu"}
            className="hidden rounded-lg p-1.5 text-cendre hover:text-ivoire lg:block"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="mb-2 px-4 text-[10px] font-medium uppercase tracking-widest text-pierre">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-or/10 text-or"
                      : "text-cendre hover:bg-ivoire/5 hover:text-ivoire"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-filet p-4">
            <p className="text-[10px] text-pierre">Administration</p>
          </div>
        )}
      </aside>
    </>
  );
}
