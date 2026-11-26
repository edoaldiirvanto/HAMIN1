# Looop
## Product Requirements Document (PRD)

**Nama Produk:** Looop  
**Dokumen:** Product Requirements Document  
**Versi:** 1.1  
**Status:** Updated — Product Rebranding & Refinement  
**Tanggal:** 26 November 2026  
**Tagline:** *Connecting Waste, Creating Value.*

---

# 1. Product Overview

## 1.1 Deskripsi Produk

Looop merupakan platform digital terintegrasi yang dirancang untuk menghubungkan masyarakat, bank sampah, dan pemerintah daerah dalam satu ekosistem pengelolaan sampah berbasis ekonomi sirkular.

Platform ini memungkinkan masyarakat menemukan bank sampah, melihat jenis sampah yang diterima beserta harga yang berlaku, mengajukan penyetoran sampah, memantau hasil penimbangan, dan memperoleh saldo digital berdasarkan transaksi yang telah diverifikasi.

Di sisi lain, bank sampah memperoleh sistem untuk mengelola operasional, menentukan harga sampah, memverifikasi transaksi, mencatat persediaan, serta mengelola pencairan saldo masyarakat.

Pemerintah daerah dapat memanfaatkan data yang terkumpul untuk memantau perkembangan pengelolaan sampah, mengevaluasi kinerja bank sampah, dan memperoleh gambaran aktivitas ekonomi sirkular di wilayahnya.

Looop menggabungkan proses digital dengan verifikasi lapangan agar transaksi tetap dapat berjalan sesuai kondisi operasional bank sampah.

## 1.2 Problem Statement

Pengelolaan bank sampah masih menghadapi beberapa permasalahan:

1. Informasi lokasi dan layanan bank sampah belum terintegrasi dalam satu platform.
2. Harga sampah berbeda-beda antarbank sampah dan sulit diketahui masyarakat.
3. Pencatatan transaksi dan saldo masih berpotensi dilakukan secara manual.
4. Masyarakat kesulitan memantau riwayat penyetoran dan nilai ekonomis sampah.
5. Bank sampah membutuhkan sistem untuk mengelola transaksi, persediaan, dan pencairan saldo.
6. Pemerintah daerah membutuhkan data terpusat untuk monitoring dan evaluasi.
7. Potensi ekonomi dari sampah belum sepenuhnya terhubung dengan aktivitas masyarakat dan bank sampah.

## 1.3 Product Vision

Menjadi ekosistem digital pengelolaan sampah yang menghubungkan masyarakat, bank sampah, dan pemerintah daerah untuk menciptakan pengelolaan sampah yang lebih transparan, terukur, dan bernilai ekonomi.

## 1.4 Product Objectives

- Mempermudah masyarakat menemukan dan menggunakan layanan bank sampah.
- Meningkatkan transparansi harga dan transaksi sampah.
- Mendigitalisasi pencatatan transaksi serta saldo masyarakat.
- Membantu bank sampah mengelola operasional secara terintegrasi.
- Menyediakan data pengelolaan sampah bagi pemerintah daerah.
- Mendorong partisipasi masyarakat dalam ekonomi sirkular.

---

# 2. Target Users & Stakeholders

## 2.1 Target Wilayah

Implementasi awal Looop difokuskan pada satu kabupaten yang terdiri atas beberapa kecamatan dan desa/kelurahan.

Sistem harus dirancang agar dapat diperluas ke wilayah administratif lain tanpa perubahan besar pada arsitektur aplikasi.

## 2.2 User Roles

### A. Super Admin

Pengelola utama platform.

Hak akses:
- Mengelola akun dan hak akses seluruh pengguna.
- Mengelola data wilayah administratif.
- Memverifikasi dan mengelola data bank sampah.
- Mengelola kategori sampah.
- Mengakses seluruh data platform.
- Memantau aktivitas dan audit log.
- Mengelola konfigurasi sistem.

### B. Government / Pemerintah Daerah

Pengguna dari instansi pemerintah daerah.

Hak akses:
- Melihat dashboard pengelolaan sampah.
- Memantau jumlah bank sampah.
- Melihat statistik transaksi dan volume sampah.
- Melihat distribusi aktivitas berdasarkan wilayah.
- Mengakses laporan dan rekapitulasi.
- Mengevaluasi perkembangan bank sampah.

Pemerintah memiliki akses monitoring dan evaluasi, bukan pengelolaan transaksi operasional atau pembayaran masyarakat.

### C. Waste Bank Admin

Pengelola bank sampah.

Hak akses:
- Mengelola profil bank sampah.
- Mengelola petugas bank sampah.
- Mengatur kategori sampah yang diterima.
- Menentukan harga beli sampah.
- Memverifikasi penyetoran.
- Mengelola saldo dan pencairan.
- Mengelola persediaan sampah.
- Melihat laporan operasional.

### D. Waste Bank Staff

Petugas operasional bank sampah.

Hak akses:
- Melihat pengajuan penyetoran.
- Melakukan pemeriksaan sampah.
- Mencatat hasil penimbangan.
- Mengunggah bukti transaksi.
- Memperbarui status transaksi sesuai kewenangan.
- Melihat riwayat transaksi operasional.

### E. Field Officer

Petugas lapangan yang dapat ditugaskan untuk membantu proses pengumpulan atau verifikasi di lapangan.

Hak akses:
- Melihat tugas lapangan.
- Memeriksa data pengajuan.
- Memverifikasi proses serah terima.
- Mengunggah dokumentasi.
- Memperbarui status tugas sesuai kewenangan.

Fitur penugasan lapangan lanjutan dapat dikembangkan setelah MVP.

### F. Citizen / Masyarakat

Pengguna utama layanan Looop.

Hak akses:
- Mendaftar dan mengelola akun.
- Menemukan bank sampah.
- Melihat harga sampah per bank.
- Mengajukan penyetoran.
- Memantau status penyetoran.
- Mengonfirmasi hasil transaksi.
- Melihat saldo per bank sampah.
- Mengajukan pencairan saldo.
- Melihat riwayat transaksi.
- Mendaftar sebagai anggota bank sampah secara opsional.

---

# 3. Business Rules

Aturan bisnis berikut merupakan dasar yang harus diterapkan dalam sistem.

## 3.1 Keanggotaan

- Masyarakat dapat melakukan transaksi tanpa harus menjadi anggota bank sampah.
- Keanggotaan bersifat opsional.
- Satu pengguna dapat menjadi anggota di lebih dari satu bank sampah.
- Keanggotaan memberikan akses terhadap fitur tambahan sesuai kebijakan bank sampah.
- Pengguna nonanggota tetap harus melewati proses verifikasi transaksi.
- Penonaktifan keanggotaan tidak menghapus riwayat transaksi.

## 3.2 Harga Sampah

- Setiap bank sampah memiliki kewenangan menentukan harga sampah sendiri.
- Harga dapat berbeda antarbank sampah.
- Harga memiliki tanggal mulai berlaku dan riwayat perubahan.
- Setiap transaksi menyimpan snapshot harga ketika transaksi diselesaikan.
- Perubahan harga tidak mengubah nilai transaksi yang sudah selesai.

## 3.3 Saldo Digital

- Saldo dicatat secara terpisah untuk setiap kombinasi pengguna dan bank sampah.
- Sistem membedakan saldo tersedia dan saldo tertahan.
- Saldo bertambah setelah transaksi penyetoran dinyatakan selesai.
- Saldo berkurang melalui transaksi pencairan yang berhasil.
- Setiap perubahan saldo harus tercatat dalam ledger.
- Koreksi transaksi dilakukan melalui jurnal penyesuaian, bukan menghapus catatan lama.

Saldo Looop merupakan catatan kewajiban pembayaran bank sampah kepada pengguna. Dana tidak otomatis disimpan atau dikelola oleh Looop.

## 3.4 Pencairan Saldo

- Pencairan dapat dilakukan melalui uang tunai atau transfer bank.
- Bank sampah bertanggung jawab melakukan pembayaran.
- Proses pencairan pada MVP dikelola secara manual oleh bank sampah.
- Saldo ditahan ketika permintaan pencairan disetujui.
- Jika pencairan gagal atau dibatalkan, saldo yang ditahan dikembalikan.
- Pemerintah daerah tidak terlibat dalam proses pembayaran.

## 3.5 Monitoring Pemerintah

- Pemerintah hanya memiliki akses monitoring dan evaluasi.
- Data ditampilkan berdasarkan wilayah dan periode.
- Data pribadi masyarakat tidak ditampilkan secara terbuka.
- Pemerintah tidak dapat mengubah transaksi atau saldo.
- Laporan harus dapat ditelusuri berdasarkan sumber data.

---

# 4. Product Scope

## 4.1 MVP Scope

MVP berfokus pada digitalisasi proses inti bank sampah dan transaksi masyarakat.

| Modul | Fitur |
|---|---|
| Authentication | Registrasi, login, reset password |
| User Management | Profil dan manajemen pengguna |
| Regional Management | Kabupaten, kecamatan, desa |
| Waste Bank | Profil dan direktori bank sampah |
| Staff Management | Pengelolaan petugas bank sampah |
| Waste Catalog | Kategori dan jenis sampah |
| Pricing | Pengaturan harga per bank sampah |
| Membership | Keanggotaan opsional |
| Deposit | Pengajuan penyetoran sampah |
| Verification | Pemeriksaan dan penimbangan |
| Transaction | Konfirmasi dan penyelesaian transaksi |
| Digital Ledger | Pencatatan saldo pengguna |
| Payout | Pengajuan dan pencatatan pencairan |
| Inventory | Pencatatan persediaan sampah |
| Government Dashboard | Monitoring dan evaluasi |
| Reporting | Laporan operasional |
| Audit Log | Riwayat aktivitas penting |

## 4.2 Out of Scope MVP

Fitur berikut tidak menjadi prioritas implementasi awal:

- Penjemputan sampah otomatis.
- Optimasi rute pengambilan sampah.
- Marketplace B2B sampah daur ulang.
- Integrasi IoT timbangan.
- Klasifikasi sampah berbasis AI.
- Prediksi volume sampah.
- Integrasi pembayaran otomatis.
- Sistem reward dan EcoPoints.
- Rekonsiliasi pembayaran otomatis.
- Analitik prediktif tingkat lanjut.

Fitur tersebut dapat dimasukkan ke dalam fase pengembangan selanjutnya.

---

# 5. Functional Requirements

## FR-01 Authentication & Authorization

Sistem harus menyediakan:
- Registrasi akun masyarakat.
- Login dan logout.
- Reset password.
- Pengelolaan sesi pengguna.
- Role-Based Access Control (RBAC).
- Pembatasan akses berdasarkan peran dan wilayah.
- Verifikasi status akun.

## FR-02 Regional Management

Sistem harus menyediakan:
- Pengelolaan data kabupaten.
- Pengelolaan kecamatan.
- Pengelolaan desa/kelurahan.
- Relasi bank sampah dengan wilayah administratif.
- Filter data berdasarkan wilayah.

## FR-03 Waste Bank Management

Sistem harus menyediakan:
- Registrasi bank sampah.
- Verifikasi bank sampah.
- Pengelolaan profil dan lokasi.
- Pengaturan jam operasional.
- Informasi layanan bank sampah.
- Pengelolaan status aktif/nonaktif.
- Pengelolaan petugas.

## FR-04 Waste Catalog & Pricing

Sistem harus menyediakan:
- Master kategori sampah.
- Jenis sampah berdasarkan kategori.
- Pengaturan harga oleh masing-masing bank sampah.
- Riwayat perubahan harga.
- Periode berlaku harga.
- Status ketersediaan jenis sampah.
- Informasi harga kepada masyarakat.

## FR-05 Membership Management

Sistem harus menyediakan:
- Pengajuan keanggotaan.
- Persetujuan atau penolakan keanggotaan.
- Status keanggotaan.
- Riwayat keanggotaan.
- Pengelolaan anggota oleh bank sampah.
- Dukungan satu pengguna menjadi anggota beberapa bank sampah.

## FR-06 Deposit Management

Sistem harus menyediakan:
- Pengajuan penyetoran sampah.
- Pemilihan bank sampah.
- Pemilihan jenis sampah.
- Perkiraan berat dan nilai transaksi.
- Pemilihan jadwal penyetoran jika diperlukan.
- Informasi status pengajuan.
- Pembatalan pengajuan sesuai aturan.
- Riwayat penyetoran.

## FR-07 Verification & Weighing

Sistem harus menyediakan:
- Pemeriksaan kondisi sampah.
- Pencatatan berat aktual.
- Penyesuaian jenis sampah berdasarkan hasil pemeriksaan.
- Penghitungan nilai transaksi berdasarkan harga yang berlaku.
- Dokumentasi transaksi.
- Konfirmasi hasil oleh masyarakat.
- Penanganan transaksi yang disengketakan.

## FR-08 Transaction Management

Sistem harus menyediakan:
- Pencatatan transaksi penyetoran.
- Perhitungan nilai transaksi.
- Penyimpanan snapshot harga.
- Pembaruan status transaksi.
- Riwayat transaksi.
- Pencegahan transaksi ganda.
- Pembatalan dan koreksi melalui mekanisme yang dapat diaudit.

## FR-09 Digital Ledger

Sistem harus menyediakan:
- Saldo per pengguna dan bank sampah.
- Saldo tersedia.
- Saldo tertahan.
- Riwayat kredit dan debit.
- Referensi transaksi.
- Jurnal penyesuaian.
- Perhitungan saldo dari catatan ledger.
- Perlindungan terhadap perubahan catatan transaksi yang sudah final.

## FR-10 Payout Management

Sistem harus menyediakan:
- Pengajuan pencairan saldo.
- Pilihan metode tunai atau transfer.
- Persetujuan oleh bank sampah.
- Status proses pencairan.
- Bukti pembayaran.
- Pengembalian saldo tertahan jika gagal.
- Riwayat pencairan.

## FR-11 Inventory Management

Sistem harus menyediakan:
- Pencatatan stok berdasarkan jenis sampah.
- Penambahan stok dari transaksi selesai.
- Pengurangan stok melalui aktivitas operasional.
- Riwayat pergerakan stok.
- Rekapitulasi stok.
- Pencatatan koreksi persediaan.

## FR-12 Government Dashboard

Sistem harus menyediakan:
- Jumlah bank sampah terdaftar.
- Jumlah bank sampah aktif.
- Jumlah pengguna.
- Total transaksi.
- Total berat sampah yang dikelola.
- Distribusi aktivitas berdasarkan wilayah.
- Tren transaksi berdasarkan periode.
- Laporan aktivitas bank sampah.

Dashboard bersifat read-only.

## FR-13 Reporting

Sistem harus menyediakan:
- Laporan transaksi.
- Laporan berat sampah.
- Laporan persediaan.
- Laporan pencairan.
- Laporan aktivitas bank sampah.
- Filter berdasarkan periode dan wilayah.
- Ekspor laporan ke format CSV atau Excel.

## FR-14 Audit Log

Sistem harus mencatat:
- Aktivitas login penting.
- Perubahan harga.
- Perubahan data bank sampah.
- Perubahan status transaksi.
- Perubahan saldo.
- Aktivitas pencairan.
- Perubahan hak akses.
- Identitas pengguna dan waktu aktivitas.

---

# 6. Core Business Workflow

## 6.1 Alur Penyetoran Sampah

1. Masyarakat masuk ke aplikasi Looop.
2. Masyarakat memilih bank sampah.
3. Masyarakat melihat daftar sampah dan harga.
4. Masyarakat membuat pengajuan penyetoran.
5. Bank sampah menerima pengajuan.
6. Masyarakat membawa sampah atau menyerahkannya melalui proses lapangan yang tersedia.
7. Petugas memeriksa dan menimbang sampah.
8. Petugas memasukkan berat aktual dan nilai transaksi.
9. Masyarakat memeriksa hasil penimbangan.
10. Masyarakat mengonfirmasi hasil.
11. Sistem menyelesaikan transaksi.
12. Sistem menambahkan saldo ke ledger pengguna.
13. Sistem memperbarui persediaan bank sampah.

## 6.2 Alur Pencairan Saldo

1. Masyarakat memilih bank sampah yang memiliki saldo.
2. Masyarakat mengajukan pencairan.
3. Sistem memeriksa saldo tersedia.
4. Bank sampah meninjau permintaan.
5. Jika disetujui, sistem menahan saldo.
6. Bank sampah melakukan pembayaran tunai atau transfer.
7. Bank sampah mencatat bukti pembayaran.
8. Sistem mengubah status menjadi Paid.
9. Ledger mencatat pengurangan saldo.

Jika pembayaran gagal, saldo yang ditahan dikembalikan melalui pencatatan ledger.

## 6.3 Alur Keanggotaan

1. Masyarakat memilih bank sampah.
2. Masyarakat mengajukan keanggotaan.
3. Bank sampah meninjau pengajuan.
4. Bank sampah menyetujui atau menolak.
5. Sistem memperbarui status keanggotaan.
6. Pengguna dapat melihat status dan riwayat keanggotaannya.

Keanggotaan tidak menjadi syarat untuk melakukan penyetoran.

---

# 7. Transaction State Management

## 7.1 Deposit Status

| Status | Deskripsi |
|---|---|
| Draft | Pengajuan sedang dibuat |
| Submitted | Pengajuan dikirim |
| Accepted | Pengajuan diterima bank |
| Rejected | Pengajuan ditolak |
| Scheduled | Jadwal penyetoran ditentukan |
| Received | Sampah diterima |
| Weighing | Proses pemeriksaan dan penimbangan |
| Awaiting Confirmation | Menunggu konfirmasi masyarakat |
| Completed | Transaksi selesai |
| Cancelled | Transaksi dibatalkan |
| Disputed | Transaksi sedang disengketakan |

Perubahan status harus mengikuti aturan transisi yang ditentukan. Transaksi yang telah selesai tidak boleh diedit langsung.

## 7.2 Payout Status

| Status | Deskripsi |
|---|---|
| Requested | Permintaan diajukan |
| Approved | Permintaan disetujui |
| Processing | Pembayaran sedang diproses |
| Paid | Pembayaran berhasil |
| Rejected | Permintaan ditolak |
| Cancelled | Permintaan dibatalkan |
| Failed | Pembayaran gagal |

---

# 8. Information Architecture

## 8.1 Citizen Application

Menu utama:
- Beranda
- Cari Bank Sampah
- Setor Sampah
- Transaksi Saya
- Saldo
- Pencairan
- Keanggotaan
- Profil

## 8.2 Waste Bank Dashboard

Menu utama:
- Dashboard
- Transaksi Masuk
- Penimbangan
- Data Masyarakat
- Keanggotaan
- Katalog Sampah
- Harga Sampah
- Persediaan
- Saldo dan Pencairan
- Laporan
- Petugas
- Pengaturan

## 8.3 Government Dashboard

Menu utama:
- Overview
- Peta Persebaran
- Bank Sampah
- Statistik Sampah
- Statistik Transaksi
- Monitoring Wilayah
- Laporan
- Evaluasi

## 8.4 Super Admin Dashboard

Menu utama:
- Overview
- Pengguna
- Wilayah
- Bank Sampah
- Kategori Sampah
- Transaksi
- Konfigurasi
- Audit Log
- Pengaturan Sistem

---

# 9. Non-Functional Requirements

## 9.1 Performance

- Target waktu respons API p95 maksimal 500 ms untuk operasi normal.
- Halaman dashboard harus menggunakan pagination dan filter.
- Query statistik harus dioptimalkan.
- Proses berat dapat dijalankan secara asynchronous.

## 9.2 Availability

- Target ketersediaan sistem 99% per bulan.
- Sistem menyediakan mekanisme backup.
- Sistem memiliki prosedur pemulihan data.

## 9.3 Security

- Seluruh komunikasi menggunakan HTTPS.
- Password disimpan dalam bentuk hash yang aman.
- Sistem menerapkan RBAC.
- Akses data dibatasi sesuai peran dan wilayah.
- Validasi dilakukan pada sisi frontend dan backend.
- Aktivitas penting dicatat dalam audit log.
- Data sensitif tidak ditampilkan kepada pengguna yang tidak berwenang.

## 9.4 Data Integrity

- Transaksi selesai tidak dapat diubah secara langsung.
- Setiap perubahan saldo memiliki catatan ledger.
- Pencairan harus memiliki referensi transaksi.
- Harga transaksi disimpan sebagai snapshot.
- Perubahan persediaan harus memiliki catatan pergerakan stok.

## 9.5 Usability

- Antarmuka responsif untuk desktop dan perangkat mobile.
- Navigasi disesuaikan dengan masing-masing peran.
- Status transaksi harus mudah dipahami.
- Formulir menggunakan validasi yang jelas.
- Bahasa antarmuka menggunakan Bahasa Indonesia.

## 9.6 Maintainability

- Backend menggunakan modular architecture.
- Dokumentasi API tersedia.
- Database memiliki migration.
- Kode menerapkan pemisahan tanggung jawab.
- Sistem mendukung pengembangan fitur secara bertahap.

---

# 10. Technical Architecture

## 10.1 Architecture Pattern

Looop menggunakan pendekatan **Modular Monolith** untuk tahap awal.

Pendekatan ini memungkinkan seluruh modul berjalan dalam satu aplikasi backend, tetapi memiliki batas tanggung jawab yang jelas sehingga dapat dikembangkan dan dipelihara secara terstruktur.

## 10.2 Recommended Technology Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Backend | NestJS |
| Database | PostgreSQL |
| Geospatial | PostGIS |
| ORM | Prisma |
| Cache | Redis |
| Authentication | JWT |
| File Storage | S3-Compatible Storage |
| API | REST API |
| Deployment | Docker |
| Web Server | Nginx |

## 10.3 Backend Modules

Struktur modul backend:

```text
src/
├── auth/
├── users/
├── roles/
├── regions/
├── waste-banks/
├── staff/
├── waste-categories/
├── pricing/
├── memberships/
├── deposits/
├── weighing/
├── transactions/
├── ledger/
├── payouts/
├── inventory/
├── monitoring/
├── reports/
├── notifications/
├── audit-logs/
└── common/
```

## 10.4 Database Domains

1. Identity Domain
2. Regional Domain
3. Waste Bank Domain
4. Catalog & Pricing Domain
5. Membership Domain
6. Deposit & Transaction Domain
7. Finance & Ledger Domain
8. Inventory Domain
9. Monitoring & Governance Domain
10. Audit & Notification Domain

## 10.5 Database Design Principles

- Satu pengguna dapat memiliki keanggotaan pada beberapa bank sampah.
- Setiap bank sampah memiliki pengaturan harga sendiri.
- Harga transaksi disimpan sebagai snapshot.
- Saldo dipisahkan berdasarkan pengguna dan bank sampah.
- Ledger menggunakan pendekatan append-only.
- Koreksi saldo menggunakan jurnal penyesuaian.
- Persediaan memiliki riwayat pergerakan.
- Data wilayah menjadi dasar pengelompokan monitoring pemerintah.

---

# 11. UI/UX Design Guidelines

## 11.1 Design Direction

Looop menggunakan pendekatan desain modern, bersih, ramah lingkungan, dan mudah digunakan.

Karakter visual:
- Modern.
- Minimalis.
- Professional.
- Eco-friendly.
- Data-driven.
- Mobile responsive.

## 11.2 Visual Identity Direction

Arah identitas visual yang disarankan:

- Warna utama: hijau sebagai representasi lingkungan dan keberlanjutan.
- Warna sekunder: putih dan abu-abu netral.
- Warna aksen: kuning atau oranye untuk penekanan informasi.
- Tipografi: sans-serif modern.
- Ikon: sederhana dan mudah dikenali.

Logo Looop dapat mengembangkan konsep tiga huruf "o" sebagai simbol siklus, konektivitas, dan perputaran nilai ekonomi.

## 11.3 UX Principles

- Masyarakat dapat menemukan bank sampah dengan cepat.
- Harga sampah ditampilkan secara transparan.
- Proses penyetoran dibuat sesederhana mungkin.
- Saldo dan riwayat transaksi mudah dipahami.
- Dashboard bank sampah berorientasi pada pekerjaan operasional.
- Dashboard pemerintah berorientasi pada monitoring dan analitik.

---

# 12. Integrations

Integrasi yang dapat dipertimbangkan:

| Integrasi | Tujuan | Prioritas |
|---|---|---|
| Maps / Geolocation | Lokasi bank sampah | MVP |
| Email Service | Notifikasi akun | MVP |
| WhatsApp Notification | Informasi transaksi | Later |
| Object Storage | Dokumentasi transaksi | MVP |
| Payment Gateway | Pencairan otomatis | Later |
| IoT Weighing Scale | Otomatisasi penimbangan | Later |
| Analytics Service | Analisis lanjutan | Later |

Integrasi pihak ketiga harus menggunakan konfigurasi dan kredensial yang aman.

---

# 13. Product Roadmap

## Phase 1 — Product Foundation

Fokus:
- Finalisasi kebutuhan bisnis.
- Finalisasi PRD.
- Perancangan arsitektur.
- Perancangan database.
- Spesifikasi API.
- Desain UI/UX.
- Setup repository dan development environment.

## Phase 2 — Core Platform

Fokus:
- Authentication dan authorization.
- Manajemen pengguna.
- Manajemen wilayah.
- Manajemen bank sampah.
- Manajemen petugas.
- Kategori sampah.
- Pengaturan harga.
- Keanggotaan.

## Phase 3 — Core Transaction

Fokus:
- Pengajuan penyetoran.
- Verifikasi dan penimbangan.
- Konfirmasi masyarakat.
- Penyelesaian transaksi.
- Digital ledger.
- Pencairan manual.
- Persediaan.

## Phase 4 — Monitoring & Reporting

Fokus:
- Dashboard pemerintah.
- Dashboard bank sampah.
- Statistik wilayah.
- Laporan transaksi.
- Ekspor data.
- Audit log.

## Phase 5 — Ecosystem Expansion

Fokus:
- Penjemputan sampah.
- Peta dan optimasi rute.
- EcoPoints.
- Marketplace B2B.
- Integrasi pembayaran.
- Integrasi IoT.
- Analitik dan prediksi berbasis AI.

---

# 14. Success Metrics & KPIs

| Indikator | Pengukuran |
|---|---|
| Bank Sampah Terdaftar | Jumlah bank sampah yang terdaftar |
| Bank Sampah Aktif | Jumlah bank sampah yang aktif bertransaksi |
| Registered Users | Jumlah pengguna terdaftar |
| Active Users | Pengguna aktif dalam periode tertentu |
| Deposit Transactions | Jumlah transaksi penyetoran |
| Waste Volume | Total berat sampah yang dikelola |
| Transaction Value | Total nilai transaksi sampah |
| Successful Payout | Jumlah pencairan berhasil |
| Transaction Completion Rate | Persentase transaksi yang selesai |
| Platform Availability | Persentase ketersediaan sistem |

Target angka KPI perlu ditentukan setelah tersedia baseline operasional dari wilayah implementasi.

---

# 15. Risks & Mitigation

| Risiko | Mitigasi |
|---|---|
| Data harga tidak akurat | Riwayat harga dan hak akses pengelolaan |
| Manipulasi berat sampah | Verifikasi dan dokumentasi penimbangan |
| Sengketa transaksi | Mekanisme konfirmasi dan dispute |
| Kesalahan pencatatan saldo | Ledger dan rekonsiliasi |
| Pencairan tidak dilakukan bank | Status pencairan dan bukti pembayaran |
| Kualitas data rendah | Validasi dan audit log |
| Pengguna kesulitan menggunakan aplikasi | UX sederhana dan panduan |
| Bank sampah tidak aktif | Monitoring status operasional |
| Gangguan layanan | Backup dan prosedur pemulihan |

---

# 16. Open Business Decisions

Beberapa kebijakan masih perlu divalidasi dengan calon pengelola bank sampah dan pemangku kepentingan sebelum implementasi produksi.

1. **Membership Benefits:** Fitur tambahan apa yang diperoleh anggota?
2. **Minimum Payout:** Apakah terdapat batas minimum pencairan?
3. **Payout Fee:** Apakah pencairan dikenakan biaya?
4. **Payout SLA:** Berapa lama bank sampah wajib memproses pencairan?
5. **Dispute Resolution:** Siapa yang berwenang menyelesaikan sengketa transaksi?
6. **Deposit Expiry:** Kapan pengajuan penyetoran kedaluwarsa?
7. **Weighing Adjustment:** Bagaimana jika masyarakat tidak menyetujui hasil penimbangan?
8. **Bank Deactivation:** Bagaimana penanganan saldo dan transaksi ketika bank sampah dinonaktifkan?

Keputusan tersebut harus ditetapkan sebelum sistem digunakan dalam operasional nyata.

---

# 17. MVP Acceptance Criteria

MVP Looop dapat dinyatakan memenuhi kebutuhan awal apabila:

- [ ] Pengguna dapat melakukan registrasi dan login.
- [ ] Pengguna dapat menemukan bank sampah.
- [ ] Pengguna dapat melihat harga sampah setiap bank.
- [ ] Pengguna dapat melakukan transaksi tanpa menjadi anggota.
- [ ] Pengguna dapat mengajukan penyetoran sampah.
- [ ] Petugas dapat memverifikasi dan mencatat hasil penimbangan.
- [ ] Masyarakat dapat mengonfirmasi hasil transaksi.
- [ ] Transaksi selesai menghasilkan catatan saldo yang benar.
- [ ] Saldo tercatat secara terpisah untuk setiap bank sampah.
- [ ] Pengguna dapat mengajukan pencairan saldo.
- [ ] Bank sampah dapat memproses pencairan secara manual.
- [ ] Persediaan bank sampah diperbarui berdasarkan transaksi.
- [ ] Pemerintah dapat melihat statistik pengelolaan sampah.
- [ ] Aktivitas penting tercatat dalam audit log.
- [ ] Hak akses setiap peran berjalan sesuai kewenangan.

---

# 18. Product Positioning

## Looop — Connecting Waste, Creating Value.

Looop bukan sekadar aplikasi pencatatan sampah, melainkan platform digital yang menghubungkan aktivitas masyarakat, operasional bank sampah, dan monitoring pemerintah dalam satu ekosistem ekonomi sirkular.

Dengan mengintegrasikan informasi, transaksi, saldo, persediaan, dan data wilayah, Looop membantu mengubah sampah dari sesuatu yang sering dianggap tidak bernilai menjadi sumber daya yang memiliki nilai ekonomi.

**Looop: Menghubungkan Sampah, Menggerakkan Ekonomi Sirkular.**

---

**End of Document — Looop PRD v1.1**