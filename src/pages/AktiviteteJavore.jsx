import { useState } from "react";
import activitiesData from "../data/aktivitetejavore.json"; // <-- CHANGED HERE
import YouTubeChannelEmbed from "../components/YouTubeChannelEmbed";

export default function AktiviteteJavore() {
  const [activities] = useState(activitiesData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-teal-700">
        Aktivitete Javore
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((act, idx) => (
          <article
            key={idx}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
            {/* FIT-IMAGE CONTAINER */}
            <div className="relative w-full h-56 md:h-64 bg-gray-50 flex items-center justify-center">
              <img
                src={act.foto}
                alt={act.titulli}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/img/fallback.jpg";
                  e.target.alt = "Imazhi mungon";
                }}
              />
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-teal-700 mb-3">
                {act.titulli}
              </h3>

              <div className="space-y-2 mb-4 text-sm text-gray-700">
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    />
                  </svg>
                  <strong>Koha:</strong> {act.koha}
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                  <strong>Lokacioni:</strong> {act.lokacioni}
                </p>
              </div>

              <p className="text-gray-600 whitespace-pre-line flex-1 text-sm leading-relaxed">
                {act.teksti}
              </p>
            </div>
          </article>
        ))}
        <div className="col-span-3">

          <section className="mt-6 card">
            <h3 className="text-xl font-semibold">YouTube</h3>
            <p className="mt-2 text-gray-600">
              Shiko videote tona më të reja.
            </p>

            <YouTubeChannelEmbed />
          </section>
        </div>
      </div>
    </div>
  );
}
