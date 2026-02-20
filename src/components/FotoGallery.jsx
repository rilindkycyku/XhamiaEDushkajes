// src/components/FotoGallery.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPause,
  HiPlay,
  HiArrowsPointingOut,
  HiXMark
} from "react-icons/hi2";

const fotot = Object.entries(
  import.meta.glob("../assets/img/xhamia/*.{jpg,jpeg,png,gif,webp}", {
    eager: true,
    import: "default",
  })
)
  .map(([rruga, moduli]) => new URL(moduli, import.meta.url).pathname)
  .sort((a, b) => a.localeCompare(b));

const KOHA = 5000;

export default function FotoGallery() {
  const [indeksi, setIndeksi] = useState(0);
  const [luaj, setLuaj] = useState(true);
  const [isFS, setIsFS] = useState(false);
  const interval = useRef(null);

  const shko = useCallback((i) => setIndeksi(i), []);
  const para = useCallback(() => shko((indeksi - 1 + fotot.length) % fotot.length), [indeksi, shko]);
  const pas = useCallback(() => shko((indeksi + 1) % fotot.length), [indeksi, shko]);

  useEffect(() => {
    if (luaj && !isFS) {
      interval.current = setInterval(pas, KOHA);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [luaj, pas, isFS]);

  if (fotot.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 w-full select-none max-w-4xl mx-auto">
      {/* MAIN VIEWER - COMPACT & CENTERED */}
      <div
        onClick={() => setIsFS(true)}
        className="relative group rounded-3xl md:rounded-[3.5rem] overflow-hidden bg-slate-950 aspect-square md:aspect-[21/10] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] ring-1 ring-white/10 cursor-zoom-in"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={fotot[indeksi]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {/* Ambient Dynamic Background */}
            <div
              className="absolute inset-0 scale-125 blur-[80px] opacity-40 saturate-[1.5]"
              style={{
                backgroundImage: `url(${fotot[indeksi]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Image Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full p-3 md:p-8 relative z-10 flex items-center justify-center"
            >
              <img
                src={fotot[indeksi]}
                className="max-w-full max-h-full object-contain rounded-xl md:rounded-[1.5rem] shadow-2xl"
                alt="Gallery"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* HUD UI */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl bg-black/30 backdrop-blur-2xl border border-white/10 text-white z-20 flex items-center gap-2 md:gap-3">
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] md:text-sm font-black tracking-widest">{String(indeksi + 1).padStart(2, '0')} / {String(fotot.length).padStart(2, '0')}</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setIsFS(true); }}
          className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center hover:bg-emerald-600 transition-all z-20"
        >
          <HiArrowsPointingOut size={16} md:size={20} />
        </button>

        {/* Desktop Side Controls */}
        <div className="absolute inset-y-0 left-0 w-20 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button onClick={(e) => { e.stopPropagation(); para(); }} className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl text-white flex items-center justify-center hover:bg-emerald-500 transition-all"><HiChevronLeft size={24} /></button>
        </div>
        <div className="absolute inset-y-0 right-0 w-20 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button onClick={(e) => { e.stopPropagation(); pas(); }} className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl text-white flex items-center justify-center hover:bg-emerald-500 transition-all"><HiChevronRight size={24} /></button>
        </div>
      </div>

      {/* DOCKER BAR */}
      <div className="w-full bg-white rounded-2xl md:rounded-[3rem] p-2 md:p-4 shadow-xl border border-slate-100 flex items-center gap-3 md:gap-6">
        <button
          onClick={() => setLuaj(!luaj)}
          className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.8rem] flex items-center justify-center transition-all ${luaj ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}
        >
          {luaj ? <HiPause size={20} md:size={24} /> : <HiPlay size={20} md:size={24} />}
        </button>

        <div className="flex-1 flex gap-1.5 md:gap-2 overflow-hidden px-1 md:px-2">
          {fotot.map((_, i) => (
            <button
              key={i}
              onClick={() => shko(i)}
              className={`relative h-1 md:h-1.5 min-w-[8px] md:min-w-[12px] rounded-full transition-all duration-700 ${i === indeksi ? "flex-grow bg-emerald-500" : "w-1 md:w-1.5 bg-slate-100 hover:bg-slate-200"
                }`}
            />
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={para} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"><HiChevronLeft size={18} /></button>
          <button onClick={pas} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"><HiChevronRight size={18} /></button>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {isFS && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-slate-950 flex items-center justify-center p-3 md:p-12"
            onClick={() => setIsFS(false)}
          >
            <div
              className="absolute inset-0 blur-[100px] opacity-30 saturate-[1.5]"
              style={{ backgroundImage: `url(${fotot[indeksi]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <button className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[2rem] bg-white text-slate-900 flex items-center justify-center z-50 shadow-2xl transition-transform active:scale-90"><HiXMark size={24} md:size={32} /></button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={fotot[indeksi]}
              className="max-w-full max-h-full object-contain relative z-40 rounded-[2rem] md:rounded-[3rem] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
