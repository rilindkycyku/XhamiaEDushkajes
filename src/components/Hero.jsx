// src/components/Hero.jsx
import siteConfig from "../data/site.json";

export default function Hero() {
  const imageUrl = siteConfig.heroImage || "/assets/logo.png";

  return (
    <section className="relative h-64 md:h-96 bg-gray-50 overflow-hidden">
      {/* Direct <img> tag — NEVER fails */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <img
          src={imageUrl}
          alt="KBI Kaçanik"
          className="max-w-full max-h-full object-contain drop-shadow-lg"
          onError={(e) => {
            console.error("Image failed to load:", imageUrl);
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
          }}
        />
      </div>

      {/* Optional: Text below image */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center text-black">
        <h1 className="text-2xl md:text-4xl font-bold drop-shadow-md">
          {siteConfig.heroTitle}
        </h1>
        <p className="text-lg md:text-xl font-medium drop-shadow">
          {siteConfig.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
