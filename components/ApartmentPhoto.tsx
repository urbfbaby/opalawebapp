import Image from "next/image";
import type { ApartmentImage } from "@/lib/schemas";

interface ApartmentPhotoProps {
  image?: ApartmentImage;
  unitCode: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide" | "hero";
  priority?: boolean;
}

export function ApartmentPhoto({
  image,
  unitCode,
  className = "",
  aspectRatio = "video",
  priority = false,
}: ApartmentPhotoProps) {
  const aspectClasses = {
    video: "aspect-[16/10]",
    square: "aspect-square",
    wide: "aspect-[16/9]",
    hero: "aspect-[16/9] sm:aspect-[21/9]",
  }[aspectRatio];

  // If placeholder is true or no image is supplied, render the warm grey neutral placeholder
  if (!image || image.placeholder) {
    return (
      <div
        className={`w-full ${aspectClasses} bg-opala-placeholder flex flex-col items-center justify-center p-4 border border-opala-borderSubtle transition-all duration-300 relative overflow-hidden group select-none ${className}`}
        aria-label={`Photo placeholder for ${unitCode}`}
      >
        <span className="font-serif text-sm tracking-wider text-navy/70 group-hover:text-navy transition-colors">
          {unitCode}
        </span>
        <span className="text-[10px] tracking-widest uppercase text-opala-muted/70 mt-1 font-sans">
          {image?.category || "Apartment"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${aspectClasses} relative overflow-hidden bg-opala-placeholder border border-opala-borderSubtle ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover img-hover-zoom"
      />
    </div>
  );
}
