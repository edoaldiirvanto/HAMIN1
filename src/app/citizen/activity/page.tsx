import { Card } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function CitizenActivityPage() {
  const user = await prisma.user.findFirst({
    where: { role: "CITIZEN" },
    include: {
      deposits: {
        orderBy: { createdAt: "desc" },
        include: {
          wasteBank: true,
          items: { include: { wasteItem: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-lg font-bold text-looop-text">Aktivitas & Riwayat Transaksi</h1>
        <p className="text-xs text-looop-muted">
          Pantau status penimbangan dan konfirmasi hasil penyetoran sampah Anda.
        </p>
      </div>

      <div className="space-y-3">
        {user?.deposits.map((dep) => (
          <Card key={dep.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-looop-text block">
                  {dep.code}
                </span>
                <span className="text-[11px] text-looop-muted">
                  {dep.wasteBank.name} • {formatDate(dep.createdAt)}
                </span>
              </div>
              <Badge variant={getStatusBadgeVariant(dep.status)}>
                {dep.status}
              </Badge>
            </div>

            {/* Breakdown Items */}
            <div className="bg-looop-bg p-2.5 rounded-lg text-xs space-y-1.5 border border-looop-border">
              {dep.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[11px]">
                  <span className="text-looop-text">{item.wasteItem.name}</span>
                  <span className="font-semibold text-looop-text">
                    {item.actualKg > 0 ? `${item.actualKg} kg (aktual)` : `${item.estimatedKg} kg (est)`}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-looop-border">
              <span className="text-looop-muted">Total Transaksi:</span>
              <span className="font-bold text-sm text-looop-primary">
                {formatRupiah(dep.totalActual || dep.totalEstimated)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
