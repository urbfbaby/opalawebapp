import { submitStagingPassword } from "@/app/actions/staging-auth";
import { BrandLogo } from "@/components/BrandLogo";

interface StagingLoginPageProps {
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}

export default async function StagingLoginPage({
  searchParams,
}: StagingLoginPageProps) {
  const { returnTo, error } = await searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-opala-border p-8 rounded-[2px] space-y-6 text-center">
        <BrandLogo theme="dark" showManagedBy={true} className="items-center" />
        <div className="space-y-1">
          <h1 className="font-serif text-2xl text-navy">
            Staging Preview
          </h1>
          <p className="text-xs text-opala-muted font-sans">
            Please enter the staging access password to preview this site.
          </p>
        </div>

        {error === "invalid" && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-[2px] text-xs text-left">
            Incorrect password. Please try again.
          </div>
        )}

        <form action={submitStagingPassword} className="space-y-4 text-left">
          <input type="hidden" name="returnTo" value={returnTo || "/"} />
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
          >
            Access site
          </button>
        </form>
      </div>
    </div>
  );
}
