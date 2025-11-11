// src/components/Hero.jsx
import siteConfig from "../data/site.json";

export default function Hero() {
  const logo = siteConfig.logoHero || "/assets/logo.png";

  return (
    <section className="bg-gray-100 py-8 md:py-12 lg:py-16">
      {/* -------------------------------------------------
          MOBILE – Logo + Welcome card, centered
      ------------------------------------------------- */}
      <div className="md:hidden flex flex-col items-center gap-6 px-6">
        {/* LOGO */}
        <div className="w-32 h-32">
          <img
            src={logo}
            alt={siteConfig.emriXhamis || "Xhamia e Dushkajës"}
            className="w-full h-full object-contain rounded-full shadow-lg"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7QodW/0LjRgtC+0LvQvdC40LU8L3RleHQ+PC9zdmc+";
            }}
          />
        </div>

        {/* WELCOME CARD */}
        <div className="w-full max-w-sm bg-gradient-to-r from-green-700 to-green-900 rounded-3xl p-6 text-white shadow-xl text-center">
          <h1 className="text-2xl font-bold">Mirë se vini!</h1>
          <p className="mt-2 text-lg">{siteConfig.titulliHero}</p>
          <p className="mt-1 text-base">
            Imam: {siteConfig.emriImamitXhamis}
          </p>
        </div>
      </div>

      {/* -------------------------------------------------
          DESKTOP – Welcome card + Logo, centered side-by-side
      ------------------------------------------------- */}
      <div className="hidden md:flex md:items-center md:justify-center md:gap-12 lg:gap-16 px-8 lg:px-16">
        {/* WELCOME CARD */}
        <div className="w-full max-w-md bg-gradient-to-r from-green-700 to-green-900 rounded-3xl p-8 text-white shadow-xl text-center">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Mirë se vini!
          </h1>
          <p className="mt-3 text-xl lg:text-2xl">{siteConfig.titulliHero}</p>
          <p className="mt-2 text-lg lg:text-xl">
            Imam: {siteConfig.emriImamitXhamis}
          </p>
        </div>

        {/* LOGO */}
        <div className="flex-shrink-0 w-40 h-40 lg:w-48 lg:h-48">
          <img
            src={logo}
            alt={siteConfig.emriXhamis || "Xhamia e Dushkajës"}
            className="w-full h-full object-contain rounded-full shadow-lg"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7QodW/0LjRgtC+0LvQvdC40LU8L3RleHQ+PC9zdmc+";
            }}
          />
        </div>
      </div>
    </section>
  );
}