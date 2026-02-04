// src/pages/AktiviteteJavore.jsx
import { useState } from "react";
import aktivitete from "../data/aktivitetejavore.json";
import YouTubeChannelEmbed from "../components/YouTubeChannelEmbed";

export default function AktiviteteJavore() {
  const [lista] = useState(aktivitete);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-teal-700">
        Aktivitete Javore
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lista.map((akt, idx) => (
          <article
            key={idx}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full h-56 md:h-64 bg-gray-50 flex items-center justify-center">
              <img
                src={akt.foto}
                alt={akt.titulli}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/img/fallback.jpg";
                  e.target.alt = "Imazhi mungon";
                }}
              />
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-teal-700 mb-3">
                {akt.titulli}
              </h3>
              <div className="space-y-2 mb-4 text-sm text-gray-700">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    />
                  </svg>
                  <strong>Koha:</strong> {akt.koha}
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  <strong>Lokacioni:</strong> {akt.lokacioni}
                </p>
              </div>
              <p className="text-gray-600 whitespace-pre-line flex-1 text-sm leading-relaxed">
                {akt.teksti}
              </p>
            </div>
          </article>
        ))}

        <article className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-3">
          <div className="p-5">
            <h3 className="text-xl font-bold text-teal-700 mb-2">YouTube</h3>
            <p className="text-gray-600 mb-4">
              Shiko Derset dhe Ligjëratat Javore.
            </p>
          </div>

          <div className="relative w-full px-5 pb-5">
            <div className="flex justify-center">
              <div
                className="
                  relative w-full
                  max-w-[340px]
                  sm:max-w-[500px]
                  lg:max-w-[700px]
                  xl:max-w-[800px]
                "
                style={{ minHeight: "340px" }}
              >
                <YouTubeChannelEmbed />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}