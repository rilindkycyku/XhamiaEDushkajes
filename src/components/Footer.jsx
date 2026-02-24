import { Link } from 'react-router-dom';
import siteConfig from '../data/site.json';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { HiOutlineMapPin, HiSparkles } from 'react-icons/hi2';

export default function Footer() {
  const year = new Date().getFullYear();

  // Helper function to handle custom routing logic
  const getPath = (link) => {
    switch (link) {
      case 'Ballina':
        return '/';
      case 'Rreth Xhamisë':
        return '/rrethxhamis';
      case 'Dhuro':
        return '/dhuroperxhamin';
      case 'Aktivitete Javore':
        return '/aktivitetejavore';
      default:
        return `/${link.toLowerCase().replace(/\s+/g, '')}`;
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-20 md:pt-32 pb-12 border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px] translate-y-1/2" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-12 mb-20">

          {/* Brand Section */}
          <div className="space-y-8 lg:col-span-5">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-xl group-hover:scale-110 transition-transform">
                  <img src={siteConfig.global?.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h4 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter">
                  {siteConfig.global?.emriXhamis}<span className="text-emerald-500">.</span>
                </h4>
              </div>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-md">
              Misioni ynë është të ofrojmë një ambient të ngrohtë dhe frymëzues për të gjithë besimtarët, duke promovuar vlerat e bashkëjetesës dhe dritës.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebook size={20} />, url: siteConfig.socials?.facebook, label: 'Facebook' },
                { icon: <FaYoutube size={20} />, url: siteConfig.socials?.youtube, label: 'YouTube' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-inner group"
                  aria-label={social.label}
                >
                  <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-8 lg:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
              <HiSparkles className="animate-pulse" /> Lidhje të Shpejta
            </h4>
            <nav className="flex flex-col gap-4">
              {['Ballina', 'Rreth Xhamisë', 'Aktivitete Javore', 'Dhuro'].map((link) => (
                <Link
                  key={link}
                  to={getPath(link)}
                  className="text-slate-400 hover:text-white transition-all font-bold text-lg hover:translate-x-2 w-fit inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-4 h-0.5 bg-emerald-500 mr-0 group-hover:mr-3 transition-all rounded-full" />
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Location Section */}
          <div className="space-y-8 lg:col-span-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
              <HiOutlineMapPin /> Vendndodhja
            </h4>
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4 hover:border-white/10 transition-colors group">
              <p className="text-slate-300 text-lg font-bold leading-relaxed">
                {siteConfig.footer?.adresa}
              </p>
              <p className="text-slate-500 text-sm font-medium">
                Dyer tona janë gjithmonë të hapura për besimtarët dhe vizitorët.
              </p>
              <div className="pt-4">
                <Link to="/rrethxhamis" className="text-emerald-400 font-black text-xs uppercase tracking-widest hover:text-emerald-300 transition-colors flex items-center gap-2 group-hover:gap-4 duration-300">
                  Shih në Hartë <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-sm font-bold tracking-wide">
            © {year} — Zhvilluar me përkushtim nga Xhemati i Xhamisë së Dushkajës.
          </p>
        </div>
      </div>
    </footer>
  );
}
