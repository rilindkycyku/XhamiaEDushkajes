import { useState, useEffect } from 'react';
import { BiCookie, BiBarChartAlt2 } from 'react-icons/bi';
import { HiX, HiShieldCheck, HiChevronDown, HiChevronUp, HiAdjustments } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'cookie-consent';

function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.accepted ? 'accepted' : 'declined';
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState(null); // 'accepted' | 'declined' | null

  useEffect(() => {
    const stored = getStoredConsent();
    setStatus(stored);
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (accepted) => {
    const value = { accepted, date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event('cookie-consent-changed'));
    setStatus(accepted ? 'accepted' : 'declined');
    setIsVisible(false);
  };

  const openPreferences = () => {
    setShowDetails(false);
    setIsVisible(true);
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            key="cookie-trigger"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28, delay: 0.3 }}
            onClick={openPreferences}
            aria-label="Menaxho preferencat e cookie-ve"
            title={
              status === 'accepted'
                ? 'Cookie-t pranohen - kliko për të ndryshuar'
                : status === 'declined'
                ? 'Cookie-t refuzohen - kliko për të ndryshuar'
                : 'Preferencat e cookie-ve'
            }
            className="fixed bottom-5 left-5 z-[99] group"
          >
            <span className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-950/95 backdrop-blur-xl border border-emerald-800/40 shadow-xl shadow-black/50 hover:border-emerald-600/50 hover:bg-emerald-900/90 transition-all duration-300">
              <BiCookie
                className={
                  `text-[17px] ${
                  status === 'accepted'
                    ? 'text-emerald-400'
                    : status === 'declined'
                    ? 'text-white/30'
                    : 'text-emerald-400'
                  }`
                }
              />
              <span
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-emerald-950 ${
                  status === 'accepted'
                    ? 'bg-emerald-400'
                    : status === 'declined'
                    ? 'bg-white/25'
                    : 'bg-amber-400 animate-pulse'
                }`}
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Banner / Preferences Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="cookie-banner"
            initial={{ y: 120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-5 left-5 z-[100] w-[340px] sm:w-[380px]"
          >
            <div className="relative overflow-hidden bg-emerald-950/98 backdrop-blur-2xl border border-emerald-800/30 rounded-2xl shadow-2xl shadow-black/60">
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-[50px] pointer-events-none rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-700/8 blur-[40px] pointer-events-none rounded-full" />

              {/* Dismiss / Close button */}
              <button
                onClick={() => {
                  if (status !== null) {
                    setIsVisible(false);
                  } else {
                    saveConsent(false);
                  }
                }}
                className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all duration-200"
                aria-label={status !== null ? 'Mbyll' : 'Refuzo dhe mbyll'}
              >
                <HiX className="text-[15px]" />
              </button>

              <div className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {status !== null ? (
                      <HiAdjustments className="text-emerald-400 text-xl" />
                    ) : (
                      <BiCookie className="text-emerald-400 text-xl" />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                      {status !== null ? 'Preferencat e Cookie-ve' : 'Privatësia & Analitika'}
                      <HiShieldCheck className="text-[14px] text-emerald-400/80" />
                    </h4>
                    <p className="text-white/50 text-xs leading-relaxed mt-1">
                      {status !== null
                        ? status === 'accepted'
                          ? 'Keni pranuar analitikën anonime. Mund ta ndryshoni këtë kurdo.'
                          : 'Keni refuzuar analitikën. Asnjë gjurmim nuk është aktiv. Mund ta ndryshoni.'
                        : 'Përdorim analitikë anonime për të kuptuar si vizitorët e përdorin faqen. Nuk mblidhen ose shiten të dhëna personale.'}
                    </p>
                  </div>
                </div>

                {/* Current status badge */}
                {status !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                      status === 'accepted'
                        ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'accepted' ? 'bg-emerald-400' : 'bg-white/30'}`} />
                    Statusi: {status === 'accepted' ? 'Analitika pranuar' : 'Analitika refuzuar'}
                  </motion.div>
                )}

                {/* Expandable Details */}
                <div className="rounded-xl border border-white/8 overflow-hidden">
                  <button
                    onClick={() => setShowDetails(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 text-xs font-semibold uppercase tracking-wider"
                  >
                    <span>Çfarë mblidhet</span>
                    {showDetails ? <HiChevronUp className="text-[13px]" /> : <HiChevronDown className="text-[13px]" />}
                  </button>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 pt-1 flex flex-col gap-3 border-t border-white/8">
                          <div className="flex items-start gap-2.5">
                            <BiBarChartAlt2 className="text-[13px] text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white/70 text-xs font-semibold">Vercel Analytics</p>
                              <p className="text-white/35 text-[11px] leading-relaxed">Vizita, referuesit, lloji i pajisjes. Asnjë IP ose identifikues nuk ruhet.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <BiCookie className="text-[13px] text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white/70 text-xs font-semibold">YouTube & Facebook</p>
                              <p className="text-white/35 text-[11px] leading-relaxed">Video dhe postime të integruara i përmbahen politikave të këtyre platformave sapo i shfaqni.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5 border-t border-white/5 pt-2.5">
                            <BiBarChartAlt2 className="text-[13px] text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white/70 text-xs font-semibold">Radio Kuran (Streaming)</p>
                              <p className="text-white/35 text-[11px] leading-relaxed">Transmetimi i drejtpërdrejtë i Kuranit është një shërbim i jashtëm. Dëgjimi i tij i nënshtrohet politikave të privatësisë të ofruesit të stream-it.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5">
                  <button
                    onClick={() => saveConsent(false)}
                    className={`flex-1 font-bold text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all duration-200 border ${
                      status === 'declined'
                        ? 'bg-white/10 text-white/70 border-white/20'
                        : 'bg-white/6 hover:bg-white/10 text-white/50 hover:text-white/80 border-white/8 hover:border-white/15'
                    }`}
                  >
                    {status === 'declined' ? '✓ Refuzuar' : 'Refuzo'}
                  </button>
                  <button
                    onClick={() => saveConsent(true)}
                    className={`flex-[2] font-black text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg ${
                      status === 'accepted'
                        ? 'bg-emerald-500 text-white shadow-emerald-900/30 scale-[1.01]'
                        : 'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-900/30'
                    }`}
                  >
                    {status === 'accepted' ? '✓ Pranuar' : 'Prano të Gjitha'}
                  </button>
                </div>

                <p className="text-white/50 text-[10px] text-center leading-relaxed -mt-1">
                  Klikoni ikonën <BiCookie className="inline text-[10px] mb-0.5" /> në cep çdo herë për të ndryshuar preferencat tuaja.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
