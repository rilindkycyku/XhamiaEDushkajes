// components/YouTubeChannelEmbed.jsx
import siteConfig from "../data/site.json";

const merrIdListes = (id) => {
  const s = id.trim();
  return s.startsWith("UC") ? "UU" + s.slice(2) : s;
};

export default function YouTubeChannelEmbed() {
  const idKanali = siteConfig.kanaliYouTube?.trim();
  if (!idKanali) return null;

  const idListes = merrIdListes(idKanali);
  const src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
    idListes
  )}&rel=0&modestbranding=1`;

  return (
    <iframe
      title="Kanali në YouTube"
      src={src}
      className="absolute inset-0 w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}