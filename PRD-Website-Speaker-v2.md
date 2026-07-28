# PRD (Product Requirements Document)
# Website Jualan Speaker – Direct WhatsApp
**Versi 2.0 (Revisi)**
**Tech Stack: Node.js + React**

---

## 1. Ringkasan Produk

Website e-commerce sederhana khusus penjualan speaker (portable, partybox, bluetooth, dll) dengan sistem pemesanan langsung via WhatsApp. Tidak ada keranjang belanja, checkout, atau pembayaran online. Pengunjung melihat produk → klik tombol WhatsApp → chat langsung ke admin.

Terdapat **Admin Panel** lengkap untuk mengelola kategori dan produk (CRUD).

Desain visual mengusung gaya **"3D modern"** — efek depth, shadow berlapis, glassmorphism, dan micro-animation — tanpa menggunakan model 3D asli (bukan Three.js/WebGL), sehingga tetap ringan dan cepat.

---

## 2. Tujuan Produk

- Memudahkan calon pembeli menemukan dan memesan speaker dengan cepat via WhatsApp.
- Memberikan admin kontrol penuh terhadap katalog produk dan kategori tanpa perlu coding.
- Tampilan modern, premium, dan menarik secara visual (depth, shadow, glassmorphism).
- Responsive (mobile-first) karena mayoritas traffic datang dari HP.
- Cepat, ringan, dan mudah di-maintain.
- Memberikan data/insight ke admin (produk mana yang paling diminati) lewat tracking klik WhatsApp.

---

## 3. Target Pengguna

| Peran          | Deskripsi                                      |
|----------------|------------------------------------------------|
| Pengunjung     | Orang yang ingin membeli speaker               |
| Admin          | Pemilik / admin toko yang mengelola produk     |

---

## 4. Tech Stack

| Layer              | Teknologi                          | Keterangan |
|--------------------|-------------------------------------|----------|
| Frontend           | React (Vite) + Tailwind CSS         | SPA / multi-page |
| Animasi            | Framer Motion                       | Micro-interaction, hover effect, page transition |
| Icon               | Lucide React                        | Konsisten dengan style modern |
| State Management   | React Query / Zustand (opsional)    | Data fetching |
| Backend            | Node.js + Express                   | REST API |
| Database           | PostgreSQL / MySQL + Prisma ORM     | Direkomendasikan Prisma |
| Authentication     | JWT + bcrypt                        | Admin login |
| File Upload        | Multer + local storage / Cloudinary | Gambar produk (multi-image) |
| Analytics          | Google Analytics 4 + Meta Pixel     | Tracking klik & pageview |
| Deployment         | Vercel (frontend) + Railway / Render (backend) | - |

---

## 5. Fitur Utama

### 5.1 Frontend (Pengunjung)

- Beranda: daftar produk terbaru + filter kategori + hero section dengan layered background
- Halaman Kategori: produk berdasarkan kategori
- Pencarian produk (search bar sederhana, query di API)
- Detail Produk:
  - Galeri foto (multi-image, bisa swipe di mobile)
  - Nama, harga, deskripsi, stok, kategori
  - Badge "Stok Habis" otomatis muncul jika `stok = 0`, tombol WhatsApp berubah jadi nonaktif/"Tanya Ketersediaan"
  - Tombol **Pesan via WhatsApp** dengan pesan otomatis
- UI modern:
  - Product card dengan shadow berlapis + subtle tilt/scale saat hover
  - Glassmorphism pada navbar (backdrop-blur + semi-transparent background)
  - Floating WhatsApp button dengan efek pulse
  - Page transition (fade/slide) antar halaman
  - Skeleton shimmer loading (bukan spinner biasa)
  - Menghormati `prefers-reduced-motion` untuk aksesibilitas
- Responsive design (mobile, tablet, desktop)
- Loading state & empty state yang baik
- SEO: meta title, description, Open Graph, sitemap.xml, robots.txt, structured data (schema.org Product)

### 5.2 Admin Panel

- Login / Logout (JWT) dengan rate limiting pada endpoint login (anti brute-force)
- Dashboard:
  - Total produk, total kategori, produk aktif
  - Produk terlaris berdasarkan jumlah klik WhatsApp (dari data analytics)
- **CRUD Kategori**
  - Tambah, edit, hapus kategori
  - Nama + slug otomatis
- **CRUD Produk**
  - Tambah, edit, hapus produk
  - Field: nama, kategori, harga, stok, deskripsi, status aktif/nonaktif
  - Upload multi-gambar (galeri produk, drag-to-reorder)
  - Pengaturan varian (opsional, lihat catatan di section 8)
- **Pengaturan Toko** (baru)
  - Nomor WhatsApp admin bisa diubah langsung dari panel (bukan hardcoded di frontend)
  - Template pesan WhatsApp default bisa disesuaikan
- Proteksi route (hanya admin yang sudah login)

### 5.3 Fitur WhatsApp Direct

Contoh pesan otomatis:
```
Halo, saya tertarik dengan *JBL PartyBox 310*
Harga: Rp 4.500.000
Apakah masih tersedia?
```

Link format: `https://wa.me/62xxxxxxxxxx?text=...`

Nomor WA dan template pesan diambil dari **Pengaturan Toko** di admin panel (dinamis), bukan hardcoded.

Setiap klik tombol WhatsApp di-track ke Analytics (event: `whatsapp_click`, dengan parameter `product_id`) agar admin bisa melihat produk mana yang paling banyak ditanya.

---

## 6. User Stories

**Pengunjung**
- Sebagai pengunjung, saya ingin melihat daftar speaker agar bisa memilih.
- Sebagai pengunjung, saya ingin memfilter dan mencari berdasarkan kategori/kata kunci.
- Sebagai pengunjung, saya ingin melihat detail produk lengkap dengan beberapa foto.
- Sebagai pengunjung, saya ingin tahu jika produk sedang habis stok sebelum menghubungi admin.
- Sebagai pengunjung, saya ingin langsung chat WhatsApp dengan pesan yang sudah terisi.

**Admin**
- Sebagai admin, saya ingin login ke panel admin dengan aman.
- Sebagai admin, saya ingin menambah / mengubah / menghapus kategori.
- Sebagai admin, saya ingin menambah / mengubah / menghapus produk beserta galeri gambarnya.
- Sebagai admin, saya ingin menonaktifkan produk tanpa menghapusnya.
- Sebagai admin, saya ingin mengubah nomor WhatsApp toko tanpa perlu redeploy.
- Sebagai admin, saya ingin melihat produk mana yang paling banyak ditanya via WhatsApp.

---

## 7. Struktur Halaman / Route

### Frontend (React)
```
/                     → Beranda (daftar produk)
/kategori/:slug       → Produk per kategori
/produk/:slug         → Detail produk + galeri + tombol WhatsApp
/cari?q=...           → Hasil pencarian
/admin/login          → Login admin
/admin                → Dashboard
/admin/kategori       → List + CRUD kategori
/admin/produk         → List + CRUD produk
/admin/pengaturan     → Pengaturan toko (nomor WA, template pesan)
```

### Backend API (Express)
```
POST   /api/auth/login

GET    /api/categories
POST   /api/categories               (admin)
PUT    /api/categories/:id           (admin)
DELETE /api/categories/:id           (admin)

GET    /api/products?search=&category=&page=
GET    /api/products/:slug
POST   /api/products                 (admin)
PUT    /api/products/:id             (admin)
DELETE /api/products/:id             (admin)

POST   /api/upload                   (admin - gambar, mendukung multi-file)
DELETE /api/upload/:id               (admin - hapus 1 gambar dari galeri)

GET    /api/settings                 (nomor WA & template pesan, publik/read-only)
PUT    /api/settings                 (admin)

POST   /api/analytics/whatsapp-click (tracking klik, dipanggil dari frontend)
GET    /api/analytics/top-products   (admin - untuk dashboard)
```

---

## 8. Database Schema (Prisma)

```prisma
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Category {
  id          String    @id @default(cuid())
  nama        String
  slug        String    @unique
  deskripsi   String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          String         @id @default(cuid())
  nama        String
  slug        String         @unique
  deskripsi   String?
  harga       Int
  stok        Int            @default(0)
  isActive    Boolean        @default(true)
  categoryId  String?
  category    Category?      @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  clicks      WhatsappClick[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  urutan    Int      @default(0)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model WhatsappClick {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Setting {
  id             String @id @default(cuid())
  nomorWhatsapp  String
  templatePesan  String
  updatedAt      DateTime @updatedAt
}
```

> **Catatan:** Varian produk (warna/ukuran) sengaja belum dimasukkan ke schema utama karena butuh keputusan desain lebih lanjut (apakah varian jadi produk terpisah atau tabel `ProductVariant` sendiri). Bisa dibahas di iterasi berikutnya jika dibutuhkan.

---

## 9. Panduan Desain "3D Modern" (Non-3D-Render)

Karena disepakati bahwa "3D" di sini adalah gaya visual (bukan model 3D nyata seperti Three.js/WebGL), berikut panduan implementasinya:

| Elemen | Implementasi |
|---|---|
| Product card | Shadow berlapis (soft shadow + colored glow saat hover), sedikit scale/tilt saat hover |
| Navbar / modal | Glassmorphism — `backdrop-blur` + background semi-transparan |
| Hero section | Layered background — gradient + blur blob di belakang produk unggulan |
| Floating WA button | Shadow halus + animasi pulse untuk menarik perhatian |
| Transisi halaman | Fade/slide antar halaman (Framer Motion) |
| Loading state | Skeleton shimmer, bukan spinner polos |
| Aksesibilitas | Semua animasi tunduk pada `prefers-reduced-motion` |

**Prinsip performa:** efek visual harus *progressive* — perangkat kuat mendapat efek penuh, perangkat low-end mendapat versi lebih ringan (hindari blur besar di banyak elemen sekaligus). Ini menjaga NFR loading time tetap terpenuhi.

---

## 10. Non-Functional Requirements

- Loading time halaman utama < 2 detik (termasuk dengan efek animasi aktif)
- Mobile-first responsive
- Gambar produk di-compress (max 500KB–1MB per gambar)
- Validasi input di frontend & backend
- Error handling yang jelas
- Keamanan:
  - Password di-hash (bcrypt)
  - JWT protected routes
  - Rate limiting pada endpoint login & upload
  - CORS dikonfigurasi hanya untuk domain frontend
- Bisa di-deploy dengan mudah (Vercel + Railway/Render)
- Environment variables (.env) untuk semua kredensial & konfigurasi sensitif

---

## 11. Out of Scope (Tidak Dibuat di Versi 1)

- Keranjang belanja & checkout
- Pembayaran online (Midtrans, dll)
- Multi-admin / role management
- Review & rating produk
- Wishlist
- Notifikasi email
- Multi-bahasa
- Inventory otomatis dari stok
- Varian produk (warna/ukuran) — dipertimbangkan untuk versi selanjutnya
- Model 3D nyata / 3D product viewer (Three.js, WebGL) — hanya gaya visual "3D modern"

---

## 12. Prioritas Pengembangan (MVP)

**Phase 1 – Core**
1. Setup project (React + Express + Prisma)
2. Database & API kategori + produk (termasuk galeri gambar)
3. Frontend daftar produk + detail + tombol WhatsApp
4. Admin login + CRUD kategori & produk

**Phase 2 – Polish & Fitur Tambahan**
5. Upload multi-gambar + galeri produk
6. Filter & search produk
7. Pengaturan toko (nomor WA, template pesan dinamis)
8. Dashboard admin + tracking klik WhatsApp
9. Styling "3D modern" (shadow, glassmorphism, animasi, skeleton loading)
10. SEO final (sitemap, structured data) & responsive polish

---

## 13. Perubahan dari Versi 1 (Changelog)

- ➕ Galeri multi-gambar produk (sebelumnya hanya 1 field `gambar`)
- ➕ Handling stok habis (badge & tombol WA nonaktif)
- ➕ Analytics tracking klik WhatsApp + dashboard produk terlaris
- ➕ Fitur pencarian produk (endpoint & halaman)
- ➕ Pengaturan toko dinamis (nomor WA & template pesan tidak lagi hardcoded)
- ➕ SEO teknis: sitemap.xml, robots.txt, structured data
- ➕ Rate limiting spesifik untuk login & upload
- ➕ Panduan desain "3D modern" (shadow, glassmorphism, animasi, skeleton loading)
- 📝 Dicatat sebagai open decision: varian produk (warna/ukuran)

---

## 14. Next Steps

Silakan pilih prioritas selanjutnya:
1. **Struktur folder lengkap** (frontend + backend)
2. **Contoh API endpoints detail** (request/response schema)
3. **Langsung generate starter code** (package.json, Prisma schema, dsb)
