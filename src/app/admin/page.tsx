"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Building2, Power } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  wasteBank?: { name: string };
}

interface WasteBankItem {
  id: string;
  name: string;
  code: string;
  address: string;
  isActive: boolean;
  region: { village: string; district: string };
}

export default function SuperAdminInteractivePage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [wasteBanks, setWasteBanks] = useState<WasteBankItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Modals / Expanders
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);

  // Form State User
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState("CITIZEN");

  // Form State Bank Sampah
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");

  const refreshData = async () => {
    try {
      const [uRes, bRes] = await Promise.all([
        fetch("/api/admin/users-list").then((r) => r.json()).catch(() => []),
        fetch("/api/waste-banks").then((r) => r.json()).catch(() => []),
      ]);
      if (Array.isArray(uRes)) setUsers(uRes);
      if (Array.isArray(bRes)) setWasteBanks(bRes);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: userPhone,
          role: userRole,
        }),
      });
      if (res.ok) {
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setShowAddUser(false);
        refreshData();
      } else {
        alert("Gagal menambahkan pengguna");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    refreshData();
  };

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/waste-banks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bankName,
          address: bankAddress,
          regionId: wasteBanks[0]?.id || "region-default",
        }),
      });
      if (res.ok) {
        setBankName("");
        setBankAddress("");
        setShowAddBank(false);
        refreshData();
      } else {
        alert("Gagal mendaftarkan bank sampah");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBankStatus = async (id: string, current: boolean) => {
    await fetch("/api/admin/waste-banks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !current }),
    });
    refreshData();
  };

  return (
    <div className="min-h-screen bg-looop-bg pb-12">
      {/* Super Admin Header */}
      <header className="bg-looop-primary text-white h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Logo size="md" variant="light" />
          <span className="text-xs bg-looop-accent/20 text-looop-accent px-2.5 py-1 rounded font-bold border border-looop-accent/30">
            Super Administrator Control Center
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-white/70">Hak Akses Penuh: Konfigurasi, Akun & Operasional</span>
          <Link href="/login" className="text-white hover:underline font-semibold">
            Keluar Sesi
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Pusat Kendali & Konfigurasi Platform Looop
          </h1>
          <p className="text-sm text-looop-muted">
            Kelola akun pengguna, verifikasi izin bank sampah, dan administrasi wilayah cakupan.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddUser(!showAddUser)}
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Pengguna Baru</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddBank(!showAddBank)}
            className="gap-2 bg-white"
          >
            <Building2 className="w-4 h-4" />
            <span>Daftarkan Bank Sampah Baru</span>
          </Button>
        </div>

        {/* Form Tambah Pengguna */}
        {showAddUser && (
          <Card className="p-5 border-looop-secondary bg-white shadow-sm">
            <CardTitle className="text-base mb-3">Form Pendaftaran Pengguna & Role Baru</CardTitle>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                label="Nama Lengkap"
                placeholder="Contoh: Ahmad Yani"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <Input
                label="Alamat Email"
                type="email"
                placeholder="ahmad@looop.id"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <Input
                label="No. Telepon"
                placeholder="08123456789"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
              <div>
                <label className="block text-xs font-semibold text-looop-text mb-1.5">
                  Peran / Hak Akses
                </label>
                <select
                  className="w-full rounded-input border border-looop-border bg-white px-3 py-2 text-sm text-looop-text focus:outline-none"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="CITIZEN">Masyarakat (Citizen)</option>
                  <option value="WASTE_BANK_ADMIN">Admin Bank Sampah</option>
                  <option value="WASTE_BANK_STAFF">Petugas Bank Sampah</option>
                  <option value="GOVERNMENT">Pemerintah Daerah (Monitoring)</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-end gap-2">
                <Button type="submit" variant="secondary" size="md" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Pengguna"}
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
          <Card className="p-5 border-looop-secondary bg-white shadow-sm">
            <CardTitle className="text-base mb-3">Registrasi Bank Sampah Mitra Baru</CardTitle>
            <form onSubmit={handleCreateBank} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Nama Bank Sampah"
                placeholder="Contoh: Bank Sampah Berkah Mandiri"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
              <Input
                label="Alamat Lengkap"
                placeholder="Jl. Kaliurang KM 9, Sinduharjo"
                value={bankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
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
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Daftar Pengguna Sistem & Hak Akses</CardTitle>
                <CardDescription>Manajemen aktif seluruh akun dan role pada platform Looop</CardDescription>
              </div>
              <span className="text-xs text-looop-muted">{users.length} Akun Terdaftar</span>
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
                        {u.wasteBank?.name || "Publik / Warga"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 transition"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Master Bank Sampah & Status Izin */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Bank Sampah Mitra</CardTitle>
                <CardDescription>Aktivasi & verifikasi operasional unit</CardDescription>
              </div>
            </div>

            <div className="space-y-3">
              {wasteBanks.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-looop-bg rounded-lg border border-looop-border text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-looop-text">{b.name}</div>
                    <div className="text-[11px] text-looop-muted">{b.code}</div>
                    <span
                      className={`inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${b.isActive ? "bg-emerald-100 text-looop-success" : "bg-rose-100 text-rose-600"
                        }`}
                    >
                      {b.isActive ? "Operasional Aktif" : "Dinonaktifkan"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleBankStatus(b.id, b.isActive)}
                    className="h-7 text-[11px]"
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
