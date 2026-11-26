"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface DepositDetail {
  id: string;
  code: string;
  status: string;
  citizen: { name: string; phone: string };
  notes?: string;
  items: {
    id: string;
    wasteItemId: string;
    estimatedKg: number;
    actualKg: number;
    priceSnapshot: number;
    subtotal: number;
    wasteItem: { name: string };
  }[];
}

function WeighingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const depositIdParam = searchParams.get("depositId");

  const [deposits, setDeposits] = useState<DepositDetail[]>([]);
  const [selectedId, setSelectedId] = useState(depositIdParam || "");
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [weighingNotes, setWeighingNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/bank/deposits")
      .then((res) => res.json())
      .then((data: DepositDetail[]) => {
        setDeposits(data);
        if (!selectedId && data.length > 0) {
          setSelectedId(data[0].id);
        }
      });
  }, [selectedId]);

  const activeDeposit = deposits.find((d) => d.id === selectedId);

  useEffect(() => {
    if (activeDeposit) {
      const initialWeights: Record<string, number> = {};
      activeDeposit.items.forEach((item) => {
        initialWeights[item.id] = item.actualKg > 0 ? item.actualKg : item.estimatedKg;
      });
      setWeights(initialWeights);
    }
  }, [activeDeposit]);

  const handleWeightChange = (itemId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setWeights((prev) => ({ ...prev, [itemId]: num }));
  };

  const calculatedTotal = activeDeposit
    ? activeDeposit.items.reduce((acc, item) => {
        const actual = weights[item.id] || 0;
        return acc + Math.round(actual * item.priceSnapshot);
      }, 0)
    : 0;

  const handleSaveWeighing = async (complete: boolean) => {
    if (!activeDeposit) return;
    setLoading(true);

    try {
      const payload = {
        depositId: activeDeposit.id,
        status: complete ? "COMPLETED" : "WEIGHING",
        weighingNotes,
        items: activeDeposit.items.map((item) => ({
          id: item.id,
          actualKg: weights[item.id] || 0,
        })),
      };

      const res = await fetch("/api/bank/weighing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/bank");
        }, 1500);
      } else {
        alert("Gagal menyimpan hasil penimbangan");
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Form Penimbangan & Verifikasi Lapangan
        </h1>
        <p className="text-sm text-looop-muted">
          Pemeriksaan kondisi fisik sampah, pencatatan berat timbangan aktual, dan penambahan saldo otomatis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-1">
          <CardTitle className="text-sm mb-3">Pilih Antrean Penyetoran</CardTitle>
          <div className="space-y-2">
            {deposits.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`w-full text-left p-3 rounded-button border text-xs transition ${
                  selectedId === d.id
                    ? "border-looop-secondary bg-looop-secondary/10"
                    : "border-looop-border hover:bg-looop-bg"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-looop-text">{d.code}</span>
                  <Badge variant={getStatusBadgeVariant(d.status)}>{d.status}</Badge>
                </div>
                <div className="font-semibold text-looop-text">{d.citizen.name}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          {success ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-emerald-100 text-looop-success rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-looop-text mb-1">
                Penimbangan Selesai & Transaksi Berhasil!
              </h3>
              <p className="text-xs text-looop-muted">
                Saldo warga telah dikreditkan ke buku besar digital dan stok persediaan bank bertambah.
              </p>
            </div>
          ) : activeDeposit ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-looop-border">
                <div>
                  <h3 className="text-base font-bold text-looop-text">
                    {activeDeposit.code} — {activeDeposit.citizen.name}
                  </h3>
                  <p className="text-xs text-looop-muted">
                    Telp: {activeDeposit.citizen.phone || "-"} • Catatan Warga: {activeDeposit.notes || "Tidak ada"}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(activeDeposit.status)}>
                  {activeDeposit.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-looop-text">
                  Masukkan Hasil Timbangan Aktual (kg):
                </label>
                {activeDeposit.items.map((item) => {
                  const actual = weights[item.id] || 0;
                  const itemSubtotal = Math.round(actual * item.priceSnapshot);
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-looop-bg rounded-lg border border-looop-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-looop-text">{item.wasteItem.name}</div>
                        <div className="text-[11px] text-looop-muted">
                          Estimasi awal: {item.estimatedKg} kg • Harga: {formatRupiah(item.priceSnapshot)}/kg
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-28">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            value={weights[item.id] || ""}
                            onChange={(e) => handleWeightChange(item.id, e.target.value)}
                            placeholder="0 kg"
                            className="text-right py-1.5 font-bold"
                          />
                        </div>
                        <div className="w-28 text-right font-bold text-looop-primary">
                          {formatRupiah(itemSubtotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <Input
                  label="Catatan Petugas Penimbang"
                  placeholder="Kondisi bersih, kering, layak daur ulang"
                  value={weighingNotes}
                  onChange={(e) => setWeighingNotes(e.target.value)}
                />
              </div>

              <div className="p-4 bg-looop-primary text-white rounded-card flex items-center justify-between">
                <div>
                  <span className="text-xs text-white/80 block">Total Nilai Transaksi Final:</span>
                  <span className="text-2xl font-extrabold">{formatRupiah(calculatedTotal)}</span>
                </div>
                <div className="text-right text-[11px] text-looop-accent">
                  (Nilai transaksi = Berat aktual × Harga snapshot)
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSaveWeighing(false)}
                  disabled={loading}
                >
                  Simpan Draf Timbangan
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => handleSaveWeighing(true)}
                  disabled={loading}
                >
                  {loading ? "Menyelesaikan..." : "Selesaikan & Tambah Saldo Warga"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-looop-muted py-8 text-center">Tidak ada antrean yang dipilih.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function WeighingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-looop-muted">Memuat form penimbangan...</div>}>
      <WeighingContent />
    </Suspense>
  );
}
