import { lazy, Suspense, useState } from "react";
import aktivitete from "../data/aktivitetejavore.json";
const YouTubeChannelEmbed = lazy(() => import("../components/YouTubeChannelEmbed"));
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import { HiOutlineClock, HiOutlineMapPin, HiOutlineVideoCamera, HiSparkles, HiOutlineChevronDown } from "react-icons/hi2";

const ActivityDescription = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text && text.length > 150;

  return (
    <div className="flex-1 flex flex-col">
      <p className={`text-slate-500 text-lg leading-relaxed font-medium transition-all duration-300 ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-1.5 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors group/btn"
        >
          {isExpanded ? "Shih më pak" : "Lexo më shumë"}
          <HiOutlineChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default function AktiviteteJavore() {
  const [lista] = useState(aktivitete);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container py-12 md:py-16 space-y-24 mx-auto px-4"
    >
      <SEO
        title="Aktivitetet Javore"
        description="Bashkohuni me ne në aktivitetet tona javore: ligjërata fetare, kurse, dhe programe edukative për të gjitha moshat në Xhaminë e Dushkajës."
        url="/aktivitetejavore"
      />
      <section className="text-center max-w-4xl mx-auto px-4 md:px-0">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-8 border border-emerald-100 shadow-sm font-sans">
          <HiSparkles className="text-emerald-500 animate-pulse" /> Përfshiu në Mirësi
        </motion.div>
        <h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 mb-6 md:mb-8 leading-[1.05] tracking-tighter animate-fade-in-up"
        >
          Aktivitetet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">Javore</span>
        </h1>
        <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto px-2">
          Zbuloni programin tonë dinamik të ligjëratave, kurseve dhe aktiviteteve që organizohen rregullisht në xhaminë tonë.
        </motion.p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-2 sm:px-0">
        {lista.map((akt, idx) => (
          <motion.article
            key={idx}
            variants={itemVariants}
            className="bg-white rounded-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-slate-100 hover:shadow-[0_30px_70px_-20px_rgba(16,185,129,0.15)] transition-all duration-500 group"
          >
            <div className="relative w-full h-72 bg-slate-50 overflow-hidden">
              <img
                src={akt.foto}
                alt={akt.titulli}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-out p-4"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/img/fallback.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                <span className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <HiOutlineVideoCamera className="text-emerald-400" /> Ju mirëpresim
                </span>
              </div>
            </div>

            <div className="p-10 flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-slate-950 mb-6 leading-tight group-hover:text-emerald-700 transition-colors">
                {akt.titulli}
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                    <HiOutlineClock size={20} />
                  </div>
                  <span>{akt.koha}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                    <HiOutlineMapPin size={20} />
                  </div>
                  <span>{akt.lokacioni}</span>
                </div>
              </div>

              <ActivityDescription text={akt.teksti} />
            </div>
          </motion.article>
        ))}

        <motion.article
          variants={itemVariants}
          className="bg-slate-950 rounded-[4rem] p-10 md:p-20 shadow-2xl relative overflow-hidden md:col-span-2 lg:col-span-3 min-h-[600px] flex flex-col justify-center items-center text-center group/yt"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-64 -mt-64 blur-[120px] group-hover/yt:scale-110 transition-standard" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/20 rounded-full -ml-32 -mb-32 blur-[100px]" />

          <div className="relative z-10 max-w-4xl w-full">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-8 border border-white/10 backdrop-blur-sm">
              <HiOutlineVideoCamera className="animate-pulse" /> Kanali Zyrtar
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">YouTube Channel</h3>
            <p className="text-xl text-slate-400 mb-16 font-medium max-w-2xl mx-auto leading-relaxed">Shikoni derset, ligjëratat dhe transmetimet direkte në kanalin tonë zyrtar.</p>

            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-4 md:p-10 w-full shadow-2xl">
              <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white/5">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/50 animate-pulse">Duke u ngarkuar...</div>}>
                  <YouTubeChannelEmbed />
                </Suspense>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
}

