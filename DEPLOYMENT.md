# Rental Mobil - Deployment Guide

## Architecture
- **Frontend:** Next.js (Static Export) → Cloudflare Pages
- **Backend:** Hono API → Cloudflare Workers
- **Database:** D1 (SQLite on Edge)

---

## Prerequisites
- Cloudflare account
- Wrangler CLI installed: `npm install -g wrangler`
- Wrangler login: `wrangler login`

---

## Step 1: Create Production D1 Database

```bash
wrangler d1 create rental_mobil_db_prod
```

Copy the `database_id` dari output, update `wrangler.toml`:

```toml
[env.production]
[[env.production.d1_databases]]
binding = "DB"
database_name = "rental_mobil_db_prod"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

---

## Step 2: Run Migrations to Production

```bash
wrangler d1 migrations apply rental_mobil_db_prod --remote
```

---

## Step 3: Deploy Backend (Hono API)

```bash
wrangler deploy --env production
```

Output akan kasih URL Workers: `https://rental-mobil-api.YOUR_SUBDOMAIN.workers.dev`

**Copy URL ini!** Nanti dipakai di frontend.

---

## Step 4: Test Backend API

```bash
curl https://rental-mobil-api.YOUR_SUBDOMAIN.workers.dev/api/cars
```

Harusnya return JSON dengan list cars (auto-seeded).

---

## Step 5: Build Frontend (Next.js)

Set environment variable dulu:

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_API_URL="https://rental-mobil-api.YOUR_SUBDOMAIN.workers.dev/api"

# Linux/Mac
export NEXT_PUBLIC_API_URL="https://rental-mobil-api.YOUR_SUBDOMAIN.workers.dev/api"
```

Build static export:

```bash
npm run build
```

Output folder: `out/`

---

## Step 6: Deploy Frontend to Cloudflare Pages

### Option A: Wrangler CLI (One-time)

```bash
wrangler pages deploy out/ --project-name rental-mobil
```

### Option B: GitHub Integration (Recommended)

1. Push code ke GitHub
2. Login Cloudflare Dashboard → Pages → Create a project
3. Connect GitHub repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Environment variable:**
     - `NEXT_PUBLIC_API_URL` = `https://rental-mobil-api.YOUR_SUBDOMAIN.workers.dev/api`
5. Save and Deploy

---

## Step 7: Set CORS di Workers

Update `wrangler.toml` environment variable (atau set via dashboard):

```toml
[env.production.vars]
FRONTEND_URL = "https://rental-mobil.pages.dev"
```

Atau via CLI:

```bash
wrangler secret put FRONTEND_URL --env production
# Enter value: https://rental-mobil.pages.dev
```

Redeploy workers:

```bash
wrangler deploy --env production
```

---

## Step 8: Test Full Flow

1. Open `https://rental-mobil.pages.dev`
2. Coba booking mobil
3. Cek pesanan
4. Login admin di `/admin` (password: `admin123` atau sesuai setting lu)

---

## Troubleshooting

### Frontend gak bisa fetch API (CORS error)
- Cek `FRONTEND_URL` di Workers env vars
- Pastikan URL match (tanpa trailing slash)

### Database kosong setelah deploy
- Run migrations: `wrangler d1 migrations apply rental_mobil_db_prod --remote`
- Auto-seed akan jalan otomatis pas pertama kali fetch `/api/cars`

### Admin page gak bisa login
- Password hardcode di `app/admin/page.tsx` line 89
- Default: `admin123` atau `admin`

---

## Local Development

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Frontend akan proxy API ke `http://localhost:8787/api`

---

## Environment Variables Summary

### Frontend (CF Pages)
```
NEXT_PUBLIC_API_URL=https://rental-mobil-api.YOUR_SUBDOMAIN.workers.dev/api
```

### Backend (CF Workers)
```
FRONTEND_URL=https://rental-mobil.pages.dev
```

---

## Next Steps (Post-Deployment)

1. **Custom Domain:** Add domain di CF Pages & Workers dashboard
2. **Security:** Implement server-side admin auth (JWT)
3. **Monitoring:** Enable Workers Analytics di dashboard
4. **Rate Limiting:** Add rate limit di Hono endpoints

---

## Commands Cheat Sheet

```bash
# Local dev
npm run dev              # Next.js frontend
npm run server           # Hono backend
npm run db:migrate       # Migrate local D1

# Production
wrangler deploy --env production           # Deploy Workers
wrangler pages deploy out/                 # Deploy Pages
wrangler d1 migrations apply DB --remote   # Migrate prod D1

# Logs
wrangler tail --env production             # Workers logs
```
