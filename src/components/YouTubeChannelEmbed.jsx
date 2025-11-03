// YouTubeChannelEmbed.jsx
import siteConfig from "../data/site.json";

const getPlaylistId = (id) => {
  const s = id.trim();
  return s.startsWith("UC") ? "UU" + s.slice(2) : s;
};

export default function YouTubeChannelEmbed() {
  const channelId = siteConfig.youtubeChannelId?.trim();
  if (!channelId) return null;

  const playlistId = getPlaylistId(channelId);
  const src = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(
    playlistId
  )}&rel=0&modestbranding=1`;

  return (
    <iframe
      title="YouTube Channel"
      src={src}
      className="absolute inset-0 w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}
