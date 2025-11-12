// src/pages/Home.jsx
import Hero from "../components/Hero";
import PrayerTimes from "../components/PrayerTimes";
import FacebookEmbed from "../components/FacebookEmbed";
import siteConfig from "../data/site.json";
import { Link } from "react-router-dom";

export default function Home() {
  const dataHapjes = new Date(siteConfig.dataEHapjesXhamis);
  const sot = new Date();

  const viteAktive = sot.getFullYear() - dataHapjes.getFullYear();

  const eshteSezonPervjetori =
    sot.getMonth() > 10 || (sot.getMonth() === 10 && sot.getDate() >= 4);

  const viteTeShfaqura = eshteSezonPervjetori ? viteAktive : viteAktive - 1;
  const vitiPervjetor = dataHapjes.getFullYear() + viteTeShfaqura;

  const formatoDaten = (data) => {
    const ditet = data.getDate();
    const viti = data.getFullYear();

    const emratEMuajve = [
      "Janar",
      "Shkurt",
      "Mars",
      "Prill",
      "Maj",
      "Qershor",
      "Korrik",
      "Gusht",
      "Shtator",
      "Tetor",
      "Nëntor",
      "Dhjetor",
    ];

    const muaji = emratEMuajve[data.getMonth()];

    return `${ditet} ${muaji} ${viti}`;
  };

  return (
    <div>
      <Hero />

      {viteTeShfaqura > 0 && (
        <section className="container mx-auto px-4 py-6">
          <Link to="/rrethxhamis" className="block">
            <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-2xl md:text-3xl font-bold">
                {viteTeShfaqura} {viteTeShfaqura === 1 ? "Vit" : "Vite"} Dritë,
                Dije & Bamirësi
              </h3>
              <p className="mt-2 text-lg opacity-90 font-semibold">
                {formatoDaten(dataHapjes)} –{" "}
                {formatoDaten(new Date(vitiPervjetor, 10, 4))}
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider">
                Shiko Historinë Tonë
              </p>
            </div>
          </Link>
        </section>
      )}

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-teal-700">
              Mirë se Vini
            </h2>
            <p className="mt-2 text-gray-600">{siteConfig.textiMiresevini}</p>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-teal-700">Facebook</h3>
            <p className="mt-2 text-gray-600">
              Ndiqni postimet dhe njoftimet tona në Facebook.
            </p>
            <div className="mt-4">
              <FacebookEmbed />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <PrayerTimes />
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-teal-700">Kontakti</h3>
            <p className="mt-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-teal-600 hover:text-teal-800 underline transition-colors">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
