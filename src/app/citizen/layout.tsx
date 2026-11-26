import React from "react";
import { CitizenBottomNav } from "@/components/citizen/bottom-nav";
import { Logo } from "@/components/ui/logo";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-looop-bg pb-20">
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-looop-border">
        <div className="max-w-md mx-auto md:max-w-3xl px-4 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-looop-muted hover:text-looop-text border border-looop-border px-2.5 py-1 rounded-button"
            >
              Keluar
            </Link>
            <button className="p-1.5 text-looop-muted hover:text-looop-text rounded-button transition">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto md:max-w-3xl px-4 pt-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <CitizenBottomNav />
    </div>
  );
}
