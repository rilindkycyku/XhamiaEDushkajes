// src/components/Hero.jsx
import siteConfig from "../data/site.json";

export default function Hero() {
  const foto = siteConfig.logoHero || "/assets/logo.png";

  return (
    <section className="relative h-64 md:h-96 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <img
          src={foto}
          alt={siteConfig.emriXhamis || "Xhamia e Dushkajës"}
          className="max-w-full max-h-full object-contain drop-shadow-lg"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7QodW/0LjRgtC+0LvQvdC40LU8L3RleHQ+PC9zdmc+";
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          {siteConfig.nentilluiHero}
        </h1>
        <p className="mt-4 text-xl md:text-4xl font-medium text-white drop-shadow">
          {siteConfig.titulliHero}
        </p>
        <p className="mt-2 text-lg md:text-2xl font-medium text-white drop-shadow">
          Imam: {siteConfig.emriImamitXhamis}
        </p>
      </div>
    </section>
  );
}