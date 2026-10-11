"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  uploadApartmentPhotoAction,
  deleteApartmentPhotoAction,
} from "@/app/actions/admin-content";
import { ApartmentPhoto } from "@/components/ApartmentPhoto";
import type { ApartmentImage } from "@/lib/schemas";

interface ApartmentPhotoUploaderProps {
  slug: string;
  unitCode: string;
  images: ApartmentImage[];
}

export function ApartmentPhotoUploader({
  slug,
  unitCode,
  images,
}: ApartmentPhotoUploaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await uploadApartmentPhotoAction(slug, formData);
      if (res.success) {
        setMessage({ text: "Photo uploaded and added to unit successfully!" });
        form.reset();
        router.refresh();
      } else {
        setMessage({ text: res.message || "Failed to upload photo.", error: true });
      }
      setTimeout(() => setMessage(null), 4000);
    });
  };

  const handleDelete = (src: string) => {
    if (confirm("Remove this photo from the apartment?")) {
      startTransition(async () => {
        await deleteApartmentPhotoAction(slug, src);
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-opala-border">
      <div>
        <h3 className="font-serif text-lg text-navy">
          Photos & Image Management ({images.length})
        </h3>
        <p className="text-xs text-opala-muted mt-0.5">
          Upload original high-resolution photography directly to Cloud Storage (Supabase Storage). When uploaded, photos immediately replace placeholders.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-[2px] text-xs border ${
            message.error
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload New Photo Form */}
      <form onSubmit={handleUpload} className="p-4 bg-opala-bg border border-opala-border rounded-[2px] space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-navy">
          Upload New Photo
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-opala-muted mb-1">
              File (JPG, PNG, WebP)
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full text-xs text-opala-charcoal file:mr-2 file:py-1 file:px-2.5 file:rounded-[2px] file:border-0 file:text-xs file:font-medium file:bg-navy file:text-[#FAF8F5] hover:file:bg-navy-surface cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-opala-muted mb-1">
              Room Category
            </label>
            <select
              name="category"
              defaultValue="living"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-opala-border rounded-[2px] text-opala-charcoal focus:outline-none focus:border-navy"
            >
              <option value="living">Living & Dining</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="balcony">Balcony / Outlook</option>
              <option value="floorplan">Floorplan</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-opala-muted mb-1">
              Descriptive Alt Text
            </label>
            <input
              type="text"
              name="alt"
              required
              placeholder="e.g. Living room with floor-to-ceiling windows"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-opala-border rounded-[2px] text-opala-charcoal focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-opala-charcoal">
            <input
              type="checkbox"
              name="isCover"
              value="true"
              className="w-3.5 h-3.5 text-navy rounded-[2px]"
            />
            <span>Set as primary cover photo</span>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-navy text-[#FAF8F5] hover:bg-navy-surface transition-colors rounded-[2px] disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "Upload to Cloud"}
          </button>
        </div>
      </form>

      {/* Current Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.src} className="space-y-1 group relative">
            <ApartmentPhoto image={img} unitCode={unitCode} aspectRatio="video" />
            <div className="flex items-center justify-between text-[10px] text-opala-muted pt-1">
              <span className="capitalize">{img.category}</span>
              <div className="flex items-center gap-2">
                {img.isCover && <span className="font-semibold text-navy">Cover</span>}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(img.src)}
                  className="text-rose-600 hover:text-rose-800 underline"
                >
                  Remove
                </button>
              </div>
            </div>
            {img.placeholder ? (
              <span className="text-[9px] text-amber-800 bg-amber-50 px-1 py-0.5 rounded-[2px] block text-center border border-amber-200">
                Placeholder Canvas
              </span>
            ) : (
              <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded-[2px] block text-center border border-emerald-200">
                Real Photography
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
