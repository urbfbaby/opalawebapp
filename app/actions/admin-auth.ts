"use server";

import { redirect } from "next/navigation";
import { getAdminPassword, setAdminSession, clearAdminSession } from "@/lib/admin-auth";

export async function loginAdminAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  const returnTo = (formData.get("returnTo") as string) || "/admin";
  const expectedPassword = getAdminPassword();

  if (password === expectedPassword) {
    await setAdminSession();
    redirect(returnTo);
  }

  return { error: "Incorrect admin password. Please try again." };
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
