"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusCircle, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function CitizenBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Beranda", href: "/citizen", icon: Home },
    { label: "Jelajahi", href: "/citizen/explore", icon: Compass },
    { label: "Setor", href: "/citizen/deposit", icon: PlusCircle, isPrimary: true },
    { label: "Aktivitas", href: "/citizen/activity", icon: History },
    { label: "Profil", href: "/citizen/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-looop-border max-w-md mx-auto md:max-w-none">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-looop-secondary text-white flex items-center justify-center shadow-md active:scale-95 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold text-looop-secondary mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 py-1 text-xs transition",
                isActive ? "text-looop-secondary font-semibold" : "text-looop-muted hover:text-looop-text"
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
