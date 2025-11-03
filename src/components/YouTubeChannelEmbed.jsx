// YouTubeChannelEmbed.jsx
import siteConfig from "../data/site.json";

export default function YouTubeChannelEmbed() {
  const handle = siteConfig.youtubeChannelHandle?.trim();

  if (!handle) return null;

  // Correct: Use the OFFICIAL channel embed URL
  const src = `https://www.youtube.com/${encodeURIComponent(handle)}`;

  return (
    <div className="mt-4 w-full">
      <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-white">
        {/* 16:9 responsive box */}
        <div className="relative w-full pb-[56.25%]">
          <iframe
            title="YouTube Channel"
            src={src}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-2">
        Scroll to view all videos
      </p>
    </div>
  );
}