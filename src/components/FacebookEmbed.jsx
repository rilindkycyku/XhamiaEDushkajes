// components/FacebookEmbed.jsx
import siteConfig from "../data/site.json";

export default function FacebookEmbed() {
  const faqja = siteConfig.faqeFB?.trim();
  if (!faqja) return null;

  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    faqja
  )}&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-center">
        <div
          className="
            relative w-full
            max-w-[500px]
            pb-[160%]
          "
        >
          <iframe
            title="Faqja në Facebook"
            src={src}
            className="absolute inset-0 w-full h-full border-0"
            scrolling="yes"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}