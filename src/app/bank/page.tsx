"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { Scale, Inbox, Wallet, Package } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export default function WasteBankDashboard() {
  const { state, mounted } = useAppStore();

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-looop-muted">
        Memuat dashboard operasional bank sampah...
      </div>
    );
  }

  const currentBank = state.wasteBanks[0];
  const deposits = state.deposits.filter((d) => d.wasteBankId === currentBank.id);
  const pendingDeposits = deposits.filter((d) => d.status === "SUBMITTED" || d.status === "WEIGHING");
  const completedDeposits = deposits.filter((d) => d.status === "COMPLETED");

  const totalStockKg = currentBank.inventory.reduce((acc, i) => acc + i.stockKg, 0);
  const pendingPayouts = state.payouts.filter(
    (p) => p.wasteBankId === currentBank.id && p.status === "REQUESTED"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Ringkasan Operasional Bank Sampah
        </h1>
        <p className="text-sm text-looop-muted">
          Unit: <strong className="text-looop-text">{currentBank.name}</strong> ({currentBank.code}) — {currentBank.address}
        </p>
      </div>

      {/* KPI Cards Sesuai Stitch 9.4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-looop-muted block mb-1">Setoran Perlu Diproses</span>
            <span className="text-2xl font-extrabold text-looop-text">{pendingDeposits.length}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-looop-warning flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-looop-muted block mb-1">Total Setoran Selesai</span>
            <span className="text-2xl font-extrabold text-looop-text">{completedDeposits.length}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-looop-success flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-looop-muted block mb-1">Total Stok Tersimpan</span>
            <span className="text-2xl font-extrabold text-looop-text">{totalStockKg.toFixed(1)} kg</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-looop-info flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-looop-muted block mb-1">Permintaan Pencairan</span>
            <span className="text-2xl font-extrabold text-looop-text">{pendingPayouts.length}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-looop-accent/40 text-looop-primary flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Transaksi Masuk Menunggu Penimbangan */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>Transaksi Masuk Terbaru</CardTitle>
            <CardDescription>Daftar pengajuan masyarakat yang perlu diverifikasi dan ditimbang</CardDescription>
          </div>
          <Link href="/bank/weighing">
            <Button variant="secondary" size="sm">
              Buka Form Penimbangan
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">No. Pengajuan</th>
                <th className="py-3 px-4">Nama Warga</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Estimasi / Aktual</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-looop-muted">
                    Belum ada data transaksi penyetoran masuk.
                  </td>
                </tr>
              ) : (
                deposits.slice(0, 5).map((dep) => (
                  <tr key={dep.id} className="hover:bg-looop-bg/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-looop-text">{dep.code}</td>
                    <td className="py-3 px-4 font-medium text-looop-text">
                      <div>{dep.citizenName}</div>
                      <div className="text-[10px] text-looop-muted">{dep.citizenPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-looop-muted">{formatDate(dep.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(dep.status)}>
                        {dep.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-looop-text font-mono">
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
