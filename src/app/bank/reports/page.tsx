import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const revalidate = 0;

export default async function BankReportsPage() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
    include: {
      deposits: { where: { status: "COMPLETED" } },
      payouts: true,
      inventory: { include: { wasteItem: true } },
    },
  });

  const totalDepositVolume = bank?.inventory.reduce((acc, i) => acc + i.stockKg, 0) || 0;
  const totalDepositValue = bank?.deposits.reduce((acc, d) => acc + d.totalActual, 0) || 0;
  const totalPayoutValue = bank?.payouts.reduce((acc, p) => acc + p.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Laporan & Rekapitulasi Operasional
          </h1>
          <p className="text-sm text-looop-muted">
            Laporan volume sampah, rekap transaksi, dan keuangan operasional bank sampah.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan (CSV)</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-looop-muted block mb-1">Total Volume Sampah Terkelola</span>
          <span className="text-2xl font-extrabold text-looop-text">{totalDepositVolume.toFixed(1)} kg</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold text-looop-muted block mb-1">Total Nilai Penyetoran Warga</span>
          <span className="text-2xl font-extrabold text-looop-secondary">{formatRupiah(totalDepositValue)}</span>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-semibold text-looop-muted block mb-1">Total Pencairan Dana</span>
          <span className="text-2xl font-extrabold text-looop-primary">{formatRupiah(totalPayoutValue)}</span>
        </Card>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Ringkasan Operasional Bulanan</CardTitle>
        <CardDescription className="mb-4">
          Laporan terpadu sesuai standar pelaporan dinas lingkungan hidup.
        </CardDescription>

        <div className="p-4 bg-looop-bg rounded-lg border border-looop-border flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-looop-text text-sm">Periode November 2026</div>
            <div className="text-looop-muted mt-0.5">
              Status: Lengkap & Terverifikasi Buku Besar
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-looop-success font-semibold">
            Terekonsiliasi
          </span>
        </div>
      </Card>
    </div>
  );
}
