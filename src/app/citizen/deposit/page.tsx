"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";

interface WasteBankOption {
  id: string;
  name: string;
  prices: {
    wasteItemId: string;
    pricePerKg: number;
    wasteItem: { name: string; unit: string };
  }[];
}

function DepositContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBankId = searchParams.get("bankId");

  const [banks, setBanks] = useState<WasteBankOption[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>(preselectedBankId || "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/waste-banks")
      .then((res) => res.json())
      .then((data) => {
        setBanks(data);
        if (!selectedBankId && data.length > 0) {
          setSelectedBankId(data[0].id);
        }
      });
  }, [selectedBankId]);

  const activeBank = banks.find((b) => b.id === selectedBankId);

  const handleQtyChange = (itemId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setQuantities((prev) => ({ ...prev, [itemId]: num }));
  };

  const estimatedTotal = activeBank
    ? activeBank.prices.reduce((acc, p) => {
        const qty = quantities[p.wasteItemId] || 0;
        return acc + qty * p.pricePerKg;
      }, 0)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankId) return;

    setLoading(true);
    try {
      const items = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([wasteItemId, estimatedKg]) => ({
          wasteItemId,
          estimatedKg,
        }));

      if (items.length === 0) {
        alert("Pilih minimal satu jenis sampah dengan berat perkiraan > 0");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteBankId: selectedBankId,
          notes,
          items,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/citizen/activity");
        }, 1200);
      } else {
        alert("Gagal mengirim pengajuan");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-lg font-bold text-looop-text">Pengajuan Setor Sampah</h1>
        <p className="text-xs text-looop-muted">
          Pilih bank sampah dan masukkan estimasi berat sampah anorganik Anda.
        </p>
      </div>

      <Card className="p-5">
        {success ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-emerald-100 text-looop-success rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
              ✓
            </div>
            <h3 className="text-base font-bold text-looop-text mb-1">Pengajuan Berhasil Dikirim!</h3>
            <p className="text-xs text-looop-muted">Mengalihkan ke riwayat aktivitas Anda...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-looop-text mb-1.5">
                Pilih Bank Sampah Tujuan
              </label>
              <select
                className="w-full rounded-input border border-looop-border bg-white px-3 py-2 text-sm text-looop-text focus:outline-none focus:ring-1 focus:ring-looop-secondary"
                value={selectedBankId}
                onChange={(e) => {
                  setSelectedBankId(e.target.value);
                  setQuantities({});
                }}
                required
              >
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {activeBank && (
              <div className="space-y-3 pt-2 border-t border-looop-border">
                <label className="block text-xs font-semibold text-looop-text">
                  Daftar Jenis Sampah & Perkiraan Berat (kg)
                </label>
                {activeBank.prices.map((p) => (
                  <div
                    key={p.wasteItemId}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-looop-border bg-looop-bg/50"
                  >
                    <div>
                      <div className="text-xs font-bold text-looop-text">{p.wasteItem.name}</div>
                      <div className="text-[11px] text-looop-secondary font-medium">
                        {formatRupiah(p.pricePerKg)}/{p.wasteItem.unit}
                      </div>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0 kg"
                        value={quantities[p.wasteItemId] || ""}
                        onChange={(e) => handleQtyChange(p.wasteItemId, e.target.value)}
                        className="text-right py-1.5 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Input
                label="Catatan Tambahan (Opsional)"
                placeholder="Misal: Sudah dipilah rapi di dalam karung"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="p-3 bg-looop-bg rounded-lg border border-looop-border flex items-center justify-between text-xs">
              <span className="font-semibold text-looop-muted">Perkiraan Nilai Transaksi:</span>
              <span className="font-bold text-sm text-looop-primary">{formatRupiah(estimatedTotal)}</span>
            </div>

            <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Pengajuan Setoran"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default function DepositPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-looop-muted">Memuat halaman setoran...</div>}>
      <DepositContent />
    </Suspense>
  );
}
