-- ============================================================
-- OPALA PROPERTY — SUPABASE PRODUCTION DATABASE SCHEMA
-- Idempotent script: Safe to run multiple times
-- ============================================================

-- Ensure uuid extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TABLES CREATION
-- ============================================================

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  abn TEXT NOT NULL,
  managed_by_line TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_international TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_message TEXT NOT NULL,
  business_hours TEXT NOT NULL,
  service_area TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Feature Flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id TEXT PRIMARY KEY DEFAULT 'global',
  short_term BOOLEAN NOT NULL DEFAULT false,
  show_availability BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Properties (Buildings)
CREATE TABLE IF NOT EXISTS public.properties (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Australia',
  summary TEXT NOT NULL,
  min_stay TEXT NOT NULL,
  flexible_stay TEXT NOT NULL,
  bills_coverage TEXT[] NOT NULL DEFAULT '{}',
  nearby JSONB NOT NULL DEFAULT '[]',
  map JSONB NOT NULL DEFAULT '{}',
  standard_facilities TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Unit Types (Rent lives here)
CREATE TABLE IF NOT EXISTS public.unit_types (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  unit TEXT NOT NULL DEFAULT 'week',
  from_excl_bills NUMERIC NOT NULL,
  from_incl_bills NUMERIC NOT NULL,
  display TEXT NOT NULL DEFAULT 'from',
  reviewed TEXT NOT NULL DEFAULT 'Quarterly',
  updated_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 5. Apartments
CREATE TABLE IF NOT EXISTS public.apartments (
  slug TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  property_slug TEXT NOT NULL REFERENCES public.properties(slug) ON DELETE CASCADE,
  unit_type_key TEXT NOT NULL REFERENCES public.unit_types(key) ON DELETE RESTRICT,
  floor INT NOT NULL,
  floor_inferred BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  extra_facilities TEXT[] NOT NULL DEFAULT '{}',
  stay_types TEXT[] NOT NULL DEFAULT '{"long-term"}',
  available_from DATE,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Apartment Images
CREATE TABLE IF NOT EXISTS public.apartment_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_slug TEXT NOT NULL REFERENCES public.apartments(slug) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 1,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  placeholder BOOLEAN NOT NULL DEFAULT false
);

-- 7. Inbound Tenant Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  move_in_date DATE,
  stay_length TEXT,
  bills_preference TEXT,
  apartment_code TEXT,
  apartment_slug TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running to prevent duplicates
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read feature_flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Public read properties" ON public.properties;
DROP POLICY IF EXISTS "Public read unit_types" ON public.unit_types;
DROP POLICY IF EXISTS "Public read published apartments" ON public.apartments;
DROP POLICY IF EXISTS "Public read apartment images" ON public.apartment_images;
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Service role full access site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Service role full access feature_flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Service role full access properties" ON public.properties;
DROP POLICY IF EXISTS "Service role full access unit_types" ON public.unit_types;
DROP POLICY IF EXISTS "Service role full access apartments" ON public.apartments;
DROP POLICY IF EXISTS "Service role full access apartment_images" ON public.apartment_images;
DROP POLICY IF EXISTS "Service role full access enquiries" ON public.enquiries;

-- Public can read site configuration & catalog data
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read feature_flags" ON public.feature_flags FOR SELECT USING (true);
CREATE POLICY "Public read properties" ON public.properties FOR SELECT USING (published = true);
CREATE POLICY "Public read unit_types" ON public.unit_types FOR SELECT USING (true);
CREATE POLICY "Public read published apartments" ON public.apartments FOR SELECT USING (published = true);
CREATE POLICY "Public read apartment images" ON public.apartment_images FOR SELECT USING (true);

-- Anyone can submit an enquiry form
CREATE POLICY "Public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Full access for service_role / backend server
CREATE POLICY "Service role full access site_settings" ON public.site_settings USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access feature_flags" ON public.feature_flags USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access properties" ON public.properties USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access unit_types" ON public.unit_types USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access apartments" ON public.apartments USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access apartment_images" ON public.apartment_images USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access enquiries" ON public.enquiries USING (auth.role() = 'service_role');

-- ============================================================
-- 3. STORAGE BUCKET CONFIGURATION (apartment-photos)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'apartment-photos',
  'apartment-photos',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public read apartment-photos" ON storage.objects;
DROP POLICY IF EXISTS "Service role upload apartment-photos" ON storage.objects;

-- Public read policy for apartment-photos bucket
CREATE POLICY "Public read apartment-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'apartment-photos');

-- Service role upload policy for apartment-photos bucket
CREATE POLICY "Service role upload apartment-photos"
ON storage.objects FOR ALL
USING (bucket_id = 'apartment-photos');
