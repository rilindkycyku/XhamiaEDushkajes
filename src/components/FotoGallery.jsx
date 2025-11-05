// src/components/FotoGallery.jsx
import { useState, useRef, useEffect, useCallback } from "react";

/* 
  LEXON AUTOMATIKISHT TË GJITHA FOTOT NGA DOSJA:
  src/assets/img/xhamia/
  (shto foto të reja aty – shfaqen vetë!)
*/
const fotot = Object.entries(
  import.meta.glob("../assets/img/xhamia/*.{jpg,jpeg,png,gif,webp}", {
    eager: true,
    import: "default",
  })
)
  .map(([rruga, moduli]) => new URL(moduli, import.meta.url).pathname)
  .sort((a, b) => a.localeCompare(b));

const KOHA = 2000; // sa sekonda ndërrohet fotoja vetë

export default function FotoGallery() {
  const [indeksi, setIndeksi] = useState(0); // cila foto është aktive
  const [luaj, setLuaj] = useState(true); // a po luan vetë?
  const kuti = useRef(null); // div-i që rrotullon fotot
  const interval = useRef(null); // timer-i për auto-play
  const mbi = useRef(false); // a është maus mbi galeri?

  /* SHKO TE NJË FOTO SPECIFIKE */
  const shko = useCallback((i) => {
    const el = kuti.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIndeksi(i);
  }, []);

  const para = () => shko((indeksi - 1 + fotot.length) % fotot.length);
  const pas = () => shko((indeksi + 1) % fotot.length);

  /* FILLO AUTO-PLAY */
  const fillo = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    interval.current = setInterval(() => {
      if (!mbi.current) pas(); // ndërro foto vetëm nëse maus nuk është mbi
    }, KOHA);
  }, [pas]);

  /* NDALO AUTO-PLAY */
  const ndalo = useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  }, []);

  /* NDËRRO LUJ / PAUZO */
  const ndrysho = () => {
    const doLuaj = !luaj;
    setLuaj(doLuaj);
    if (doLuaj) fillo();
    else ndalo();
  };

  /* RIFILLO TIMERIN PAS KLIKIMIT */
  const rifillo = () => luaj && fillo();

  /* EFEKTE: AUTO-PLAY + SCROLL + RESET */
  useEffect(() => {
    if (luaj) fillo();
    return () => ndalo(); // pastro kur largohet komponenti
  }, [luaj, fillo, ndalo]);

  useEffect(() => {
    const el = kuti.current;
    if (!el) return;

    const rrotullo = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      if (i >= 0 && i < fotot.length) setIndeksi(i);
    };

    el.addEventListener("scroll", rrotullo);
    return () => el.removeEventListener("scroll", rrotullo);
  }, [fotot.length]);

  useEffect(() => shko(0), [shko]); // fillo nga fotoja e parë

  /* MAUSI MBI GALERI */
  const hyne = () => {
    mbi.current = true;
    ndalo();
  };
  const dil = () => {
    mbi.current = false;
    if (luaj) fillo();
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-50"
      onMouseEnter={hyne}
      onMouseLeave={dil}>
      {/* ZONA E RROTULLIMIT TË FOTOVE */}
      <div
        ref={kuti}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}>
        {fotot.map((src, i) => (
          <div
            key={src}
            className="w-full flex-shrink-0"
            style={{ height: "400px" }}>
            <img
              src={src}
              alt={`Foto ${i + 1}`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* SHIGJETA MAJTAS */}
      <button
        onClick={() => {
          para();
          rifillo();
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
        aria-label="Foto e mëparshme">
        <ShigjetaMajtas />
      </button>

      {/* SHIGJETA DJATHTAS */}
      <button
        onClick={() => {
          pas();
          rifillo();
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
        aria-label="Foto tjetër">
        <ShigjetaDjathtas />
      </button>

      {/* PIKAT POSHTË (NAVIGIM) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {fotot.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              shko(i);
              rifillo();
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === indeksi ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Shko te foto ${i + 1}`}
          />
        ))}
      </div>

      {/* BUTONI LUJ / PAUZO */}
      <button
        onClick={ndrysho}
        className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition"
        aria-label={luaj ? "Pauzo" : "Luaj"}
        title={luaj ? "Pauzo" : "Luaj"}>
        {luaj ? <Pauzo /> : <Luaj />}
      </button>
    </div>
  );
}

/* IKONAT */
const ShigjetaMajtas = () => (
  <svg
    className="w-5 h-5 text-gray-800"
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
);

const ShigjetaDjathtas = () => (
  <svg
    className="w-5 h-5 text-gray-800"
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
);

const Luaj = () => (
  <svg
    className="w-4 h-4 text-gray-800"
    fill="currentColor"
    viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Pauzo = () => (
  <svg
    className="w-4 h-4 text-gray-800"
    fill="currentColor"
    viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
