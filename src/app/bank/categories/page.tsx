"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export default function BankCategoriesPage() {
  const { state, mounted } = useAppStore();

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-looop-muted">
        Memuat katalog kategori sampah...
      </div>
    );
  }

  // Derive categories from default master categories and current bank prices
  const currentBank = state.wasteBanks[0] || state.wasteBanks[0];
  
  // Categorized item catalogue
  const defaultCategories = [
    {
      id: "cat-plastik",
      name: "Plastik Daur Ulang",
      code: "PLST",
      description: "Sampah jenis botol, wadah, dan kemasan plastik bening atau berwarna.",
      items: [
        { id: "item-1", name: "Botol PET Bening", unit: "kg" },
        { id: "item-4", name: "Gelas Plastik Bersih", unit: "kg" },
        { id: "item-5", name: "Tutup Botol / HDPE", unit: "kg" }
      ]
    },
    {
      id: "cat-kertas",
      name: "Kertas & Karton",
      code: "KRTS",
      description: "Kardus bekas kemasan, kertas arsip, koran, dan majalah.",
      items: [
        { id: "item-2", name: "Kardus Bekas Tebal", unit: "kg" },
        { id: "item-6", name: "Koran Bekas", unit: "kg" },
        { id: "item-7", name: "Kertas HVS Putih", unit: "kg" }
      ]
    },
    {
      id: "cat-logam",
      name: "Logam & Kaleng",
      code: "LGM",
      description: "Aluminium, kaleng susu/makanan, seng, dan potongan besi layak daur.",
      items: [
        { id: "item-3", name: "Kaleng Minuman Alumunium", unit: "kg" },
        { id: "item-8", name: "Besi Campur", unit: "kg" }
      ]
    },
    {
      id: "cat-kaca",
      name: "Kaca & Beling",
      code: "KCA",
      description: "Botol sirup, botol kecap, toples kaca utuh tanpa retak.",
      items: [
        { id: "item-9", name: "Botol Kaca Utuh", unit: "kg" }
      ]
    },
    {
      id: "cat-minyak",
      name: "Minyak Jelantah",
      code: "MJL",
      description: "Minyak goreng bekas pakai yang telah disaring bersih.",
      items: [
        { id: "item-10", name: "Minyak Jelantah Saring", unit: "liter" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Kategori & Jenis Sampah Daur Ulang
        </h1>
        <p className="text-sm text-looop-muted">
          Katalog standar kategori sampah anorganik yang dapat diterima oleh {currentBank?.name || "Bank Sampah"}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultCategories.map((cat) => (
          <Card key={cat.id} className="p-5 flex flex-col justify-between hover:shadow-card-hover transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-looop-accent/30 text-looop-primary flex items-center justify-center font-bold">
                  {cat.name.charAt(0)}
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-looop-bg font-mono font-medium text-looop-muted border border-looop-border">
                  {cat.code}
                </span>
              </div>
              <CardTitle className="text-base mb-1">{cat.name}</CardTitle>
              <CardDescription className="mb-4 text-xs">{cat.description}</CardDescription>
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
