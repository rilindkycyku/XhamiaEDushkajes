import { useEffect, useState } from "react";

export default function RrethXhamis() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/data/donations.json")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);
  if (!data) return <div className="container mx-auto px-4 py-8">Loading…</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">RrethXhamis</h1>
      <p className="mt-2 text-gray-600">{data.description}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold">Local (Kosovo)</h3>
          <p className="mt-2">Bank: {data.kosovo.bank}</p>
          <p>
            IBAN: <code className="break-all">{data.kosovo.iban}</code>
          </p>
          <p>Holder: {data.kosovo.holder}</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">
            International (SEPA - Lithuania)
          </h3>
          <p className="mt-2">Bank: {data.sepa.bank}</p>
          <p>
            IBAN: <code className="break-all">{data.sepa.iban}</code>
          </p>
          <p>Holder: {data.sepa.holder}</p>
        </div>
      </div>
    </div>
  );
}
