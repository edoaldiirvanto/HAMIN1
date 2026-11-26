# Looop Design Skill

## Panduan Desain UI/UX dan Prompt Google Stitch

**Produk:** Looop\
**Tagline:** *Connecting Waste, Creating Value.*\
**Versi Skill:** 1.0\
**Basis Produk:** Looop PRD v1.1\
**Tanggal:** 26 November 2026

------------------------------------------------------------------------

## 1. Tujuan Skill

Dokumen ini menjadi pedoman utama untuk merancang seluruh antarmuka
digital Looop agar memiliki identitas visual, pola interaksi, struktur
navigasi, dan kualitas pengalaman pengguna yang konsisten.

Skill ini digunakan sebagai referensi ketika: - Membuat atau memperbarui
desain di Google Stitch. - Mengembangkan halaman baru. - Membuat
dashboard berdasarkan role. - Menyempurnakan UI yang sudah dihasilkan. -
Menyerahkan desain kepada developer. - Memastikan desain tetap sesuai
dengan kebutuhan produk dalam PRD.

**Prinsip utama:** seluruh antarmuka Looop harus terasa sebagai satu
produk yang sama, meskipun digunakan oleh jenis pengguna yang berbeda.

------------------------------------------------------------------------

## 2. Identitas Produk

### 2.1 Deskripsi

Looop adalah platform digital pengelolaan sampah dan ekonomi sirkular
yang menghubungkan masyarakat, bank sampah, dan pemerintah daerah dalam
satu ekosistem.

Platform mendukung: - Masyarakat menemukan bank sampah dan menyetorkan
sampah. - Bank sampah mengelola harga, transaksi, penimbangan, saldo,
pencairan, dan persediaan. - Pemerintah daerah memantau data dan
mengevaluasi aktivitas pengelolaan sampah.

### 2.2 Positioning

Looop bukan sekadar aplikasi pencatatan sampah. Looop merupakan
ekosistem digital yang menghubungkan aktivitas masyarakat, operasional
bank sampah, dan monitoring pemerintah untuk mengubah sampah menjadi
sumber daya yang memiliki nilai ekonomi.

### 2.3 Brand Message

**Nama:** Looop\
**Tagline:** Connecting Waste, Creating Value.\
**Pesan utama:** Menghubungkan Sampah, Menggerakkan Ekonomi Sirkular.

### 2.4 Arah Logo

-   Gunakan wordmark `Looop`.
-   Simbol dapat mengambil inspirasi dari tiga bentuk lingkaran atau
    tiga huruf "o" yang saling terhubung.
-   Makna visual: siklus, konektivitas, penggunaan kembali, dan
    perputaran nilai.
-   Utamakan bentuk sederhana, mudah dikenali, dan tetap terbaca pada
    ukuran kecil.
-   Hindari menjadikan ikon daun generik sebagai simbol utama.
-   Jangan mengubah bentuk logo secara acak antarhalaman.

------------------------------------------------------------------------

## 3. Prinsip Desain

Semua desain Looop wajib mengikuti prinsip berikut:

1.  **Modern:** menggunakan pola antarmuka SaaS masa kini.
2.  **Eco-tech:** menunjukkan tema lingkungan melalui warna dan konteks,
    bukan dekorasi berlebihan.
3.  **Clear:** informasi, status, harga, dan nilai transaksi mudah
    dipahami.
4.  **Trustworthy:** desain memberikan kesan aman, transparan, dan dapat
    dipercaya.
5.  **Accessible:** dapat digunakan oleh masyarakat dengan tingkat
    literasi digital yang beragam.
6.  **Consistent:** komponen, warna, tipografi, ikon, dan jarak harus
    konsisten.
7.  **Responsive:** pengalaman tetap baik di desktop, tablet, dan
    mobile.
8.  **Role-aware:** navigasi dan tindakan disesuaikan dengan kewenangan
    setiap pengguna.

### 3.1 Hindari

-   Tampilan seperti template website pemerintahan yang kaku.
-   Penggunaan warna hijau secara berlebihan.
-   Gradien mencolok di hampir semua elemen.
-   Ilustrasi kartun yang tidak relevan.
-   Terlalu banyak kartu dan panel dekoratif.
-   Bayangan tebal dan efek glassmorphism berlebihan.
-   Tabel terlalu padat tanpa filter atau hierarki.
-   Tombol atau menu yang tidak sesuai dengan role pengguna.
-   Data dummy yang tidak realistis.
-   Mencampur saldo dari beberapa bank sampah menjadi satu saldo yang
    dapat dicairkan.

------------------------------------------------------------------------

## 4. Design Tokens

### 4.1 Color Palette

  --------------------------------------------------------------------------
  Token             Nama              Hex               Penggunaan
  ----------------- ----------------- ----------------- --------------------
  Primary           Deep Forest       `#123D32`         Brand, sidebar,
                                                        heading penting

  Secondary         Eco Green         `#2F805C`         Tombol utama, active
                                                        state

  Accent            Fresh Green       `#B8E4C5`         Highlight ringan,
                                                        elemen pendukung

  Background        Soft Neutral      `#F5F7F2`         Latar halaman

  Surface           White             `#FFFFFF`         Card, modal, panel

  Text Primary      Dark Text         `#17231D`         Teks utama

  Text Secondary    Muted Green Gray  `#68756D`         Deskripsi dan
                                                        metadata

  Border            Soft Border       `#E4EAE4`         Garis pemisah dan
                                                        outline

  Success           Green             `#23865B`         Status berhasil

  Warning           Amber             `#E7A23B`         Menunggu/perhatian

  Danger            Red               `#D9534F`         Gagal/ditolak

  Info              Blue              `#4385C5`         Informasi
  --------------------------------------------------------------------------

**Aturan penggunaan warna:** - Deep Forest menjadi jangkar identitas
visual. - Eco Green digunakan untuk aksi utama dan state aktif. - Fresh
Green hanya untuk highlight yang membutuhkan penekanan lembut. -
Background utama menggunakan Soft Neutral, bukan hijau pekat. - Warna
semantik hanya digunakan untuk status yang relevan. - Pastikan kontras
teks dan latar mudah dibaca.

### 4.2 Typography

**Font utama:** Plus Jakarta Sans.

  Elemen              Ukuran rekomendasi Weight
  ----------------- -------------------- ----------
  Page title                   28--32 px Bold
  Section title                18--22 px Semibold
  Card title                   15--17 px Semibold
  Body                         14--15 px Regular
  Supporting text              12--13 px Regular
  Button                           14 px Semibold

Gunakan hierarki yang jelas. Hindari terlalu banyak variasi ukuran dan
weight dalam satu halaman.

### 4.3 Spacing dan Shape

-   Gunakan sistem jarak berbasis kelipatan 4 atau 8 px.
-   Padding konten dashboard desktop: 28--32 px.
-   Jarak antarkartu: 16--24 px.
-   Input dan button: radius 10 px.
-   Card: radius 14 px.
-   Modal: radius 16 px.
-   Gunakan border tipis dan shadow yang sangat halus.
-   Jangan menggunakan radius yang berbeda tanpa alasan fungsional.

### 4.4 Iconography

Gunakan ikon outline bergaya Lucide dengan ukuran dan ketebalan stroke
yang konsisten.

Ikon yang direkomendasikan: - Recycle - Leaf - MapPin - Wallet - Scale -
Package - ChartNoAxesCombined - Users - Building2 - ClipboardList -
ArrowUpRight - ArrowDownRight - Settings - Bell - Search

Ikon harus membantu pemahaman, bukan menjadi dekorasi yang tidak
memiliki fungsi.

------------------------------------------------------------------------

## 5. Layout dan Navigation System

### 5.1 Desktop Dashboard

-   Sidebar kiri sekitar 240--260 px.
-   Header atas sekitar 64--72 px.
-   Area konten fleksibel.
-   Padding konten 28--32 px.
-   Gunakan grid yang konsisten.
-   Tabel dan grafik harus tetap terbaca pada resolusi laptop umum.

### 5.2 Citizen Mobile App

Gunakan pendekatan mobile-first dengan bottom navigation:

1.  Beranda
2.  Jelajahi
3.  Setor
4.  Aktivitas
5.  Profil

Aksi utama seperti setor sampah harus mudah ditemukan dan tidak
tersembunyi di dalam banyak menu.

### 5.3 Responsive Behavior

-   Desktop: sidebar tetap dan konten multi-kolom.
-   Tablet: sidebar dapat dipadatkan atau menjadi drawer.
-   Mobile: navigasi dashboard disederhanakan, tabel berubah menjadi
    list/card bila diperlukan.
-   Form harus menggunakan lebar layar secara efektif.
-   Tombol utama harus mudah dijangkau dan memiliki area sentuh memadai.
-   Jangan sekadar mengecilkan tampilan desktop untuk menghasilkan
    mobile.

------------------------------------------------------------------------

## 6. Komponen UI Standar

Buat dan gunakan kembali komponen berikut:

### 6.1 Navigation

-   Sidebar
-   Top navigation
-   Breadcrumb
-   Mobile bottom navigation
-   Tab navigation
-   Dropdown menu

### 6.2 Actions

-   Primary button
-   Secondary button
-   Ghost button
-   Destructive button
-   Icon button
-   Floating action button jika benar-benar diperlukan

### 6.3 Forms

-   Text input
-   Password input
-   Search input
-   Select
-   Date picker
-   Textarea
-   Checkbox
-   Radio group
-   File upload
-   Form validation message

### 6.4 Data Display

-   Statistic card
-   Data table
-   List item
-   Chart container
-   Progress indicator
-   Status badge
-   Timeline
-   Empty state
-   Loading state
-   Error state

### 6.5 Feedback

-   Toast notification
-   Modal
-   Confirmation dialog
-   Alert banner
-   Tooltip
-   Inline validation

**Aturan:** komponen yang memiliki fungsi sama harus memiliki tampilan
dan perilaku yang sama di seluruh modul.

------------------------------------------------------------------------

## 7. Status dan Pola Transaksi

### 7.1 Deposit Status

  Status                  Makna                 Perlakuan visual
  ----------------------- --------------------- ------------------
  Draft                   Belum dikirim         Neutral
  Submitted               Diajukan              Info
  Accepted                Diterima bank         Info/Success
  Rejected                Ditolak               Danger
  Scheduled               Terjadwal             Info
  Received                Sampah diterima       Info
  Weighing                Sedang ditimbang      Warning
  Awaiting Confirmation   Menunggu konfirmasi   Warning
  Completed               Selesai               Success
  Cancelled               Dibatalkan            Neutral
  Disputed                Disengketakan         Danger/Warning

### 7.2 Payout Status

  Status       Makna        Perlakuan visual
  ------------ ------------ ------------------
  Requested    Diajukan     Info
  Approved     Disetujui    Info
  Processing   Diproses     Warning
  Paid         Dibayar      Success
  Rejected     Ditolak      Danger
  Cancelled    Dibatalkan   Neutral
  Failed       Gagal        Danger

Jangan hanya mengandalkan warna. Selalu tampilkan label status yang
jelas.

### 7.3 Financial UI Rules

-   Saldo harus dipisahkan berdasarkan bank sampah.
-   Tampilkan saldo tersedia dan saldo tertahan secara terpisah.
-   Gunakan format Rupiah Indonesia, misalnya `Rp125.000`.
-   Berat sampah menggunakan satuan yang jelas, misalnya `12,5 kg`.
-   Nilai perkiraan harus dibedakan dari nilai final.
-   Tampilkan harga per satuan dan total perhitungan.
-   Riwayat saldo harus menunjukkan kredit, debit, waktu, dan referensi
    transaksi.
-   Jangan menampilkan saldo gabungan lintas bank sebagai satu saldo
    yang dapat dicairkan.

### 7.4 Weighing UI Rules

Form penimbangan harus menampilkan: - Identitas transaksi. - Nama
masyarakat. - Kategori sampah. - Harga per satuan yang berlaku. - Berat
aktual. - Total nilai transaksi. - Dokumentasi foto. - Catatan
petugas. - Ringkasan sebelum dikirim untuk konfirmasi.

Rumus nilai transaksi:

`Nilai transaksi = Berat aktual × Harga per satuan`

Jelaskan bahwa nilai estimasi dapat berubah setelah pemeriksaan dan
penimbangan fisik.

------------------------------------------------------------------------

## 8. Kategori Produk dan Pola Desain per Role

### 8.1 Public Website

**Tujuan:** memperkenalkan Looop dan mengajak pengguna bergabung.

Halaman: 1. Landing page. 2. Tentang Looop. 3. Cara kerja. 4. Direktori
bank sampah. 5. Dampak lingkungan. 6. Login dan registrasi.

Prioritas desain: - Hero yang kuat. - Penjelasan manfaat. - Cara kerja
yang ringkas. - Statistik dampak. - CTA yang jelas. - Preview aplikasi
yang realistis.

### 8.2 Citizen Application

**Tujuan:** membantu masyarakat menemukan bank sampah, menyetor sampah,
dan memantau nilai ekonominya.

Halaman: 1. Beranda. 2. Jelajahi bank sampah. 3. Detail bank sampah. 4.
Form pengajuan setoran. 5. Pelacakan setoran. 6. Detail transaksi. 7.
Saldo per bank sampah. 8. Pencairan saldo. 9. Keanggotaan. 10. Profil
dan pengaturan.

Prioritas desain: - Mobile-first. - Bahasa sederhana. - Alur setor
singkat. - Harga transparan. - Timeline status. - Saldo mudah dipahami.

Aturan bisnis yang harus terlihat: - Masyarakat boleh bertransaksi tanpa
menjadi anggota. - Harga ditentukan masing-masing bank sampah. - Saldo
dipisahkan per bank sampah. - Nilai akhir mengikuti hasil pemeriksaan
dan penimbangan.

### 8.3 Waste Bank Dashboard

**Tujuan:** membantu pengelola menjalankan operasional bank sampah.

Halaman: 1. Dashboard overview. 2. Transaksi masuk. 3. Penimbangan dan
verifikasi. 4. Konfirmasi transaksi. 5. Data masyarakat. 6. Keanggotaan.
7. Kategori sampah. 8. Pengaturan harga. 9. Persediaan. 10. Saldo dan
pencairan. 11. Laporan. 12. Manajemen petugas.

Prioritas desain: - Operational efficiency. - Tabel yang mudah
dipindai. - Filter dan pencarian. - Form penimbangan yang jelas. -
Informasi harga dan stok. - Status transaksi yang mudah dilacak.

### 8.4 Government Dashboard

**Tujuan:** monitoring dan evaluasi pengelolaan sampah pada tingkat
wilayah.

Halaman: 1. Executive overview. 2. Persebaran bank sampah. 3. Statistik
sampah. 4. Analitik transaksi. 5. Monitoring wilayah. 6. Laporan.

Prioritas desain: - KPI tingkat wilayah. - Peta persebaran. - Tren
bulanan/tahunan. - Perbandingan kecamatan/desa. - Kategori sampah. -
Ekspor laporan.

**Batas kewenangan:** dashboard pemerintah bersifat read-only. Jangan
tampilkan tombol untuk mengubah transaksi, saldo, harga, atau pencairan.

### 8.5 Super Admin Dashboard

**Tujuan:** mengelola platform secara keseluruhan.

Halaman: 1. Overview platform. 2. Pengguna. 3. Role dan permission. 4.
Wilayah. 5. Bank sampah. 6. Kategori sampah. 7. Monitoring transaksi. 8.
Audit log. 9. Konfigurasi sistem.

Prioritas desain: - Manajemen data. - Pengaturan hak akses. - Verifikasi
bank sampah. - Monitoring lintas modul. - Audit trail.

### 8.6 Authentication and Onboarding

Halaman: 1. Login. 2. Registrasi. 3. Verifikasi OTP. 4. Lupa password.
5. Reset password. 6. Onboarding. 7. Pengalihan berdasarkan role.

Gunakan form sederhana, instruksi jelas, dan feedback yang mudah
dimengerti.

------------------------------------------------------------------------

## 9. Prompt Library Google Stitch

Gunakan prompt berikut secara bertahap. Jalankan Master Design System
terlebih dahulu, kemudian prompt per kategori. Pertahankan project
Stitch yang sama dan gunakan hasil desain utama sebagai referensi untuk
generasi berikutnya.

### 9.1 Master Design System Prompt

``` text
Design a premium, modern, production-ready design system for Looop, an integrated waste management and circular economy platform connecting citizens, waste banks, and local government.

Brand tagline: "Connecting Waste, Creating Value."

Use a modern SaaS + Eco-Tech + minimalist visual direction.

Brand colors:
- Deep Forest #123D32
- Eco Green #2F805C
- Fresh Green #B8E4C5
- Background #F5F7F2
- Surface #FFFFFF
- Text Primary #17231D
- Text Secondary #68756D
- Border #E4EAE4
- Success #23865B
- Warning #E7A23B
- Danger #D9534F
- Info #4385C5

Typography: Plus Jakarta Sans.

Use consistent spacing based on 4px/8px increments, 10px input/button radius, 14px card radius, and 16px modal radius.

Create reusable buttons, inputs, tables, cards, badges, modals, tabs, navigation, charts, empty states, loading states, and error states.

Use Lucide-style outline icons.

Desktop dashboards use a 240–260px sidebar and 64–72px top header. Citizen application uses mobile-first bottom navigation.

Create a minimal Looop logo based on three connected circular forms or three connected "o" shapes. Do not use a generic leaf as the primary logo.

The interface must be modern, clear, trustworthy, accessible, responsive, and implementation-ready.

Avoid excessive gradients, cartoon illustrations, heavy shadows, clutter, and generic government portal styling.

This is the single source of truth for every subsequent Looop screen. Do not introduce new colors, fonts, radii, or unrelated visual patterns.
```

### 9.2 Public Website Prompt

``` text
Using the established Looop Design System, design the public landing page for Looop.

The purpose is to introduce Looop as an integrated digital waste management and circular economy platform.

Create:
1. Navigation with Looop logo, Beranda, Tentang, Cara Kerja, Bank Sampah, Dampak, Login, and Daftar.
2. Hero headline: "Ubah Sampah Menjadi Nilai, Mulai dari Sekarang."
3. Supporting copy explaining how citizens can find waste banks, deposit waste, and track its economic value.
4. Primary CTA "Mulai Sekarang" and secondary CTA "Pelajari Cara Kerja".
5. Illustrative platform statistics, clearly marked as sample data.
6. Three-step how-it-works section.
7. Featured waste bank directory.
8. Benefits for citizens, waste banks, and local government.
9. Environmental impact section.
10. Closing CTA and complete footer.

Use realistic Indonesian content. Show a realistic product preview rather than a generic recycling illustration.

Maintain the exact Looop colors, typography, spacing, components, and visual language.
```

### 9.3 Citizen Application Prompt

``` text
Using the established Looop Design System, design the complete mobile-first citizen application.

Use bottom navigation:
Beranda, Jelajahi, Setor, Aktivitas, Profil.

Create screens for:
1. Citizen home dashboard.
2. Waste bank discovery with search and filters.
3. Waste bank detail with location, accepted waste, operating hours, and bank-specific prices.
4. Multi-step deposit submission.
5. Deposit tracking timeline.
6. Transaction detail and citizen confirmation.
7. Digital balance grouped separately by waste bank.
8. Payout request using cash or bank transfer.
9. Optional waste bank membership.
10. Profile and settings.

Show available and held balances separately. Never combine balances from different waste banks into one withdrawable balance.

Make it clear that membership is optional and that each waste bank determines its own prices.

Use Indonesian Rupiah and realistic Indonesian sample data. Make the interface simple, friendly, accessible, and easy to use.
```

### 9.4 Waste Bank Dashboard Prompt

``` text
Using the established Looop Design System, design a professional desktop-first waste bank management dashboard.

Create a persistent sidebar with:
Dashboard, Transaksi Masuk, Penimbangan, Data Masyarakat, Keanggotaan, Kategori Sampah, Harga Sampah, Persediaan, Saldo dan Pencairan, Laporan, Petugas, Pengaturan.

Create screens for:
1. Operational overview with KPIs and charts.
2. Incoming deposit table with search, filters, and pagination.
3. Weighing and verification form with actual weight, current bank-specific price, automatic value calculation, photo upload, and notes.
4. Transactions awaiting citizen confirmation.
5. Citizen directory and transaction history.
6. Membership management.
7. Waste category management.
8. Bank-specific pricing with effective dates and price history.
9. Inventory and stock movement.
10. Payout requests with approval, processing, proof of payment, and failure handling.
11. Operational reports with CSV/Excel export.
12. Staff management and role assignment.

Waste Bank Admin has full operational permissions. Waste Bank Staff only sees authorized operational functions.

Prioritize clear tables, efficient workflows, and transparent financial information.
```

### 9.5 Government Dashboard Prompt

``` text
Using the established Looop Design System, design a professional local government environmental monitoring dashboard.

The dashboard is read-only and supports monitoring and evaluation.

Create:
1. Executive overview with total waste banks, active banks, registered citizens, managed waste volume, transactions, and economic value.
2. Geographic distribution map of waste banks.
3. Waste statistics by category and period.
4. Transaction analytics and trends.
5. Regional monitoring and comparisons by kecamatan and desa/kelurahan.
6. Reports with date filters and export options.

Use KPI cards, line charts, bar charts, donut charts, and geographic visualization only where they provide useful information.

Do not include actions to edit transactions, balances, prices, or process payouts.

Use clearly labeled sample data and maintain the exact Looop visual identity.
```

### 9.6 Super Admin Dashboard Prompt

``` text
Using the established Looop Design System, design an enterprise-grade platform administration dashboard.

Create navigation for:
Overview, Pengguna, Role & Permissions, Wilayah, Bank Sampah, Kategori Sampah, Transaksi, Konfigurasi, Audit Log, Pengaturan Sistem.

Create screens for:
1. Platform overview.
2. User management.
3. Role and permission matrix.
4. Hierarchical regional management.
5. Waste bank registration and verification.
6. Master waste category management.
7. Transaction monitoring.
8. Audit log with actor, role, timestamp, module, and action.
9. System configuration.

Use clear administrative tables, filters, confirmation dialogs, and audit-friendly detail views.

Completed financial records must not be directly editable. Preserve role-based access boundaries and the Looop visual identity.
```

### 9.7 Authentication and Onboarding Prompt

``` text
Using the established Looop Design System, design the authentication and onboarding experience.

Create:
1. Login.
2. Registration.
3. OTP verification.
4. Forgot password.
5. Reset password.
6. Three-step onboarding introducing how to find a waste bank, deposit waste, and track its economic value.
7. Role-based redirection after successful login.

Use clean forms, clear validation, accessible controls, friendly feedback, and responsive layouts.

Maintain the same Looop logo, colors, typography, and component styles.
```

### 9.8 Design Refinement Prompt

``` text
Review and refine all previously generated Looop screens without redesigning the product from scratch.

Use the established Looop Master Design System as the single source of truth.

Check:
1. Exact color consistency.
2. Plus Jakarta Sans typography.
3. Consistent buttons, inputs, cards, tables, and modals.
4. Consistent spacing, border radius, shadows, and icon sizes.
5. Consistent sidebar and header dimensions.
6. Consistent citizen mobile bottom navigation.
7. Consistent status labels and semantic colors.
8. Consistent chart styling.
9. Correct role-based navigation and permissions.
10. Responsive desktop, tablet, and mobile behavior.
11. Indonesian interface language.
12. Realistic and consistent sample data.

Remove unnecessary decoration, improve information hierarchy, and ensure all screens feel like one premium, production-ready product.
```

------------------------------------------------------------------------

## 10. Aturan Konten dan Data Dummy

Gunakan konten berbahasa Indonesia untuk seluruh UI.

### 10.1 Format Data

-   Mata uang: Rupiah, contoh `Rp125.000`.
-   Berat: kilogram, contoh `12,5 kg`.
-   Tanggal: `26 Nov 2026` atau format tanggal Indonesia yang konsisten.
-   Nomor transaksi: `LOO-TRX-000001`.
-   Nomor pengajuan: `LOO-DEP-000001`.
-   Nama wilayah: gunakan contoh wilayah Indonesia yang realistis.
-   Harga: selalu tampilkan satuan, misalnya `Rp5.000/kg`.

### 10.2 Konsistensi Sample Data

Jika satu transaksi muncul di beberapa halaman, gunakan: - ID transaksi
yang sama. - Nama masyarakat yang sama. - Bank sampah yang sama. - Berat
dan harga yang sama. - Status sesuai alur transaksi. - Nilai Rupiah yang
konsisten.

Jangan membuat angka yang saling bertentangan antar-dashboard.

### 10.3 Microcopy

Gunakan bahasa yang: - Singkat. - Jelas. - Ramah. - Tidak terlalu teknis
untuk masyarakat. - Profesional untuk dashboard operasional dan
pemerintah.

Contoh: - "Setor Sampah" - "Cari Bank Sampah" - "Menunggu Konfirmasi" -
"Saldo Tersedia" - "Saldo Tertahan" - "Lihat Detail Transaksi" - "Harga
dapat berbeda di setiap bank sampah."

------------------------------------------------------------------------

## 11. Accessibility dan Responsive Checklist

Sebelum desain dianggap selesai, periksa:

-   [ ] Kontras teks dan latar memadai.
-   [ ] Status tidak hanya dibedakan dengan warna.
-   [ ] Tombol memiliki label yang jelas.
-   [ ] Form memiliki label dan pesan error.
-   [ ] Area sentuh mobile memadai.
-   [ ] Teks tetap terbaca pada layar kecil.
-   [ ] Tabel memiliki alternatif tampilan mobile.
-   [ ] Navigasi keyboard dipertimbangkan untuk web.
-   [ ] Empty, loading, success, dan error state tersedia.
-   [ ] Modal memiliki aksi yang jelas.
-   [ ] Tidak ada informasi penting yang hanya ditampilkan melalui ikon.

------------------------------------------------------------------------

## 12. Design QA Checklist

### Brand

-   [ ] Nama produk selalu `Looop`.
-   [ ] Tagline konsisten.
-   [ ] Logo dan wordmark tidak berubah-ubah.
-   [ ] Tidak ada sisa nama RecyConnect.

### Visual

-   [ ] Palet warna sesuai design tokens.
-   [ ] Tipografi menggunakan Plus Jakarta Sans.
-   [ ] Spacing konsisten.
-   [ ] Radius dan shadow konsisten.
-   [ ] Ikon menggunakan satu gaya.

### UX

-   [ ] Navigasi sesuai role.
-   [ ] Alur utama mudah ditemukan.
-   [ ] CTA memiliki tujuan yang jelas.
-   [ ] Form mudah diselesaikan.
-   [ ] Status transaksi mudah dipahami.
-   [ ] Tidak ada tombol tanpa fungsi yang jelas.

### Business Rules

-   [ ] Transaksi masyarakat tidak mewajibkan membership.
-   [ ] Harga bersifat spesifik per bank sampah.
-   [ ] Saldo terpisah per bank sampah.
-   [ ] Saldo tersedia dan tertahan dibedakan.
-   [ ] Nilai estimasi dibedakan dari nilai final.
-   [ ] Pemerintah hanya memiliki akses read-only.
-   [ ] Transaksi final tidak dapat diedit secara langsung.

### Responsive

-   [ ] Desktop.
-   [ ] Tablet.
-   [ ] Mobile.
-   [ ] Tidak ada konten terpotong.
-   [ ] Navigasi tetap mudah digunakan.

------------------------------------------------------------------------

## 13. Workflow Penggunaan Skill

Ikuti tahapan berikut ketika membuat desain baru:

1.  **Baca kebutuhan:** identifikasi modul, role, tujuan halaman, dan
    business rules terkait.
2.  **Pilih kategori:** Public, Citizen, Waste Bank, Government, Super
    Admin, atau Authentication.
3.  **Gunakan Master Design System:** pastikan proyek Stitch memakai
    fondasi visual yang sama.
4.  **Jalankan prompt kategori:** generate halaman sesuai kelompoknya.
5.  **Periksa alur:** pastikan halaman mendukung proses bisnis yang
    benar.
6.  **Periksa konsistensi:** bandingkan warna, komponen, tipografi,
    navigasi, dan spacing.
7.  **Periksa responsive:** evaluasi desktop, tablet, dan mobile.
8.  **Refine:** gunakan prompt refinement untuk memperbaiki hasil tanpa
    mengganti identitas.
9.  **Handoff:** dokumentasikan komponen, state, interaksi, dan aturan
    bisnis untuk developer.

### Urutan Eksekusi Google Stitch

    Urutan Kategori               Output
  -------- ---------------------- -----------------------------------
         1 Master Design System   Fondasi identitas dan komponen
         2 Public Website         Landing page dan informasi produk
         3 Authentication         Login, registrasi, onboarding
         4 Citizen                Aplikasi masyarakat
         5 Waste Bank             Dashboard operasional
         6 Government             Dashboard monitoring
         7 Super Admin            Administrasi platform
         8 Refinement             Penyelarasan dan QA desain

------------------------------------------------------------------------

## 14. Handoff ke Developer

Desain yang siap diimplementasikan harus memiliki:

-   Nama halaman dan tujuan.
-   Role yang dapat mengakses.
-   Komponen yang digunakan.
-   Variasi state: default, hover, focus, disabled, loading, success,
    error.
-   Aturan validasi form.
-   Perilaku tombol dan navigasi.
-   Responsivitas.
-   Data yang ditampilkan.
-   Sumber data atau API yang dibutuhkan.
-   Aturan bisnis yang memengaruhi tampilan.

Jangan menganggap desain statis sudah cukup untuk menjadi spesifikasi
implementasi. Interaksi dan state penting harus dijelaskan.

------------------------------------------------------------------------

## 15. Prinsip Keputusan Desain

Jika terdapat konflik antara estetika dan kebutuhan bisnis:

1.  Utamakan kebenaran alur bisnis.
2.  Utamakan kejelasan informasi.
3.  Utamakan aksesibilitas dan usability.
4.  Pertahankan konsistensi design system.
5.  Baru optimalkan elemen dekoratif.

**Standar akhir:** Looop harus terlihat modern dan menarik untuk Expo
Kampus, tetapi tetap realistis, konsisten, mudah digunakan, dan dapat
diterjemahkan menjadi aplikasi yang benar-benar berfungsi.

------------------------------------------------------------------------

**End of Looop Design Skill --- Version 1.0**
