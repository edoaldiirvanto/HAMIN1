"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Inbox, Wallet, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CitizenActivityPage() {
  const { state, mounted } = useAppStore();
  const [activeTab, setActiveTab] = useState<"deposits" | "payouts">("deposits");

  if (!mounted) {
    return (
      <div className="py-12 text-center text-xs text-looop-muted">
        Memuat riwayat transaksi...
      </div>
    );
  }

  const deposits = state.deposits;
  const payouts = state.payouts;

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center gap-2">
        <Link href="/citizen" className="p-1 rounded hover:bg-looop-bg text-looop-muted">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-looop-text">Aktivitas & Riwayat Transaksi</h1>
          <p className="text-xs text-looop-muted">
            Pantau status penimbangan sampah dan riwayat pencairan saldo Anda.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-looop-border">
        <button
          onClick={() => setActiveTab("deposits")}
          className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === "deposits"
              ? "border-looop-primary text-looop-primary"
              : "border-transparent text-looop-muted hover:text-looop-text"
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Setoran Sampah ({deposits.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("payouts")}
          className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === "payouts"
              ? "border-looop-primary text-looop-primary"
              : "border-transparent text-looop-muted hover:text-looop-text"
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Pencairan Saldo ({payouts.length})</span>
        </button>
      </div>

      {/* Tab Content: Setoran */}
      {activeTab === "deposits" && (
        <div className="space-y-3">
          {deposits.length === 0 ? (
            <Card className="p-6 text-center text-xs text-looop-muted">
              Belum ada transaksi penyetoran sampah yang diajukan.
            </Card>
          ) : (
            deposits.map((dep) => (
              <Card key={dep.id} className="p-4 space-y-3 hover:border-looop-secondary/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-looop-text block">
                      {dep.code}
                    </span>
                    <span className="text-[11px] text-looop-muted">
                      {dep.wasteBankName} • {formatDate(dep.createdAt)}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(dep.status)}>
                    {dep.status}
                  </Badge>
                </div>

                {/* Breakdown Items */}
                <div className="bg-looop-bg p-2.5 rounded-lg text-xs space-y-1.5 border border-looop-border">
                  {dep.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-looop-text">{item.wasteItemName}</span>
                      <span className="font-semibold text-looop-text font-mono">
                        {item.actualKg > 0 ? `${item.actualKg} kg (aktual)` : `${item.estimatedKg} kg (est)`}
                      </span>
                    </div>
                  ))}
                  {dep.notes && (
                    <div className="pt-1 text-[10px] text-looop-muted border-t border-looop-border/60">
                      Catatan: {dep.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-looop-border">
                  <span className="text-looop-muted">Total Nilai:</span>
                  <span className="font-bold text-sm text-looop-primary font-mono">
                    {formatRupiah(dep.status === "COMPLETED" ? dep.totalActual : dep.totalEstimated)}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Pencairan */}
      {activeTab === "payouts" && (
        <div className="space-y-3">
          {payouts.length === 0 ? (
            <Card className="p-6 text-center text-xs text-looop-muted">
              Belum ada riwayat pengajuan pencairan saldo.
            </Card>
          ) : (
            payouts.map((pay) => (
              <Card key={pay.id} className="p-4 space-y-3 hover:border-looop-secondary/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-looop-text block">
                      {pay.code}
                    </span>
                    <span className="text-[11px] text-looop-muted">
                      {pay.wasteBankName} • {formatDate(pay.createdAt)}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(pay.status)}>
                    {pay.status}
                  </Badge>
                </div>

                <div className="p-2.5 bg-looop-bg rounded-lg text-xs space-y-1.5 border border-looop-border">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-looop-muted">Metode:</span>
                    <span className="font-semibold text-looop-text">
                      {pay.method === "CASH_PICKUP" ? "Tarik Tunai di Lokasi" : "Transfer Bank"}
                    </span>
                  </div>
                  {pay.pickupSchedule ? (
                    <div className="space-y-1 pt-1 border-t border-looop-border/60">
                      <div className="text-[11px] text-amber-900 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>Jadwal: {pay.pickupSchedule.date} ({pay.pickupSchedule.timeSlot})</span>
                      </div>
                      <div className="text-[10px] text-looop-muted flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-looop-secondary flex-shrink-0 mt-0.5" />
                        <span>Lokasi: {pay.pickupSchedule.location}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-looop-muted">
                      Rekening: {pay.accountDetails}
                    </div>
                  )}
                  {pay.notes && (
                    <div className="text-[10px] text-looop-muted pt-1 border-t border-looop-border/60">
                      Catatan: {pay.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-looop-border">
                  <span className="text-looop-muted">Nominal Pencairan:</span>
                  <span className="font-extrabold text-sm text-looop-primary font-mono">
                    {formatRupiah(pay.amount)}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
