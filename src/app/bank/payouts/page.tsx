"use client";

import React, { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Check, X, Calendar, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function BankPayoutsPage() {
  const { state, mounted, processPayout } = useAppStore();
  const [actionFeedback, setActionFeedback] = useState<string>("");

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat daftar pencairan...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const payouts = state.payouts.filter((p) => p.wasteBankId === currentBank.id);

  const handleAction = (payoutId: string, action: "APPROVE" | "REJECT") => {
    const res = processPayout(payoutId, action);
    if (res) {
      setActionFeedback(
        action === "APPROVE"
          ? `Pencairan ${res.code} berhasil disetujui dan diselesaikan.`
          : `Pencairan ${res.code} telah ditolak dan saldo telah dikembalikan ke nasabah.`
      );
      setTimeout(() => setActionFeedback(""), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Kelola Saldo & Pengajuan Pencairan Dana
        </h1>
        <p className="text-sm text-looop-muted">
          Daftar pengajuan pencairan saldo masyarakat via transfer bank atau penarikan uang tunai di kantor bank sampah.
        </p>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-looop-success text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      <Card className="p-6">
        <CardTitle className="mb-4">Permintaan Pencairan Dana ({payouts.length})</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">No. Payout</th>
                <th className="py-3 px-4">Nama Warga</th>
                <th className="py-3 px-4">Metode & Rincian</th>
                <th className="py-3 px-4">Jadwal Pengambilan (Tunai)</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-looop-muted">
                    Tidak ada pengajuan pencairan yang tertunda saat ini.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-looop-bg/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-looop-text">{p.code}</td>
                    <td className="py-3 px-4 font-medium text-looop-text">
                      <div>{p.userName}</div>
                      <div className="text-[10px] text-looop-muted">{formatDate(p.createdAt)}</div>
                    </td>
                    <td className="py-3 px-4 text-looop-muted">
                      <span className="font-semibold text-looop-text block">
                        {p.method === "CASH_PICKUP" ? "Penarikan Tunai di Lokasi" : "Transfer Rekening"}
                      </span>
                      <span className="text-[11px]">{p.accountDetails}</span>
                    </td>
                    <td className="py-3 px-4 text-looop-muted">
                      {p.pickupSchedule ? (
                        <div className="space-y-0.5">
                          <div className="font-bold text-amber-900 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-700" />
                            <span>{p.pickupSchedule.date}</span>
                          </div>
                          <div className="text-[10px] text-looop-muted">{p.pickupSchedule.timeSlot}</div>
                        </div>
                      ) : (
                        <span className="text-looop-muted">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-base text-looop-primary font-mono">
                      {formatRupiah(p.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(p.status)}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status === "REQUESTED" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => handleAction(p.id, "APPROVE")}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs px-2 gap-1"
                            onClick={() => handleAction(p.id, "REJECT")}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-looop-muted font-medium">Selesai Diproses</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
