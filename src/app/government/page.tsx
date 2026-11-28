"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Award, Layers, ChevronRight, BarChart3, Info } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface SubCategoryItem {
  id: string;
  name: string;
  weightKg: number;
}

interface WasteCategoryComposition {
  id: string;
  name: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  subcategories: SubCategoryItem[];
}

const COMPOSITION_DATA: WasteCategoryComposition[] = [
  {
    id: "cat-kertas",
    name: "Kertas & Kardus",
    colorClass: "bg-looop-primary",
    badgeBg: "bg-emerald-50",
    badgeText: "text-looop-primary",
    subcategories: [
      { id: "sub-1", name: "Kardus Tebal (Cokelat/Box)", weightKg: 180.0 },
      { id: "sub-2", name: "Kertas HVS & Arsip Kantor", weightKg: 75.0 },
      { id: "sub-3", name: "Koran & Majalah Bekas", weightKg: 45.0 },
      { id: "sub-4", name: "Karton & Dupleks Ringan", weightKg: 20.0 },
    ],
  },
  {
    id: "cat-plastik",
    name: "Plastik",
    colorClass: "bg-looop-secondary",
    badgeBg: "bg-teal-50",
    badgeText: "text-looop-secondary",
    subcategories: [
      { id: "sub-5", name: "Botol PET Bening (Air Mineral)", weightKg: 85.5 },
      { id: "sub-6", name: "Botol PET Warna", weightKg: 32.0 },
      { id: "sub-7", name: "Gelas Plastik PP Bening", weightKg: 18.0 },
      { id: "sub-8", name: "Plastik Campur / Kresek Bersih", weightKg: 10.0 },
    ],
  },
  {
    id: "cat-logam",
    name: "Logam",
    colorClass: "bg-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    subcategories: [
      { id: "sub-9", name: "Kaleng Minuman Alumunium", weightKg: 28.0 },
      { id: "sub-10", name: "Besi Tua & Seng Padat", weightKg: 14.0 },
    ],
  },
];

export default function GovernmentDashboardPage() {
  const { state, mounted } = useAppStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("cat-kertas");

  if (!mounted) {
    return (
      <div className="min-h-screen bg-looop-bg p-8 text-center text-xs text-looop-muted">
        Memuat dashboard eksekutif pemerintah daerah...
      </div>
    );
  }

  const wasteBanks = state.wasteBanks;
  const deposits = state.deposits;
  const completedDeposits = deposits.filter((d) => d.status === "COMPLETED");

  const totalCitizens = state.users.filter((u) => u.role === "CITIZEN").length;
  const totalBanks = wasteBanks.length;
  const totalCompletedCount = completedDeposits.length;
  const totalEconomicValue = completedDeposits.reduce((acc, d) => acc + d.totalActual, 0);

  // Total volume dihitung dari total komposisi aktual
  const totalVolumeKg = COMPOSITION_DATA.reduce(
    (acc, cat) => acc + cat.subcategories.reduce((subAcc, s) => subAcc + s.weightKg, 0),
    0
  );

  const estimatedCarbonOffsetKg = (totalVolumeKg * 1.48).toFixed(1);
  const landfillDiversionRate = "84.2%";

  // Kategori aktif untuk detail breakdown interaktif
  const activeCategory = COMPOSITION_DATA.find((c) => c.id === selectedCategoryId) || COMPOSITION_DATA[0];
  const activeCategoryTotalKg = activeCategory.subcategories.reduce((acc, s) => acc + s.weightKg, 0);

  return (
    <div className="min-h-screen bg-looop-bg pb-12">
      {/* Read-Only Banner Sesuai PRD FR-12 */}
      <div className="bg-looop-primary text-white py-2.5 px-4 text-center text-xs flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-looop-accent" />
        <span className="font-medium">
          Portal Eksekutif Pemerintah Daerah (Read-Only) — Pemantauan Kebijakan & Evaluasi Kinerja Lingkungan Hidup
        </span>
      </div>

      {/* Top Header */}
      <header className="bg-white border-b border-looop-border h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <span className="text-xs bg-looop-accent/30 text-looop-primary font-bold px-3 py-1 rounded-full border border-looop-secondary/20">
            Dinas Lingkungan Hidup Kab. Sleman
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-looop-muted">Update Realtime Terpadu: 28 Nov 2026</span>
          <Link href="/login" className="font-semibold text-looop-secondary hover:underline">
            Keluar Sesi
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-looop-text tracking-tight">
              Executive Environmental & Circular Economy Intelligence
            </h1>
            <p className="text-sm text-looop-muted">
              Analitik komprehensif efektivitas bank sampah, perputaran ekonomi sirkular, dan reduksi emisi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-looop-success text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              Sertifikasi Wilayah Hijau: Kategori A
            </span>
          </div>
        </div>

        {/* 4 Core KPIs Konsisten dengan State Terpusat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <span className="text-xs text-looop-muted font-semibold block mb-1">Cakupan Bank Sampah</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-looop-text">{totalBanks} Unit</span>
              <span className="text-xs text-looop-success font-semibold">100% Aktif</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              Wilayah Sleman: Depok & Mlati
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-xs text-looop-muted font-semibold block mb-1">Partisipasi Warga</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-looop-text">{totalCitizens} Warga</span>
              <span className="text-xs text-looop-info font-semibold">+18% bln ini</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              Rata-rata 4.8 kg / penyetor
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-xs text-looop-muted font-semibold block mb-1">Total Sampah Terkelola</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-looop-text">{totalVolumeKg.toFixed(1)} kg</span>
              <span className="text-xs text-looop-secondary font-semibold">Anorganik</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              Tingkat Daur Ulang: <strong>{landfillDiversionRate}</strong>
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-xs text-looop-muted font-semibold block mb-1">Nilai Ekonomi ke Masyarakat</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-looop-secondary">{formatRupiah(totalEconomicValue)}</span>
              <span className="text-xs text-looop-muted">{totalCompletedCount} Selesai</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              Terkreditasi langsung ke saldo nasabah
            </span>
          </Card>
        </div>

        {/* Environmental Impact & Evaluasi Wilayah */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-looop-primary to-[#184639] text-white lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-looop-accent mb-3">
                <Award className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Environmental Impact Score</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Estimasi Reduksi Karbon</h3>
              <div className="text-4xl font-extrabold text-looop-accent my-3">
                {estimatedCarbonOffsetKg} <span className="text-lg text-white font-normal">kg CO₂e</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Sampah anorganik yang terserap oleh ekosistem Looop berhasil mencegah emisi gas rumah kaca setara dengan penanaman 24 pohon produktif.
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 mt-6 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-white/60 block text-[10px]">Timbunan TPA Berkurang</span>
                <span className="font-bold text-sm text-white">{totalVolumeKg.toFixed(0)} kg</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px]">Indeks Sirkularitas</span>
                <span className="font-bold text-sm text-looop-accent">Tinggi (8.9/10)</span>
              </div>
            </div>
          </Card>

          {/* Tren Distribusi Sampah & Evaluasi Kinerja Kecamatan */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Evaluasi Kinerja Bank Sampah per Wilayah Administratif</CardTitle>
                <CardDescription>
                  Pemantauan komparatif volume, transaksi, dan tingkat keaktifan bank sampah
                </CardDescription>
              </div>
              <span className="text-xs text-looop-muted bg-looop-bg px-2.5 py-1 rounded border border-looop-border">
                Filter: Tahun 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
                  <tr>
                    <th className="py-2.5 px-3">Bank Sampah</th>
                    <th className="py-2.5 px-3">Kecamatan / Desa</th>
                    <th className="py-2.5 px-3">Stok Gudang</th>
                    <th className="py-2.5 px-3">Volume Transaksi</th>
                    <th className="py-2.5 px-3">Indeks Kinerja</th>
                    <th className="py-2.5 px-3 text-right">Rekomendasi DLH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-looop-border">
                  {wasteBanks.map((b) => {
                    const bankStock = b.inventory.reduce((acc, i) => acc + i.stockKg, 0);
                    const bankTrx = deposits.filter((d) => d.wasteBankId === b.id).length;
                    return (
                      <tr key={b.id} className="hover:bg-looop-bg/50">
                        <td className="py-3 px-3 font-bold text-looop-text">{b.name}</td>
                        <td className="py-3 px-3 text-looop-muted">
                          {b.region.district}, {b.region.village}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-looop-text">
                          {bankStock.toFixed(1)} kg
                        </td>
                        <td className="py-3 px-3 font-semibold text-looop-secondary">
                          {bankTrx} transaksi
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-looop-success">
                            Sangat Baik
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-[11px] text-looop-muted">
                          Dukungan Subsidi Timbangan Digital
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* SECTION UTAMA: Komposisi Sampah Interaktif Sesuai Phase 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <CardTitle>Komposisi Kategori Sampah Daur Ulang</CardTitle>
                <span className="text-[11px] bg-looop-accent/40 text-looop-primary px-2.5 py-0.5 rounded-full font-bold">
                  Klik untuk Rincian
                </span>
              </div>
              <CardDescription>
                Pilih kategori di bawah ini untuk melihat komposisi subkategori material secara detail
              </CardDescription>
            </div>

            <div className="space-y-3">
              {COMPOSITION_DATA.map((cat) => {
                const catTotalKg = cat.subcategories.reduce((acc, s) => acc + s.weightKg, 0);
                const percentOfTotal = ((catTotalKg / totalVolumeKg) * 100).toFixed(1);
                const isSelected = selectedCategoryId === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? "border-looop-secondary bg-looop-accent/20 ring-1 ring-looop-secondary/50 shadow-sm"
                        : "border-looop-border bg-white hover:border-looop-secondary/40 hover:bg-looop-bg/60"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${cat.colorClass}`} />
                        <span className="text-looop-text">{cat.name}</span>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-looop-secondary font-semibold border border-looop-secondary/30">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-looop-primary font-mono">{percentOfTotal}%</span>
                        <span className="text-looop-muted font-mono font-normal">({catTotalKg.toFixed(1)} kg)</span>
                        <ChevronRight className={`w-4 h-4 transition ${isSelected ? "text-looop-secondary rotate-90" : "text-looop-muted"}`} />
                      </div>
                    </div>

                    <div className="w-full bg-looop-bg h-2 rounded-full overflow-hidden border border-looop-border/80">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${cat.colorClass}`}
                        style={{ width: `${percentOfTotal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Rincian Subkategori Aktif yang Dipilih */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-looop-border">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-looop-secondary" />
                  <CardTitle className="text-base">Detail Subkategori: {activeCategory.name}</CardTitle>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Total Material: <strong>{activeCategoryTotalKg.toFixed(1)} kg</strong> (
                  {((activeCategoryTotalKg / totalVolumeKg) * 100).toFixed(1)}% dari total sampah kabupaten)
                </CardDescription>
              </div>
              <button
                onClick={() => setSelectedCategoryId("cat-kertas")}
                className="text-[11px] font-semibold text-looop-secondary hover:underline"
              >
                Reset Tampilan
              </button>
            </div>

            <div className="space-y-3">
              {activeCategory.subcategories.map((sub) => {
                const percentOfCategory = ((sub.weightKg / activeCategoryTotalKg) * 100).toFixed(1);
                const percentOfTotal = ((sub.weightKg / totalVolumeKg) * 100).toFixed(1);

                return (
                  <div key={sub.id} className="p-3 bg-looop-bg rounded-lg border border-looop-border space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-looop-text">{sub.name}</span>
                      <div className="text-right">
                        <span className="font-extrabold text-looop-primary font-mono">{sub.weightKg.toFixed(1)} kg</span>
                        <span className="text-[10px] text-looop-muted ml-1.5 font-mono">({percentOfCategory}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-looop-border">
                      <div
                        className={`h-full rounded-full ${activeCategory.colorClass}`}
                        style={{ width: `${percentOfCategory}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-looop-muted">
                      <span>Proporsi terhadap kategori {activeCategory.name}: <strong>{percentOfCategory}%</strong></span>
                      <span>Proporsi total: <strong>{percentOfTotal}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-looop-info flex-shrink-0 mt-0.5" />
              <div className="text-looop-muted text-[11px] leading-relaxed">
                Akumulasi persentase seluruh subkategori di atas setara dengan <strong>100%</strong> dari kategori induk{" "}
                <strong>{activeCategory.name}</strong>, dihitung secara presisi dari data timbangan riil lapangan.
              </div>
            </div>
          </Card>
        </div>

        {/* Rekomendasi Kebijakan DLH */}
        <Card className="p-6">
          <CardTitle className="mb-2">Rekomendasi Kebijakan Dinas Lingkungan Hidup</CardTitle>
          <CardDescription className="mb-4">
            Insight otomatis berbasis data untuk akselerasi ekonomi sirkular daerah
          </CardDescription>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs">
              <div className="font-bold text-looop-info mb-1">Optimalisasi Botol PET Bening</div>
              <p className="text-looop-muted leading-relaxed">
                Volume plastik PET di Caturtunggal mencapai 85.5 kg. Disarankan menambah drop-point komunal di area kampus dan perkantoran.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
              <div className="font-bold text-looop-success mb-1">Integrasi Industri Daur Ulang Kardus</div>
              <p className="text-looop-muted leading-relaxed">
                Stok kardus tebal mencapai 180 kg di Depok, siap disalurkan langsung ke pabrik mitra untuk menjaga stabilitas harga beli warga.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
              <div className="font-bold text-looop-warning mb-1">Ekspansi Bank Sampah Mlati</div>
              <p className="text-looop-muted leading-relaxed">
                Kecamatan Mlati memiliki rasio keaktifan warga tinggi dan berpotensi penambahan 2 unit bank sampah binaan baru.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
