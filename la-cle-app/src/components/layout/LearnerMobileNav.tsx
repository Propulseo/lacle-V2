"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Archive, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const items = [
  { label: "Accueil", href: ROUTES.espace.dashboard, icon: Home },
  { label: "Parcours", href: ROUTES.espace.parcours, icon: BookOpen },
  { label: "Révision", href: ROUTES.espace.revision, icon: Archive },
  { label: "Documents", href: ROUTES.espace.documents, icon: FileText },
  { label: "Compte", href: ROUTES.espace.compte, icon: User },
];

export function LearnerMobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/espace") return pathname === "/espace";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-filet bg-nuit-profond/95 backdrop-blur-sm md:hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors",
            isActive(item.href) ? "text-or" : "text-pierre"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
