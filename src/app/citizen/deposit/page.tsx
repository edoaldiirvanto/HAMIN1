"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { MapPin, Info, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function DepositContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBankId = searchParams.get("bankId");

  const { state, mounted, addDeposit } = useAppStore();
  const [selectedBankId, setSelectedBankId] = useState<string>(preselectedBankId || "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const banks = state.wasteBanks;

  useEffect(() => {
    if (mounted && banks.length > 0) {
      if (!selectedBankId || !banks.some((b) => b.id === selectedBankId)) {
        setSelectedBankId(preselectedBankId && banks.some((b) => b.id === preselectedBankId) ? preselectedBankId : banks[0].id);
      }
    }
  }, [mounted, banks, selectedBankId, preselectedBankId]);

  const activeBank = banks.find((b) => b.id === selectedBankId) || banks[0];

  const handleQtyChange = (itemId: string, val: string) => {
    const num = Math.max(0, parseFloat(val) || 0);
    setQuantities((prev) => ({ ...prev, [itemId]: num }));
    if (errorMessage) setErrorMessage("");
  };

  const estimatedTotal = activeBank
    ? activeBank.prices.reduce((acc, p) => {
        const qty = quantities[p.wasteItemId] || 0;
        return acc + qty * p.pricePerKg;
      }, 0)
    : 0;

  const totalKg = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    if (!selectedBankId) {
      setErrorMessage("Silakan pilih unit bank sampah tujuan.");
      return;
    }

    const itemsToSubmit = activeBank.prices
      .filter((p) => (quantities[p.wasteItemId] || 0) > 0)
      .map((p) => ({
        wasteItemId: p.wasteItemId,
        wasteItemName: p.wasteItem.name,
        unit: p.wasteItem.unit,
        estimatedKg: quantities[p.wasteItemId],
        priceSnapshot: p.pricePerKg,
      }));

    if (itemsToSubmit.length === 0) {
      setErrorMessage("Pilih minimal satu jenis sampah dengan estimasi berat lebih dari 0 kg.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const created = addDeposit({
        wasteBankId: selectedBankId,
        notes: notes.trim(),
        items: itemsToSubmit,
      });

      setSubmittedCode(created.code);
      setSuccess(true);
      setTimeout(() => {
        router.push("/citizen/activity");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan pengajuan penyetoran.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-looop-muted">
        Memuat formulir pengajuan...
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/citizen" className="p-1 rounded hover:bg-looop-bg text-looop-muted">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-looop-text">Ajukan Penyetoran Sampah</h1>
          <p className="text-xs text-looop-muted">
            Pilah dari rumah, tentukan perkiraan berat, dan serahkan ke bank sampah.
          </p>
        </div>
      </div>

      <Card className="p-5">
        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-looop-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-looop-text">Pengajuan Berhasil Dikirim!</h3>
            <p className="text-xs text-looop-muted max-w-xs mx-auto">
              Nomor Registrasi: <span className="font-mono font-bold text-looop-primary">{submittedCode}</span>.
              Bawa sampah Anda ke lokasi untuk ditimbang oleh petugas.
            </p>
            <div className="pt-2 text-[11px] text-looop-secondary font-semibold">
              Mengarahkan ke riwayat aktivitas...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Pilih Bank Sampah */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-looop-text">
                1. Pilih Bank Sampah Tujuan
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => {
                  setSelectedBankId(e.target.value);
                  setQuantities({});
                }}
                className="w-full h-10 px-3 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
                required
              >
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.region.village}, {b.region.district})
                  </option>
                ))}
              </select>

              {activeBank && (
                <div className="mt-1 text-[11px] text-looop-muted flex items-center gap-1.5 bg-looop-bg p-2 rounded border border-looop-border">
                  <MapPin className="w-3.5 h-3.5 text-looop-secondary flex-shrink-0" />
                  <span>
                    {activeBank.address} • Jam: {activeBank.operatingHours}
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Input Berat Sampah */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-looop-text">
                  2. Jenis & Perkiraan Berat Sampah
                </label>
                <span className="text-[10px] text-looop-muted">
                  Berdasarkan katalog harga bank sampah
                </span>
              </div>

              <div className="space-y-2">
                {activeBank?.prices.map((p) => {
                  const qty = quantities[p.wasteItemId] || "";
                  const subtotal = (quantities[p.wasteItemId] || 0) * p.pricePerKg;

                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg border border-looop-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-looop-secondary/40 transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-looop-text">{p.wasteItem.name}</div>
                        <div className="text-[11px] text-looop-secondary font-semibold font-mono">
                          {formatRupiah(p.pricePerKg)} / {p.wasteItem.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-28">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0.0"
                            value={qty}
                            onChange={(e) => handleQtyChange(p.wasteItemId, e.target.value)}
                            className="h-8 text-xs text-right font-mono"
                          />
                        </div>
                        <span className="text-xs text-looop-muted w-6">{p.wasteItem.unit}</span>
                        <div className="text-right w-24">
                          <span className="text-xs font-bold text-looop-text font-mono block">
                            {formatRupiah(subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Catatan Pengajuan */}
            <div className="space-y-1">
              <label htmlFor="notes" className="block text-xs font-bold text-looop-text">
                3. Catatan Tambahan (Opsional)
              </label>
              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kardus sudah diikat rapi, botol bersih tanpa tutup."
                className="w-full p-2.5 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
              />
            </div>

            {/* Estimasi Ringkasan */}
            <div className="bg-looop-bg p-3.5 rounded-lg border border-looop-border space-y-1.5">
              <div className="flex justify-between text-xs text-looop-muted">
                <span>Total Estimasi Berat:</span>
                <span className="font-bold text-looop-text font-mono">{totalKg.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between text-xs text-looop-muted">
                <span>Estimasi Nilai Sampah:</span>
                <span className="font-bold text-base text-looop-primary font-mono">
                  {formatRupiah(estimatedTotal)}
                </span>
              </div>
              <div className="text-[10px] text-looop-muted flex items-start gap-1 pt-1 border-t border-looop-border/60">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-looop-info mt-0.5" />
                <span>
                  Nilai akhir akan ditentukan berdasarkan hasil penimbangan aktual di lapangan oleh petugas bank sampah.
                </span>
              </div>
            </div>

            {/* Submit Button with Loading State */}
            <Button
              type="submit"
              variant="secondary"
              disabled={loading || totalKg <= 0}
              className="w-full text-xs font-bold h-10 gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirimkan Pengajuan...</span>
                </>
              ) : (
                <span>Kirim Pengajuan Penyetoran ({totalKg.toFixed(1)} kg)</span>
              )}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default function CitizenDepositPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs">Memuat formulir setor sampah...</div>}>
      <DepositContent />
    </Suspense>
  );
}
