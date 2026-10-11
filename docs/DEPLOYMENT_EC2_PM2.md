# Panduan Deployment EC2 (PM2 Multi-Domain & GitHub Actions)

Panduan ini dirancang khusus untuk menggabungkan **Opala WebApp** (`opalawebapp`) ke dalam **server AWS EC2 existing Anda (`t3.small`, Ubuntu)** yang saat ini sudah menjalankan `opala-tracker` dan menggunakan **PM2**.

---

## 1. Arsitektur Multi-Domain di 1 Server EC2

### Pertanyaan: *Bisa tidak domainnya beda di satu server yang sama?*
**Jawabannya: BISA BANGET dan sangat umum dilakukan!**

Nginx menggunakan fitur bernama **Server Blocks (Virtual Hosts)**. Satu IP Publik EC2 dapat melayani puluhan domain berbeda sekaligus:
```text
                         [ AWS EC2 Server: t3.small (Ubuntu) ]
                                      IP: xx.xx.xx.xx
                                            │
                                    ┌───────┴───────┐
                                    │     NGINX     │  (Port 80 / 443 HTTPS)
                                    └───┬───────┬───┘
                                        │       │
              Host: tracker.domain.com  │       │  Host: opala.com.au
                                        ▼       ▼
                       ┌────────────────────┐   ┌────────────────────┐
                       │   opala-tracker    │   │    opala-webapp    │
                       │   (PM2: port 3000) │   │  (PM2: port 3001)  │
                       └────────────────────┘   └────────────────────┘
```

- Ketika user mengakses `tracker.domain.com` -> Nginx meneruskan ke port `opala-tracker` (misal port 3000).
- Ketika user mengakses `opala.com.au` -> Nginx meneruskan ke port `opala-webapp` (port 3001).
- Masing-masing domain memiliki sertifikat SSL Let's Encrypt tersendiri yang terpisah dan gratis!
- **Kelebihan Menggunakan PM2 di t3.small**: Hemat RAM! Instance `t3.small` memiliki 2GB RAM. Menjalankan Next.js via PM2 jauh lebih ringan daripada menjalankan Docker daemon tambahan.

---

## 2. Setup Awal di Server EC2 (Hanya Perlu Sekali)

Masuk ke server EC2 Anda via terminal / SSH:
```bash
ssh -i /path/ke/key.pem ubuntu@IP_EC2_ANDA
```

### Langkah A: Buat Direktori Aplikasi
```bash
sudo mkdir -p /var/www/opalawebapp
sudo chown -R $USER:$USER /var/www/opalawebapp
```

### Langkah B: Buat File Environment di Server
Buat file konfigurasi produksi di dalam folder aplikasi:
```bash
nano /var/www/opalawebapp/.env.production
```
Salin dan sesuaikan isi berikut:
```env
NEXT_PUBLIC_SITE_URL=https://domain-anda.com.au
NEXT_PUBLIC_ALLOW_INDEXING=false

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://nmfzlstldxkytsvfhija.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Admin Password
ADMIN_PASSWORD=opala2026
```
*(File ini tidak akan terhapus saat git pull/reset karena masuk di `.gitignore`)*

### Langkah C: Konfigurasi Nginx untuk Domain Baru
1. Buat file konfigurasi Nginx untuk domain `opalawebapp`:
```bash
sudo nano /etc/nginx/sites-available/opala-webapp.conf
```
Salin isi konfigurasi berikut:
```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Ganti dengan domain Opala Anda
    server_name opala.com.au www.opala.com.au;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        expires 365d;
        access_log off;
    }

    client_max_body_size 50M;
}
```

2. Aktifkan konfigurasi Nginx dan restart:
```bash
sudo ln -s /etc/nginx/sites-available/opala-webapp.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Langkah D: Pasang SSL HTTPS Gratis (Certbot)
Setelah DNS domain Anda (A record) sudah diarahkan ke IP publik EC2, jalankan:
```bash
sudo certbot --nginx -d opala.com.au -d www.opala.com.au
```
Certbot akan otomatis memperbarui file Nginx dan mengaktifkan HTTPS tanpa mengganggu SSL project tracker Anda.

---

## 3. Konfigurasi GitHub Repository & Secrets

Buka repository Anda di browser: [https://github.com/urbfbaby/opalawebapp](https://github.com/urbfbaby/opalawebapp)

Masuk ke menu: **Settings -> Secrets and variables -> Actions -> New repository secret**

Tambahkan 3 secret berikut:

1. `EC2_HOST`: IP Publik server EC2 Anda (contoh: `54.254.xxx.xxx`).
2. `EC2_USER`: `ubuntu` (atau username SSH server Anda).
3. `EC2_SSH_KEY`: Seluruh isi file private key SSH Anda (`.pem` file), dimulai dari `-----BEGIN RSA PRIVATE KEY-----` sampai `-----END RSA PRIVATE KEY-----`.
4. `EC2_PORT`: `22` *(opsional jika port SSH Anda standar)*.

---

## 4. Cara Push Code dari Komputer Lokal ke GitHub

Dari folder project Anda (`D:\Opala Porto`), jalankan perintah git berikut:

```bash
# 1. Inisialisasi Git
git init

# 2. Tambahkan remote repository
git remote add origin https://github.com/urbfbaby/opalawebapp.git

# 3. Ubah branch ke main
git branch -M main

# 4. Stage semua file
git add .

# 5. Commit perubahan
git commit -m "feat: complete opala property leasing webapp with supabase and pm2 deployment"

# 6. Push ke GitHub
git push -u origin main
```

*(Catatan: Jika repository GitHub sudah ada file `README.md` atau commit sebelumnya, Anda bisa menggunakan `git push -u origin main --force` untuk overwrite branch main awal).*

---

## 5. Otomatisasi GitHub Actions (CI/CD)

Setiap kali Anda menjalankan `git push origin main`:
1. GitHub Actions ([`.github/workflows/deploy.yml`](file:///d:/Opala%20Porto/.github/workflows/deploy.yml)) akan otomatis aktif.
2. Action akan terhubung ke server EC2 via SSH.
3. Menarik code terbaru ke `/var/www/opalawebapp`.
4. Menjalankan `npm install` dan `npm run build`.
5. Me-restart proses PM2 `opala-webapp` di port `3001` secara zero-downtime.

### Perintah Cek di Server EC2:
```bash
# Cek semua aplikasi yang berjalan di PM2
pm2 list

# Cek logs aplikasi Opala WebApp
pm2 logs opala-webapp

# Cek penggunaan CPU dan RAM
pm2 monit
```
