import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function BankCategoriesPage() {
  const categories = await prisma.wasteCategory.findMany({
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Kategori & Jenis Sampah Daur Ulang
        </h1>
        <p className="text-sm text-looop-muted">
          Katalog standar kategori sampah anorganik yang dapat diterima oleh bank sampah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-looop-accent/30 text-looop-primary flex items-center justify-center font-bold mb-3">
                {cat.name.charAt(0)}
              </div>
              <CardTitle className="text-base mb-1">{cat.name}</CardTitle>
              <CardDescription className="mb-4">{cat.description || "Kategori sampah daur ulang"}</CardDescription>
            </div>

            <div className="pt-3 border-t border-looop-border">
              <span className="text-xs font-semibold text-looop-text block mb-2">Item Terdaftar:</span>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((it) => (
                  <span
                    key={it.id}
                    className="text-[11px] bg-looop-bg px-2.5 py-1 rounded text-looop-text border border-looop-border"
                  >
                    {it.name} ({it.unit})
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
