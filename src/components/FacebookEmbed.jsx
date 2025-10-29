
import siteConfig from "../data/site.json"

export default function FacebookEmbed({ height = 500 }) {
  const page = siteConfig.facebookPage?.trim();
  if (!page) return null;

  // Responsive container style
  const containerStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: `${(height / 340) * 100}%`, // maintain aspect ratio
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    overflow: 'hidden',
  };

  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    page
  )}&tabs=timeline&width=340&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  return (
    <div className="mt-4" style={containerStyle}>
      <iframe
        title="fb-page"
        src={src}
        style={iframeStyle}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
      ></iframe>
    </div>
  );
}
