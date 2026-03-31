// components/YouTubeChannelEmbed.jsx
import siteConfig from "../data/site.json";
import useConsentAccepted from "../hooks/useConsentAccepted";
import { HiPlay } from "react-icons/hi2";
import { BiCookie } from "react-icons/bi";

const merrIdListes = (id) => {
  const s = id.trim();
  return s.startsWith("UC") ? "UU" + s.slice(2) : s;
};

export default function YouTubeChannelEmbed() {
  const consentAccepted = useConsentAccepted();
  const idKanali = siteConfig.socials?.youtubeId?.trim();
  if (!idKanali) return null;

  const idListes = merrIdListes(idKanali);
  const src = `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(
    idListes
  )}&rel=0&modestbranding=1`;

  const acceptCookies = () => {
    const value = { accepted: true, date: new Date().toISOString() };
    localStorage.setItem('cookie-consent', JSON.stringify(value));
    window.dispatchEvent(new Event('cookie-consent-changed'));
  };

  if (!consentAccepted) {
    return (
      <div className="absolute inset-0 w-full h-full border-0 bg-slate-900/60 backdrop-blur-2xl rounded-xl md:rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-inner z-10">
        <BiCookie className="text-4xl text-emerald-400/70 mb-4 animate-bounce" />
        <h3 className="text-white font-bold text-lg md:text-xl mb-2">Video nga YouTube</h3>
        <p className="text-slate-300 text-sm md:text-base mb-6 max-w-sm">Për të parë videot tona direkt këtu, ju lutemi pranoni cookie-t e nevojshme.</p>
        <button 
          onClick={acceptCookies}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <HiPlay className="text-xl" /> Prano dhe Shiko
        </button>
      </div>
    );
  }

  return (
    <iframe
      title="Kanali në YouTube"
      src={src}
      className="absolute inset-0 w-full h-full border-0 rounded-xl md:rounded-3xl shadow-xl"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}