// src/components/VideoGallery.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPlay,
  HiPause,
  HiExclamationCircle,
  HiArrowsPointingOut,
  HiXMark,
  HiSpeakerWave,
  HiSpeakerXMark
} from "react-icons/hi2";

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
  const [isLuo, setIsLuo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFS, setIsFS] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRefs = useRef([]);

  const shko = useCallback((i) => {
    if (i < 0 || i >= videot.length) return;
    if (i !== indeksi) {
      setIndeksi(i);
      setLoading(true);
      setError(false);
    }
    setIsLuo(true);
  }, [indeksi]);

  const para = useCallback(() => shko((indeksi - 1 + videot.length) % videot.length), [indeksi, shko]);
  const pas = useCallback(() => shko((indeksi + 1) % videot.length), [indeksi, shko]);

  useEffect(() => {
    const v = videoRefs.current[indeksi];
    if (v) {
      if (isLuo) v.play().catch(() => { });
      else v.pause();
    }
  }, [isLuo, indeksi]);

  if (videot.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 w-full select-none max-w-4xl mx-auto">

      {/* COMPACT CINEMATIC PLAYER */}
      <div
        onClick={() => setIsFS(true)}
        className="relative group rounded-3xl md:rounded-[3.5rem] overflow-hidden bg-slate-950 aspect-square md:aspect-[21/10] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] ring-1 ring-white/10 cursor-zoom-in"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none scale-125 blur-[80px] opacity-30 saturate-[1.6]">
          <video
            key={`ambient-${videot[indeksi]}`}
            src={videot[indeksi]}
            className="w-full h-full object-cover"
            muted loop autoPlay playsInline preload="none"
          />
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-3xl z-30"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-40">
            <HiExclamationCircle className="h-12 w-12 md:h-16 md:w-16 text-red-500/80" />
          </div>
        )}

        {/* Main Video */}
        <video
          key={videot[indeksi]}
          ref={(el) => (videoRefs.current[indeksi] = el)}
          src={videot[indeksi]}
          className="w-full h-full object-contain relative z-10 p-3 md:p-8 drop-shadow-2xl"
          autoPlay={isLuo}
          muted={isMuted}
          loop playsInline
          preload="none"
          onLoadedData={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />

        {/* Floating HUD */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl bg-black/30 backdrop-blur-2xl border border-white/10 text-white z-20 flex items-center gap-2">
          <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] md:text-sm font-black tracking-widest">{indeksi + 1} / {videot.length}</span>
        </div>

        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2 md:gap-3 z-20">
          <button aria-label={isMuted ? "Aktivizo Zërin" : "Ndalo Zërin"} onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all">
            {isMuted ? <HiSpeakerXMark size={16} md:size={18} /> : <HiSpeakerWave size={16} md:size={18} />}
          </button>
          <button aria-label="Zmadho" onClick={(e) => { e.stopPropagation(); setIsFS(true); }} className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
            <HiArrowsPointingOut size={16} md:size={18} />
          </button>
        </div>
      </div>

      {/* DOCKER & THUMBNAILS */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex-1 w-full bg-white rounded-2xl md:rounded-[3rem] p-2 md:p-4 shadow-xl border border-slate-100 flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setIsLuo(!isLuo)}
            aria-label={isLuo ? "Ndalo Videon" : "Luaj Videon"}
            className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.8rem] bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
          >
            {isLuo ? <HiPause size={20} md:size={24} /> : <HiPlay size={20} md:size={24} className="translate-x-0.5" />}
          </button>

          <div className="flex-1 hidden md:block">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duke Luajtur</span>
            <p className="text-sm font-black text-slate-900 truncate">Video</p>
          </div>

          {videot.length > 1 && (
            <div className="flex items-center gap-2">
              <button aria-label="Video Paraprake" onClick={para} className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 text-slate-900 hover:bg-emerald-600 hover:text-white transition-all"><HiChevronLeft size={16} md:size={18} /></button>
              <button aria-label="Video e Radhës" onClick={pas} className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 text-slate-900 hover:bg-emerald-600 hover:text-white transition-all"><HiChevronRight size={16} md:size={18} /></button>
            </div>
          )}
        </div>

        {videot.length > 1 && (
          <div className="overflow-x-auto w-full md:w-auto scrollbar-hide flex gap-3 px-2">
            {videot.map((src, i) => (
              <button
                key={src}
                aria-label={`Video ${i + 1}`}
                onClick={() => shko(i)}
                className={`relative flex-shrink-0 w-20 md:w-28 aspect-video rounded-2xl overflow-hidden border-2 transition-all ${i === indeksi ? "border-emerald-500 scale-105" : "border-slate-100 opacity-40 hover:opacity-100"
                  }`}
              >
                <video src={src} className="w-full h-full object-cover" muted preload="none" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN THEATER */}
      <AnimatePresence>
        {isFS && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-slate-950 flex flex-col items-center justify-center p-0 md:p-12"
            onClick={() => setIsFS(false)}
          >
            <div className="absolute inset-0 blur-[100px] opacity-30 saturate-[1.5]">
              <video src={videot[indeksi]} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            </div>
            <button aria-label="Mbyll Zmadhimin" onClick={() => setIsFS(false)} className="absolute top-10 right-10 w-16 h-16 rounded-[2rem] bg-white text-slate-900 flex items-center justify-center z-50"><HiXMark size={32} /></button>

            <motion.video
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={videot[indeksi]}
              className="w-full h-full md:max-w-6xl md:max-h-full object-contain relative z-40 rounded-none md:rounded-[3rem] shadow-2xl"
              autoPlay controls playsInline muted={isMuted}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
