import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChevronRight } from 'react-icons/hi2';

// Module-level cache — loads once, shared across renders
let _cachedNames = null;

async function loadNames() {
  if (_cachedNames) return _cachedNames;
  const res = await fetch('/esmaul-husna.json');
  _cachedNames = await res.json();
  return _cachedNames;
}

function getDailyName(names) {
  if (!names || names.length === 0) return null;
  const today = new Date();
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysSinceEpoch = Math.floor(midnight.getTime() / 86400000);
  return names[daysSinceEpoch % names.length];
}

export default function EsmaulHusnaWidget() {
  const [dailyName, setDailyName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNames().then((names) => {
      setDailyName(getDailyName(names));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-5 h-32 animate-pulse" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!dailyName) return null;

  const explanation = dailyName.explanations?.sq ?? '';
  const shortExplanation = explanation.length > 120
    ? explanation.slice(0, 120).trimEnd() + '…'
    : explanation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
    >
      {/* Dark Header — same style as PrayerTimes */}
      <div className="bg-slate-900 p-5 text-white relative overflow-hidden">
        {/* Subtle glow blob */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mb-3">
          Esmaul Husna Ditore
        </p>

        {/* Arabic calligraphy */}
        <p
          className="text-4xl font-bold text-center mb-3 leading-relaxed"
          style={{ fontFamily: 'serif', direction: 'rtl' }}
        >
          {dailyName.arabic}
        </p>

        {/* Transliteration pill */}
        <div className="flex justify-center">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-black uppercase tracking-wider">
            {dailyName.transliterations?.sq ?? ''}
          </span>
        </div>
      </div>

      {/* White body */}
      <div className="p-5">
        {/* Meaning */}
        <div className="mb-3">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">
            Kuptimi
          </p>
          <p className="text-slate-900 font-bold text-base">
            {dailyName.translations?.sq ?? ''}
          </p>
        </div>

        {/* Short explanation */}
        <p className="text-slate-500 text-sm leading-relaxed mb-5">
          {shortExplanation}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* CTA button */}
        <Link
          to="/esmaul-husna"
          className="flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all group"
        >
          <span>Shiko të gjitha 99 Emrat</span>
          <HiChevronRight className="text-lg text-emerald-300 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
