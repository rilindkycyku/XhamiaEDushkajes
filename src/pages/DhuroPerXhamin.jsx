import { useState } from "react";
import dhuro from "../data/dhuro-per-xhami.json";
import site from "../data/site.json";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { HiOutlineHeart, HiOutlineGlobeAlt, HiSparkles } from "react-icons/hi2";

export default function DhuroPerXhamin() {
  const [teDhenat] = useState(dhuro);

  const hadithet = [
    {
      id: 1,
      teksti: "Agjërimi është mburojë, sadaka i annulon mëkatet sikur që uji e fik zjarrin...",
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
      className="container py-12 md:py-16 space-y-24 md:space-y-32 mx-auto"
    >
      <SEO
        title="Ofroni Ndihmën Tuaj"
        description="Kontribuoni për Xhaminë e Dushkajës. Çdo donacion i juaj ndihmon në mirëmbajtjen e xhamisë dhe zhvillimin e aktiviteteve tona bamirëse."
        url="/dhuroperxhamin"
      />
      <section className="text-center max-w-3xl mx-auto space-y-8 px-4 md:px-0">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gold-50 text-gold-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 border border-gold-100 shadow-sm">
          <HiSparkles className="text-gold-500 animate-pulse" /> Bëhu pjesë e mirësisë
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-[1.05] tracking-tighter">
          Dhuroni për <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700">Xhaminë Tonë</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-500 leading-relaxed font-medium px-4">
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

      <motion.section variants={itemVariants} className="group relative">
        <div className="absolute inset-0 bg-gold-500/5 rounded-[4.5rem] rotate-1 group-hover:rotate-0 transition-standard" />
        <div className="bg-white rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100 relative">
          <div className="p-10 md:p-20">
            <div className="max-w-2xl mb-16">
              <div className="inline-flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-[0.2em] mb-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                <HiSparkles /> {site.ramazan?.active ? "Ramazani" : "100%"} Transparencë
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-8 tracking-tighter">Transparenca Financiare</h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Çdo kontribut i juaj është i shenjtë. Ne sigurohemi që çdo cent të shkojë në destinacionin e duhur me transparencë të plotë.
              </p>
            </div>

            <div className="rounded-[3rem] overflow-hidden border border-slate-200/60 shadow-2xl h-[700px] bg-white relative group/frame flex flex-col">
              {/* Window Header */}
              <div className="h-14 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between px-8 shrink-0">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white px-4 py-1.5 rounded-xl border border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  docs.google.com
                </div>
                <a
                  href="https://docs.google.com/spreadsheets/d/1J6tehqBppt5zFp0POSAhIKEIbdpegZV5lWQcJLrMv9I/edit?gid=1052631879#gid=1052631879"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-black text-xs uppercase tracking-widest transition-colors"
                >
                  Hap në Tab të Ri <HiOutlineGlobeAlt size={16} />
                </a>
              </div>

              {/* Spreadsheat Body */}
              <div className="flex-1 bg-slate-50 relative">
                <div className="absolute inset-0 bg-gold-500/5 pointer-events-none z-10 opacity-0 group-hover/frame:opacity-100 transition-opacity" />
                <iframe
                  src="https://docs.google.com/spreadsheets/d/1J6tehqBppt5zFp0POSAhIKEIbdpegZV5lWQcJLrMv9I/preview?gid=1052631879&widget=true&headers=false&chrome=false"
                  className="w-full h-full relative z-0"
                  title="Financat e Xhamisë"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
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