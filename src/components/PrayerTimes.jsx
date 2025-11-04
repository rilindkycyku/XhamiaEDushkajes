// components/PrayerTimes.jsx
import { useEffect, useState } from "react";
import vaktetData from "../data/vaktet-e-namazit.json";

export default function PrayerTimes() {
  const [teDhenat, setTeDhenat] = useState(null);
  const [vaktiTani, setVaktiTani] = useState(null);

  useEffect(() => {
    if (!vaktetData || !Array.isArray(vaktetData)) return;

    const sot = new Date();
    const dita = sot.getDate();
    const muaji = sot.toLocaleString("en", { month: "short" });

    const teDhenatSot =
      vaktetData.find((v) => {
        const [d, m] = v.Date.split("-");
        return Number(d) === dita && m === muaji;
      }) || vaktetData[0];

    setTeDhenat(teDhenatSot);
  }, []);

  useEffect(() => {
    if (!teDhenat) return;

    const perditesoVaktin = () => {
      const tani = new Date();
      const minutaTani = tani.getHours() * 60 + tani.getMinutes();

      const vaktet = [
        { emri: "Sabahu", koha: teDhenat.Sabahu },
        { emri: "Lindja", koha: teDhenat.Lindja },
        { emri: "Dreka", koha: teDhenat.Dreka },
        { emri: "Ikindia", koha: teDhenat.Ikindia },
        { emri: "Akshami", koha: teDhenat.Akshami },
        { emri: "Jacia", koha: teDhenat.Jacia },
      ];

      const neMinuta = (k) => {
        const [o, m] = k.split(":").map(Number);
        return o * 60 + m;
      };

      let vaktAktual = null;

      for (let i = 0; i < vaktet.length; i++) {
        const min = neMinuta(vaktet[i].koha);
        if (minutaTani < min) {
          vaktAktual = vaktet[i - 1] || { emri: "Sabahu", koha: teDhenat.Sabahu };
          break;
        }
      }

      if (!vaktAktual || minutaTani >= neMinuta(teDhenat.Jacia)) {
        const indexSot = vaktetData.findIndex((v) => v.Date === teDhenat.Date);
        const teDhenatNeser = vaktetData[indexSot + 1] || vaktetData[0];
        vaktAktual = {
          emri: "Sabahu (nesër)",
          koha: teDhenatNeser.Sabahu,
          eshteNeser: true,
          data: teDhenatNeser.Date,
        };
      }

      setVaktiTani(vaktAktual);
    };

    perditesoVaktin();
    const interval = setInterval(perditesoVaktin, 60000);
    return () => clearInterval(interval);
  }, [teDhenat]);

  const ne12Ore = (koha24) => {
    if (!koha24) return "";
    const [o, m] = koha24.split(":").map(Number);
    const ampm = o < 12 ? "am" : "pm";
    const o12 = o === 0 ? 12 : o > 12 ? o - 12 : o;
    return `${o12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  if (!teDhenat)
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        Duke ngarkuar…
      </div>
    );

  const listaVakteve = [
    { key: "Sabahu", label: "Sabahu" },
    { key: "Lindja", label: "L. e Diellit" },
    { key: "Dreka", label: "Dreka" },
    { key: "Ikindia", label: "Ikindia" },
    { key: "Akshami", label: "Akshami" },
    { key: "Jacia", label: "Jacia" },
  ];

  const formatoDaten = (str) => {
    const [dita, muaji] = str.split("-");
    const viti = new Date().getFullYear();
    const data = new Date(`${muaji} ${dita}, ${viti}`);
    const dd = String(data.getDate()).padStart(2, "0");
    const mm = String(data.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${viti}`;
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="text-lg font-bold text-gray-800">{formatoDaten(teDhenat.Date)}</div>

        {vaktiTani && (
          <div className="mt-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow">
            {vaktiTani.eshteNeser ? (
              <>
                <div className="text-sm opacity-90">{formatoDaten(vaktiTani.data)}</div>
                <div>{vaktiTani.emri}</div>
                <div className="text-2xl mt-1">{ne12Ore(vaktiTani.koha)}</div>
              </>
            ) : (
              <>
                <div>{vaktiTani.emri}</div>
                <div className="text-2xl mt-1">{ne12Ore(vaktiTani.koha)}</div>
              </>
            )}
          </div>
        )}
      </div>

      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-indigo-50 text-indigo-800 font-semibold">
            <th className="p-2 border border-indigo-200">Namazi</th>
            <th className="p-2 border border-indigo-200 text-right">Koha</th>
          </tr>
        </thead>
        <tbody>
          {listaVakteve.map(({ key, label }) => {
            const eshteTani = vaktiTani && vaktiTani.emri.includes(label);
            return (
              <tr
                key={key}
                className={`${
                  eshteTani ? "bg-indigo-100 font-bold" : "bg-white"
                } hover:bg-gray-50 transition`}>
                <td className="p-2 border border-gray-300">{label}</td>
                <td className="p-2 border border-gray-300 text-right font-mono">
                  {ne12Ore(teDhenat[key])}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}