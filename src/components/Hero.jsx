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

      {/* Sideways gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>

      {/* Centered text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          {siteConfig.heroSubtitle}
        </h1>
        <p className="mt-4 text-xl md:text-4xl font-medium text-white drop-shadow">
          {siteConfig.heroTitle}
        </p>

        <p className="mt-2 text-lg md:text-2xl font-medium text-white drop-shadow">
          Imam: {siteConfig.imamName}
        </p>
      </div>
    </section>
  );
}
