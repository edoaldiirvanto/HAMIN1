"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useAppStore, DepositRecord } from "@/lib/store";
import { CheckCircle2, AlertCircle, ArrowLeft, Scale, Lock, Clock, Check, Sparkles } from "lucide-react";
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
  const isCompleted = activeDeposit?.status === "COMPLETED";

  // Inisialisasi input berat aktual saat deposit aktif berganti
  useEffect(() => {
    if (activeDeposit) {
      const initial: Record<string, number> = {};
      activeDeposit.items.forEach((it) => {
        initial[it.id] = it.actualKg > 0 ? it.actualKg : it.estimatedKg;
      });
      setWeights(initial);
      setWeighingNotes(activeDeposit.notes || "");
      setSuccess(false);
      setErrorMessage("");
    }
  }, [activeDeposit]);

  const handleWeightChange = (itemId: string, val: string) => {
    if (isCompleted) return; // Read-only protection
    const num = Math.max(0, parseFloat(val) || 0);
    setWeights((prev) => ({ ...prev, [itemId]: num }));
  };

  const calculatedTotal = activeDeposit
    ? isCompleted && activeDeposit.totalActual > 0
      ? activeDeposit.totalActual
      : activeDeposit.items.reduce((acc, it) => {
          const w = weights[it.id] !== undefined ? weights[it.id] : it.estimatedKg;
          return acc + Math.round(w * it.priceSnapshot);
        }, 0)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeposit) return;

    // Strict Guard: jika sudah completed, tolak form submission
    if (isCompleted || activeDeposit.isCredited) {
      setErrorMessage("Transaksi ini sudah berstatus COMPLETED dan saldo sudah dikreditkan.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const actualItems = activeDeposit.items.map((it) => ({
        itemId: it.id,
        actualKg: weights[it.id] !== undefined ? weights[it.id] : it.estimatedKg,
      }));

      const res: any = completeWeighing(activeDeposit.id, actualItems, weighingNotes);
      if (res) {
        if (res.alreadyCompleted) {
          setErrorMessage("Transaksi ini sudah pernah diselesaikan sebelumnya.");
        } else {
          setSuccess(true);
        }
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
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-looop-success text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <div className="font-bold text-sm">Penimbangan Berhasil Disimpan & Diverifikasi!</div>
            <div>
              Saldo sebesar <strong>{formatRupiah(calculatedTotal)}</strong> telah otomatis dikreditkan ke nasabah dan dicatat pada buku besar mutasi. Transaksi telah dikunci.
            </div>
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
        {/* Kolom Kiri: Antrian Penimbangan */}
        <Card className="p-4 lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-looop-border">
            <span className="text-xs font-bold text-looop-text uppercase tracking-wider">
              Antrian Setoran Masuk
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-looop-bg text-looop-muted font-bold">
              {deposits.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {deposits.map((dep) => {
              const isSelected = dep.id === selectedId;
              const isDepDone = dep.status === "COMPLETED";

              return (
                <button
                  key={dep.id}
                  type="button"
                  onClick={() => setSelectedId(dep.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-looop-secondary bg-looop-secondary/5 ring-1 ring-looop-secondary"
                      : "border-looop-border hover:bg-looop-bg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-looop-text font-mono">{dep.code}</span>
                    <Badge variant={getStatusBadgeVariant(dep.status)}>{dep.status}</Badge>
                  </div>
                  <div className="text-xs font-semibold text-looop-text">{dep.citizenName}</div>
                  <div className="text-[11px] text-looop-muted flex items-center justify-between mt-1">
                    <span>{dep.items.length} jenis komoditas</span>
                    <span className="font-mono font-bold text-looop-secondary">
                      {formatRupiah(isDepDone ? dep.totalActual : dep.totalEstimated)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Kolom Kanan: Form Penimbangan */}
        <Card className="p-6 lg:col-span-2">
          {activeDeposit ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Rincian Transaksi */}
              <div className="p-4 rounded-lg bg-looop-bg border border-looop-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-looop-border">
                  <div>
                    <div className="text-xs text-looop-muted font-semibold">Kode Transaksi</div>
                    <div className="text-base font-extrabold text-looop-text font-mono">
                      {activeDeposit.code}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(activeDeposit.status)}>
                      {activeDeposit.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-looop-muted block text-[10px]">Nama Nasabah</span>
                    <span className="font-bold text-looop-text">{activeDeposit.citizenName}</span>
                  </div>
                  <div>
                    <span className="text-looop-muted block text-[10px]">No. Telepon</span>
                    <span className="font-semibold text-looop-text">{activeDeposit.citizenPhone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-looop-muted block text-[10px]">Tgl Pengajuan</span>
                    <span className="font-semibold text-looop-text">{formatDate(activeDeposit.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-looop-muted block text-[10px]">Estimasi Awal</span>
                    <span className="font-bold text-looop-secondary font-mono">
                      {formatRupiah(activeDeposit.totalEstimated)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Banner untuk Transaksi COMPLETED */}
              {isCompleted && (
                <div className="p-4 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-looop-text space-y-1">
                  <div className="flex items-center gap-2 font-bold text-looop-success">
                    <Check className="w-4 h-4" />
                    <span>Transaksi Ini Telah Selesai & Saldo Berhasil Dikreditkan</span>
                  </div>
                  <p className="text-looop-muted text-[11px] pl-6">
                    Hak saldo sebesar <strong>{formatRupiah(activeDeposit.totalActual)}</strong> telah dikreditkan ke rekening nasabah pada buku besar mutasi. Data penimbangan bersifat read-only untuk menjaga integritas data.
                  </p>
                </div>
              )}

              {/* Rincian Komoditas & Input Berat Aktual */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-looop-text">
                    Hasil Timbangan Fisik (kg):
                  </div>
                  {isCompleted && (
                    <span className="text-[11px] text-looop-muted flex items-center gap-1 font-semibold">
                      <Lock className="w-3 h-3 text-looop-muted" /> Mode Read-Only (Terkunci)
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {activeDeposit.items.map((item) => {
                    const currentWeight = isCompleted && item.actualKg > 0
                      ? item.actualKg
                      : weights[item.id] !== undefined
                      ? weights[item.id]
                      : item.estimatedKg;
                    const subtotal = Math.round(currentWeight * item.priceSnapshot);

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-lg border ${
                          isCompleted
                            ? "bg-slate-50/80 border-slate-200"
                            : "bg-looop-bg/50 border-looop-border"
                        } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                      >
                        <div>
                          <div className="text-xs font-bold text-looop-text">{item.wasteItemName}</div>
                          <div className="text-[11px] text-looop-muted">
                            Estimasi Awal: {item.estimatedKg} kg &bull; Snapshot Harga: {formatRupiah(item.priceSnapshot)}/kg
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
                              disabled={isCompleted}
                              value={currentWeight}
                              onChange={(e) => handleWeightChange(item.id, e.target.value)}
                              className={`h-9 text-xs text-right font-mono font-bold ${
                                isCompleted
                                  ? "bg-slate-100 text-slate-700 cursor-not-allowed border-slate-300"
                                  : "bg-white text-looop-text"
                              }`}
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
                  disabled={isCompleted}
                  value={weighingNotes}
                  onChange={(e) => setWeighingNotes(e.target.value)}
                  placeholder="Contoh: Berat bersih setelah pengurangan karung 0.2 kg."
                  className={`w-full p-2.5 text-xs border rounded-button focus:outline-none ${
                    isCompleted
                      ? "bg-slate-100 text-slate-600 border-slate-200 cursor-not-allowed"
                      : "bg-white border-looop-border focus:border-looop-secondary"
                  }`}
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

              {/* Tombol Aksi Penyelesaian */}
              <div className="flex gap-3">
                {isCompleted ? (
                  <Button
                    type="button"
                    disabled
                    variant="outline"
                    className="flex-1 font-bold text-xs h-10 gap-2 bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 text-looop-success" />
                    <span>Transaksi Sudah Diselesaikan & Saldo Terkredit</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={loading}
                    className="flex-1 font-bold text-xs h-10 gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{loading ? "Menyimpan & Mengkreditkan..." : "Selesaikan & Kreditkan Saldo"}</span>
                  </Button>
                )}
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
