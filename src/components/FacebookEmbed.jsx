import siteConfig from "../data/site.json";

export default function FacebookEmbed() {
  const page = siteConfig.facebookPage?.trim();
  if (!page) return null;

  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    page
  )}&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  return (
    <div className="mt-4 w-full">
      {/* 1. Full‑width wrapper – does NOT shrink the page */}
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
            title="Facebook Page"
            src={src}
            className="absolute inset-0 w-full h-full border-0"
            scrolling="no"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}