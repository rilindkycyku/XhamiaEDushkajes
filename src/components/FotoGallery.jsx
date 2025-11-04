// components/FotoGallery.jsx
import { useState, useRef, useEffect } from "react";

const FOTOT = [
  "/img/xhamia/XhamiaJasht.jpg",
  "/img/xhamia/XhamiaMbrenda.jpg",
  "/img/xhamia/XhamiaNatenDritatEReja.jpg",
];

export default function FotoGallery() {
  const [indeksi, setIndeksi] = useState(0);
  const kutiRef = useRef(null);

  const shkoTe = (i) => {
    const el = kutiRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIndeksi(i);
  };

  const para = () => shkoTe((indeksi - 1 + FOTOT.length) % FOTOT.length);
  const pas = () => shkoTe((indeksi + 1) % FOTOT.length);

  useEffect(() => {
    const el = kutiRef.current;
    if (!el) return;

    const neRrotullim = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndeksi(i);
    };

    el.addEventListener("scroll", neRrotullim);
    return () => el.removeEventListener("scroll", neRrotullim);
  }, []);

  useEffect(() => shkoTe(0), []);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-50">
      <div
        ref={kutiRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {FOTOT.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0" style={{ height: "400px" }}>
            <img
              src={src}
              alt={`Xhamia ${i + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      <button
        onClick={para}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
        aria-label="Foto e mëparshme"
      >
        <ShigjetaMajtas />
      </button>

      <button
        onClick={pas}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
        aria-label="Foto tjetër"
      >
        <ShigjetaDjathtas />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {FOTOT.map((_, i) => (
          <button
            key={i}
            onClick={() => shkoTe(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === indeksi ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Shko te foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const ShigjetaMajtas = () => (
  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ShigjetaDjathtas = () => (
  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);