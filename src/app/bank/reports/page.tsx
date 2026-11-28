"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function BankReportsPage() {
  const { state, mounted } = useAppStore();

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat laporan...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const deposits = state.deposits.filter((d) => d.wasteBankId === currentBank.id && d.status === "COMPLETED");
  const payouts = state.payouts.filter((p) => p.wasteBankId === currentBank.id && p.status === "COMPLETED");

  const totalDepositVolume = currentBank.inventory.reduce((acc, i) => acc + i.stockKg, 0);
  const totalDepositValue = deposits.reduce((acc, d) => acc + d.totalActual, 0);
  const totalPayoutValue = payouts.reduce((acc, p) => acc + p.amount, 0);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["No Pengajuan,Nama Warga,Status,Total Nilai", ...deposits.map((d) => `${d.code},${d.citizenName},${d.status},${d.totalActual}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Bank_Sampah_${currentBank.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Laporan & Rekapitulasi Operasional
          </h1>
          <p className="text-sm text-looop-muted">
            Laporan volume sampah, rekap transaksi, dan keuangan operasional {currentBank.name}.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={handleExportCSV}>
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan (CSV)</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-looop-muted block mb-1">Total Volume Sampah Terkelola</span>
          <span className="text-2xl font-extrabold text-looop-text font-mono">{totalDepositVolume.toFixed(1)} kg</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold text-looop-muted block mb-1">Total Nilai Penyetoran Warga</span>
          <span className="text-2xl font-extrabold text-looop-secondary font-mono">{formatRupiah(totalDepositValue)}</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold text-looop-muted block mb-1">Total Pencairan Dana Selesai</span>
          <span className="text-2xl font-extrabold text-looop-primary font-mono">{formatRupiah(totalPayoutValue)}</span>
        </Card>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Ringkasan Operasional Terpadu</CardTitle>
        <CardDescription className="mb-4">
          Laporan terpadu sesuai standar pelaporan dinas lingkungan hidup kabupaten.
        </CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">Indikator</th>
                <th className="py-3 px-4">Nilai Akumulasi</th>
                <th className="py-3 px-4">Satuan / Format</th>
                <th className="py-3 px-4">Catatan Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              <tr className="hover:bg-looop-bg/50">
                <td className="py-3 px-4 font-bold text-looop-text">Transaksi Penimbangan Selesai</td>
                <td className="py-3 px-4 font-mono font-bold text-looop-primary">{deposits.length}</td>
                <td className="py-3 px-4 text-looop-muted">Transaksi</td>
                <td className="py-3 px-4 text-looop-muted">Telah diverifikasi timbangan aktual</td>
              </tr>
              <tr className="hover:bg-looop-bg/50">
                <td className="py-3 px-4 font-bold text-looop-text">Persediaan Sampah di Gudang</td>
                <td className="py-3 px-4 font-mono font-bold text-looop-secondary">{totalDepositVolume.toFixed(1)}</td>
                <td className="py-3 px-4 text-looop-muted">Kilogram (kg)</td>
                <td className="py-3 px-4 text-looop-muted">Siap didistribusikan ke pengepul/industri daur ulang</td>
              </tr>
              <tr className="hover:bg-looop-bg/50">
                <td className="py-3 px-4 font-bold text-looop-text">Pengajuan Pencairan Diproses</td>
                <td className="py-3 px-4 font-mono font-bold text-looop-text">{payouts.length}</td>
                <td className="py-3 px-4 text-looop-muted">Pencairan</td>
                <td className="py-3 px-4 text-looop-muted">Transfer bank dan penarikan tunai terjadwal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
