"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { SITE, ROUTES } from "@/lib/constants";

export function LearnerHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-filet bg-nuit-profond/80 px-4 backdrop-blur-sm sm:px-6">
      <Link href="/espace" className="font-serif text-xl text-or">
        {SITE.name}
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 md:flex">
        <Link href={ROUTES.espace.parcours} className="text-sm text-cendre hover:text-ivoire transition-colors">
          Parcours
        </Link>
        <Link href={ROUTES.espace.revision} className="text-sm text-cendre hover:text-ivoire transition-colors">
          Révision
        </Link>
        <Link href={ROUTES.espace.documents} className="text-sm text-cendre hover:text-ivoire transition-colors">
          Documents
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <DropdownMenu
          trigger={
            <div className="flex items-center gap-2 rounded-lg px-2 py-1 text-cendre hover:text-ivoire transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-or/10 text-sm text-or">
                {user?.firstName?.[0]}
              </div>
              <span className="hidden text-sm sm:block">{user?.firstName}</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          }
          items={[
            {
              label: "Mon compte",
              icon: <User className="h-4 w-4" />,
              onClick: () => router.push(ROUTES.espace.compte),
            },
            {
              label: "Déconnexion",
              icon: <LogOut className="h-4 w-4" />,
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </div>
    </header>
  );
}
