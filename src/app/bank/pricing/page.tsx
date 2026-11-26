import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function BankPricingPage() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
    include: {
      prices: {
        include: { wasteItem: { include: { category: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Penetapan Harga Sampah (Bank-Specific Pricing)
        </h1>
        <p className="text-sm text-looop-muted">
          Setiap bank sampah berwenang menentukan harga beli sendiri sesuai PRD v1.1 Bagian 3.2.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Daftar Harga Beli Aktif</CardTitle>
        <CardDescription className="mb-4">
          Harga ini menjadi snapshot acuan saat transaksi penimbangan diselesaikan.
        </CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">Jenis Sampah</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Satuan</th>
                <th className="py-3 px-4">Harga Beli per Satuan</th>
                <th className="py-3 px-4">Status Penerimaan</th>
                <th className="py-3 px-4">Berlaku Sejak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {bank?.prices.map((p) => (
                <tr key={p.id} className="hover:bg-looop-bg/50">
                  <td className="py-3 px-4 font-bold text-looop-text">{p.wasteItem.name}</td>
                  <td className="py-3 px-4 text-looop-muted">{p.wasteItem.category.name}</td>
                  <td className="py-3 px-4 font-mono">{p.wasteItem.unit}</td>
                  <td className="py-3 px-4 font-bold text-base text-looop-secondary">
                    {formatRupiah(p.pricePerKg)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-looop-success border border-emerald-200">
                      Menerima
                    </span>
                  </td>
                  <td className="py-3 px-4 text-looop-muted">{formatDate(p.effectiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
