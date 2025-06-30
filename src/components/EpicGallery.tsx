import React, { useRef } from "react";

type EpicImage = {
  imageUrl: string;
  caption: string;
  date: string;
  centroid_coordinates?: { lat: number; lon: number };
};

interface EpicGalleryProps {
  availableDates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  images: EpicImage[];
  loading: boolean;
  error?: string;
}

export default function EpicGallery({
  availableDates,
  selectedDate,
  onDateChange,
  images,
  loading,
  error,
}: EpicGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const currentIndex = images.findIndex(img => img.date === selectedDate);

  const scrollGallery = (dir: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = 340;
      galleryRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <label className="text-white font-bold" htmlFor="epic-date">Choose a date:</label>
        <select
          id="epic-date"
          className="bg-[#292f38] text-white rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
          value={selectedDate}
          onChange={e => onDateChange(e.target.value)}
          aria-label="Select date for Earth images"
        >
          {availableDates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-white">Loading images...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : images.length === 0 ? (
        <div className="text-white">No images for this date.</div>
      ) : (
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-blue-400/60 text-white rounded-full p-2 shadow-lg backdrop-blur-md border border-white/30 transition-all duration-200 hidden md:block"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={() => scrollGallery("left")}
            tabIndex={0}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-blue-400/60 text-white rounded-full p-2 shadow-lg backdrop-blur-md border border-white/30 transition-all duration-200 hidden md:block"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={() => scrollGallery("right")}
            tabIndex={0}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
          {/* Gallery */}
          <div
            ref={galleryRef}
            className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
            tabIndex={0}
            aria-label="Earth images gallery"
          >
            {images.map((img, i) => (
              <div
                key={img.imageUrl + i}
                className="min-w-[320px] max-w-xs bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-0 flex-shrink-0 relative group snap-center transition-all duration-300 border border-white/10 hover:border-blue-400/80 hover:shadow-blue-400/30"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative">
                  <img
                    src={img.imageUrl}
                    alt={img.caption}
                    className="rounded-t-2xl w-full aspect-video object-cover mb-0"
                    loading="lazy"
                  />
                  {/* Overlay date/coords */}
                  <div className="absolute left-2 bottom-2 bg-black/60 text-white text-xs rounded px-2 py-1 backdrop-blur-sm">
                    <span>{img.date}</span>
                    {img.centroid_coordinates && (
                      <span className="ml-2">Lat: {img.centroid_coordinates.lat.toFixed(2)}, Lon: {img.centroid_coordinates.lon.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                {/* Floating caption card */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-32px] w-[90%] bg-white/90 text-[#181c22] text-sm font-semibold rounded-xl shadow-lg px-4 py-2 z-20 border border-blue-200/40">
                  {img.caption}
                </div>
              </div>
            ))}
          </div>
          {/* Image count */}
          <div className="text-white text-xs text-center mt-12">
            Showing {images.length} image{images.length > 1 ? 's' : ''} for {selectedDate}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
} 