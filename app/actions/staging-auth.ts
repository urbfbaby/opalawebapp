"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitStagingPassword(formData: FormData): Promise<void> {
  const password = formData.get("password") as string;
  const returnTo = (formData.get("returnTo") as string) || "/";
  const expectedPassword = process.env.STAGING_PASSWORD;

  if (expectedPassword && password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set("opala_staging_auth", expectedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    redirect(returnTo);
  }

  redirect(
    `/staging-login?error=invalid&returnTo=${encodeURIComponent(returnTo)}`
  );
}
