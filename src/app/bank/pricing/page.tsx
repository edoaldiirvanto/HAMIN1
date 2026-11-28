"use client";

import React, { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Edit2, Check, X, AlertCircle } from "lucide-react";

export default function BankPricingPage() {
  const { state, mounted, updateWastePrice } = useAppStore();
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat katalog harga...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const prices = currentBank.prices;

  const handleStartEdit = (priceId: string, currentPrice: number) => {
    setEditingPriceId(priceId);
    setNewPriceValue(String(currentPrice));
    setSuccessMsg("");
  };

  const handleSavePrice = (priceId: string) => {
    const val = parseFloat(newPriceValue);
    if (isNaN(val) || val <= 0) return;

    updateWastePrice(currentBank.id, priceId, val);
    setEditingPriceId(null);
    setSuccessMsg("Harga beli berhasil diperbarui dan tersimpan!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

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

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-looop-success rounded-lg text-xs font-semibold">
          {successMsg}
        </div>
      )}

      <Card className="p-6">
        <CardTitle className="mb-2">Daftar Harga Beli Aktif ({prices.length} Komoditas)</CardTitle>
        <CardDescription className="mb-4">
          Harga ini menjadi snapshot acuan saat transaksi penimbangan warga diselesaikan.
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
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {prices.map((p) => {
                const isEditing = editingPriceId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-looop-bg/50 transition">
                    <td className="py-3 px-4 font-bold text-looop-text">{p.wasteItem.name}</td>
                    <td className="py-3 px-4 text-looop-muted">{p.wasteItem.category?.name || "Anorganik"}</td>
                    <td className="py-3 px-4 font-mono">{p.wasteItem.unit}</td>
                    <td className="py-3 px-4 font-bold text-base text-looop-secondary font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={newPriceValue}
                            onChange={(e) => setNewPriceValue(e.target.value)}
                            className="h-8 w-28 text-xs font-mono font-bold"
                          />
                        </div>
                      ) : (
                        formatRupiah(p.pricePerKg)
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-looop-success border border-emerald-200">
                        Menerima
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => handleSavePrice(p.id)}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => setEditingPriceId(null)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2 gap-1 text-looop-muted hover:text-looop-text"
                          onClick={() => handleStartEdit(p.id, p.pricePerKg)}
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Ubah Harga</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
