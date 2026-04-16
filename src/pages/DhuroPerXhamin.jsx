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

      <motion.section variants={itemVariants} className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] px-6 py-12 md:px-8 md:py-16 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Mënyrat e Donacionit</h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Këto janë llogaritë tona të sigurta për transferime bankare ose donacione direkte dixhitale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
            {/* Local Bank "} */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm relative group hover:border-emerald-500/30 transition-all flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <HiOutlineBanknotes size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Brenda Kosovës</h3>
                  <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mt-1">OneFor Kosovo</p>
                </div>
              </div>

              <div className="space-y-5 flex-1 flex flex-col">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5 focus:outline-none">Pronari Llogarisë</p>
                  <p className="text-lg font-bold text-slate-200">Rilind Kycyku</p>
                </div>
                <div className="group/copy relative">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">IBAN</p>
                  <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => copyToClipboard('5001000087606925', 'localIban')}>
                    <p className="font-mono text-emerald-300 font-bold tracking-wider truncate sm:text-base text-sm">5001 0000 8760 6925</p>
                    <button className={`p-1.5 rounded-lg transition-colors ${copiedField === 'localIban' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                      {copiedField === 'localIban' ? <HiCheck size={18} /> : <HiOutlineDocumentDuplicate size={18} />}
                    </button>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">Përshkrimi Bankar / Referenca</p>
                  <p className="text-sm md:text-base font-semibold text-slate-300">Donacion - Xhamia e Dushkajes</p>
                </div>
              </div>
            </div>

            {/* International Bank Details */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm relative group hover:border-gold-500/30 transition-all flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                  <HiOutlineGlobeAlt size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Nga Evropa / Bota</h3>
                  <p className="text-sm font-medium text-gold-400 uppercase tracking-widest mt-1">MOORWAND LTD</p>
                </div>
              </div>

              <div className="space-y-5 flex-1 flex flex-col">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Pronari Llogarisë</p>
                  <p className="text-lg font-bold text-slate-200">Rilind Kycyku</p>
                </div>
                <div className="group/copy relative">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">IBAN (Euro)</p>
                  <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 border border-white/5 hover:border-gold-500/30 transition-colors cursor-pointer" onClick={() => copyToClipboard('GB22MOOW00993591483670', 'euIban')}>
                    <p className="font-mono text-gold-300 font-bold tracking-wider text-xs sm:text-sm truncate mr-2">GB22 MOOW 0099 3591 4836 70</p>
                    <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${copiedField === 'euIban' ? 'bg-gold-500/20 text-gold-400' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                      {copiedField === 'euIban' ? <HiCheck size={18} /> : <HiOutlineDocumentDuplicate size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Adresa e Bankës</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-400 leading-snug">Moorwand Ltd Fora, 3 Lloyds Avenue, London, EC3N 3DS</p>
                </div>
                <div className="mt-auto pt-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">Përshkrimi Bankar / Referenca</p>
                  <p className="text-sm md:text-base font-semibold text-slate-300">Donacion - Xhamia e Dushkajes</p>
                </div>
              </div>
            </div>

            {/* QR Code Quick Transfer */}
            <div className="md:col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between shadow-xl mt-4">
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-blue-500/20">
                  <HiOutlineQrCode size={16} /> Transfere e Menjëhershme
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white">Paguaj përmes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">OneFor</span></h3>
                <p className="text-slate-400 font-medium md:text-lg">Skanoni QR Kodin ose klikoni butonin për të hapur aplikacionin tuaj OneFor në telefon dhe dërgoni transaksionin me 0€ provizion.</p>
                <a
                  href="https://web.app.onefor.com/web/contact?userName=rilindkycyku"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEvent('click_onefor_link', { event_category: 'engagement', event_label: 'OneFor Payment Link' })}
                  className="inline-flex items-center gap-2 mt-4 bg-white text-slate-900 px-8 py-4 rounded-xl font-black hover:bg-emerald-400 hover:text-slate-900 transition-colors shadow-lg"
                >
                  Hap OneFor
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>
              <div className="bg-slate-950/50 p-2 md:p-3 rounded-[1.5rem] md:rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] shrink-0 group hover:scale-[1.03] transition-transform duration-500 border-4 border-white/5 relative overflow-hidden">
                <img
                  src="/img/onefor_qr.png"
                  alt="OneFor QR Code"
                  className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>

          </div>
        </div>
      </motion.section>

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
                  onClick={() => logEvent('click_transparency_docs', { event_category: 'engagement', event_label: 'Google Sheets' })}
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