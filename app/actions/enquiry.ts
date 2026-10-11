"use server";

import {
  EnquirySchema,
  saveEnquiry,
  sendEnquiryEmail,
  type EnquiryActionResult,
} from "@/lib/enquiry";

export async function submitEnquiryAction(
  prevState: EnquiryActionResult | null,
  formData: FormData
): Promise<EnquiryActionResult> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    moveInDate: formData.get("moveInDate") || undefined,
    stayLength: formData.get("stayLength") || undefined,
    billsPreference: formData.get("billsPreference") || undefined,
    apartmentCode: formData.get("apartmentCode") || undefined,
    apartmentSlug: formData.get("apartmentSlug") || undefined,
    message: formData.get("message"),
    website_field: formData.get("website_field") || undefined,
  };

  const parsed = EnquirySchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      const fieldName = err.path[0];
      if (typeof fieldName === "string") {
        fieldErrors[fieldName] = err.message;
      }
    });

    return {
      success: false,
      message: "Something went wrong. Please try again or contact us on WhatsApp.",
      errors: fieldErrors,
    };
  }

  try {
    // 1. Stub for database persistence
    await saveEnquiry(parsed.data);

    // 2. Resend email dispatch (no-op if key missing)
    await sendEnquiryEmail(parsed.data);

    return {
      success: true,
      message: "Thanks, we have your enquiry and will be in touch soon.",
    };
  } catch (error) {
    console.error("Enquiry processing error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again or contact us on WhatsApp.",
    };
  }
}
