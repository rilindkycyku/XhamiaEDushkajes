// src/components/Hero.jsx
import siteConfig from "../data/site.json";
import { motion } from "framer-motion";
import xhamiaImage from "../assets/img/xhamia/A-XhamiaJasht.jpg";

export default function Hero() {
  const logo = siteConfig.logoHero || "/assets/logo.png";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlays */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src={xhamiaImage}
          alt="Xhamia e Dushkajës"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 to-transparent" />
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative z-10 py-20 pt-10 md:pt-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 mb-8 mx-auto relative group animate-float">
              {/* Soft White Background Base */}
              <div className="absolute inset-0 bg-white shadow-2xl rounded-full scale-110 border border-slate-100"></div>
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>

              <img
                src={logo}
                alt={siteConfig.emriXhamis}
                className="w-full h-full object-contain relative z-10 p-2 drop-shadow-sm transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnL3N2ZyI+PHRleHQgeD0iMTAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+0KHVv9C40YLSvtC70L3QuNC1PC90ZXh0Pjwvc3ZnPg==";
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="glass-dark p-10 md:p-16 rounded-[3rem] border border-white/10 w-full relative overflow-hidden group"
          >
            {/* Glossy Effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-8 tracking-tighter"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 drop-shadow-sm">
                Mirë se vini!
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-slate-300 mb-10 font-medium leading-relaxed max-w-3xl mx-auto"
            >
              {siteConfig.titulliHero}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6 justify-center items-center"
            >
              <div className="flex items-center gap-4 bg-emerald-500/10 backdrop-blur-xl px-8 py-4 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-standard">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-50 font-bold tracking-wide">Imam: {siteConfig.emriImamitXhamis}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-7 h-12 border-2 border-white/20 rounded-full flex justify-center p-1.5 glass bg-white/5">
          <div className="w-1.5 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        </div>
      </motion.div>
    </section>
  );
}