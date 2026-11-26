"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Inbox,
  Scale,
  Users,
  Tags,
  DollarSign,
  Package,
  Wallet,
  FileText,
  UserCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/bank", icon: LayoutDashboard },
  { label: "Transaksi Masuk", href: "/bank/deposits", icon: Inbox },
  { label: "Penimbangan", href: "/bank/weighing", icon: Scale },
  { label: "Data Warga", href: "/bank/citizens", icon: Users },
  { label: "Kategori Sampah", href: "/bank/categories", icon: Tags },
  { label: "Harga Sampah", href: "/bank/pricing", icon: DollarSign },
  { label: "Persediaan (Stok)", href: "/bank/inventory", icon: Package },
  { label: "Saldo & Pencairan", href: "/bank/payouts", icon: Wallet },
  { label: "Laporan", href: "/bank/reports", icon: FileText },
  { label: "Petugas", href: "/bank/staff", icon: UserCheck },
];

export function WasteBankLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-looop-bg flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-looop-primary text-white sticky top-0 z-50">
        <Logo size="sm" variant="light" />
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar (240-260px) sesuai Stitch 5.1 & 9.4 */}
      <aside
        className={cn(
          "w-64 bg-looop-primary text-white flex-shrink-0 flex flex-col justify-between p-5 md:sticky md:top-0 md:h-screen z-40 transition-all",
          mobileOpen ? "block fixed inset-0 top-14" : "hidden md:flex"
        )}
      >
        <div>
          <div className="hidden md:block mb-8 px-2">
            <Logo size="md" variant="light" />
            <div className="text-[11px] text-looop-accent mt-1">Bank Sampah Sejahtera Lestari</div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-button text-xs font-semibold transition",
                    isActive
                      ? "bg-looop-secondary text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3.5 py-2 rounded-button text-xs font-semibold text-rose-300 hover:bg-white/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (64-72px) */}
        <header className="hidden md:flex h-16 bg-white border-b border-looop-border items-center justify-between px-8 sticky top-0 z-30">
          <div className="text-sm font-semibold text-looop-text">
            Panel Operasional Bank Sampah (Waste Bank Admin & Staff)
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="px-2.5 py-1 bg-looop-accent/40 text-looop-primary font-semibold rounded-full">
              Sesi: Siti Rahmawati (Admin)
            </span>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
