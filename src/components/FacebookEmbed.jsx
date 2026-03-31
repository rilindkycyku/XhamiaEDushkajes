// components/FacebookEmbed.jsx
import siteConfig from "../data/site.json";
import useConsentAccepted from "../hooks/useConsentAccepted";
import { BiCookie } from "react-icons/bi";

export default function FacebookEmbed() {
  const consentAccepted = useConsentAccepted();
  const faqja = siteConfig.socials?.facebook?.trim();
  if (!faqja) return null;

  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    faqja
  )}&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  const acceptCookies = () => {
    const value = { accepted: true, date: new Date().toISOString() };
    localStorage.setItem('cookie-consent', JSON.stringify(value));
    window.dispatchEvent(new Event('cookie-consent-changed'));
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-center">
        <div className="relative w-full max-w-[500px] min-h-[500px] h-[800px] rounded-2xl md:rounded-[2rem] overflow-hidden bg-white shadow-xl">
          
          {!consentAccepted ? (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200/60 z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                 <BiCookie className="text-4xl text-blue-500 animate-bounce" />
              </div>
              <h3 className="text-slate-900 font-bold text-xl mb-3">Postimet nga Facebook</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Për të shfaqur postimet tona nga Facebook drejtpërdrejt në këtë faqe, ju lutemi pranoni përdorimin e cookie-ve sipas rregullave të privatësisë.
              </p>
              <button 
                onClick={acceptCookies}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 w-full uppercase tracking-wider text-sm"
              >
                Prano dhe Shiko
              </button>
            </div>
          ) : (
            <iframe
              title="Faqja në Facebook"
              src={src}
              className="absolute inset-0 w-full h-full border-0"
              scrolling="yes"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              loading="lazy"
            />
          )}

        </div>
      </div>
    </div>
  );
}