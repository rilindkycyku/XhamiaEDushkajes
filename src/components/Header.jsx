import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import siteConfig from '../data/site.json';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import RamadanTicker from './RamadanTicker';

export default function Header() {
  const titulli = siteConfig?.emriXhamis ?? 'Xhamia';
  const [menuHapur, setMenuHapur] = useState(false);
  const location = useLocation();

  const navigimi = [
    { emri: 'Ballina', path: '/' },
    { emri: 'Rreth Xhamisë', path: '/rrethxhamis' },
    { emri: 'Aktivitet Javore', path: '/aktivitetejavore' },
    { emri: 'Dhuro', path: '/dhuroperxhamin' },
    { emri: 'Kontakti', path: '/kontakti' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
        <div className="glass py-3 md:py-4 !border-none shadow-none">
          <div className="container flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-slate-200 border border-slate-100 overflow-hidden p-1.5">
                  <img
                    src={siteConfig.logoHero}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                {titulli}<span className="text-emerald-500">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:block">
              <ul className="flex gap-8">
                {navigimi.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`relative font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:text-emerald-600 px-1 py-1 ${location.pathname === item.path ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                    >
                      {item.emri}
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden focus:outline-none p-2 rounded-xl text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all"
              onClick={() => setMenuHapur(!menuHapur)}
              aria-label="Menu"
            >
              {menuHapur ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>

        {/* Global Ramadan Ticker */}
        <RamadanTicker />

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuHapur && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white backdrop-blur-2xl border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden p-4"
            >
              <ul className="flex flex-col gap-1">
                {navigimi.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMenuHapur(false)}
                      className={`block py-3 px-6 rounded-xl font-bold transition-all ${location.pathname === item.path ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {item.emri}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}