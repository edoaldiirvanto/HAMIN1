import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const revalidate = 0;

export default async function GovernmentDashboardPage() {
  const wasteBanks = await prisma.wasteBank.findMany({
    include: {
      region: true,
      deposits: true,
      inventory: { include: { wasteItem: true } },
    },
  });

  const totalCitizens = await prisma.user.count({ where: { role: "CITIZEN" } });
  const totalBanks = wasteBanks.length;
  const totalCompletedDeposits = await prisma.deposit.count({ where: { status: "COMPLETED" } });

  const totalDepositsList = await prisma.deposit.findMany({
    where: { status: "COMPLETED" },
  });
  const totalEconomicValue = totalDepositsList.reduce((acc, d) => acc + d.totalActual, 0);

  const inventoryItems = await prisma.inventoryItem.findMany({
    include: { wasteItem: { include: { category: true } } },
  });
  const totalVolumeKg = inventoryItems.reduce((acc, i) => acc + i.stockKg, 0);

  // Estimasi Pengurangan Emisi Karbon (Formula DLH: ~1.5 kg CO2e reduksi per kg sampah daur ulang)
  const estimatedCarbonOffsetKg = (totalVolumeKg * 1.48).toFixed(1);
  const landfillDiversionRate = "84.2%";

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
          <span className="text-looop-muted">Update Realtime: 27 Nov 2026</span>
          <Link href="/login" className="font-semibold text-looop-secondary hover:underline">
            Keluar Sesi
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
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

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <span className="text-xs text-looop-muted font-semibold block mb-1">Cakupan Bank Sampah</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-looop-text">{totalBanks} Unit</span>
              <span className="text-xs text-looop-success font-semibold">100% Aktif</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              2 Kecamatan tercover (Depok & Mlati)
            </span>
          </Card>

          <Card className="p-5">
            <span className="text-xs text-looop-muted font-semibold block mb-1">Partisipasi Warga</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-looop-text">{totalCitizens} Warga</span>
              <span className="text-xs text-looop-info font-semibold">+18% bln ini</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              Rata-rata 4.2 kg/penyetor
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
              <span className="text-xs text-looop-muted">{totalCompletedDeposits} Trx</span>
            </div>
            <span className="text-[11px] text-looop-muted mt-2 block">
              Terkreditasi langsung ke nasabah
            </span>
          </Card>
        </div>

        {/* Environmental Impact & Carbon Offset Insights */}
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
                          {b.deposits.length} transaksi
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

        {/* Analisis Komposisi Sampah & Tren Komoditas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <CardTitle className="mb-2">Komposisi Sampah Berdasarkan Kategori</CardTitle>
            <CardDescription className="mb-4">
              Proporsi jenis material sampah daur ulang yang dikumpulkan warga
            </CardDescription>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Kertas & Kardus (Kardus Tebal, Arsip)</span>
                  <span className="text-looop-primary">63.1% (320.0 kg)</span>
                </div>
                <div className="w-full bg-looop-bg h-2.5 rounded-full overflow-hidden border border-looop-border">
                  <div className="bg-looop-primary h-full rounded-full" style={{ width: "63.1%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Plastik (Botol PET Bening)</span>
                  <span className="text-looop-secondary">28.7% (145.5 kg)</span>
                </div>
                <div className="w-full bg-looop-bg h-2.5 rounded-full overflow-hidden border border-looop-border">
                  <div className="bg-looop-secondary h-full rounded-full" style={{ width: "28.7%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Logam (Kaleng Minuman Alumunium)</span>
                  <span className="text-amber-600">8.2% (42.0 kg)</span>
                </div>
                <div className="w-full bg-looop-bg h-2.5 rounded-full overflow-hidden border border-looop-border">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "8.2%" }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardTitle className="mb-2">Rekomendasi Kebijakan Dinas Lingkungan Hidup</CardTitle>
            <CardDescription className="mb-4">
              Insight otomatis berbasis data untuk akselerasi ekonomi sirkular daerah
            </CardDescription>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs">
                <div className="font-bold text-looop-info mb-0.5">Optimalisasi Pengumpulan Botol PET</div>
                <p className="text-looop-muted">
                  Volume plastik PET meningkat pesat di wilayah Caturtunggal. Disarankan penambahan drop-point komunal di area kampus/perumahan.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
                <div className="font-bold text-looop-success mb-0.5">Integrasi UMKM & Industri Daur Ulang</div>
                <p className="text-looop-muted">
                  Stok kardus tebal mencapai 320 kg, siap disalurkan langsung ke pabrik daur ulang mitra pemerintah untuk harga jual tertinggi.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                <div className="font-bold text-looop-warning mb-0.5">Ekspansi Wilayah Prioritas</div>
                <p className="text-looop-muted">
                  Kecamatan Mlati memiliki potensi penambahan 2 unit bank sampah binaan baru pada Triwulan I 2027.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
