import { Card, CardTitle } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function BankDepositsListPage() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
    include: {
      deposits: {
        orderBy: { createdAt: "desc" },
        include: { citizen: true, items: { include: { wasteItem: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Daftar Seluruh Transaksi Penyetoran Masuk
          </h1>
          <p className="text-sm text-looop-muted">
            Semua transaksi warga yang diajukan, sedang ditimbang, atau telah selesai.
          </p>
        </div>
        <Link href="/bank/weighing">
          <Button variant="secondary" size="sm">
            Buka Form Penimbangan Baru
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-4">Riwayat Penyetoran Sampah</CardTitle>
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
              {bank?.deposits.map((dep) => (
                <tr key={dep.id} className="hover:bg-looop-bg/50">
                  <td className="py-3 px-4 font-mono font-bold text-looop-text">{dep.code}</td>
                  <td className="py-3 px-4 font-medium text-looop-text">
                    <div>{dep.citizen.name}</div>
                    <div className="text-[10px] text-looop-muted">{dep.citizen.phone || "-"}</div>
                  </td>
                  <td className="py-3 px-4 text-looop-muted">{formatDate(dep.createdAt)}</td>
                  <td className="py-3 px-4 text-looop-muted">
                    {dep.items.map((i) => i.wasteItem.name).join(", ")}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(dep.status)}>
                      {dep.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-looop-primary">
                    {formatRupiah(dep.totalActual || dep.totalEstimated)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/bank/weighing?depositId=${dep.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        {dep.status === "COMPLETED" ? "Lihat Detail" : "Proses Timbang"}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
