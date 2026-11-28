"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Wallet, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

const TIME_SLOTS = [
  "08:30 - 10:00 WIB (Pagi)",
  "10:00 - 12:00 WIB (Siang)",
  "13:00 - 15:00 WIB (Sore)",
];

function PayoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBankId = searchParams.get("bankId");

  const { state, mounted, addPayout } = useAppStore();
  const balances = state.citizenBalances;

  const [selectedBankId, setSelectedBankId] = useState<string>(preselectedBankId || "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"BANK_TRANSFER" | "CASH_PICKUP">("CASH_PICKUP");

  // Transfer fields
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("Budi Santoso");

  // Cash Pickup fields (Mandatory Schedule sesuai Phase 2 Task)
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState(TIME_SLOTS[0]);
  const [pickupLocation, setPickupLocation] = useState("");

  // Optional notes & UI states
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedPayout, setSubmittedPayout] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (mounted && balances.length > 0) {
      if (!selectedBankId || !balances.some((b) => b.wasteBankId === selectedBankId)) {
        setSelectedBankId(preselectedBankId && balances.some((b) => b.wasteBankId === preselectedBankId) ? preselectedBankId : balances[0].wasteBankId);
      }
    }
  }, [mounted, balances, selectedBankId, preselectedBankId]);

  const activeBalance = balances.find((b) => b.wasteBankId === selectedBankId) || balances[0];
  const targetBank = state.wasteBanks.find((w) => w.id === selectedBankId);

  useEffect(() => {
    if (targetBank && !pickupLocation) {
      setPickupLocation(targetBank.address);
    }
  }, [targetBank, pickupLocation]);

  // Set default date ke besok
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    setPickupDate(dateStr);
  }, []);

  const withdrawAmount = parseFloat(amount) || 0;

  const validateForm = () => {
    if (!activeBalance) {
      setErrorMessage("Portofolio bank sampah tidak valid.");
      return false;
    }
    if (withdrawAmount <= 0) {
      setErrorMessage("Masukkan nominal pencairan saldo yang valid.");
      return false;
    }
    if (withdrawAmount > activeBalance.available) {
      setErrorMessage(`Saldo tersedia tidak mencukupi. Saldo Anda: ${formatRupiah(activeBalance.available)}`);
      return false;
    }
    if (method === "BANK_TRANSFER") {
      if (!accountNumber.trim()) {
        setErrorMessage("Nomor rekening tujuan transfer wajib diisi.");
        return false;
      }
    } else {
      if (!pickupDate) {
        setErrorMessage("Tanggal pengambilan tunai wajib dipilih.");
        return false;
      }
      if (!pickupTimeSlot) {
        setErrorMessage("Slot waktu pengambilan tunai wajib dipilih.");
        return false;
      }
    }
    return true;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (loading || success) return;
    setLoading(true);
    setShowConfirmModal(false);

    try {
      let accountDetailsStr = "";
      let scheduleObj = undefined;

      if (method === "BANK_TRANSFER") {
        accountDetailsStr = `${bankName} - ${accountNumber.trim()} a.n. ${accountHolder.trim()}`;
      } else {
        accountDetailsStr = `Penarikan Tunai di Kantor: ${targetBank?.name || "Bank Sampah"}`;
        scheduleObj = {
          location: pickupLocation || targetBank?.address || "Kantor Bank Sampah",
          date: pickupDate,
          timeSlot: pickupTimeSlot,
        };
      }

      const res = addPayout({
        wasteBankId: selectedBankId,
        amount: withdrawAmount,
        method,
        accountDetails: accountDetailsStr,
        notes: notes.trim(),
        pickupSchedule: scheduleObj,
      });

      if ("error" in res) {
        setErrorMessage(res.error);
      } else {
        setSubmittedPayout(res);
        setSuccess(true);
        setTimeout(() => {
          router.push("/citizen");
        }, 1800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengajukan pencairan dana.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-looop-muted">
        Memuat data portofolio saldo...
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
          <h1 className="text-lg font-bold text-looop-text">Pencairan Saldo</h1>
          <p className="text-xs text-looop-muted">
            Tarik saldo digital Anda melalui penarikan tunai terjadwal atau transfer bank.
          </p>
        </div>
      </div>

      <Card className="p-5">
        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-looop-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-looop-text">Pengajuan Pencairan Terkirim!</h3>
            <p className="text-xs text-looop-muted max-w-sm mx-auto">
              Nomor Referensi: <span className="font-mono font-bold text-looop-primary">{submittedPayout?.code}</span>.
              Nominal sebesar <strong>{formatRupiah(withdrawAmount)}</strong> telah dialokasikan ke saldo tertahan
              dan menunggu konfirmasi dari pengelola bank sampah.
            </p>
            {submittedPayout?.pickupSchedule && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left text-xs max-w-sm mx-auto">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Jadwal Pengambilan Tunai:</span>
                </div>
                <div className="text-looop-text">Tanggal: <strong>{submittedPayout.pickupSchedule.date}</strong></div>
                <div className="text-looop-text">Waktu: <strong>{submittedPayout.pickupSchedule.timeSlot}</strong></div>
                <div className="text-[11px] text-looop-muted mt-1">Lokasi: {submittedPayout.pickupSchedule.location}</div>
              </div>
            )}
            <div className="pt-2 text-[11px] text-looop-secondary font-semibold">
              Mengarahkan kembali ke dashboard utama...
            </div>
          </div>
        ) : (
          <form onSubmit={handleOpenConfirm} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pilih Bank Sampah Asal Saldo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-looop-text">
                1. Pilih Saldo Bank Sampah yang Ingin Ditarik
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
                required
              >
                {balances.map((b) => (
                  <option key={b.wasteBankId} value={b.wasteBankId}>
                    {b.wasteBankName} (Tersedia: {formatRupiah(b.available)})
                  </option>
                ))}
              </select>

              {activeBalance && (
                <div className="p-3 rounded-lg bg-looop-bg border border-looop-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-looop-muted block">Saldo Tersedia untuk Ditarik:</span>
                    <span className="text-base font-extrabold text-looop-primary font-mono">
                      {formatRupiah(activeBalance.available)}
                    </span>
                  </div>
                  {activeBalance.held > 0 && (
                    <div className="text-right">
                      <span className="text-[11px] text-looop-muted block">Sedang Diproses:</span>
                      <span className="text-xs font-semibold text-amber-600 font-mono">
                        {formatRupiah(activeBalance.held)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nominal Pencairan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-looop-text">
                2. Masukkan Nominal Pencairan (Rp)
              </label>
              <Input
                type="number"
                min="10000"
                step="1000"
                placeholder="Contoh: 50000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                required
                className="h-10 text-sm font-mono font-semibold"
              />
              <div className="flex gap-2 pt-1">
                {[25000, 50000, 100000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="text-[11px] px-2.5 py-1 rounded bg-looop-bg border border-looop-border hover:border-looop-secondary text-looop-text font-medium"
                  >
                    {formatRupiah(preset)}
                  </button>
                ))}
                {activeBalance && activeBalance.available > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(activeBalance.available))}
                    className="text-[11px] px-2.5 py-1 rounded bg-looop-accent/40 text-looop-primary border border-looop-secondary/30 font-bold"
                  >
                    Tarik Semua ({formatRupiah(activeBalance.available)})
                  </button>
                )}
              </div>
            </div>

            {/* Metode Pencairan Tab Sesuai PRD & Phase 2 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-looop-text">
                3. Metode Penarikan Dana
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("CASH_PICKUP")}
                  className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                    method === "CASH_PICKUP"
                      ? "border-looop-secondary bg-looop-accent/20 text-looop-primary font-bold shadow-sm"
                      : "border-looop-border bg-white text-looop-muted hover:border-looop-secondary/40"
                  }`}
                >
                  <Calendar className="w-5 h-5 text-looop-secondary flex-shrink-0" />
                  <div>
                    <div className="text-xs">Tarik Tunai di Lokasi</div>
                    <div className="text-[10px] opacity-80 font-normal">Pilih jadwal pengambilan</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("BANK_TRANSFER")}
                  className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                    method === "BANK_TRANSFER"
                      ? "border-looop-secondary bg-looop-accent/20 text-looop-primary font-bold shadow-sm"
                      : "border-looop-border bg-white text-looop-muted hover:border-looop-secondary/40"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-looop-primary flex-shrink-0" />
                  <div>
                    <div className="text-xs">Transfer Rekening Bank</div>
                    <div className="text-[10px] opacity-80 font-normal">BCA, Mandiri, BRI, BNI</div>
                  </div>
                </button>
              </div>

              {/* SECTION KHUSUS: Penarikan Tunai di Lokasi (Jadwal & Slot) */}
              {method === "CASH_PICKUP" ? (
                <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Atur Jadwal Penarikan Tunai</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-looop-text">
                        Tanggal Pengambilan <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={pickupDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setPickupDate(e.target.value)}
                        required
                        className="h-9 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-looop-text">
                        Slot Waktu / Jam <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={pickupTimeSlot}
                        onChange={(e) => setPickupTimeSlot(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
                        required
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="block text-[11px] font-bold text-looop-text">
                      Lokasi Pengambilan Dana
                    </label>
                    <div className="p-2.5 bg-white rounded border border-amber-200 text-xs flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-looop-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-looop-text">{targetBank?.name}</div>
                        <div className="text-[11px] text-looop-muted">{pickupLocation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* SECTION TRANSFER BANK */
                <div className="p-4 rounded-lg bg-looop-bg border border-looop-border space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="block text-[11px] font-bold text-looop-text">Nama Bank</label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-white border border-looop-border rounded-button"
                      >
                        <option value="BCA">BCA</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                        <option value="BSI">BSI</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-[11px] font-bold text-looop-text">Nomor Rekening</label>
                      <Input
                        type="text"
                        placeholder="Contoh: 1234567890"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        className="h-9 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-looop-text">Nama Pemilik Rekening</label>
                    <Input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Catatan Tambahan (Opsional) */}
            <div className="space-y-1">
              <label htmlFor="payoutNotes" className="block text-xs font-bold text-looop-text">
                4. Catatan Tambahan (Opsional)
              </label>
              <textarea
                id="payoutNotes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Uang tunai pecahan kecil jika tersedia."
                className="w-full p-2.5 text-xs bg-white border border-looop-border rounded-button focus:outline-none focus:border-looop-secondary"
              />
            </div>

            {/* Ringkasan & Submit */}
            <div className="p-3.5 bg-looop-bg rounded-lg border border-looop-border space-y-1">
              <div className="flex justify-between text-xs text-looop-muted">
                <span>Total Pengurangan Saldo:</span>
                <span className="font-extrabold text-base text-looop-primary font-mono">
                  {formatRupiah(withdrawAmount)}
                </span>
              </div>
              <div className="text-[11px] text-looop-muted">
                Metode: <strong>{method === "CASH_PICKUP" ? "Penarikan Tunai Terjadwal" : `Transfer ${bankName}`}</strong>
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={loading || withdrawAmount <= 0 || withdrawAmount > (activeBalance?.available || 0)}
              className="w-full text-xs font-bold h-10 gap-2"
            >
              <span>Ajukan Pencairan Dana ({formatRupiah(withdrawAmount)})</span>
            </Button>
          </form>
        )}
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-card max-w-sm w-full p-5 shadow-xl border border-looop-border space-y-4">
            <h3 className="text-base font-bold text-looop-text">Konfirmasi Pengajuan Pencairan</h3>
            <p className="text-xs text-looop-muted">
              Pastikan rincian penarikan saldo Anda telah sesuai sebelum dikirim ke sistem bank sampah:
            </p>

            <div className="p-3 bg-looop-bg rounded-lg text-xs space-y-1.5 border border-looop-border">
              <div className="flex justify-between">
                <span className="text-looop-muted">Nominal:</span>
                <span className="font-bold text-looop-primary font-mono">{formatRupiah(withdrawAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-looop-muted">Unit Bank Sampah:</span>
                <span className="font-medium text-looop-text">{targetBank?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-looop-muted">Metode:</span>
                <span className="font-semibold text-looop-secondary">
                  {method === "CASH_PICKUP" ? "Tarik Tunai di Lokasi" : `Transfer ${bankName}`}
                </span>
              </div>
              {method === "CASH_PICKUP" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-looop-muted">Jadwal:</span>
                    <span className="font-bold text-amber-900">{pickupDate} ({pickupTimeSlot})</span>
                  </div>
                  <div className="text-[10px] text-looop-muted">Lokasi: {pickupLocation}</div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Batal & Periksa
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs font-bold gap-1.5"
                onClick={handleConfirmSubmit}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Ya, Ajukan Sekarang"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CitizenPayoutPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs">Memuat formulir pencairan...</div>}>
      <PayoutContent />
    </Suspense>
  );
}
