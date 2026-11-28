"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { useAppStore, DepositRecord } from "@/lib/store";
import { CheckCircle2, AlertCircle, ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";

function WeighingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const depositIdParam = searchParams.get("depositId");

  const { state, mounted, completeWeighing } = useAppStore();

  const currentBank = state.wasteBanks[0];
  const deposits = state.deposits.filter((d) => d.wasteBankId === currentBank.id);

  const [selectedId, setSelectedId] = useState<string>(depositIdParam || "");
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [weighingNotes, setWeighingNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (mounted && deposits.length > 0) {
      if (!selectedId || !deposits.some((d) => d.id === selectedId)) {
        const matchingParam = depositIdParam && deposits.some((d) => d.id === depositIdParam);
        setSelectedId(matchingParam ? (depositIdParam as string) : deposits[0].id);
      }
    }
  }, [mounted, deposits, selectedId, depositIdParam]);

  const activeDeposit = deposits.find((d) => d.id === selectedId);

  // Inisialisasi input berat aktual saat deposit aktif berganti
  useEffect(() => {
    if (activeDeposit) {
      const initial: Record<string, number> = {};
      activeDeposit.items.forEach((it) => {
        initial[it.id] = it.actualKg > 0 ? it.actualKg : it.estimatedKg;
      });
      setWeights(initial);
      setWeighingNotes(activeDeposit.notes || "");
    }
  }, [activeDeposit]);

  const handleWeightChange = (itemId: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setWeights((prev) => ({ ...prev, [itemId]: num }));
  };

  const calculatedTotal = activeDeposit
    ? activeDeposit.items.reduce((acc, it) => {
        const w = weights[it.id] !== undefined ? weights[it.id] : it.estimatedKg;
        return acc + Math.round(w * it.priceSnapshot);
      }, 0)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeposit) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const actualItems = activeDeposit.items.map((it) => ({
        itemId: it.id,
        actualKg: weights[it.id] !== undefined ? weights[it.id] : it.estimatedKg,
      }));

      const res = completeWeighing(activeDeposit.id, actualItems, weighingNotes);
      if (res) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/bank/deposits");
        }, 1500);
      } else {
        setErrorMessage("Gagal memproses penimbangan.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses penimbangan.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat antrian penimbangan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/bank/deposits" className="p-1 rounded hover:bg-looop-bg text-looop-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-looop-text tracking-tight">
            Form Penimbangan & Verifikasi Lapangan
          </h1>
          <p className="text-sm text-looop-muted">
            Timbang berat aktual fisik dan konfirmasi hasil perhitungan untuk kredit saldo nasabah.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-looop-success text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <div className="font-bold">Penimbangan Berhasil Disimpan & Diverifikasi!</div>
            <div>Saldo nasabah telah otomatis dikreditkan dan stok persediaan gudang bertambah. Mengarahkan...</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Antrian Penyetoran Masuk */}
        <Card className="p-5 lg:col-span-1 space-y-3">
          <CardTitle className="text-sm">Antrian Pengajuan ({deposits.length})</CardTitle>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {deposits.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedId(d.id);
                  setSuccess(false);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedId === d.id
                    ? "border-looop-secondary bg-looop-accent/20 ring-1 ring-looop-secondary/50"
                    : "border-looop-border bg-white hover:bg-looop-bg"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono font-bold text-looop-text">{d.code}</span>
                  <Badge variant={getStatusBadgeVariant(d.status)}>
                    {d.status}
                  </Badge>
                </div>
                <div className="text-xs font-medium text-looop-text">{d.citizenName}</div>
                <div className="text-[11px] text-looop-muted flex justify-between mt-1">
                  <span>{d.items.length} jenis sampah</span>
                  <span className="font-bold text-looop-primary font-mono">
                    {formatRupiah(d.status === "COMPLETED" ? d.totalActual : d.totalEstimated)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Kolom Kanan: Form Penimbangan Aktual */}
        <Card className="p-6 lg:col-span-2 space-y-5">
          {activeDeposit ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-looop-border gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-looop-primary">{activeDeposit.code}</div>
                  <div className="text-lg font-bold text-looop-text">Nasabah: {activeDeposit.citizenName}</div>
                  <div className="text-xs text-looop-muted">Kontak: {activeDeposit.citizenPhone}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-looop-muted block">Status Saat Ini:</span>
                  <Badge variant={getStatusBadgeVariant(activeDeposit.status)}>
                    {activeDeposit.status}
                  </Badge>
                </div>
              </div>

              {/* Rincian Komoditas & Input Berat Aktual */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-looop-text">
                  Masukkan Hasil Timbangan Fisik (kg):
                </div>

                <div className="space-y-2.5">
                  {activeDeposit.items.map((item) => {
                    const currentWeight = weights[item.id] !== undefined ? weights[item.id] : item.estimatedKg;
                    const subtotal = Math.round(currentWeight * item.priceSnapshot);

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-lg border border-looop-border bg-looop-bg/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-looop-text">{item.wasteItemName}</div>
                          <div className="text-[11px] text-looop-muted">
                            Estimasi Awal: {item.estimatedKg} kg • Snapshot Harga: {formatRupiah(item.priceSnapshot)}/kg
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-32">
                            <label className="block text-[10px] text-looop-muted mb-0.5 font-semibold">
                              Berat Aktual (kg):
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              value={currentWeight}
                              onChange={(e) => handleWeightChange(item.id, e.target.value)}
                              className="h-9 text-xs text-right font-mono bg-white font-bold"
                              required
                            />
                          </div>

                          <div className="text-right w-28">
                            <span className="text-[10px] text-looop-muted block">Subtotal Nilai:</span>
                            <span className="text-xs font-mono font-bold text-looop-primary">
                              {formatRupiah(subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Petugas */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-looop-text">
                  Catatan Verifikasi Penimbangan
                </label>
                <textarea
                  rows={2}
                  value={weighingNotes}
                  onChange={(e) => setWeighingNotes(e.target.value)}
                  placeholder="Contoh: Berat bersih setelah pengurangan karung 0.2 kg."
                  className="w-full p-2.5 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
                />
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 bg-looop-primary/5 rounded-lg border border-looop-primary/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-looop-muted block">Total Hak Saldo Warga:</span>
                  <span className="text-2xl font-extrabold text-looop-primary font-mono">
                    {formatRupiah(calculatedTotal)}
                  </span>
                </div>
                <div className="text-right text-xs text-looop-muted">
                  Snapshot harga terkunci & ledger append-only
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={loading}
                  className="flex-1 font-bold text-xs h-10 gap-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>{loading ? "Menyimpan Hasil..." : "Selesaikan & Kreditkan Saldo"}</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 text-xs text-looop-muted">
              Pilih salah satu antrian pengajuan di sebelah kiri untuk memulai penimbangan.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function BankWeighingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs">Memuat modul penimbangan...</div>}>
      <WeighingContent />
    </Suspense>
  );
}
