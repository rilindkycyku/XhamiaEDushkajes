import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiXMark, HiChevronLeft, HiChevronRight, HiArrowDownTray } from 'react-icons/hi2';
import SEO from '../components/SEO';

let _cachedNames = null;
async function loadNames() {
  if (_cachedNames) return _cachedNames;
  const res = await fetch('/esmaul-husna.json');
  _cachedNames = await res.json();
  return _cachedNames;
}

export default function EsmaulHusna() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    loadNames().then((data) => {
      setNames(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, names.length]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setActiveIndex(null);
      }
    };
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeIndex]);

  const handleNext = () => setActiveIndex((p) => (p === names.length - 1 ? 0 : p + 1));
  const handlePrev = () => setActiveIndex((p) => (p === 0 ? names.length - 1 : p - 1));

  const filteredNames = useMemo(() => {
    if (!searchQuery.trim()) return names;
    const q = searchQuery.toLowerCase().trim();
    return names.filter((n) =>
      n.id.toString() === q ||
      n.arabic.includes(q) ||
      Object.values(n.transliterations || {}).some((t) => t.toLowerCase().includes(q)) ||
      Object.values(n.translations || {}).some((t) => t.toLowerCase().includes(q))
    );
  }, [names, searchQuery]);

  const activeName = activeIndex !== null ? names[activeIndex] : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <>
      <SEO
        title="99 Emrat e Allahut - Esmaul Husna Shqip"
        description="Zbuloni 99 Emrat e Bukur të Allahut (Esmaul Husna) me shkrim arab, transliterim shqip, kuptim dhe shpjegim teologjik të detajuar. Emrat e Allahut në shqip, arabisht dhe transliterim — Xhamia e Dushkajës, Kaçanik."
        url="/esmaul-husna"
        keywords="99 emrat e allahut, esmaul husna, esmaul husna shqip, 99 emrat shqip, emrat e bukur te allahut, 99 emrat e bukur, emrat e allahut ne shqip, esma ul husna, 99 names of allah albanian, emrat e allahut me shpjegim, emrat e allahut arabisht, el-melik, er-rahman, er-rahim, islam shqip, feja islame shqip, xhamia dushkajes kacanik"
      />

      {/* Hero */}
      <div className="bg-slate-900 text-white pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-black uppercase tracking-widest mb-5">
            Esmaul Husna
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            99 Emrat e Allahut
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-8">
            Eksploroni 99 Emrat e Bukur të Allahut me shkrim origjinal arab, transliterim, kuptim dhe shpjegime teologjike të detajuara.
          </p>
          <a
            href="/esmaul-husna.json"
            download="esmaul-husna.json"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <HiArrowDownTray className="text-emerald-400 text-base" />
            Shkarko JSON
          </a>
        </div>
      </div>

      <main className="container py-12 -mt-6 relative z-10">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Kërko emrin (p.sh. El-Melik, Sunduesi, 4)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <HiXMark size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse h-36" />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && filteredNames.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredNames.map((name) => {
              const localIndex = names.findIndex((n) => n.id === name.id);
              return (
                <motion.div
                  key={name.id}
                  variants={itemVariants}
                  onClick={() => setActiveIndex(localIndex)}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      #{name.id}
                    </span>
                  </div>
                  <p
                    className="text-2xl text-center text-slate-900 mb-2 leading-relaxed group-hover:text-emerald-700 transition-colors"
                    style={{ fontFamily: 'serif', direction: 'rtl' }}
                  >
                    {name.arabic}
                  </p>
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wide truncate text-center">
                    {name.transliterations?.sq ?? ''}
                  </p>
                  <p className="text-xs text-slate-500 truncate text-center mt-0.5">
                    {name.translations?.sq ?? ''}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* No results */}
        {!loading && filteredNames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-500 font-medium">Nuk u gjet asnjë emër me këtë kërkim.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-emerald-600 font-bold hover:underline text-sm"
            >
              Pastro kërkimin
            </button>
          </div>
        )}
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {activeName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="bg-slate-900 px-6 pt-6 pb-5 text-white relative flex-shrink-0">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                    {activeName.id} / 99
                  </span>
                  <button
                    onClick={() => setActiveIndex(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <HiXMark size={20} />
                  </button>
                </div>
                <p
                  className="text-5xl text-center mb-4 leading-relaxed"
                  style={{ fontFamily: 'serif', direction: 'rtl' }}
                >
                  {activeName.arabic}
                </p>
                <div className="flex justify-center">
                  <span className="px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                    {activeName.transliterations?.sq ?? ''}
                  </span>
                </div>
              </div>

              {/* Modal body — scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kuptimi</p>
                  <p className="text-slate-900 font-bold text-lg">{activeName.translations?.sq ?? ''}</p>
                </div>
                <div className="border-t border-slate-100" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Shpjegimi Teologjik (Tefsiri)</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{activeName.explanations?.sq ?? ''}</p>
                </div>
              </div>

              {/* Modal footer — Prev / Next */}
              <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-emerald-300 transition-all"
                >
                  <HiChevronLeft className="text-emerald-600" />
                  I mëparshmi
                </button>
                <span className="text-xs font-bold text-slate-400">{activeName.id} / 99</span>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-emerald-300 transition-all"
                >
                  I radhës
                  <HiChevronRight className="text-emerald-600" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
