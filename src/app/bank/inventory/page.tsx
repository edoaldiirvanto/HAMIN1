"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function BankInventoryPage() {
  const { state, mounted } = useAppStore();

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat persediaan gudang...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const inventory = currentBank.inventory;
  const totalStock = inventory.reduce((acc, i) => acc + i.stockKg, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Persediaan Sampah & Manajemen Stok
        </h1>
        <p className="text-sm text-looop-muted">
          Pencatatan persediaan sampah di gudang yang bertambah secara transaksional saat penimbangan selesai.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between sm:col-span-1">
          <div>
            <span className="text-xs font-semibold text-looop-muted block mb-1">Total Stok di Gudang</span>
            <span className="text-2xl font-extrabold text-looop-text font-mono">{totalStock.toFixed(1)} kg</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-looop-accent/40 text-looop-primary flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Stok per Komoditas Sampah ({inventory.length} Komoditas)</CardTitle>
        <CardDescription className="mb-4">
          Stok otomatis sinkron dengan seluruh riwayat transaksi penimbangan nasabah.
        </CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">Nama Komoditas</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Jumlah Stok Tersimpan</th>
                <th className="py-3 px-4">Kondisi Persediaan</th>
                <th className="py-3 px-4">Pembaruan Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {inventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-looop-bg/50 transition">
                  <td className="py-3 px-4 font-bold text-looop-text">{inv.wasteItemName}</td>
                  <td className="py-3 px-4 text-looop-muted">{inv.categoryName}</td>
                  <td className="py-3 px-4 font-extrabold text-base text-looop-primary font-mono">
                    {inv.stockKg.toFixed(1)} {inv.unit}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-looop-info border border-blue-200">
                      Tersedia di Gudang
                    </span>
                  </td>
                  <td className="py-3 px-4 text-looop-muted">{formatDate(inv.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
