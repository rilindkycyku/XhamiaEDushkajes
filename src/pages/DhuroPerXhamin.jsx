// src/pages/DhuroPerXhamin.jsx
import { useState } from "react";
import dhuro from "../data/dhuro-per-xhami.json";
import { motion } from "framer-motion";
import { HiOutlineHeart, HiOutlineGlobeAlt, HiOutlineChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";

export default function DhuroPerXhamin() {
  const [teDhenat] = useState(dhuro);

  const hadithet = [
    {
      id: 1,
      teksti: "Agjërimi është mburojë, sadaka i anulon mëkatet sikur që uji e fik zjarrin...",
      burimi: "Sahihu i Muslimit (40 Hadithet e Imam Neveviut)",
    },
    {
      id: 2,
      teksti: "Çdo e mirë është sadaka.",
      burimi: "Sahihu i Buhariut & Sahihu i Muslimit",
    },
    {
      id: 3,
      teksti: "Çdo njeri do të jetë nën hijen e sadakasë së tij, derisa të gjykohet mes tyre.",
      burimi: "Tirmidhiu",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container py-12 md:py-16 space-y-24 md:space-y-32"
    >
      <section className="text-center max-w-3xl mx-auto space-y-8 px-4">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gold-50 text-gold-700 text-xs font-black uppercase tracking-[0.2em] mb-4 border border-gold-100 shadow-sm">
          <HiSparkles className="text-gold-500 animate-pulse" /> Bëhu pjesë e mirësisë
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-[1.05] tracking-tighter">
          Dhuroni për <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700">Xhaminë Tonë</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium">
          {teDhenat.pershkrimiDhuro}
        </motion.p>
      </section>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {hadithet.map((h) => (
          <motion.div
            key={h.id}
            variants={itemVariants}
            className="bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white transition-standard shadow-sm">
                <HiOutlineHeart size={28} />
              </div>
              <p className="text-xl italic text-slate-700 mb-8 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">"{h.teksti}"</p>
              <div className="flex items-center gap-2">
                <div className="w-10 h-0.5 bg-gold-500 rounded-full" />
                <p className="text-xs text-gold-700 uppercase font-black tracking-[0.2em]">
                  {h.burimi}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-12 md:p-16 rounded-[4rem] shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-125 transition-standard" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-[60px]" />

          <HiOutlineChatBubbleLeftRight className="text-6xl mb-10 text-emerald-300 drop-shadow-lg" />
          <h3 className="text-4xl font-black mb-6 tracking-tight">Na Kontaktoni</h3>
          <p className="text-xl text-emerald-100/80 mb-12 font-medium leading-relaxed max-w-md">
            Për çdo donacion apo pyetje rreth procesit, plotësoni formularin tonë.
          </p>
          <a href="/kontakti" className="inline-flex items-center justify-center gap-3 w-full bg-white text-emerald-800 font-black py-5 rounded-[2rem] hover:bg-emerald-50 transition-all shadow-[0_15px_30px_-5px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95">
            Shko te Formulari <HiSparkles className="text-gold-500" />
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-950 text-white p-12 md:p-16 rounded-[4rem] shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-125 transition-standard" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/5 rounded-full -ml-24 -mb-24 blur-[60px]" />

          <HiOutlineGlobeAlt className="text-6xl mb-10 text-emerald-400 drop-shadow-lg" />
          <h3 className="text-4xl font-black mb-6 tracking-tight">Rrjetet Sociale</h3>
          <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed max-w-md">
            Na dërgoni një mesazh direkt në faqen tonë zyrtare në Facebook për detaje.
          </p>
          <a href="https://www.facebook.com/xhamiaedushkajeskacanik/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-white/5 text-white font-black py-5 rounded-[2rem] hover:bg-white/10 transition-all backdrop-blur-xl border border-white/10 hover:-translate-y-1 active:scale-95">
            Dërgo Mesazh
          </a>
        </motion.div>
      </div>

      <motion.section variants={itemVariants} className="group relative">
        <div className="absolute inset-0 bg-gold-500/5 rounded-[4.5rem] rotate-1 group-hover:rotate-0 transition-standard" />
        <div className="bg-white rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100 relative">
          <div className="p-10 md:p-20">
            <div className="max-w-2xl mb-16">
              <div className="inline-flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-[0.2em] mb-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                <HiSparkles /> 100% Transparencë
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-8 tracking-tighter">Transparenca Financiare</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Çdo kontribut i juaj është i shenjtë. Ne sigurohemi që çdo cent të shkojë në destinacionin e duhur me transparencë të plotë.
              </p>
            </div>

            <div className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl h-[650px] bg-slate-50 relative group/frame">
              <div className="absolute inset-0 border-[12px] border-white rounded-[2.8rem] pointer-events-none z-10" />
              <iframe
                src="https://docs.google.com/spreadsheets/d/1J6tehqBppt5zFp0POSAhIKEIbdpegZV5lWQcJLrMv9I/edit?gid=1052631879#gid=1052631879"
                className="w-full h-full"
                title="Financat e Xhamisë"
                allowFullScreen
              />
            </div>
            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-xs text-slate-400 uppercase font-black tracking-[0.3em]">
                Përditësuar në kohë reale
              </p>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}