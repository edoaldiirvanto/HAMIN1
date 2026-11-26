import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function ExploreWasteBanksPage() {
  const wasteBanks = await prisma.wasteBank.findMany({
    include: {
      region: true,
      prices: {
        include: { wasteItem: true },
      },
    },
  });

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-lg font-bold text-looop-text">Jelajahi Bank Sampah</h1>
        <p className="text-xs text-looop-muted">
          Daftar bank sampah terdaftar dan harga beli sampah resmi di wilayah Anda.
        </p>
      </div>

      <div className="space-y-4">
        {wasteBanks.map((bank) => (
          <Card key={bank.id} className="p-4 space-y-3">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-looop-text">{bank.name}</h3>
                <span className="text-[11px] font-medium bg-emerald-50 text-looop-success px-2 py-0.5 rounded-full border border-emerald-200">
                  {bank.code}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-looop-muted mt-1">
                <MapPin className="w-3.5 h-3.5 text-looop-secondary flex-shrink-0" />
                <span>{bank.address}, {bank.region.village}, {bank.region.district}</span>
              </div>
              {bank.operatingHours && (
                <div className="flex items-center gap-1.5 text-xs text-looop-muted mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-looop-muted flex-shrink-0" />
                  <span>{bank.operatingHours}</span>
                </div>
              )}
            </div>

            <div className="bg-looop-bg rounded-lg p-3 border border-looop-border">
              <div className="text-xs font-semibold text-looop-text mb-2">Harga Beli Sampah:</div>
              <div className="grid grid-cols-2 gap-2">
                {bank.prices.map((p) => (
                  <div key={p.id} className="text-xs bg-white p-2 rounded border border-looop-border">
                    <div className="text-looop-muted text-[11px]">{p.wasteItem.name}</div>
                    <div className="font-bold text-looop-text">
                      Rp{p.pricePerKg.toLocaleString("id-ID")}/kg
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href={`/citizen/deposit?bankId=${bank.id}`}>
              <Button variant="secondary" size="sm" className="w-full gap-1.5">
                <span>Ajukan Penyetoran Sampah</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
