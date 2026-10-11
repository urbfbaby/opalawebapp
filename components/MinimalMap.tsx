interface MinimalMapProps {
  address: string;
  lat?: number | null;
  lng?: number | null;
  className?: string;
}

export function MinimalMap({
  address,
  lat = -37.8115,
  lng = 144.9602,
  className = "",
}: MinimalMapProps) {
  const latitude = lat ?? -37.8115;
  const longitude = lng ?? 144.9602;

  // OpenStreetMap embed coordinates bounding box
  const bbox = `${longitude - 0.005},${latitude - 0.003},${longitude + 0.005},${latitude + 0.003}`;

  return (
    <div className={`relative border border-opala-border overflow-hidden rounded-[2px] bg-opala-bgAlt ${className}`}>
      <iframe
        title={`Map location of ${address}`}
        width="100%"
        height="100%"
        className="w-full h-full min-h-[360px] border-0 filter grayscale-[40%] contrast-[95%]"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`}
      />
      <div className="p-3 bg-white border-t border-opala-border flex items-center justify-between text-xs text-opala-muted">
        <span>327 La Trobe Street, Melbourne CBD VIC 3000</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy underline hover:text-amber-hover transition-colors font-medium"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
