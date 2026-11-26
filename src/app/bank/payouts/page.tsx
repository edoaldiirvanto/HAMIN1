import { Card, CardTitle } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const revalidate = 0;

export default async function BankPayoutsPage() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
    include: {
      payouts: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Kelola Saldo & Pengajuan Pencairan
        </h1>
        <p className="text-sm text-looop-muted">
          Daftar pengajuan pencairan saldo masyarakat via transfer atau uang tunai.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-4">Permintaan Pencairan Dana</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">No. Payout</th>
                <th className="py-3 px-4">Nama Warga</th>
                <th className="py-3 px-4">Metode & Rekening</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {bank?.payouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-looop-muted">
                    Tidak ada pengajuan pencairan yang tertunda saat ini.
                  </td>
                </tr>
              ) : (
                bank?.payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-looop-bg/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-looop-text">{p.code}</td>
                    <td className="py-3 px-4 font-medium text-looop-text">{p.user.name}</td>
                    <td className="py-3 px-4 text-looop-muted">
                      <span className="font-semibold text-looop-text block">{p.method}</span>
                      <span>{p.accountDetails}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-looop-primary">
                      {formatRupiah(p.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(p.status)}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status === "REQUESTED" ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" size="sm" className="h-7 text-xs">
                            Setujui & Bayar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-looop-muted">Selesai</span>
                      )}
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
