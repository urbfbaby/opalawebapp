import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment.");
  console.log("Usage: node --env-file=.env.local scripts/seed-supabase.mjs");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const CONTENT_DIR = path.join(process.cwd(), "content");

async function seed() {
  console.log("🚀 Starting Opala Property data migration to Supabase...\n");

  // 1. Site Settings
  try {
    const siteRaw = await fs.readFile(path.join(CONTENT_DIR, "site.json"), "utf-8");
    const site = JSON.parse(siteRaw);
    const { error } = await supabase.from("site_settings").upsert({
      id: "global",
      name: site.name,
      legal_name: site.legalName,
      abn: site.abn,
      managed_by_line: site.managedByLine,
      phone: site.phone,
      phone_international: site.phoneInternational,
      email: site.email,
      whatsapp_message: site.whatsappMessage,
      business_hours: site.businessHours,
      service_area: site.serviceArea,
    });
    if (error) throw error;
    console.log("✅ 1/6 site_settings migrated.");
  } catch (err) {
    console.error("❌ Failed site_settings:", err.message);
  }

  // 2. Feature Flags
  try {
    const flagsRaw = await fs.readFile(path.join(CONTENT_DIR, "flags.json"), "utf-8");
    const flags = JSON.parse(flagsRaw);
    const { error } = await supabase.from("feature_flags").upsert({
      id: "global",
      short_term: flags.shortTerm,
      show_availability: flags.showAvailability,
    });
    if (error) throw error;
    console.log("✅ 2/6 feature_flags migrated.");
  } catch (err) {
    console.error("❌ Failed feature_flags:", err.message);
  }

  // 3. Properties
  try {
    const propFiles = await fs.readdir(path.join(CONTENT_DIR, "properties"));
    for (const file of propFiles) {
      if (!file.endsWith(".json")) continue;
      const raw = await fs.readFile(path.join(CONTENT_DIR, "properties", file), "utf-8");
      const p = JSON.parse(raw);
      const { error } = await supabase.from("properties").upsert({
        slug: p.slug,
        name: p.name,
        address: p.address,
        suburb: p.suburb,
        state: p.state,
        postcode: p.postcode,
        country: p.country,
        summary: p.summary,
        min_stay: p.minStay,
        flexible_stay: p.flexibleStay,
        bills_coverage: p.billsCoverage,
        nearby: p.nearby,
        map: p.map,
        standard_facilities: p.standardFacilities,
        published: p.published,
      });
      if (error) throw error;
    }
    console.log("✅ 3/6 properties migrated.");
  } catch (err) {
    console.error("❌ Failed properties:", err.message);
  }

  // 4. Unit Types
  try {
    const utFiles = await fs.readdir(path.join(CONTENT_DIR, "unit-types"));
    for (const file of utFiles) {
      if (!file.endsWith(".json")) continue;
      const raw = await fs.readFile(path.join(CONTENT_DIR, "unit-types", file), "utf-8");
      const u = JSON.parse(raw);
      const { error } = await supabase.from("unit_types").upsert({
        key: u.key,
        label: u.label,
        bedrooms: u.bedrooms,
        bathrooms: u.bathrooms,
        currency: u.rent.currency,
        unit: u.rent.unit,
        from_excl_bills: u.rent.fromExclBills,
        from_incl_bills: u.rent.fromInclBills,
        display: u.rent.display,
        reviewed: u.rent.reviewed,
        updated_at: u.rent.updatedAt,
      });
      if (error) throw error;
    }
    console.log("✅ 4/6 unit_types migrated.");
  } catch (err) {
    console.error("❌ Failed unit_types:", err.message);
  }

  // 5. Apartments & Images
  try {
    const aptFiles = await fs.readdir(path.join(CONTENT_DIR, "apartments"));
    for (const file of aptFiles) {
      if (!file.endsWith(".json")) continue;
      const raw = await fs.readFile(path.join(CONTENT_DIR, "apartments", file), "utf-8");
      const a = JSON.parse(raw);
      
      const { error: aptErr } = await supabase.from("apartments").upsert({
        slug: a.slug,
        code: a.code,
        property_slug: a.property,
        unit_type_key: a.unitType,
        floor: a.floor,
        floor_inferred: a.floorInferred,
        description: a.description,
        extra_facilities: a.extraFacilities,
        stay_types: a.stayTypes,
        available_from: a.availableFrom,
        published: a.published,
      });
      if (aptErr) throw aptErr;

      // Delete existing images for clean upsert
      await supabase.from("apartment_images").delete().eq("apartment_slug", a.slug);

      // Insert images
      if (Array.isArray(a.images) && a.images.length > 0) {
        const imageRows = a.images.map((img) => ({
          apartment_slug: a.slug,
          src: img.src,
          alt: img.alt,
          category: img.category,
          order_index: img.order,
          is_cover: Boolean(img.isCover),
          placeholder: Boolean(img.placeholder),
        }));
        const { error: imgErr } = await supabase.from("apartment_images").insert(imageRows);
        if (imgErr) throw imgErr;
      }
    }
    console.log("✅ 5/6 apartments & images migrated (9 units).");
  } catch (err) {
    console.error("❌ Failed apartments:", err.message);
  }

  // 6. Enquiries
  try {
    const enqRaw = await fs.readFile(path.join(CONTENT_DIR, "enquiries.json"), "utf-8");
    const enquiries = JSON.parse(enqRaw);
    if (Array.isArray(enquiries) && enquiries.length > 0) {
      for (const enq of enquiries) {
        await supabase.from("enquiries").upsert({
          name: enq.name,
          email: enq.email,
          phone: enq.phone,
          move_in_date: enq.moveInDate || null,
          stay_length: enq.stayLength,
          bills_preference: enq.billsPreference,
          apartment_code: enq.apartmentCode,
          apartment_slug: enq.apartmentSlug,
          message: enq.message,
          created_at: enq.createdAt,
        });
      }
    }
    console.log("✅ 6/6 enquiries migrated.");
  } catch (err) {
    console.error("❌ Failed enquiries:", err.message);
  }

  console.log("\n🎉 Migration finished successfully!");
}

seed();
