// components/DhuroPerXhamin.jsx
import { useState } from "react";
import dhuro from "../data/dhuro-per-xhami.json";

export default function DhuroPerXhamin() {
  const [teDhenat] = useState(dhuro);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Dhuro për Xhamin</h1>
      <p className="mt-2 text-gray-600">{teDhenat.pershkrimiDhuro}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700">Kosovë</h3>
          <p className="mt-2">Banka: {teDhenat.bankaKosove.bank}</p>
          <p>
            IBAN: <code className="break-all font-mono bg-gray-100 px-1 rounded">{teDhenat.bankaKosove.iban}</code>
          </p>
          <p>Mbajtësi: {teDhenat.bankaKosove.mbajtesi}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-teal-700">
            Jashtë (SEPA – Lituani)
          </h3>
          <p className="mt-2">Banka: {teDhenat.bankaJashtVendi.bank}</p>
          <p>
            IBAN: <code className="break-all font-mono bg-gray-100 px-1 rounded">{teDhenat.bankaJashtVendi.iban}</code>
          </p>
          <p>Mbajtësi: {teDhenat.bankaJashtVendi.mbajtesi}</p>
        </div>
      </div>
    </div>
  );
}