import { z } from "zod";
import { facilities } from "./facilities";

const facilityKeys = Object.keys(facilities) as [string, ...string[]];

export const SiteSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  abn: z.string(),
  managedByLine: z.string(),
  phone: z.string(),
  phoneInternational: z.string(),
  email: z.string().email(),
  whatsappMessage: z.string(),
  businessHours: z.string(),
  serviceArea: z.string(),
});

export const FeatureFlagsSchema = z.object({
  shortTerm: z.boolean(),
  showAvailability: z.boolean(),
});

export const NearbyPlaceSchema = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  verified: z.boolean().default(false),
});

export const PropertySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  suburb: z.string().min(1),
  state: z.string().min(1),
  postcode: z.string().min(1),
  country: z.string().min(1),
  summary: z.string(),
  minStay: z.string(),
  flexibleStay: z.string(),
  billsCoverage: z.array(z.string()),
  nearby: z.array(NearbyPlaceSchema),
  map: z.object({
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    note: z.string().optional(),
  }),
  standardFacilities: z.array(z.string()),
  published: z.boolean(),
});

export const UnitTypeRentSchema = z.object({
  currency: z.string().default("AUD"),
  unit: z.string().default("week"),
  fromExclBills: z.number().positive(),
  fromInclBills: z.number().positive(),
  display: z.string().default("from"),
  reviewed: z.string().default("Quarterly"),
  updatedAt: z.string(),
});

export const UnitTypeSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().int().min(1),
  rent: UnitTypeRentSchema,
});

export const ApartmentImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1, "Alt text is required for all images"),
  category: z.string(),
  order: z.number().int(),
  isCover: z.boolean().default(false),
  placeholder: z.boolean().default(false),
});

export const ApartmentSchema = z.object({
  slug: z.string().min(1),
  code: z.string().min(1),
  property: z.string().min(1),
  unitType: z.string().min(1),
  floor: z.number().int(),
  floorInferred: z.boolean().default(false),
  description: z.string(),
  extraFacilities: z.array(z.string()).default([]),
  stayTypes: z.array(z.string()).default(["long-term"]),
  availableFrom: z.string().nullable().default(null),
  published: z.boolean(),
  images: z.array(ApartmentImageSchema),
});

export const EnquiryRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  moveInDate: z.string().optional(),
  stayLength: z.string().optional(),
  billsPreference: z.string().optional(),
  apartmentCode: z.string().optional(),
  apartmentSlug: z.string().optional(),
  message: z.string(),
  createdAt: z.string(),
});

export type Site = z.infer<typeof SiteSchema>;
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type UnitType = z.infer<typeof UnitTypeSchema>;
export type ApartmentImage = z.infer<typeof ApartmentImageSchema>;
export type Apartment = z.infer<typeof ApartmentSchema>;
export type EnquiryRecord = z.infer<typeof EnquiryRecordSchema>;

// Populated Apartment with relations resolved
export interface PopulatedApartment extends Apartment {
  propertyDetails?: Property;
  unitTypeDetails?: UnitType;
  allFacilities: string[]; // standardFacilities + extraFacilities
}
