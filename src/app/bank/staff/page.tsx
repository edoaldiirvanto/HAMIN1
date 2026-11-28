"use client";

import React, { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { UserPlus, CheckCircle2, Shield } from "lucide-react";

export default function BankStaffPage() {
  const { state, mounted, addStaff } = useAppStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("Petugas Penimbang");
  const [successMsg, setSuccessMsg] = useState("");

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat data staf...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const staffList = state.users.filter(
    (u) => (u.role === "WASTE_BANK_STAFF" || u.role === "WASTE_BANK_ADMIN") && u.wasteBankId === currentBank.id
  );

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addStaff(currentBank.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: roleTitle,
    });

    setName("");
    setEmail("");
    setPhone("");
    setShowAddForm(false);
    setSuccessMsg(`Petugas ${name} berhasil didaftarkan ke sistem operasional!`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Manajemen Petugas & Pengelola Bank Sampah
          </h1>
          <p className="text-sm text-looop-muted">
            Daftar staf penimbang dan administrator yang berwenang dalam operasional unit {currentBank.name}.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5 font-bold text-xs"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? "Tutup Form" : "Tambah Petugas Baru"}</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-looop-success text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {showAddForm && (
        <Card className="p-5 border-looop-secondary/40 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-looop-text">
            <UserPlus className="w-4 h-4 text-looop-secondary" />
            <span>Form Registrasi Petugas Lapangan Baru</span>
          </div>

          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Nama Lengkap"
                placeholder="Contoh: Rian Hidayat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Alamat Email"
                type="email"
                placeholder="rian.staff@looop.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Nomor WhatsApp"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button type="submit" variant="secondary" size="sm" className="font-bold">
                Simpan & Daftarkan Petugas
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <CardTitle className="mb-2">Petugas Berwenang ({staffList.length} Pengelola)</CardTitle>
        <CardDescription className="mb-4">
          Petugas memiliki akses untuk melakukan penimbangan fisik aktual dan validasi transaksi penyetoran.
        </CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">Nama Petugas</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">No. Telepon</th>
                <th className="py-3 px-4">Kewenangan / Peran</th>
                <th className="py-3 px-4">Terdaftar Sejak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-looop-bg/50 transition">
                  <td className="py-3 px-4 font-bold text-looop-text">{st.name}</td>
                  <td className="py-3 px-4 text-looop-muted">{st.email}</td>
                  <td className="py-3 px-4 text-looop-muted">{st.phone || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge variant={st.role === "WASTE_BANK_ADMIN" ? "success" : "info"}>
                      {st.role === "WASTE_BANK_ADMIN" ? "Administrator Unit" : "Petugas Penimbang"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-looop-muted">{formatDate(st.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
