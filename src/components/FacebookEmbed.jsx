// YouTubeChannelEmbed.jsx
import siteConfig from "../data/site.json";

export default function YouTubeChannelEmbed() {
  const handle = siteConfig.youtubeChannelHandle?.trim();
  if (!handle) return null;

  // Build the full channel videos page URL
  const channelUrl = `https://www.youtube.com/${handle}/videos`;
  const src = `${channelUrl}?embed=true&modestbranding=1&embed_domain=${
    typeof window !== "undefined" ? window.location.hostname : "localhost"
  }`;

  return (
    <div className="mt-4 w-full">
      {/* 1. Full-width wrapper – does NOT shrink the page */}
      <div className="flex justify-center">
        {/* 2. Responsive box that ONLY constrains the plugin */}
        <div
          className="
            relative w-full
            max-w-[340px]          /* mobile */
            sm:max-w-[500px]       /* ≥640px  → desktop layout */
            lg:max-w-[700px]       /* ≥1024px → wider */
            xl:max-w-[800px]       /* ≥1280px → max */
            pb-[160%]   sm:pb-[160%]   lg:pb-[114.2857%]   xl:pb-[100%]
          "
        >
          <iframe
            title="YouTube Channel"
            src={src}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{ overflowY: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}