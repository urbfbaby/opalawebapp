import { z } from "zod";

export const EnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  moveInDate: z.string().optional(),
  stayLength: z.string().optional(),
  billsPreference: z.enum(["excluded", "included", "not-sure"]).optional(),
  apartmentCode: z.string().optional(),
  apartmentSlug: z.string().optional(),
  message: z.string().min(5, "Message is required"),
  // Honeypot field for bot mitigation
  website_field: z.string().max(0, "Spam detected").optional(),
});

export type EnquiryData = z.infer<typeof EnquirySchema>;

export interface EnquiryActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

import fs from "fs/promises";
import path from "path";
import { isSupabaseConfigured } from "@/lib/supabase";
import { insertEnquiryInSupabase } from "@/lib/data/supabase-provider";

/**
 * Persist enquiry to /content/enquiries.json and Supabase
 */
export async function saveEnquiry(data: EnquiryData): Promise<void> {
  const filePath = path.join(process.cwd(), "content", "enquiries.json");
  let records: unknown[] = [];

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    records = JSON.parse(raw);
    if (!Array.isArray(records)) records = [];
  } catch {
    records = [];
  }

  const newRecord = {
    id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  records.unshift(newRecord);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");

  if (isSupabaseConfigured()) {
    try {
      await insertEnquiryInSupabase(data);
    } catch (e) {
      console.warn("[saveEnquiry] Supabase insert failed:", e);
    }
  }
}

/**
 * Send enquiry email using Resend, or no-op if no key is configured
 */
export async function sendEnquiryEmail(data: EnquiryData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[sendEnquiryEmail NO-OP] RESEND_API_KEY missing. Logged enquiry:", {
      to: "admin@opala.com.au",
      from: data.email,
      name: data.name,
      apartment: data.apartmentCode || "General",
      moveInDate: data.moveInDate,
      message: data.message,
    });
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Opala Property <enquiries@opala.com.au>",
        to: ["admin@opala.com.au"],
        reply_to: data.email,
        subject: `New Enquiry from ${data.name}${data.apartmentCode ? ` - ${data.apartmentCode}` : ""}`,
        text: `Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Apartment: ${data.apartmentCode || "General enquiry"}
Preferred Move-in: ${data.moveInDate || "Not specified"}
Stay Length: ${data.stayLength || "Not specified"}
Bills Preference: ${data.billsPreference || "Not specified"}

Message:
${data.message}`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[sendEnquiryEmail ERROR] Resend responded with status", res.status, err);
    }
  } catch (err) {
    console.error("[sendEnquiryEmail EXCEPTION]", err);
  }
}
