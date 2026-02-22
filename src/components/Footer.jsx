// components/Footer.jsx
import { Link } from 'react-router-dom';
import siteConfig from '../data/site.json';
import { FaFacebook, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  // Helper function to handle custom routing logic
  const getPath = (link) => {
    switch (link) {
      case 'Ballina':
        return '/';
      case 'Rreth Xhamisë':
        return '/rrethxhamis'; // Matches your Route path
      case 'Dhuro':
        return '/dhuroperxhamin';
      case 'Aktivitete Javore':
        return '/aktivitetejavore';
      case 'Kontakti':
        return '/kontakti';
      default:
        return `/${link.toLowerCase().replace(/\s+/g, '')}`;
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 md:pt-24 pb-10 md:pb-12 border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/5 rounded-full blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
          
          {/* Brand Section */}
          <div className="space-y-8 lg:col-span-1">
            <Link to="/" className="inline-block group">
              <h4 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                {siteConfig.emriXhamis}<span className="text-emerald-500">.</span>
              </h4>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Misioni ynë është të ofrojmë një ambient të ngrohtë dhe frymëzues për të gjithë besimtarët, duke promovuar vlerat e bashkëjetesës dhe dritës.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebook size={20} />, url: siteConfig.faqeFB },
                { icon: <FaYoutube size={20} />, url: siteConfig.kanaliYouTubeLink }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Lidhje të Shpejta</h4>
            <nav className="flex flex-col gap-4">
              {['Ballina', 'Rreth Xhamisë', 'Aktivitete Javore', 'Dhuro', 'Kontakti'].map((link) => (
                <Link
                  key={link}
                  to={getPath(link)}
                  className="text-slate-400 hover:text-white transition-all font-bold text-lg hover:translate-x-2 w-fit"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Kontakt</h4>
            <div className="space-y-4">
              <p className="text-slate-400 font-bold">{siteConfig.adresa}</p>
              <a 
                href={`mailto:${siteConfig.email}`} 
                className="block text-slate-400 hover:text-white font-bold transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm font-bold tracking-wide">
          <p>© {year} - Nga Xhemati i Xhamisë së Dushkajës.</p>
        </div>
      </div>
    </footer>
  );
}
