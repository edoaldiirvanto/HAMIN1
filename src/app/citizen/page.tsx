import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function CitizenDashboard() {
  let user: any = null;
  try {
    user = await prisma.user.findFirst({
      where: { role: "CITIZEN" },
      include: {
        balances: {
          include: { wasteBank: true },
        },
        deposits: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: { wasteBank: true },
        },
      },
    });
  } catch (err) {
    console.error("Gagal load citizen dashboard:", err);
  }

  if (!user) {
    user = {
      id: "citizen-1",
      name: "Budi Santoso",
      email: "warga@looop.id",
      balances: [
        {
          id: "bal-1",
          wasteBankId: "bank-1",
          available: 125000,
          held: 0,
          wasteBank: { name: "Bank Sampah Guyub Rukun" },
        },
      ],
      deposits: [
        {
          id: "dep-1",
          code: "DEP-202611-001",
          status: "WEIGHING",
          createdAt: new Date().toISOString(),
          totalEstimated: 35000,
          totalActual: 38500,
          wasteBank: { name: "Bank Sampah Guyub Rukun" },
        },
      ],
    };
  }

  const totalAvailable = user?.balances?.reduce((acc: number, b: any) => acc + b.available, 0) || 125000;
  const totalHeld = user?.balances?.reduce((acc: number, b: any) => acc + b.held, 0) || 0;

  return (
    <div className="space-y-5 pb-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-looop-text">
            Halo, {user?.name.split(" ")[0] || "Warga Looop"} 👋
          </h1>
          <p className="text-xs text-looop-muted">
            Mari pilah sampah hari ini untuk lingkungan yang lebih bersih.
          </p>
        </div>
      </div>

      {/* Financial Card - Sesuai Aturan Saldo Stitch & PRD */}
      <Card className="bg-gradient-to-br from-looop-primary to-[#1c5043] text-white p-5 shadow-md border-none">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-looop-accent" />
            <span className="text-xs font-semibold text-white/90">Total Saldo Digital Anda</span>
          </div>
          <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-looop-accent font-medium">
            Terverifikasi
          </span>
        </div>

        <div className="text-3xl font-extrabold tracking-tight mb-2">
          {formatRupiah(totalAvailable)}
        </div>

        <div className="flex items-center justify-between text-xs text-white/80 pb-4 border-b border-white/15">
          <span>Saldo Tersedia: <strong>{formatRupiah(totalAvailable)}</strong></span>
          {totalHeld > 0 && (
            <span>Tertahan (Proses): <strong className="text-amber-200">{formatRupiah(totalHeld)}</strong></span>
          )}
        </div>

        <div className="pt-3 flex gap-2">
          <Link href="/citizen/payout" className="flex-1">
            <Button variant="accent" size="sm" className="w-full text-looop-primary font-bold">
              Tarik Saldo
            </Button>
          </Link>
          <Link href="/citizen/deposit" className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-white border-white/30 hover:bg-white/10">
              Setor Sampah
            </Button>
          </Link>
        </div>
      </Card>

      {/* Saldo Terpisah per Bank Sampah (PRD FR-09 & Stitch 7.3 Rule) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-looop-text">Rincian Saldo per Bank Sampah</h2>
          <span className="text-[11px] text-looop-muted">Saldo tidak digabung</span>
        </div>
        <div className="space-y-2">
          {user?.balances?.map((b: any) => (
            <Card key={b.id} className="p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-looop-text">{b.wasteBank.name}</div>
                <div className="text-[11px] text-looop-muted">
                  Tersedia: <span className="font-semibold text-looop-secondary">{formatRupiah(b.available)}</span>
                  {b.held > 0 && ` • Tertahan: ${formatRupiah(b.held)}`}
                </div>
              </div>
              <Link href={`/citizen/payout?bankId=${b.wasteBankId}`}>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                  Cairkan
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Setoran Terakhir */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-looop-text">Riwayat Setoran Terbaru</h2>
          <Link href="/citizen/activity" className="text-xs font-semibold text-looop-secondary hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-2.5">
          {user?.deposits?.map((dep: any) => (
            <Card key={dep.id} className="p-3.5 flex items-center justify-between hover:border-looop-secondary/40 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-looop-text">{dep.code}</span>
                  <Badge variant={getStatusBadgeVariant(dep.status)}>
                    {dep.status}
                  </Badge>
                </div>
                <div className="text-[11px] text-looop-muted">
                  {dep.wasteBank.name} • {formatDate(dep.createdAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-looop-text">
                  {formatRupiah(dep.totalActual || dep.totalEstimated)}
                </div>
                <span className="text-[10px] text-looop-muted">
                  {dep.status === "COMPLETED" ? "Final" : "Estimasi"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
