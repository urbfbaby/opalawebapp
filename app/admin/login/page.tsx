"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/app/actions/admin-auth";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <div className="min-h-screen bg-opala-bg flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-opala-border p-8 rounded-[2px] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo theme="dark" showManagedBy={true} className="items-center" />
          <h1 className="font-serif text-2xl text-navy pt-2">
            Opala Admin Portal
          </h1>
          <p className="text-xs text-opala-muted font-sans">
            Masuk untuk mengelola apartemen, tarif mingguan, feature flags, dan pesan calon penyewa.
          </p>
        </div>

        {state?.error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-[2px] text-xs">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
            >
              Kata Sandi Admin
            </label>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue="opala2026"
              required
              autoFocus
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy font-mono"
              placeholder="••••••••••••"
            />
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-[2px] flex items-center justify-between text-[11px] text-amber-900">
              <span>Password dev: <strong className="font-mono">opala2026</strong></span>
              <span className="text-amber-700">(Sudah terisi otomatis)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-navy text-[#FAF8F5] hover:bg-navy-surface transition-colors rounded-[2px] disabled:opacity-50"
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Dashboard Admin →"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-opala-borderSubtle">
          <a
            href="/"
            className="text-xs text-opala-muted hover:text-navy underline transition-colors"
          >
            ← Kembali ke Website Publik
          </a>
        </div>
      </div>
    </div>
  );
}
