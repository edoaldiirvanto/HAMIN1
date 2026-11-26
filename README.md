# Looop — Connecting Waste, Creating Value

Platform digital terintegrasi pengelolaan sampah dan ekonomi sirkular yang menghubungkan **Masyarakat (Citizen)**, **Bank Sampah (Waste Bank)**, dan **Pemerintah Daerah (Government)**.

Dibangun dengan **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, dan **Google Stitch Design System**.

---

## 🚀 Panduan Push ke GitHub & Deploy ke Vercel

### Langkah 1: Push ke Repository GitHub Anda

Repository Git lokal pada branch `main` telah diinisialisasi dan seluruh file telah di-commit.
Jalankan langkah berikut di terminal untuk menghubungkan ke GitHub:

1. Buat repository baru di [github.com/new](https://github.com/new) (misalnya diberi nama `looop-circular-economy`).
2. Jalankan perintah:

```bash
# Hubungkan ke remote repository Anda (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push kode ke branch main
git push -u origin main
```

---

### Langkah 2: Deploy ke Vercel

Proyek ini telah dilengkapi dengan [`vercel.json`](file:///d:/TA-PPSI-HAMIN1/vercel.json) dan hook `postinstall: prisma generate` pada [`package.json`](file:///d:/TA-PPSI-HAMIN1/package.json).

1. Buka [vercel.com/new](https://vercel.com/new).
2. Hubungkan akun GitHub Anda dan pilih repository yang baru dibuat (`looop-circular-economy`).
3. Pada bagian **Environment Variables**, atur variabel berikut jika menggunakan PostgreSQL production (misalnya Neon / Supabase / Vercel Postgres):
   - `DATABASE_URL` = `postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require`
   *(Catatan: Untuk build instan tanpa database eksternal, konfigurasi default vercel.json telah mengotomatisasi inisialisasi prisma push & seed).*
4. Klik **Deploy**. Vercel akan otomatis meng-compile dan menghasilkan URL live aplikasi Anda.

---

## 💻 Menjalankan di Komputer Lokal

```bash
# 1. Jalankan development server
npm run dev

# 2. Jalankan unit test logika bisnis (Vitest)
npx vitest run

# 3. Jalankan test build produksi
npm run build
```

Buka peramban di: **`http://localhost:3000`**

---

## 🔑 Akun Demo Prototipe Multi-Role

Pada halaman login ([`/login`](http://localhost:3000/login)) atau dari Landing Page ([`/`](http://localhost:3000)), tersedia shortcut 1-klik untuk setiap role:

| Peran | Kredensial Demo | Dashboard | Fitur Utama |
|---|---|---|---|
| **Masyarakat (Citizen)** | `citizen@looop.id` / `demo123` | [`/citizen`](http://localhost:3000/citizen) | Mobile-first bottom nav, setor sampah, tracking status, cek saldo per bank, dan pencairan dana. |
| **Bank Sampah Admin & Staff** | `bank@looop.id` / `demo123` | [`/bank`](http://localhost:3000/bank) | Sidebar operasional, antrean setoran, **form penimbangan & verifikasi fisik**, harga, stok gudang, dan pencairan. |
| **Pemerintah Daerah** | `gov@slemankab.go.id` / `demo123` | [`/government`](http://localhost:3000/government) | Read-only executive dashboard: evaluasi bank sampah per kecamatan, estimasi reduksi karbon ($\text{kg CO}_2\text{e}$), dan rekomendasi DLH. |
| **Super Admin** | `admin@looop.id` / `demo123` | [`/admin`](http://localhost:3000/admin) | Kontrol penuh: Tambah/hapus akun pengguna, aktivasi/suspend izin bank sampah, dan audit trail buku besar. |
