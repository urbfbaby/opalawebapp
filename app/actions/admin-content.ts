"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isSupabaseConfigured, getSupabaseAdminClient } from "@/lib/supabase";
import {
  updateApartmentPublishedInSupabase,
  updateApartmentInSupabase,
  updateUnitTypeRentInSupabase,
  updateFeatureFlagsInSupabase,
  updateSiteSettingsInSupabase,
  deleteEnquiryInSupabase,
  insertApartmentImageInSupabase,
  deleteApartmentImageInSupabase,
} from "@/lib/data/supabase-provider";
import {
  ApartmentSchema,
  UnitTypeSchema,
  FeatureFlagsSchema,
  SiteSchema,
  type Apartment,
  type FeatureFlags,
  type Site,
} from "@/lib/schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function verifyAuth() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    throw new Error("Unauthorized: Admin session required.");
  }
}

/**
 * Toggle apartment published status
 */
export async function toggleApartmentPublishedAction(slug: string) {
  await verifyAuth();
  const filePath = path.join(CONTENT_DIR, "apartments", `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  const apt = ApartmentSchema.parse(JSON.parse(raw));

  const updated: Apartment = {
    ...apt,
    published: !apt.published,
  };

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await updateApartmentPublishedInSupabase(slug, updated.published);
    } catch (e) {
      console.warn("[toggleApartmentPublishedAction] Supabase sync failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath(`/apartments/${slug}`);
  revalidatePath("/admin/apartments");
  return { success: true, published: updated.published };
}

/**
 * Save / Update an apartment
 */
export async function updateApartmentAction(
  slug: string,
  formData: FormData
) {
  await verifyAuth();
  const filePath = path.join(CONTENT_DIR, "apartments", `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  const current = ApartmentSchema.parse(JSON.parse(raw));

  const description = (formData.get("description") as string) || current.description;
  const floor = Number(formData.get("floor")) || current.floor;
  const floorInferred = formData.get("floorInferred") === "true";
  const published = formData.get("published") === "true";
  const availableFrom = (formData.get("availableFrom") as string) || null;

  // Selected extra facilities (multi-value)
  const extraFacilities = formData.getAll("extraFacilities") as string[];

  const updated: Apartment = {
    ...current,
    description,
    floor,
    floorInferred,
    published,
    availableFrom,
    extraFacilities,
  };

  // Validate with Zod
  ApartmentSchema.parse(updated);

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await updateApartmentInSupabase(slug, {
        description,
        floor,
        floorInferred,
        published,
        availableFrom,
        extraFacilities,
      });
    } catch (e) {
      console.warn("[updateApartmentAction] Supabase sync failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath(`/apartments/${slug}`);
  revalidatePath("/admin/apartments");

  return { success: true, message: `Apartment ${current.code} updated successfully.` };
}

/**
 * Update unit type rent matrix
 */
export async function updateUnitTypeRentAction(
  key: string,
  fromExclBills: number,
  fromInclBills: number
) {
  await verifyAuth();
  const filePath = path.join(CONTENT_DIR, "unit-types", `${key}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  const unitType = UnitTypeSchema.parse(JSON.parse(raw));

  const updated = {
    ...unitType,
    rent: {
      ...unitType.rent,
      fromExclBills: Number(fromExclBills),
      fromInclBills: Number(fromInclBills),
      updatedAt: new Date().toISOString().split("T")[0],
    },
  };

  UnitTypeSchema.parse(updated);

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await updateUnitTypeRentInSupabase(
        key,
        Number(fromExclBills),
        Number(fromInclBills),
        updated.rent.updatedAt
      );
    } catch (e) {
      console.warn("[updateUnitTypeRentAction] Supabase sync failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath("/admin/rates");

  return { success: true, message: `Rates for ${unitType.label} updated.` };
}

/**
 * Update feature flags
 */
export async function updateFeatureFlagsAction(flags: FeatureFlags) {
  await verifyAuth();
  const filePath = path.join(CONTENT_DIR, "flags.json");

  FeatureFlagsSchema.parse(flags);

  await fs.writeFile(filePath, JSON.stringify(flags, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await updateFeatureFlagsInSupabase(flags);
    } catch (e) {
      console.warn("[updateFeatureFlagsAction] Supabase sync failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath("/admin/flags");

  return { success: true, message: "Feature flags updated." };
}

/**
 * Update site configuration
 */
export async function updateSiteSettingsAction(formData: FormData) {
  await verifyAuth();
  const filePath = path.join(CONTENT_DIR, "site.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const current = SiteSchema.parse(JSON.parse(raw));

  const updated: Site = {
    ...current,
    abn: (formData.get("abn") as string) || current.abn,
    phone: (formData.get("phone") as string) || current.phone,
    phoneInternational: (formData.get("phoneInternational") as string) || current.phoneInternational,
    email: (formData.get("email") as string) || current.email,
    businessHours: (formData.get("businessHours") as string) || current.businessHours,
    whatsappMessage: (formData.get("whatsappMessage") as string) || current.whatsappMessage,
  };

  SiteSchema.parse(updated);

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await updateSiteSettingsInSupabase(updated);
    } catch (e) {
      console.warn("[updateSiteSettingsAction] Supabase sync failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
  revalidatePath("/admin/settings");

  return { success: true, message: "Site settings updated." };
}

/**
 * Delete enquiry from store
 */
export async function deleteEnquiryAction(id: string) {
  await verifyAuth();
  const filePath = path.join(CONTENT_DIR, "enquiries.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const records = JSON.parse(raw);

  if (Array.isArray(records)) {
    const filtered = records.filter((r: { id: string }) => r.id !== id);
    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
  }

  if (isSupabaseConfigured()) {
    try {
      await deleteEnquiryInSupabase(id);
    } catch (e) {
      console.warn("[deleteEnquiryAction] Supabase delete failed:", e);
    }
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return { success: true };
}

/**
 * Upload a photo for an apartment (to Supabase Storage if configured, or local public/images)
 */
export async function uploadApartmentPhotoAction(slug: string, formData: FormData) {
  await verifyAuth();
  const file = formData.get("file") as File;
  const category = (formData.get("category") as string) || "living";
  const alt = (formData.get("alt") as string) || `Photo of apartment ${slug}`;
  const isCover = formData.get("isCover") === "true";

  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  let publicUrl = "";

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${slug}/${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadErr } = await supabase.storage
        .from("apartment-photos")
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("apartment-photos")
        .getPublicUrl(fileName);

      publicUrl = urlData.publicUrl;
    } catch (err) {
      console.error("Supabase Storage upload error:", err);
      return { success: false, message: `Failed to upload to storage: ${err instanceof Error ? err.message : String(err)}` };
    }
  } else {
    // Local fallback: save to public/images/apartments/<slug>/
    const targetDir = path.join(process.cwd(), "public", "images", "apartments", slug);
    await fs.mkdir(targetDir, { recursive: true });
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(targetDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    publicUrl = `/images/apartments/${slug}/${fileName}`;
  }

  // Update apartment record in JSON
  const aptPath = path.join(CONTENT_DIR, "apartments", `${slug}.json`);
  const raw = await fs.readFile(aptPath, "utf-8");
  const apt = ApartmentSchema.parse(JSON.parse(raw));

  const newImage = {
    src: publicUrl,
    alt,
    category,
    order: apt.images.length + 1,
    isCover,
    placeholder: false, // REAL PHOTO!
  };

  const updatedImages = isCover
    ? apt.images.map((img) => ({ ...img, isCover: false })).concat(newImage)
    : apt.images.concat(newImage);

  const updatedApt = {
    ...apt,
    images: updatedImages,
  };

  await fs.writeFile(aptPath, JSON.stringify(updatedApt, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await insertApartmentImageInSupabase(slug, newImage);
    } catch (e) {
      console.warn("[uploadApartmentPhotoAction] Supabase image insert failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath(`/apartments/${slug}`);
  revalidatePath(`/admin/apartments/${slug}`);

  return { success: true, message: "Photo uploaded successfully!" };
}

/**
 * Remove a photo from an apartment
 */
export async function deleteApartmentPhotoAction(slug: string, imageSrc: string) {
  await verifyAuth();
  const aptPath = path.join(CONTENT_DIR, "apartments", `${slug}.json`);
  const raw = await fs.readFile(aptPath, "utf-8");
  const apt = ApartmentSchema.parse(JSON.parse(raw));

  const filtered = apt.images.filter((img) => img.src !== imageSrc);
  const updatedApt = {
    ...apt,
    images: filtered,
  };

  await fs.writeFile(aptPath, JSON.stringify(updatedApt, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await deleteApartmentImageInSupabase(slug, imageSrc);
    } catch (e) {
      console.warn("[deleteApartmentPhotoAction] Supabase image delete failed:", e);
    }
  }

  revalidatePath("/");
  revalidatePath("/apartments");
  revalidatePath(`/apartments/${slug}`);
  revalidatePath(`/admin/apartments/${slug}`);

  return { success: true };
}
