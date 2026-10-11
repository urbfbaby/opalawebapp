import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  theme?: "light" | "dark";
  showManagedBy?: boolean;
}

export function BrandLogo({
  className = "",
  theme = "light",
  showManagedBy = false,
}: BrandLogoProps) {
  const isLight = theme === "light"; // on dark navy background
  const primaryColor = isLight ? "text-[#FAF8F5]" : "text-[#0A0B3D]";
  const accentColor = "text-[#FDB92F]";
  const sublineColor = isLight ? "text-[#FAF8F5]/60" : "text-[#6B6864]";

  return (
    <Link
      href="/"
      className={`inline-flex flex-col group transition-opacity hover:opacity-95 ${className}`}
      aria-label="Opala Property - Home"
    >
      <div className="flex items-baseline gap-2">
        <span
          className={`font-serif text-2xl font-normal tracking-wide uppercase ${primaryColor}`}
        >
          Opala
        </span>
        <span
          className={`text-xs font-medium tracking-[0.2em] uppercase ${accentColor}`}
        >
          Property
        </span>
      </div>
      {showManagedBy && (
        <span className={`text-[10px] tracking-wider uppercase ${sublineColor} mt-0.5`}>
          Managed by Opala Group Pty Ltd
        </span>
      )}
    </Link>
  );
}
