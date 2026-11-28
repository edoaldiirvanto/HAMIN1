"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Search, Filter, Scale } from "lucide-react";

export default function BankDepositsListPage() {
  const { state, mounted } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat daftar transaksi...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const allDeposits = state.deposits.filter((d) => d.wasteBankId === currentBank.id);

  const filteredDeposits = allDeposits.filter((dep) => {
    const matchesSearch =
      dep.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || dep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Daftar Seluruh Transaksi Penyetoran Masuk
          </h1>
          <p className="text-sm text-looop-muted">
            Kelola transaksi warga dari pengajuan awal, proses penimbangan fisik, hingga verifikasi selesai.
          </p>
        </div>
        <Link href="/bank/weighing">
          <Button variant="secondary" size="sm" className="gap-1.5 font-bold">
            <Scale className="w-4 h-4" />
            <span>Form Penimbangan Baru</span>
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-looop-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari kode atau nama warga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-looop-muted flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
            >
              <option value="ALL">Semua Status ({allDeposits.length})</option>
              <option value="SUBMITTED">Diajukan (SUBMITTED)</option>
              <option value="WEIGHING">Sedang Ditimbang (WEIGHING)</option>
              <option value="COMPLETED">Selesai (COMPLETED)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">No. Pengajuan</th>
                <th className="py-3 px-4">Warga Pengaju</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Rincian Sampah</th>
                <th className="py-3 px-4">Status Transaksi</th>
                <th className="py-3 px-4">Total Nilai</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-looop-muted">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-looop-bg/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-looop-text">{dep.code}</td>
                    <td className="py-3 px-4 font-medium text-looop-text">
                      <div>{dep.citizenName}</div>
                      <div className="text-[10px] text-looop-muted">{dep.citizenPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-looop-muted">{formatDate(dep.createdAt)}</td>
                    <td className="py-3 px-4 text-looop-muted">
                      {dep.items.map((i) => `${i.wasteItemName} (${i.actualKg > 0 ? i.actualKg : i.estimatedKg}kg)`).join(", ")}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(dep.status)}>
                        {dep.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-looop-primary">
                      {formatRupiah(dep.status === "COMPLETED" ? dep.totalActual : dep.totalEstimated)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/bank/weighing?depositId=${dep.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          {dep.status === "COMPLETED" ? "Lihat Detail" : "Timbang Sampah"}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
