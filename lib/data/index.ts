import fs from "fs/promises";
import path from "path";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getSiteFromSupabase,
  getFeatureFlagsFromSupabase,
  getPropertiesFromSupabase,
  getUnitTypesFromSupabase,
  getApartmentsFromSupabase,
  getEnquiriesFromSupabase,
} from "./supabase-provider";
import {
  SiteSchema,
  FeatureFlagsSchema,
  PropertySchema,
  UnitTypeSchema,
  ApartmentSchema,
  EnquiryRecordSchema,
  type Site,
  type FeatureFlags,
  type Property,
  type UnitType,
  type Apartment,
  type PopulatedApartment,
  type EnquiryRecord,
} from "@/lib/schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Safe file reader helper with JSON parsing
async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Failed to read content file at ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetch site configuration
 */
export async function getSite(): Promise<Site> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getSiteFromSupabase();
      if (data) return data;
    } catch (e) {
      console.warn("[getSite] Supabase read failed, falling back to JSON:", e);
    }
  }

  const filePath = path.join(CONTENT_DIR, "site.json");
  const rawData = await readJsonFile<unknown>(filePath);
  const result = SiteSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(`Content validation error in site.json: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Fetch feature flags
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getFeatureFlagsFromSupabase();
      if (data) return data;
    } catch (e) {
      console.warn("[getFeatureFlags] Supabase read failed, falling back to JSON:", e);
    }
  }

  const filePath = path.join(CONTENT_DIR, "flags.json");
  const rawData = await readJsonFile<unknown>(filePath);
  const result = FeatureFlagsSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error(`Content validation error in flags.json: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Fetch all properties
 */
export async function getProperties(): Promise<Property[]> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getPropertiesFromSupabase();
      if (data.length > 0) return data;
    } catch (e) {
      console.warn("[getProperties] Supabase read failed, falling back to JSON:", e);
    }
  }
  const dirPath = path.join(CONTENT_DIR, "properties");
  const files = await fs.readdir(dirPath);
  const properties: Property[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const rawData = await readJsonFile<unknown>(path.join(dirPath, file));
    const result = PropertySchema.safeParse(rawData);
    if (!result.success) {
      throw new Error(`Content validation error in properties/${file}: ${result.error.message}`);
    }
    if (result.data.published) {
      properties.push(result.data);
    }
  }

  return properties;
}

/**
 * Fetch single property by slug
 */
export async function getProperty(slug: string): Promise<Property | null> {
  const filePath = path.join(CONTENT_DIR, "properties", `${slug}.json`);
  try {
    const rawData = await readJsonFile<unknown>(filePath);
    const result = PropertySchema.safeParse(rawData);
    if (!result.success) {
      throw new Error(`Content validation error in properties/${slug}.json: ${result.error.message}`);
    }
    if (!result.data.published) return null;
    return result.data;
  } catch {
    return null;
  }
}

/**
 * Fetch all unit types
 */
export async function getUnitTypes(): Promise<UnitType[]> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getUnitTypesFromSupabase();
      if (data.length > 0) return data;
    } catch (e) {
      console.warn("[getUnitTypes] Supabase read failed, falling back to JSON:", e);
    }
  }

  const dirPath = path.join(CONTENT_DIR, "unit-types");
  const files = await fs.readdir(dirPath);
  const unitTypes: UnitType[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const rawData = await readJsonFile<unknown>(path.join(dirPath, file));
    const result = UnitTypeSchema.safeParse(rawData);
    if (!result.success) {
      throw new Error(`Content validation error in unit-types/${file}: ${result.error.message}`);
    }
    unitTypes.push(result.data);
  }

  return unitTypes;
}

/**
 * Fetch single unit type by key
 */
export async function getUnitType(key: string): Promise<UnitType | null> {
  const filePath = path.join(CONTENT_DIR, "unit-types", `${key}.json`);
  try {
    const rawData = await readJsonFile<unknown>(filePath);
    const result = UnitTypeSchema.safeParse(rawData);
    if (!result.success) {
      throw new Error(`Content validation error in unit-types/${key}.json: ${result.error.message}`);
    }
    return result.data;
  } catch {
    return null;
  }
}

export interface ApartmentFilters {
  bedrooms?: number | "all";
  property?: string | "all";
  sort?: "floor-asc" | "floor-desc";
  floor?: number;
}

/**
 * Fetch all published apartments with relations populated
 */
export async function getApartments(filters?: ApartmentFilters): Promise<PopulatedApartment[]> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getApartmentsFromSupabase(filters, false);
      if (data.length > 0) return data;
    } catch (e) {
      console.warn("[getApartments] Supabase read failed, falling back to JSON:", e);
    }
  }

  const dirPath = path.join(CONTENT_DIR, "apartments");
  const files = await fs.readdir(dirPath);

  // Fetch reference data for relation resolution
  const [properties, unitTypes] = await Promise.all([
    getProperties(),
    getUnitTypes(),
  ]);

  const propertyMap = new Map(properties.map((p) => [p.slug, p]));
  const unitTypeMap = new Map(unitTypes.map((u) => [u.key, u]));

  const rawApartments: Apartment[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const rawData = await readJsonFile<unknown>(path.join(dirPath, file));
    const result = ApartmentSchema.safeParse(rawData);
    if (!result.success) {
      throw new Error(`Content validation error in apartments/${file}: ${result.error.message}`);
    }
    if (result.data.published) {
      rawApartments.push(result.data);
    }
  }

  // Populate relations and compose facilities
  let populated: PopulatedApartment[] = rawApartments.map((apt) => {
    const property = propertyMap.get(apt.property);
    const unitType = unitTypeMap.get(apt.unitType);

    // Combine standard facilities from property and extra facilities from unit
    const standardFacilities = property?.standardFacilities ?? [];
    const extraFacilities = apt.extraFacilities ?? [];
    const allFacilities = Array.from(new Set([...standardFacilities, ...extraFacilities]));

    // Sort images by order
    const sortedImages = [...apt.images].sort((a, b) => a.order - b.order);

    return {
      ...apt,
      images: sortedImages,
      propertyDetails: property,
      unitTypeDetails: unitType,
      allFacilities,
    };
  });

  // Apply filters
  if (filters?.property && filters.property !== "all") {
    populated = populated.filter((apt) => apt.property === filters.property);
  }

  if (filters?.bedrooms && filters.bedrooms !== "all") {
    populated = populated.filter(
      (apt) => apt.unitTypeDetails?.bedrooms === Number(filters.bedrooms)
    );
  }

  if (filters?.floor !== undefined) {
    populated = populated.filter((apt) => apt.floor === filters.floor);
  }

  // Sorting
  if (filters?.sort === "floor-desc") {
    populated.sort((a, b) => b.floor - a.floor);
  } else if (filters?.sort === "floor-asc") {
    populated.sort((a, b) => a.floor - b.floor);
  } else {
    // Default sort by floor ascending
    populated.sort((a, b) => a.floor - b.floor);
  }

  return populated;
}

/**
 * Fetch a single apartment by slug with relations populated
 */
export async function getApartment(slug: string): Promise<PopulatedApartment | null> {
  const filePath = path.join(CONTENT_DIR, "apartments", `${slug}.json`);
  try {
    const rawData = await readJsonFile<unknown>(filePath);
    const result = ApartmentSchema.safeParse(rawData);
    if (!result.success) {
      throw new Error(`Content validation error in apartments/${slug}.json: ${result.error.message}`);
    }
    const apt = result.data;
    if (!apt.published) return null;

    const [property, unitType] = await Promise.all([
      getProperty(apt.property),
      getUnitType(apt.unitType),
    ]);

    const standardFacilities = property?.standardFacilities ?? [];
    const extraFacilities = apt.extraFacilities ?? [];
    const allFacilities = Array.from(new Set([...standardFacilities, ...extraFacilities]));

    const sortedImages = [...apt.images].sort((a, b) => a.order - b.order);

    return {
      ...apt,
      images: sortedImages,
      propertyDetails: property ?? undefined,
      unitTypeDetails: unitType ?? undefined,
      allFacilities,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch all enquiries from /content/enquiries.json or Supabase
 */
export async function getEnquiries(): Promise<EnquiryRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getEnquiriesFromSupabase();
      if (data.length > 0) return data;
    } catch (e) {
      console.warn("[getEnquiries] Supabase read failed, falling back to JSON:", e);
    }
  }

  const filePath = path.join(CONTENT_DIR, "enquiries.json");
  try {
    const raw = await readJsonFile<unknown>(filePath);
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => EnquiryRecordSchema.parse(item));
  } catch {
    return [];
  }
}

/**
 * Fetch all apartments for admin (including unpublished)
 */
export async function getAdminApartments(): Promise<PopulatedApartment[]> {
  if (isSupabaseConfigured()) {
    try {
      const data = await getApartmentsFromSupabase(undefined, true);
      if (data.length > 0) return data;
    } catch (e) {
      console.warn("[getAdminApartments] Supabase read failed, falling back to JSON:", e);
    }
  }

  const dirPath = path.join(CONTENT_DIR, "apartments");
  const files = await fs.readdir(dirPath);

  const [properties, unitTypes] = await Promise.all([
    getProperties(),
    getUnitTypes(),
  ]);

  const propertyMap = new Map(properties.map((p) => [p.slug, p]));
  const unitTypeMap = new Map(unitTypes.map((u) => [u.key, u]));

  const list: PopulatedApartment[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const rawData = await readJsonFile<unknown>(path.join(dirPath, file));
    const result = ApartmentSchema.safeParse(rawData);
    if (!result.success) continue;

    const apt = result.data;
    const property = propertyMap.get(apt.property);
    const unitType = unitTypeMap.get(apt.unitType);

    const standardFacilities = property?.standardFacilities ?? [];
    const extraFacilities = apt.extraFacilities ?? [];
    const allFacilities = Array.from(new Set([...standardFacilities, ...extraFacilities]));
    const sortedImages = [...apt.images].sort((a, b) => a.order - b.order);

    list.push({
      ...apt,
      images: sortedImages,
      propertyDetails: property,
      unitTypeDetails: unitType,
      allFacilities,
    });
  }

  // Sort by floor ascending
  return list.sort((a, b) => a.floor - b.floor);
}

