import { useState } from "react";
import dhuro from "../data/dhuro-per-xhami.json";
import site from "../data/site.json";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { HiOutlineHeart, HiOutlineGlobeAlt, HiSparkles, HiOutlineDocumentDuplicate, HiOutlineQrCode, HiOutlineBanknotes, HiCheck } from "react-icons/hi2";
import { logEvent } from "../lib/analytics";

export default function DhuroPerXhamin() {
  const [teDhenat] = useState(dhuro);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    logEvent('copy_bank_detail', { event_category: 'engagement', event_label: field });
  };

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
      className="container py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-20 md:space-y-32 mx-auto"
    >
      <SEO
        title="Ofroni Ndihmën Tuaj"
        description="Kontribuoni për Xhaminë e Dushkajës. Çdo donacion i juaj ndihmon në mirëmbajtjen e xhamisë dhe zhvillimin e aktiviteteve tona bamirëse."
        url="/dhuroperxhamin"
      />
      <section className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-8">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gold-50 text-gold-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-2 sm:mb-4 border border-gold-100 shadow-sm">
          <HiSparkles className="text-gold-500 animate-pulse" /> Bëhu pjesë e mirësisë
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-[1.05] tracking-tighter">
          Dhuroni për <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700">Xhaminë Tonë</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-2xl text-slate-500 leading-relaxed font-medium">
          {teDhenat.pershkrimiDhuro}
        </motion.p>
      </section>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        {hadithet.map((h) => (
          <motion.div
            key={h.id}
            variants={itemVariants}
            className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center mb-5 sm:mb-8 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white transition-standard shadow-sm">
                <HiOutlineHeart className="text-2xl sm:text-[28px]" />
              </div>
              <p className="text-base sm:text-lg md:text-xl italic text-slate-700 mb-5 sm:mb-8 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">"{h.teksti}"</p>
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

      <motion.section variants={itemVariants} className="bg-slate-900 rounded-3xl sm:rounded-[3rem] md:rounded-[4rem] px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 sm:mb-6">Mënyrat e Donacionit</h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Këto janë llogaritë tona të sigurta për transferime bankare ose donacione direkte dixhitale.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-stretch">
            {/* Transfer Bankar Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 backdrop-blur-sm relative group hover:border-emerald-500/30 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <HiOutlineBanknotes className="text-xl sm:text-2xl" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Transfer Bankar</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest mt-0.5 sm:mt-1">{teDhenat.bankaKosove.bank}</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <p className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-1 sm:mb-1.5">Pronari i Llogarisë</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-white">{teDhenat.bankaKosove.mbajtesi}</p>
                  </div>
                  <div className="group/copy relative">
                    <p className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-1 sm:mb-1.5">IBAN</p>
                    <div
                      className="flex items-center justify-between gap-2 bg-black/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-emerald-500/40 transition-colors cursor-pointer"
                      onClick={() => copyToClipboard(teDhenat.bankaKosove.iban.replace(/\s/g, ''), 'localIban')}
                    >
                      {/* break-all instead of truncate: the full IBAN has to stay readable on a phone */}
                      <p className="font-mono text-emerald-400 font-bold tracking-normal sm:tracking-wider text-sm sm:text-base md:text-lg break-all min-w-0">
                        {teDhenat.bankaKosove.iban}
                      </p>
                      <button className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors shrink-0 ${copiedField === 'localIban' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'}`}>
                        {copiedField === 'localIban' ? <HiCheck size={18} /> : <HiOutlineDocumentDuplicate size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 sm:mt-8 sm:pt-6 border-t border-white/10">
                <p className="text-slate-400 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-1 sm:mb-1.5">Përshkrimi Bankar / Referenca</p>
                <p className="text-sm sm:text-base font-semibold text-slate-200">Donacion - Xhamia e Dushkajes</p>
              </div>
            </div>

            {/* QR Code Quick Transfer Card */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 backdrop-blur-sm relative group hover:border-blue-500/30 transition-all flex flex-col justify-between h-full shadow-xl">
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <HiOutlineQrCode className="text-xl sm:text-2xl" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      Paguaj me <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">OneFor</span>
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest mt-0.5 sm:mt-1">Transfere e Menjëhershme</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-5 sm:mb-6">
                  Skanoni QR Kodin me telefon ose klikoni butonin për të hapur aplikacionin tuaj OneFor me 0€ provizion.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 pt-5 sm:pt-6 border-t border-white/10">
                <div className="bg-slate-950/80 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <img
                    src="/img/onefor_qr.png"
                    alt="OneFor QR Code"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                  />
                </div>
                <div className="flex-1 w-full text-center sm:text-left space-y-3">
                  <a
                    href="https://web.app.onefor.com/web/contact?userName=rilindkycyku"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logEvent('click_onefor_link', { event_category: 'engagement', event_label: 'OneFor Payment Link' })}
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 text-sm"
                  >
                    Hap OneFor App
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">0€ Provizion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="group relative">
        <div className="absolute inset-0 bg-gold-500/5 rounded-3xl sm:rounded-[4.5rem] rotate-1 group-hover:rotate-0 transition-standard" />
        <div className="bg-white rounded-3xl sm:rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100 relative">
          <div className="p-5 sm:p-10 md:p-20">
            <div className="max-w-2xl mb-8 sm:mb-16">
              <div className="inline-flex items-center gap-2 text-emerald-700 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 bg-emerald-50 px-3 sm:px-4 py-1.5 rounded-full border border-emerald-100">
                <HiSparkles /> {site.ramazan?.active ? "Ramazani" : "100%"} Transparencë
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 mb-4 sm:mb-8 tracking-tighter">Transparenca Financiare</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                Çdo kontribut i juaj është i shenjtë. Ne sigurohemi që çdo cent të shkojë në destinacionin e duhur me transparencë të plotë.
              </p>
            </div>

            <div className="rounded-2xl sm:rounded-[3rem] overflow-hidden border border-slate-200/60 shadow-2xl h-[420px] sm:h-[560px] md:h-[700px] bg-white relative group/frame flex flex-col">
              {/* Window Header */}
              <div className="h-12 sm:h-14 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-200" />
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white px-4 py-1.5 rounded-xl border border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  docs.google.com
                </div>
                <a
                  href="https://docs.google.com/spreadsheets/d/1J6tehqBppt5zFp0POSAhIKEIbdpegZV5lWQcJLrMv9I/edit?gid=1052631879#gid=1052631879"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEvent('click_transparency_docs', { event_category: 'engagement', event_label: 'Google Sheets' })}
                  className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 hover:text-emerald-700 font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors"
                >
                  Hap në Tab të Ri <HiOutlineGlobeAlt size={14} />
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
            <div className="mt-6 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-black tracking-[0.3em] text-center">
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