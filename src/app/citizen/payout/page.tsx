"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";

interface BalanceItem {
  id: string;
  wasteBankId: string;
  available: number;
  held: number;
  wasteBank: { name: string };
}

function PayoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBankId = searchParams.get("bankId");

  const [balances, setBalances] = useState<BalanceItem[]>([]);
  const [selectedBankId, setSelectedBankId] = useState(preselectedBankId || "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [accountDetails, setAccountDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/balances")
      .then((res) => res.json())
      .then((data) => {
        setBalances(data);
        if (!selectedBankId && data.length > 0) {
          setSelectedBankId(data[0].wasteBankId);
        }
      });
  }, [selectedBankId]);

  const activeBalance = balances.find((b) => b.wasteBankId === selectedBankId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (!activeBalance || withdrawAmount > activeBalance.available) {
      alert("Saldo tersedia tidak mencukupi!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteBankId: selectedBankId,
          amount: withdrawAmount,
          method,
          accountDetails,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/citizen");
        }, 1500);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal mengajukan pencairan");
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
        <h1 className="text-lg font-bold text-looop-text">Pencairan Saldo</h1>
        <p className="text-xs text-looop-muted">
          Ajukan penarikan saldo digital Anda ke rekening bank atau secara tunai.
        </p>
      </div>

      <Card className="p-5">
        {success ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-emerald-100 text-looop-success rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
              ✓
            </div>
            <h3 className="text-base font-bold text-looop-text mb-1">Pengajuan Pencairan Terkirim!</h3>
            <p className="text-xs text-looop-muted">
              Saldo telah ditahan dan menunggu persetujuan dari bank sampah.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-looop-text mb-1.5">
                Pilih Bank Sampah
              </label>
              <select
                className="w-full rounded-input border border-looop-border bg-white px-3 py-2 text-sm text-looop-text focus:outline-none focus:ring-1 focus:ring-looop-secondary"
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                required
              >
                {balances.map((b) => (
                  <option key={b.id} value={b.wasteBankId}>
                    {b.wasteBank.name} (Tersedia: {formatRupiah(b.available)})
                  </option>
                ))}
              </select>
            </div>

            {activeBalance && (
              <div className="p-3 bg-looop-bg rounded-lg border border-looop-border text-xs flex justify-between items-center">
                <span className="text-looop-muted">Saldo Tersedia Bank Ini:</span>
                <span className="font-bold text-sm text-looop-secondary">
                  {formatRupiah(activeBalance.available)}
                </span>
              </div>
            )}

            <div>
              <Input
                label="Nominal Penarikan (Rp)"
                type="number"
                min="10000"
                max={activeBalance?.available || 0}
                placeholder="Contoh: 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-looop-text mb-1.5">
                Metode Pencairan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod("BANK_TRANSFER")}
                  className={`p-2.5 rounded-button border text-xs font-semibold transition ${
                    method === "BANK_TRANSFER"
                      ? "border-looop-secondary bg-looop-secondary/10 text-looop-secondary"
                      : "border-looop-border bg-white text-looop-text"
                  }`}
                >
                  Transfer Bank
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("CASH")}
                  className={`p-2.5 rounded-button border text-xs font-semibold transition ${
                    method === "CASH"
                      ? "border-looop-secondary bg-looop-secondary/10 text-looop-secondary"
                      : "border-looop-border bg-white text-looop-text"
                  }`}
                >
                  Tunai di Lokasi
                </button>
              </div>
            </div>

            <div>
              <Input
                label={method === "BANK_TRANSFER" ? "Nama Bank & Nomor Rekening" : "Catatan Pengambilan Tunai"}
                placeholder={
                  method === "BANK_TRANSFER"
                    ? "Contoh: BCA 1234567890 a.n. Budi Santoso"
                    : "Contoh: Diambil hari Sabtu jam 10 pagi"
                }
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="secondary" className="w-full mt-2" disabled={loading}>
              {loading ? "Memproses..." : "Ajukan Pencairan"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default function CitizenPayoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-looop-muted">Memuat halaman pencairan...</div>}>
      <PayoutContent />
    </Suspense>
  );
}
