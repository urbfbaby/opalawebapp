# AGENTS.md — Opala Property Project Context & Instructions

This document provides complete context, architectural standards, and development guidelines for AI agents and developers working on the **Opala Property** codebase.

Whenever you make structural, functional, or architectural updates to this project, **always keep this file updated**.

---

## 1. Project Overview & Business Context

- **Client / Entity**: Opala Property (`Opala Group Pty Ltd`).
- **Nature of Business**: Australian property service provider leasing furnished apartments in Melbourne CBD (specifically La Trobe Tower at 327 La Trobe Street).
- **Target Audience**: Prospective tenants (domestic/international students, young professionals, interns, exchange students).
- **Audience Restrictions**: This is strictly a **tenant-facing site**, NOT an agent/partner site. Never display commission, referral percentages, or agent fees on public pages.
- **Tone & Language**: Australian English (`cosy`, `enquire`, `colour`, `neighbourhood`, `programme`).
- **Words to Avoid**: `"Peace environment"`, `"Accessible"` (unclear meaning in tenancy), `"Opportunity"`, `"Education agents"` as a target audience, `"Referral"`, `"Commission"`, `"Student group bookings"`.

---

## 2. Technology Stack

- **Framework**: Next.js 15 (App Router, React 19, Server Components & Server Actions).
- **Language**: TypeScript (Strict mode).
- **Styling**: Tailwind CSS with custom brand design tokens.
- **Validation**: Zod (`/lib/schemas.ts`) validating all content reads and writes.
- **Icons**: `@phosphor-icons/react` (strictly Light weight, size 18–20px, body/neutral color). No emoji or colored icon circles.
- **Images**: `next/image` for real photos. Where `placeholder: true`, render neutral warm grey canvas with unit code in small Fraunces serif text. Never stock photos.

---

## 3. Design System & Brand Tokens

Located in [`/lib/tokens.ts`](file:///d:/Opala%20Porto/lib/tokens.ts) and configured in [`tailwind.config.ts`](file:///d:/Opala%20Porto/tailwind.config.ts):

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Navy** | `#0A0B3D` | Primary brand color: Header, footer, structural cards, key headings |
| **Amber** | `#FDB92F` | Accent only: Primary CTA buttons ("Enquire"), thin rules, price highlights. *Never large fills.* |
| **Warm Off-White** | `#FAF8F5` | Main page canvas background |
| **Charcoal** | `#1F1F1F` | Main body text |
| **Warm Grey** | `#EAE6DF` | Neutral photo placeholder canvas |
| **Border** | `#E5E1D8` | Thin divider lines |
| **Headings Font** | `Fraunces` | Serif font for titles, numerals (01, 02), and prices |
| **Body Font** | `DM Sans` | Clean sans-serif for body copy, specs, and navigation |

---

## 4. Architecture & Data Layer

1. **Decoupled Data Layer (`/lib/data/index.ts`)**:
   - The UI **never** reads files or databases directly.
   - All components call getters: `getProperties()`, `getProperty(slug)`, `getApartments(filters)`, `getApartment(slug)`, `getUnitTypes()`, `getSite()`, `getFeatureFlags()`, `getEnquiries()`.
   - **Dual Data Mode**:
     - **Production**: When `NEXT_PUBLIC_SUPABASE_URL` is set, reads and writes from live Supabase PostgreSQL (`lib/data/supabase-provider.ts`).
     - **Local / Fallback**: When Supabase is not configured, seamlessly reads and writes local validated JSON files in `/content`.
2. **Supabase Database & Cloud Storage**:
   - PostgreSQL schema defined in `supabase/schema.sql` (tables: `site_settings`, `feature_flags`, `properties`, `unit_types`, `apartments`, `apartment_images`, `enquiries`).
   - Automated migration script in `scripts/seed-supabase.mjs`.
   - Supabase Storage bucket `apartment-photos` with public read access and Next.js Image optimization (`next.config.mjs`).
   - Admin photo uploader component in `components/admin/ApartmentPhotoUploader.tsx`.
3. **Content Storage Structure**:
   ```
   content/
   ├── site.json                        # Global settings, ABN, phone, email
   ├── flags.json                       # Feature flags: shortTerm, showAvailability
   ├── enquiries.json                   # Inbound prospect enquiries
   ├── properties/
   │   └── <slug>.json                  # Property details & campus walking times
   ├── unit-types/
   │   └── <key>.json                   # 1BR/2BR rent (fromExclBills, fromInclBills)
   └── apartments/
       └── <slug>.json                  # Apartment units (9 units currently)
   ```
3. **Relational Models**:
   - `apartment -> property` (by slug)
   - `apartment -> unitType` (by key)
   - **Rent lives solely on the unit type**, never typed into individual apartment JSONs.
   - **Apartment Facilities**: Dynamically composed as `property.standardFacilities + apartment.extraFacilities`.

---

## 5. Admin Panel (`/admin/*`)

- **Security & Access**: Protected by HTTP-only session cookie (`opala_admin_session`) matched against `ADMIN_PASSWORD` (default: `opala2026`). Handled server-side in `lib/admin-auth.ts` and `app/admin/(protected)/layout.tsx`.
- **Login Route**: `/admin/login`.
- **Key Modules**:
  1. `/admin` — Dashboard overview with real-time stats (apartments count, weekly rates, feature flag status, recent enquiries).
  2. `/admin/apartments` — Apartment catalogue manager with live publishing toggles (`● Published` / `○ Draft`).
  3. `/admin/apartments/[slug]` — Detailed unit editor (floor level, floor inferred, available from date, description, extra facilities checklist, and image previews).
  4. `/admin/rates` — Live rent matrices (excl./incl. bills) for 1BR and 2BR with quarterly review timestamp.
  5. `/admin/flags` — Interactive toggle switches for `shortTerm` and `showAvailability` that immediately update `/content/flags.json`.
  6. `/admin/enquiries` — Inbound prospective tenant message inbox with direct WhatsApp and email reply actions, and record deletion.
  7. `/admin/settings` — Entity legal details (ABN), Australian contact phone, email, business hours, and WhatsApp prefill message.
- **Data Persistence**: Uses Next.js Server Actions (`app/actions/admin-content.ts`), validates all changes with Zod (`/lib/schemas.ts`), and writes synchronously to local JSON files (`/content/*.json`) as well as live Supabase PostgreSQL tables and Storage when `NEXT_PUBLIC_SUPABASE_URL` is configured. Automatically triggers cache revalidation via `revalidatePath()`. Zero data drift between storage layers.

---

## 6. Staging & SEO Safeguards

- `NEXT_PUBLIC_ALLOW_INDEXING`: Defaults to `false`. Emits `noindex, nofollow` meta tags, `X-Robots-Tag: noindex, nofollow` HTTP headers, and blocks indexing in `robots.txt`.
- `NEXT_PUBLIC_SITE_URL`: Drives canonical URLs, sitemaps, and Open Graph. No domain is hard-coded.
- Optional password gate via `middleware.ts` if `STAGING_PASSWORD` is set.

---

## 7. Production Deployment (GitHub Actions & PM2 on AWS EC2)

- **Target Architecture**: Co-hosted on existing AWS EC2 Ubuntu instance (`t3.small`) alongside `opala-tracker`.
- **Multi-Domain Nginx**: Independent Server Blocks (`nginx/opala-webapp.conf`) proxying to port `3001`, with isolated Let's Encrypt SSL certificates.
- **Process Manager**: Managed via PM2 with `ecosystem.config.js` (`opala-webapp` on port 3001, max memory 500MB).
- **CI/CD Pipeline**: Automated deployment via GitHub Actions (`.github/workflows/deploy.yml`) using SSH action on push to `main`.
- **Documentation**: Detailed setup instructions in [`docs/DEPLOYMENT_EC2_PM2.md`](file:///d:/Opala%20Porto/docs/DEPLOYMENT_EC2_PM2.md). Containerized alternative remains in [`docs/DEPLOYMENT_AWS.md`](file:///d:/Opala%20Porto/docs/DEPLOYMENT_AWS.md).

---

## 8. Developer & Agent Rules of Engagement

1. **Maintain Australian English**: Never convert spellings to US English (`cosy`, `enquire`, `neighbourhood`).
2. **Preserve Documentation Integrity**: Do not delete existing comments, architecture guides, or schema validators.
3. **Never Hardcode Prices**: Always read rent from unit-type files via `/lib/data`.
4. **Icons**: Use only Phosphor Icons with `weight="light"` and size 18–20px. Never use emoji.
5. **Always Update AGENTS.md**: Document any new routes, data models, or environment variables in this file.
