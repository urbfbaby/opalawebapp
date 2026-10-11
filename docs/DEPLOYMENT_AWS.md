# Panduan Deployment AWS & Supabase: Opala Property

Panduan langkah demi langkah untuk men-deploy website Opala Property (`Opala Group Pty Ltd`) ke server AWS (EC2 / Lightsail) dengan database Supabase (PostgreSQL) dan Supabase Storage.

---

## 1. Setup Database & Storage di Supabase (5 Menit)

1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru (contoh nama: `opala-property`).
2. Pilih region database yang dekat dengan Australia: **Sydney (ap-southeast-2)** atau **Singapore (ap-southeast-1)**.
3. Buka menu **SQL Editor** di sidebar Supabase.
4. Salin seluruh isi file [`supabase/schema.sql`](file:///d:/Opala%20Porto/supabase/schema.sql) dan klik **Run**.
   - Ini otomatis membuat tabel `site_settings`, `feature_flags`, `properties`, `unit_types`, `apartments`, `apartment_images`, `enquiries`.
   - Ini otomatis mengaktifkan bucket Supabase Storage bernama `apartment-photos`.
5. Buka menu **Project Settings -> API**:
   - Salin **Project URL** (`https://xxxx.supabase.co`).
   - Salin **anon public key**.
   - Salin **service_role secret key**.
6. Jalankan migrasi data seed dari laptop Anda:
   ```bash
   $env:NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
   node scripts/seed-supabase.mjs
   ```
   *Data 9 apartemen, harga sewa, fasilitas, dan pengaturan situs akan otomatis berpindah ke Supabase!*

---

## 2. Persiapan Server AWS (EC2 / Lightsail)

Rekomendasi spesifikasi server AWS:
- **OS**: Ubuntu 22.04 LTS atau 24.04 LTS.
- **Instance**: EC2 `t3.small` / `t4g.small` (2GB RAM) atau AWS Lightsail ($10/bulan).
- **Security Group (Firewall)**: Buka port `22` (SSH), `80` (HTTP), dan `443` (HTTPS).

### Langkah di Server AWS (via SSH):

```bash
# 1. Update sistem
sudo apt update && sudo apt upgrade -y

# 2. Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

---

## 3. Clone Repository & Setup Environment

```bash
# Clone proyek ke server
git clone <URL_REPOSITORY_ANDA> /var/www/opala-property
cd /var/www/opala-property

# Buat file konfigurasi produksi
nano .env.production
```

Isi file `.env.production`:
```env
NEXT_PUBLIC_SITE_URL=https://domain-anda.com.au
NEXT_PUBLIC_ALLOW_INDEXING=false # Ubah ke true saat sudah siap go-live publik

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Keamanan Admin & Email
ADMIN_PASSWORD=ganti_dengan_password_admin_kuat
RESEND_API_KEY=re_xxxx # Opsional jika ingin kirim email via Resend
```

---

## 4. Jalankan Aplikasi dengan Docker

```bash
# Build dan jalankan container Next.js di background
docker-compose up -d --build

# Cek apakah container sudah berjalan (port 3000)
docker ps
curl http://localhost:3000
```

---

## 5. Konfigurasi Nginx & SSL HTTPS Gratis (Certbot)

```bash
# Salin konfigurasi Nginx
sudo cp nginx/opala.conf /etc/nginx/sites-available/opala.conf

# Edit nama domain Anda di konfigurasi
sudo nano /etc/nginx/sites-available/opala.conf
# (Ganti 'your-domain.com.au' dengan domain asli Anda)

# Aktifkan konfigurasi Nginx
sudo ln -s /etc/nginx/sites-available/opala.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Pasang sertifikat SSL HTTPS otomatis
sudo certbot --nginx -d domain-anda.com.au -d www.domain-anda.com.au
```

---

## 6. Update / Redeploy di Masa Depan

Setiap kali Anda melakukan update kode dari git:
```bash
cd /var/www/opala-property
git pull origin main
docker-compose up -d --build
```
Proses build container selesai dalam waktu sekitar 1–2 menit tanpa downtime.
