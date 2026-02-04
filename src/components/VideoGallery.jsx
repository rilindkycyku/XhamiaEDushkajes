// src/components/VideoGallery.jsx
import { useState, useRef, useEffect } from "react";

const videot = Object.entries(
  import.meta.glob("../assets/video/xhamia/*.{mp4,webm,mov}", {
    eager: true,
    import: "default",
  })
)
  .map(([rruga, moduli]) => new URL(moduli, import.meta.url).pathname)
  .sort((a, b) => a.localeCompare(b));

export default function VideoGallery() {
  const [indeksi, setIndeksi] = useState(0);
  const [duke_ngarkuar, setDukeNgarkuar] = useState(true);
  const [gabim, setGabim] = useState(false);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // SHKO TE VIDEO TJETER
  const shko = (i) => {
    if (i < 0 || i >= videot.length) return;
    
    // NDALO TE GJITHA VIDEOT
    videoRefs.current.forEach((v) => {
      if (v) {
        v.pause();
        v.currentTime = 0; // Kthe ne fillim
      }
    });
    
    setIndeksi(i);
    setDukeNgarkuar(true);
    setGabim(false);
    
    // LUAJ VIDEON E RE
    setTimeout(() => {
      const videoAktiv = videoRefs.current[i];
      if (videoAktiv) {
        videoAktiv.play().catch(() => setGabim(true));
      }
    }, 100);
  };

  const para = () => shko((indeksi - 1 + videot.length) % videot.length);
  const pas = () => shko((indeksi + 1) % videot.length);

  const kaShume = videot.length > 1; // A KA MË SHUMË SE 1 VIDEO?

  // KEYBOARD NAVIGATION (VETËM NËse ka më shumë video)
  useEffect(() => {
    const trajto = (e) => {
      if (kaShume && e.key === "ArrowLeft") para();
      else if (kaShume && e.key === "ArrowRight") pas();
      else if (e.key === " ") {
        e.preventDefault();
        const video = videoRefs.current[indeksi];
        if (video) {
          video.paused ? video.play() : video.pause();
        }
      }
    };

    window.addEventListener("keydown", trajto);
    return () => window.removeEventListener("keydown", trajto);
  }, [indeksi, kaShume]);

  // NGARKO VIDEON E PARE
  useEffect(() => {
    if (videot.length > 0 && videoRefs.current[0]) {
      videoRefs.current[0].play().catch(() => setGabim(true));
    }
  }, []);

  // NUK KA VIDEO
  if (videot.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 text-lg">Nuk ka video të disponueshme</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* VIDEO AKTIV */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-900 group">
        {/* LOADING INDICATOR */}
        {duke_ngarkuar && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
          </div>
        )}

        {/* ERROR STATE */}
        {gabim && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white p-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm">Gabim në ngarkimin e videos</p>
              <button
                onClick={() => shko(indeksi)}
                className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm transition">
                Provo Përsëri
              </button>
            </div>
          </div>
        )}

        <video
          ref={(el) => (videoRefs.current[indeksi] = el)}
          src={videot[indeksi]}
          className="w-full h-[400px] object-contain"
          controls
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setDukeNgarkuar(false)}
          onError={() => {
            setDukeNgarkuar(false);
            setGabim(true);
          }}
        />

        {/* SHIGJETA MAJTAS - VETËM NËse ka më shumë video */}
        {kaShume && (
          <>
            <button
              onClick={para}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
              aria-label="Video e mëparshme">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* SHIGJETA DJATHTAS */}
            <button
              onClick={pas}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
              aria-label="Video tjetër">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* COUNTER - VETËM NËse ka më shumë video */}
        {kaShume && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {indeksi + 1} / {videot.length}
          </div>
        )}
      </div>

      {/* THUMBNAILS - VETËM NËse ka më shumë video */}
      {kaShume && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {videot.map((src, i) => (
            <button
              key={src}
              onClick={() => shko(i)}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                i === indeksi
                  ? "border-teal-500 scale-105 shadow-lg"
                  : "border-gray-300 hover:border-teal-300 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Shko te video ${i + 1}`}>
              <video
                src={src}
                className="w-32 h-20 object-cover pointer-events-none"
                muted
                preload="metadata"
              />
              {/* PLAY ICON */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <svg
                  className="w-8 h-8 text-white drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {/* THUMBNAIL NUMBER */}
              <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {i + 1}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}