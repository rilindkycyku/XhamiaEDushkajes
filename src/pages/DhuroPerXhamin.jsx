// components/DhuroPerXhamin.jsx
import { useState } from "react";
import dhuro from "../data/dhuro-per-xhami.json";

export default function DhuroPerXhamin() {
  const [teDhenat] = useState(dhuro);

  // 5 hadithe në shqip (të marra nga burime autentike)
  const hadithet = [
    {
      id: 1,
      teksti: "Agjërimi është mburojë, sadaka i anulon mëkatet sikur që uji e fik zjarrin...",
      burimi: "Sahihu i Muslimit (40 Hadithet e Imam Neveviut)",
    },
    {
      id: 2,
      teksti: "Çdo e mirë është sadaka.",
      burimi: "Sahihu i Buhariut & Sahihu i Muslimit",
    },
    {
      id: 3,
      teksti: "Çdo njeri do të jetë nën hijen e sadakasë së tij, derisa të gjykohet mes tyre.",
      burimi: "Tirmidhiu",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-6">
        Dhuro për Xhaminë
      </h1>
      <p className="text-center text-gray-700 max-w-2xl mx-auto mb-8">
        {teDhenat.pershkrimiDhuro}
      </p>

      {/* Hadithet – zëvendësojnë kartat e bankave */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Hadithe për Sadakën (Donacionin)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hadithet.map((h) => (
            <div
              key={h.id}
              className="bg-white p-5 rounded-xl shadow-md border border-teal-100 hover:shadow-lg transition"
            >
              <p className="italic text-gray-800 mb-3">"{h.teksti}"</p>
              <p className="text-sm text-teal-600 font-semibold">
                {h.burimi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
          <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Na Kontaktoni</h3>
          <p className="text-sm opacity-90 mb-4">
            Plotësoni formularin e kontaktit për të dhuruar
          </p>
          <a
            href="/kontakti"
            className="bg-white text-teal-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Shko te Formulari
          </a>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
          <svg className="w-10 h-10 mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Facebook</h3>
          <p className="text-sm opacity-90 mb-4">
            Na dërgoni mesazh në Facebook për donacione
          </p>
          <a
            href="https://www.facebook.com/xhamiaedushkajeskacanik/" // Replace with actual FB page
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Dërgo Mesazh
          </a>
        </div>
      </div>

      {/* Finances Transparency - Google Sheet */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">
          Transparenca Financiare
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Shikoni të gjitha të hyrat dhe shpenzimet e xhamisë në kohë reale
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src="https://docs.google.com/spreadsheets/d/1J6tehqBppt5zFp0POSAhIKEIbdpegZV5lWQcJLrMv9I/edit?gid=0#gid=0"
            className="w-full h-96 md:h-screen max-h-screen"
            title="Financat e Xhamisë"
            allowFullScreen
          ></iframe>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Çdo donacion regjistrohet publikisht për transparencë të plotë.
        </p>
      </div>

      {/* Commented Bank Details (for future use) */}
      
      {/* Temporary Message - Bank Info Disabled */}
      
      {/*
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-center">
        <p className="text-amber-800 font-semibold">
          ℹ️ Për momentin, donacionet bankare nuk janë të mundura.
        </p>
        <p className="text-amber-700 mt-2">
          Ju lutem na kontaktoni për të dhënë kontributin tuaj.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-teal-700">Kosovë</h3>
          <p className="mt-2">Banka: {teDhenat.bankaKosove.bank}</p>
          <p>
            IBAN: <code className="break-all font-semibold bg-gray-100 px-1 rounded">{teDhenat.bankaKosove.iban}</code>
          </p>
          <p>Mbajtësi: {teDhenat.bankaKosove.mbajtesi}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-teal-700">
            Jashtë (SEPA – Lituani)
          </h3>
          <p className="mt-2">Banka: {teDhenat.bankaJashtVendi.bank}</p>
          <p>
            IBAN: <code className="break-all font-semibold bg-gray-100 px-1 rounded">{teDhenat.bankaJashtVendi.iban}</code>
          </p>
          <p>Mbajtësi: {teDhenat.bankaJashtVendi.mbajtesi}</p>
        </div>
      </div>
      */}
    </div>
  );
}