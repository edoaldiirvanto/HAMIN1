# Panduan Menjalankan Aplikasi Looop

Platform digital pengelolaan sampah dan ekonomi sirkular **Looop** telah selesai dibangun sesuai spesifikasi [PRD-Looop.md](file:///d:/TA-PPSI-HAMIN1/PRD-Looop.md) dan pedoman desain Google Stitch [Looop_Design_Skill.md](file:///d:/TA-PPSI-HAMIN1/Looop_Design_Skill.md).

---

## 1. Menjalankan Aplikasi

Jalankan perintah berikut di terminal:

```bash
# Menjalankan server pengembangan (Development)
npm run dev
```

Buka peramban di: **`http://localhost:3000`**

---

## 2. Akun Demo Multi-Role

Pada halaman login (`/login`) atau langsung dari Landing Page (`/`), tersedia tombol **Akses Cepat Prototipe** untuk mencoba setiap role:

| Role | Email Demo | Password | URL Dashboard | Catatan Akses |
|---|---|---|---|---|
| **Masyarakat (Citizen)** | `citizen@looop.id` | `demo123` | [`/citizen`](http://localhost:3000/citizen) | Mobile-first bottom navigation (`Beranda`, `Jelajahi`, `Setor`, `Aktivitas`, `Profil`). Saldo terpisah per bank sampah. |
| **Bank Sampah Admin & Staff** | `bank@looop.id` | `demo123` | [`/bank`](http://localhost:3000/bank) | Sidebar desktop (240–260px). Verifikasi setoran, timbang aktual (`/bank/weighing`), approval pencairan, persediaan. |
| **Pemerintah Daerah** | `gov@slemankab.go.id` | `demo123` | [`/government`](http://localhost:3000/government) | Read-only executive dashboard: sebaran bank sampah, statistik sampah, total perputaran ekonomi daerah. |
| **Super Admin** | `admin@looop.id` | `demo123` | [`/admin`](http://localhost:3000/admin) | Master data wilayah, pengguna & role matrix, audit log transaksi keuangan. |

---

## 3. Menjalankan Uji Logika Bisnis (Unit Tests)

Untuk memverifikasi kalkulasi penimbangan dan integritas aturan saldo buku besar (ledger):

```bash
npx vitest run
```

---

## 4. Reset & Seed Ulang Database

Database menggunakan SQLite lokal (`prisma/dev.db`):

```bash
npx prisma db push
npx tsx prisma/seed.ts
```
