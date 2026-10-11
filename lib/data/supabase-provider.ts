import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabase";
import type {
  Site,
  FeatureFlags,
  Property,
  UnitType,
  PopulatedApartment,
  EnquiryRecord,
} from "@/lib/schemas";
import type { ApartmentFilters } from "./index";

/**
 * Supabase Site Provider
 */
export async function getSiteFromSupabase(): Promise<Site | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "global")
    .maybeSingle();

  if (error || !data) return null;

  return {
    name: data.name,
    legalName: data.legal_name,
    abn: data.abn,
    managedByLine: data.managed_by_line,
    phone: data.phone,
    phoneInternational: data.phone_international,
    email: data.email,
    whatsappMessage: data.whatsapp_message,
    businessHours: data.business_hours,
    serviceArea: data.service_area,
  };
}

/**
 * Supabase Feature Flags Provider
 */
export async function getFeatureFlagsFromSupabase(): Promise<FeatureFlags | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("feature_flags")
    .select("*")
    .eq("id", "global")
    .maybeSingle();

  if (error || !data) return null;

  return {
    shortTerm: data.short_term,
    showAvailability: data.show_availability,
  };
}

/**
 * Supabase Properties Provider
 */
export async function getPropertiesFromSupabase(): Promise<Property[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true);

  if (error || !data) return [];

  return data.map((p) => ({
    slug: p.slug,
    name: p.name,
    address: p.address,
    suburb: p.suburb,
    state: p.state,
    postcode: p.postcode,
    country: p.country,
    summary: p.summary,
    minStay: p.min_stay,
    flexibleStay: p.flexible_stay,
    billsCoverage: p.bills_coverage || [],
    nearby: p.nearby || [],
    map: p.map || { lat: null, lng: null },
    standardFacilities: p.standard_facilities || [],
    published: p.published,
  }));
}

/**
 * Supabase Unit Types Provider
 */
export async function getUnitTypesFromSupabase(): Promise<UnitType[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("unit_types")
    .select("*");

  if (error || !data) return [];

  return data.map((u) => ({
    key: u.key,
    label: u.label,
    bedrooms: u.bedrooms,
    bathrooms: u.bathrooms,
    rent: {
      currency: u.currency,
      unit: u.unit,
      fromExclBills: Number(u.from_excl_bills),
      fromInclBills: Number(u.from_incl_bills),
      display: u.display,
      reviewed: u.reviewed,
      updatedAt: u.updated_at,
    },
  }));
}

/**
 * Supabase Apartments Provider
 */
export async function getApartmentsFromSupabase(
  filters?: ApartmentFilters,
  includeUnpublished: boolean = false
): Promise<PopulatedApartment[]> {
  const supabase = includeUnpublished ? getSupabaseAdminClient() : getSupabaseClient();

  let query = supabase
    .from("apartments")
    .select(`
      *,
      property:properties(*),
      unit_type:unit_types(*),
      images:apartment_images(*)
    `);

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  if (filters?.property && filters.property !== "all") {
    query = query.eq("property_slug", filters.property);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let list: PopulatedApartment[] = data.map((a) => {
    const property: Property | undefined = a.property
      ? {
          slug: a.property.slug,
          name: a.property.name,
          address: a.property.address,
          suburb: a.property.suburb,
          state: a.property.state,
          postcode: a.property.postcode,
          country: a.property.country,
          summary: a.property.summary,
          minStay: a.property.min_stay,
          flexibleStay: a.property.flexible_stay,
          billsCoverage: a.property.bills_coverage || [],
          nearby: a.property.nearby || [],
          map: a.property.map || { lat: null, lng: null },
          standardFacilities: a.property.standard_facilities || [],
          published: a.property.published,
        }
      : undefined;

    const unitType: UnitType | undefined = a.unit_type
      ? {
          key: a.unit_type.key,
          label: a.unit_type.label,
          bedrooms: a.unit_type.bedrooms,
          bathrooms: a.unit_type.bathrooms,
          rent: {
            currency: a.unit_type.currency,
            unit: a.unit_type.unit,
            fromExclBills: Number(a.unit_type.from_excl_bills),
            fromInclBills: Number(a.unit_type.from_incl_bills),
            display: a.unit_type.display,
            reviewed: a.unit_type.reviewed,
            updatedAt: a.unit_type.updated_at,
          },
        }
      : undefined;

    const standardFacilities = property?.standardFacilities || [];
    const extraFacilities = a.extra_facilities || [];
    const allFacilities = Array.from(new Set([...standardFacilities, ...extraFacilities]));

    const images = Array.isArray(a.images)
      ? a.images
          .sort((x: { order_index: number }, y: { order_index: number }) => x.order_index - y.order_index)
          .map((img: { src: string; alt: string; category: string; order_index: number; is_cover: boolean; placeholder: boolean }) => ({
            src: img.src,
            alt: img.alt,
            category: img.category,
            order: img.order_index,
            isCover: img.is_cover,
            placeholder: img.placeholder,
          }))
      : [];

    return {
      slug: a.slug,
      code: a.code,
      property: a.property_slug,
      unitType: a.unit_type_key,
      floor: a.floor,
      floorInferred: a.floor_inferred,
      description: a.description,
      extraFacilities,
      stayTypes: a.stay_types || ["long-term"],
      availableFrom: a.available_from,
      published: a.published,
      images,
      propertyDetails: property,
      unitTypeDetails: unitType,
      allFacilities,
    };
  });

  if (filters?.bedrooms && filters.bedrooms !== "all") {
    list = list.filter((apt) => apt.unitTypeDetails?.bedrooms === Number(filters.bedrooms));
  }

  if (filters?.sort === "floor-desc") {
    list.sort((x, y) => y.floor - x.floor);
  } else {
    list.sort((x, y) => x.floor - y.floor);
  }

  return list;
}

/**
 * Supabase Enquiries Provider
 */
export async function getEnquiriesFromSupabase(): Promise<EnquiryRecord[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone || undefined,
    moveInDate: e.move_in_date || undefined,
    stayLength: e.stay_length || undefined,
    billsPreference: e.bills_preference || undefined,
    apartmentCode: e.apartment_code || undefined,
    apartmentSlug: e.apartment_slug || undefined,
    message: e.message,
    createdAt: e.created_at,
  }));
}

/**
 * Supabase Mutations
 */
export async function updateApartmentPublishedInSupabase(
  slug: string,
  published: boolean
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("apartments")
    .update({ published })
    .eq("slug", slug);
  if (error) throw error;
}

export async function updateApartmentInSupabase(
  slug: string,
  updates: {
    description: string;
    floor: number;
    floorInferred: boolean;
    published: boolean;
    availableFrom: string | null;
    extraFacilities: string[];
  }
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("apartments")
    .update({
      description: updates.description,
      floor: updates.floor,
      floor_inferred: updates.floorInferred,
      published: updates.published,
      available_from: updates.availableFrom,
      extra_facilities: updates.extraFacilities,
    })
    .eq("slug", slug);
  if (error) throw error;
}

export async function updateUnitTypeRentInSupabase(
  key: string,
  fromExclBills: number,
  fromInclBills: number,
  updatedAt: string
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("unit_types")
    .update({
      from_excl_bills: fromExclBills,
      from_incl_bills: fromInclBills,
      updated_at: updatedAt,
    })
    .eq("key", key);
  if (error) throw error;
}

export async function updateFeatureFlagsInSupabase(flags: FeatureFlags): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("feature_flags")
    .update({
      short_term: flags.shortTerm,
      show_availability: flags.showAvailability,
    })
    .eq("id", "global");
  if (error) throw error;
}

export async function updateSiteSettingsInSupabase(site: Site): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      abn: site.abn,
      phone: site.phone,
      phone_international: site.phoneInternational,
      email: site.email,
      business_hours: site.businessHours,
      whatsapp_message: site.whatsappMessage,
    })
    .eq("id", "global");
  if (error) throw error;
}

export async function deleteEnquiryInSupabase(id: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("enquiries")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function insertApartmentImageInSupabase(
  apartmentSlug: string,
  image: {
    src: string;
    alt: string;
    category: string;
    order: number;
    isCover: boolean;
    placeholder: boolean;
  }
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  if (image.isCover) {
    await supabase
      .from("apartment_images")
      .update({ is_cover: false })
      .eq("apartment_slug", apartmentSlug);
  }
  const { error } = await supabase.from("apartment_images").insert({
    apartment_slug: apartmentSlug,
    src: image.src,
    alt: image.alt,
    category: image.category,
    order_index: image.order,
    is_cover: image.isCover,
    placeholder: image.placeholder,
  });
  if (error) throw error;
}

export async function deleteApartmentImageInSupabase(
  apartmentSlug: string,
  src: string
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("apartment_images")
    .delete()
    .eq("apartment_slug", apartmentSlug)
    .eq("src", src);
  if (error) throw error;
}

export async function insertEnquiryInSupabase(data: {
  name: string;
  email: string;
  phone?: string;
  moveInDate?: string;
  stayLength?: string;
  billsPreference?: string;
  apartmentCode?: string;
  apartmentSlug?: string;
  message: string;
}): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("enquiries").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    move_in_date: data.moveInDate || null,
    stay_length: data.stayLength || null,
    bills_preference: data.billsPreference || null,
    apartment_code: data.apartmentCode || null,
    apartment_slug: data.apartmentSlug || null,
    message: data.message,
  });
  if (error) throw error;
}

