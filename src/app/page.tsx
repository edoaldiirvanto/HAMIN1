import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Recycle,
  Scale,
  Wallet,
  Building2,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function HomePage() {
  let wasteBanks: Array<{
    id: string;
    name: string;
    address: string;
    region: { village: string; district: string };
    prices: Array<{
      id: string;
      pricePerKg: number;
      wasteItem: { name: string };
    }>;
  }> = [];

  try {
    wasteBanks = await prisma.wasteBank.findMany({
      include: {
        region: true,
        prices: {
          include: { wasteItem: true },
          take: 3,
        },
      },
      take: 2,
    });
  } catch (err) {
    console.error("Gagal memuat bank sampah:", err);
  }

  if (!wasteBanks || wasteBanks.length === 0) {
    wasteBanks = [
      {
        id: "bank-1",
        name: "Bank Sampah Guyub Rukun",
        address: "Jl. Kaliurang KM 5.2, Caturtunggal, Depok",
        region: { village: "Caturtunggal", district: "Depok" },
        prices: [
          { id: "p1", pricePerKg: 3500, wasteItem: { name: "Botol PET Bening" } },
          { id: "p2", pricePerKg: 1800, wasteItem: { name: "Kardus Bekas Tebal" } },
          { id: "p3", pricePerKg: 12000, wasteItem: { name: "Kaleng Minuman Alumunium" } },
        ],
      },
      {
        id: "bank-2",
        name: "Bank Sampah Berkah Resik",
        address: "Jl. Magelang KM 7.5, Sinduadi, Mlati",
        region: { village: "Sinduadi", district: "Mlati" },
        prices: [
          { id: "p4", pricePerKg: 3600, wasteItem: { name: "Botol PET Bening" } },
          { id: "p5", pricePerKg: 1900, wasteItem: { name: "Kardus Bekas Tebal" } },
        ],
      },
    ];
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-looop-surface/90 backdrop-blur border-b border-looop-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-looop-muted">
            <Link href="#tentang" className="hover:text-looop-primary transition">
              Tentang
            </Link>
            <Link href="#cara-kerja" className="hover:text-looop-primary transition">
              Cara Kerja
            </Link>
            <Link href="#bank-sampah" className="hover:text-looop-primary transition">
              Bank Sampah
            </Link>
            <Link href="#dampak" className="hover:text-looop-primary transition">
              Dampak
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/citizen">
              <Button variant="primary" size="sm">
                Buka Aplikasi
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-looop-accent/40 text-looop-primary text-xs font-semibold mb-6">
              <Recycle className="w-3.5 h-3.5 text-looop-secondary" />
              <span>Platform Ekonomi Sirkular Terintegrasi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-looop-text tracking-tight leading-tight sm:leading-tight mb-6">
              Ubah Sampah Menjadi Nilai, Mulai dari Sekarang.
            </h1>

            <p className="text-base sm:text-lg text-looop-muted mb-8 leading-relaxed">
              Looop menghubungkan masyarakat, bank sampah, dan pemerintah daerah dalam satu
              ekosistem digital untuk pengelolaan sampah yang transparan, terukur, dan bernilai ekonomi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/citizen" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full gap-2">
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#cara-kerja" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Pelajari Cara Kerja
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Demo Card Switcher */}
          <div className="mt-14 max-w-4xl mx-auto bg-looop-surface rounded-card border border-looop-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-looop-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-looop-secondary" />
                <span className="text-sm font-semibold text-looop-text">
                  Akses Cepat Prototipe Role (Demo Multi-Role):
                </span>
              </div>
              <span className="text-xs text-looop-muted">Siap Dijalankan Langsung</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <Link
                href="/citizen"
                className="p-3 rounded-button border border-looop-border hover:bg-looop-bg hover:border-looop-secondary transition flex flex-col items-center gap-1.5"
              >
                <Wallet className="w-5 h-5 text-looop-secondary" />
                <span className="text-xs font-semibold text-looop-text">Masyarakat (Citizen)</span>
                <span className="text-[10px] text-looop-muted">Setor & Cek Saldo</span>
              </Link>
              <Link
                href="/bank"
                className="p-3 rounded-button border border-looop-border hover:bg-looop-bg hover:border-looop-secondary transition flex flex-col items-center gap-1.5"
              >
                <Scale className="w-5 h-5 text-looop-primary" />
                <span className="text-xs font-semibold text-looop-text">Bank Sampah</span>
                <span className="text-[10px] text-looop-muted">Penimbangan & Transaksi</span>
              </Link>
              <Link
                href="/government"
                className="p-3 rounded-button border border-looop-border hover:bg-looop-bg hover:border-looop-secondary transition flex flex-col items-center gap-1.5"
              >
                <TrendingUp className="w-5 h-5 text-looop-info" />
                <span className="text-xs font-semibold text-looop-text">Pemerintah Daerah</span>
                <span className="text-[10px] text-looop-muted">Monitoring & Evaluasi</span>
              </Link>
              <Link
                href="/admin"
                className="p-3 rounded-button border border-looop-border hover:bg-looop-bg hover:border-looop-secondary transition flex flex-col items-center gap-1.5"
              >
                <Building2 className="w-5 h-5 text-looop-text" />
                <span className="text-xs font-semibold text-looop-text">Super Admin</span>
                <span className="text-[10px] text-looop-muted">Master Data & Audit</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section id="cara-kerja" className="py-16 bg-looop-surface border-y border-looop-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-looop-text mb-3">
              Cara Kerja Looop
            </h2>
            <p className="text-sm sm:text-base text-looop-muted">
              Hanya dengan 3 langkah praktis untuk mulai berpartisipasi dalam ekonomi sirkular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative p-6">
              <div className="w-10 h-10 rounded-full bg-looop-accent/30 text-looop-primary flex items-center justify-center font-bold text-base mb-4">
                1
              </div>
              <CardTitle className="mb-2">Pilah Sampah & Ajukan</CardTitle>
              <CardDescription>
                Pilih jenis sampah anorganik (plastik, kardus, logam), pilih bank sampah terdekat, dan ajukan penyetoran secara online.
              </CardDescription>
            </Card>

            <Card className="relative p-6">
              <div className="w-10 h-10 rounded-full bg-looop-accent/30 text-looop-primary flex items-center justify-center font-bold text-base mb-4">
                2
              </div>
              <CardTitle className="mb-2">Penimbangan Lapangan</CardTitle>
              <CardDescription>
                Bawa sampah ke bank sampah atau serahkan ke petugas. Sampah ditimbang secara akurat dan dihitung otomatis berdasarkan snapshot harga.
              </CardDescription>
            </Card>

            <Card className="relative p-6">
              <div className="w-10 h-10 rounded-full bg-looop-accent/30 text-looop-primary flex items-center justify-center font-bold text-base mb-4">
                3
              </div>
              <CardTitle className="mb-2">Terima Nilai Ekonomi</CardTitle>
              <CardDescription>
                Konfirmasi hasil penimbangan. Saldo digital otomatis bertambah di buku besar Anda dan dapat dicairkan via tunai atau transfer.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Waste Bank Directory */}
      <section id="bank-sampah" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-looop-text mb-2">
                Direktori Bank Sampah Aktif
              </h2>
              <p className="text-sm text-looop-muted">
                Temukan bank sampah berizin dan terdaftar di wilayah Kabupaten Sleman.
              </p>
            </div>
            <Link href="/citizen/explore" className="mt-4 sm:mt-0 text-sm font-semibold text-looop-secondary hover:underline flex items-center gap-1">
              <span>Lihat Semua Direktori</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wasteBanks.map((bank) => (
              <Card key={bank.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-looop-text">{bank.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-looop-muted mt-1">
                      <MapPin className="w-3.5 h-3.5 text-looop-secondary" />
                      <span>{bank.address} ({bank.region.village}, {bank.region.district})</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-looop-success border border-emerald-200">
                    Aktif
                  </span>
                </div>

                <div className="mb-5 pt-3 border-t border-looop-border">
                  <div className="text-xs font-semibold text-looop-text mb-2">Harga Sampah Terkini:</div>
                  <div className="flex flex-wrap gap-2">
                    {bank.prices.map((p) => (
                      <span
                        key={p.id}
                        className="text-xs bg-looop-bg px-2.5 py-1 rounded-md text-looop-text border border-looop-border"
                      >
                        {p.wasteItem.name}: <strong>Rp{p.pricePerKg.toLocaleString("id-ID")}/kg</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/citizen/deposit?bankId=${bank.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Setor ke Bank Sampah Ini
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-looop-primary text-white py-12 border-t border-looop-primary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <Logo size="md" variant="light" />
              <p className="text-xs text-white/70 mt-2">
                Connecting Waste, Creating Value.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/80">
              <Link href="/citizen" className="hover:text-looop-accent">Masyarakat</Link>
              <Link href="/bank" className="hover:text-looop-accent">Bank Sampah</Link>
              <Link href="/government" className="hover:text-looop-accent">Pemerintah</Link>
              <Link href="/admin" className="hover:text-looop-accent">Super Admin</Link>
            </div>
          </div>
          <div className="pt-6 text-center text-xs text-white/60">
            &copy; 2026 Looop Ecosystem. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
