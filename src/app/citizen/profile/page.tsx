"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Shield, LogOut, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function CitizenProfilePage() {
  const { state, mounted } = useAppStore();

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-looop-muted">
        Memuat profil pengguna...
      </div>
    );
  }

  const user = state.users.find((u) => u.role === "CITIZEN") || state.users[0];

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-lg font-bold text-looop-text">Profil Pengguna</h1>
        <p className="text-xs text-looop-muted">
          Informasi akun masyarakat dan preferensi aplikasi Looop.
        </p>
      </div>

      <Card className="p-5 text-center">
        <div className="w-16 h-16 rounded-full bg-looop-accent/40 text-looop-primary font-bold text-xl flex items-center justify-center mx-auto mb-3">
          {user?.name ? user.name.charAt(0) : "W"}
        </div>
        <h3 className="text-base font-bold text-looop-text">{user?.name || "Warga Looop"}</h3>
        <p className="text-xs text-looop-secondary font-medium">Masyarakat (Citizen)</p>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-xs py-1 border-b border-looop-border">
          <Mail className="w-4 h-4 text-looop-muted" />
          <span className="text-looop-muted">Email:</span>
          <span className="font-semibold text-looop-text ml-auto">{user?.email || "warga@looop.id"}</span>
        </div>
        <div className="flex items-center gap-3 text-xs py-1 border-b border-looop-border">
          <Phone className="w-4 h-4 text-looop-muted" />
          <span className="text-looop-muted">No. Telepon:</span>
          <span className="font-semibold text-looop-text ml-auto">{user?.phone || "081234567890"}</span>
        </div>
        <div className="flex items-center gap-3 text-xs py-1 border-b border-looop-border">
          <MapPin className="w-4 h-4 text-looop-muted" />
          <span className="text-looop-muted">Alamat:</span>
          <span className="font-semibold text-looop-text ml-auto">{user?.address || "Kabupaten Sleman, D.I. Yogyakarta"}</span>
        </div>
        <div className="flex items-center gap-3 text-xs py-1">
          <Shield className="w-4 h-4 text-looop-muted" />
          <span className="text-looop-muted">Status Akun:</span>
          <span className="font-semibold text-looop-success ml-auto">Terverifikasi Aktif</span>
        </div>
      </Card>

      <Link href="/login" className="block">
        <Button variant="outline" className="w-full text-looop-danger border-looop-danger/30 hover:bg-rose-50 gap-2">
          <LogOut className="w-4 h-4" />
          <span>Keluar / Ganti Akun</span>
        </Button>
      </Link>
    </div>
  );
}
