"use client";

import { useState } from "react";
import Image from "next/image";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ApartmentImage } from "@/lib/schemas";

interface ApartmentGalleryProps {
  images: ApartmentImage[];
  unitCode: string;
}

export function ApartmentGallery({ images, unitCode }: ApartmentGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Main Hero Photo (Takes 2 cols & rows on md) */}
        {images[0] && (
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 md:row-span-2 relative aspect-[16/10] md:aspect-auto md:min-h-[420px] bg-opala-placeholder border border-opala-borderSubtle cursor-pointer overflow-hidden group rounded-[2px]"
          >
            {images[0].placeholder ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                <span className="font-serif text-lg text-navy/80 group-hover:text-navy transition-colors">
                  {unitCode}
                </span>
                <span className="text-xs uppercase tracking-widest text-opala-muted mt-1 font-sans">
                  {images[0].category} · Main
                </span>
                <span className="text-[11px] text-opala-muted/60 mt-3 font-serif italic">
                  Click to enlarge
                </span>
              </div>
            ) : (
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                priority
                className="object-cover img-hover-zoom"
              />
            )}
          </div>
        )}

        {/* Thumbnail Photos */}
        {images.slice(1, 5).map((img, idx) => {
          const actualIndex = idx + 1;
          return (
            <div
              key={img.src}
              onClick={() => openLightbox(actualIndex)}
              className="relative aspect-[16/10] bg-opala-placeholder border border-opala-borderSubtle cursor-pointer overflow-hidden group rounded-[2px]"
            >
              {img.placeholder ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none">
                  <span className="font-serif text-sm text-navy/70 group-hover:text-navy transition-colors">
                    {unitCode}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-opala-muted mt-0.5 font-sans">
                    {img.category}
                  </span>
                </div>
              ) : (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover img-hover-zoom"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Representative Note */}
      <p className="text-xs text-opala-muted italic font-sans">
        Images show a similar apartment of the same layout.
      </p>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070828]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
        >
          {/* Top Bar */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
            <span className="text-xs text-[#FAF8F5]/70">
              {lightboxIndex + 1} of {images.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 text-[#FAF8F5] hover:text-amber transition-colors rounded-[2px] focus:outline-none focus-visible:ring-1 focus-visible:ring-amber"
              aria-label="Close photo view"
            >
              <X size={22} weight="light" />
            </button>
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 text-[#FAF8F5] hover:text-amber transition-colors focus:outline-none"
                aria-label="Previous image"
              >
                <CaretLeft size={28} weight="light" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-[#FAF8F5] hover:text-amber transition-colors focus:outline-none"
                aria-label="Next image"
              >
                <CaretRight size={28} weight="light" />
              </button>
            </>
          )}

          {/* Active Image or Neutral Canvas */}
          <div className="max-w-4xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center relative">
            {images[lightboxIndex].placeholder ? (
              <div className="w-full max-w-2xl aspect-[16/10] bg-opala-placeholder border border-opala-border flex flex-col items-center justify-center p-8 rounded-[2px] text-center select-none shadow-xl">
                <span className="font-serif text-3xl text-navy">
                  {unitCode}
                </span>
                <span className="text-xs uppercase tracking-widest text-opala-muted mt-2 font-sans">
                  {images[lightboxIndex].category}
                </span>
                <p className="text-xs text-opala-muted/80 max-w-sm mt-4 font-sans">
                  {images[lightboxIndex].alt}
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-xs text-[#FAF8F5]/80 mt-4 text-center">
              {images[lightboxIndex].alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
