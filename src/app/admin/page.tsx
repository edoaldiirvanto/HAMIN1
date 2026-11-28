"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Building2, Power, UserCheck, Shield } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function SuperAdminInteractivePage() {
  const { state, mounted, deleteUser, toggleWasteBankStatus, addWasteBank, registerUser } = useAppStore();

  // Form Modals / Expanders
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);

  // Form State User
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState<"CITIZEN" | "WASTE_BANK_ADMIN">("CITIZEN");

  // Form State Bank Sampah
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [bankDistrict, setBankDistrict] = useState("Depok");
  const [bankVillage, setBankVillage] = useState("Caturtunggal");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-looop-muted">
        Memuat Super Administrator Control Center...
      </div>
    );
  }

  const users = state.users;
  const wasteBanks = state.wasteBanks;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      const res = registerUser({
        name: userName,
        email: userEmail,
        phone: userPhone,
        role: userRole,
      });

      if (res.success) {
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setShowAddUser(false);
      } else {
        setFormError(res.error || "Gagal menambahkan akun");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${name}"?`)) {
      deleteUser(id);
    }
  };

  const handleCreateBank = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      addWasteBank({
        name: bankName,
        address: bankAddress,
        district: bankDistrict,
        village: bankVillage,
      });
      setBankName("");
      setBankAddress("");
      setShowAddBank(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-looop-bg pb-12">
      {/* Super Admin Header */}
      <header className="bg-looop-primary text-white h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Logo size="md" variant="light" />
          <span className="hidden sm:inline-block text-xs bg-looop-accent/20 text-looop-accent px-2.5 py-1 rounded font-bold border border-looop-accent/30">
            Super Administrator Control Center
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden md:inline text-white/70">Hak Akses Penuh: Konfigurasi, Akun & Operasional</span>
          <Link href="/login" className="text-white hover:underline font-semibold">
            Keluar Sesi
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Pusat Kendali Ekosistem Looop
          </h1>
          <p className="text-sm text-looop-muted">
            Kelola integrasi seluruh unit bank sampah, akun lintas entitas, dan konfigurasi master data.
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowAddUser(!showAddUser);
              setShowAddBank(false);
            }}
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pengguna Sistem</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddBank(!showAddBank);
              setShowAddUser(false);
            }}
            className="gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Daftarkan Unit Bank Sampah Baru</span>
          </Button>
        </div>

        {/* Form Tambah Pengguna */}
        {showAddUser && (
          <Card className="p-6 border-looop-secondary/40 shadow-sm animate-in fade-in">
            <CardTitle className="text-base mb-1">Form Registrasi Akun Pengguna Baru</CardTitle>
            <CardDescription className="mb-4">
              Buat akun dengan hak akses tertentu untuk keperluan pengujian dan operasional.
            </CardDescription>

            {formError && (
              <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="cth: Siti Rahayu"
                required
              />
              <Input
                label="Email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="cth: siti@looop.id"
                required
              />
              <Input
                label="Nomor WhatsApp"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="cth: 081234567890"
                required
              />
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-looop-text">Role Akses</label>
                <select
                  className="w-full text-xs h-10 px-3 rounded-button border border-looop-border bg-white text-looop-text focus:outline-none focus:ring-2 focus:ring-looop-secondary"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                >
                  <option value="CITIZEN">Masyarakat (Citizen)</option>
                  <option value="WASTE_BANK_ADMIN">Admin Bank Sampah (Waste Bank Admin)</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" variant="secondary" size="md" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Akun"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setShowAddUser(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Form Tambah Bank Sampah */}
        {showAddBank && (
          <Card className="p-6 border-looop-primary/40 shadow-sm animate-in fade-in">
            <CardTitle className="text-base mb-1">Registrasi Entitas Unit Bank Sampah Baru</CardTitle>
            <CardDescription className="mb-4">
              Daftarkan unit bank sampah resmi di wilayah Kabupaten Sleman.
            </CardDescription>

            <form onSubmit={handleCreateBank} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Bank Sampah"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="cth: Bank Sampah Melati Berseri"
                required
              />
              <Input
                label="Alamat Lengkap Unit"
                value={bankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
                placeholder="cth: Jl. Palagan KM 8, Sariharjo, Ngaglik"
                required
              />
              <Input
                label="Kapanewon (Kecamatan)"
                value={bankDistrict}
                onChange={(e) => setBankDistrict(e.target.value)}
                placeholder="cth: Ngaglik"
                required
              />
              <Input
                label="Kalurahan (Desa)"
                value={bankVillage}
                onChange={(e) => setBankVillage(e.target.value)}
                placeholder="cth: Sariharjo"
                required
              />

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" variant="secondary" size="md" disabled={loading}>
                  {loading ? "Mendaftarkan..." : "Daftarkan Bank Sampah"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setShowAddBank(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Master Tabel Pengguna */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 sm:p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Daftar Pengguna Sistem & Hak Akses</CardTitle>
                <CardDescription>Manajemen aktif seluruh akun dan role pada platform Looop</CardDescription>
              </div>
              <span className="text-xs text-looop-muted font-semibold">{users.length} Akun Terdaftar</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
                  <tr>
                    <th className="py-2.5 px-3">Nama</th>
                    <th className="py-2.5 px-3">Kontak</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Afiliasi</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-looop-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-looop-bg/50">
                      <td className="py-2.5 px-3 font-semibold text-looop-text">{u.name}</td>
                      <td className="py-2.5 px-3 text-looop-muted">
                        <div>{u.email}</div>
                        <div className="text-[10px]">{u.phone || "-"}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="neutral">{u.role}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-looop-muted">
                        {u.wasteBankId
                          ? wasteBanks.find((b) => b.id === u.wasteBankId)?.name || "Bank Sampah Mitra"
                          : "Publik / Warga"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {u.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="text-rose-500 hover:text-rose-700 p-1 transition"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Master Bank Sampah & Status Izin */}
          <Card className="p-5 sm:p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Bank Sampah Mitra</CardTitle>
                <CardDescription>Aktivasi & verifikasi operasional unit ({wasteBanks.length})</CardDescription>
              </div>
            </div>

            <div className="space-y-3">
              {wasteBanks.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-looop-bg rounded-lg border border-looop-border text-xs flex items-center justify-between"
                >
                  <div className="pr-2">
                    <div className="font-bold text-looop-text">{b.name}</div>
                    <div className="text-[11px] text-looop-muted">{b.code} &bull; {b.region.district}</div>
                    <span
                      className={`inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${
                        b.isActive ? "bg-emerald-100 text-looop-success" : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {b.isActive ? "Operasional Aktif" : "Dinonaktifkan"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWasteBankStatus(b.id)}
                    className="h-7 text-[11px] flex-shrink-0"
                  >
                    <Power className="w-3.5 h-3.5 mr-1" />
                    {b.isActive ? "Suspend" : "Aktifkan"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
