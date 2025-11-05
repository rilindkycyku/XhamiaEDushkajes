// components/PrayerTimes.jsx
import { useEffect, useState, useCallback } from "react";
import vaktet from "../data/vaktet-e-namazit.json";

export default function PrayerTimes() {
  const [vaktiSot, setVaktiSot] = useState(null);
  const [infoTani, setInfoTani] = useState(null);

  /* GJEJ VAKTET PËR SOT */
  useEffect(() => {
    if (!Array.isArray(vaktet) || vaktet.length === 0) return;

    const sot = new Date();
    const dite = sot.getDate();
    const muajiShkurt = sot.toLocaleString("en", { month: "short" });

    const rreshti =
      vaktet.find((v) => {
        const [d, m] = v.Date.split("-");
        return Number(d) === dite && m === muajiShkurt;
      }) ?? vaktet[0];

    setVaktiSot(rreshti);
  }, []);

  /* KTHEJ ORA:NË MINUTA */
  const neMinuta = (ora) => {
    const [h, m] = ora.split(":").map(Number);
    return h * 60 + m;
  };

  /* FORMAT: 90 min → "1 orë 30 min" */
  const formatDallim = (min) => {
    if (min <= 0) return "0 min";
    const o = Math.floor(min / 60);
    const m = min % 60;
    return `${o ? `${o} orë ` : ""}${m} min`;
  };

  /* 24h → 12h (me am/pm) */
  const ne12h = (ora24) => {
    if (!ora24) return "";
    const [h, m] = ora24.split(":").map(Number);
    const ampm = h < 12 ? "am" : "pm";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  /* FORMAT: "04-Nov" → "04/11/2025" */
  const formatDaten = (str) => {
    const [d, m] = str.split("-");
    const viti = new Date().getFullYear();
    const data = new Date(`${m} ${d}, ${viti}`);
    return `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1
    ).padStart(2, "0")}/${viti}`;
  };

  /* LLOGARIT XHEMATIN (vetëm për 5 namazet) */
  const xhemati = (emri) => {
    if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(emri))
      return null;

    if (emri === "Sabahu" && vaktiSot?.Lindja) {
      const [h, m] = vaktiSot.Lindja.split(":").map(Number);
      const total = h * 60 + m - 40;
      const o = Math.floor(total / 60);
      const min = total % 60;
      return `${String(o).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }

    if (emri === "Dreka" && vaktiSot?.Dreka) {
      const eshteXhuma = new Date().getDay() === 5;
      const [h, m] = vaktiSot.Dreka.split(":").map(Number);
      const minAdhan = h * 60 + m;

      if (eshteXhuma && minAdhan >= 12 * 60) return "13:00";

      const oraTjeter = Math.ceil(minAdhan / 60) * 60;
      const o = Math.floor(oraTjeter / 60);
      return `${String(o).padStart(2, "0")}:00`;
    }

    return vaktiSot?.[emri] || null;
  };

  /* PËRDITËSO NAMAZIN TANI & TË ARDHSHMIN */
  const perditeso = useCallback(() => {
    if (!vaktiSot) return;

    const tani = new Date();
    const minTani = tani.getHours() * 60 + tani.getMinutes();

    const lista = [
      { emri: "Sabahu", label: "Sabahu", kohe: xhemati("Sabahu") },
      { emri: "Dreka", label: "Dreka", kohe: xhemati("Dreka") },
      { emri: "Ikindia", label: "Ikindia", kohe: xhemati("Ikindia") },
      { emri: "Akshami", label: "Akshami", kohe: xhemati("Akshami") },
      { emri: "Jacia", label: "Jacia", kohe: xhemati("Jacia") },
    ].filter((p) => p.kohe);

    let namaziArdhshëm = null;
    let namaziTani = null;
    let minMbetur = 0;

    for (let i = 0; i < lista.length; i++) {
      const min = neMinuta(lista[i].kohe);
      if (min > minTani) {
        namaziArdhshëm = lista[i];
        namaziTani = i > 0 ? lista[i - 1] : null;
        minMbetur = min - minTani;
        break;
      }
    }

    if (!namaziArdhshëm) {
      const indeksiSot = vaktet.findIndex((v) => v.Date === vaktiSot.Date);
      const neser = vaktet[indeksiSot + 1] ?? vaktet[0];
      const sabahNeser = xhematiPerDaten(neser, "Sabahu");
      namaziArdhshëm = {
        label: "Sabahu (nesër)",
        kohe: sabahNeser,
        date: neser.Date,
      };
      namaziTani = { label: "Jacia", kohe: xhemati("Jacia") };
      minMbetur = 24 * 60 - minTani + neMinuta(sabahNeser);
    }

    setInfoTani({
      tani: namaziTani,
      ardhshëm: namaziArdhshëm,
      mbetur: minMbetur,
    });
  }, [vaktiSot]);

  const xhematiPerDaten = (data, emri) => {
    if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(emri))
      return null;

    if (emri === "Sabahu" && data?.Lindja) {
      const [h, m] = data.Lindja.split(":").map(Number);
      const total = h * 60 + m - 40;
      const o = Math.floor(total / 60);
      const min = total % 60;
      return `${String(o).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
    if (emri === "Dreka") {
      const eshteXhuma = new Date().getDay() === 5;
      const [h, m] = data.Dreka.split(":").map(Number);
      const minAdhan = h * 60 + m;
      if (eshteXhuma && minAdhan >= 12 * 60) return "13:00";
      const oraTjeter = Math.ceil(minAdhan / 60) * 60;
      const o = Math.floor(oraTjeter / 60);
      return `${String(o).padStart(2, "0")}:00`;
    }
    return data?.[emri] || null;
  };

  /* PËRDITËSO ÇDO MINUTË */
  useEffect(() => {
    if (!vaktiSot) return;
    perditeso();
    const id = setInterval(perditeso, 60_000);
    return () => clearInterval(id);
  }, [vaktiSot, perditeso]);

  /* NËSE NUK KA TË DHËNA */
  if (!vaktiSot)
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        Duke ngarkuar…
      </div>
    );

  const eshteXhuma = new Date().getDay() === 5;
  const drekaMin = vaktiSot.Dreka ? neMinuta(vaktiSot.Dreka) : 0;
  const eshteXhumaMeVone = eshteXhuma && drekaMin >= 12 * 60;

  const listaNamazeve = [
    { emri: "Imsaku", label: "Imsaku", veçori: true },
    { emri: "Sabahu", label: "Sabahu" },
    { emri: "Lindja", label: "L. e Diellit", veçori: true },
    { emri: "Dreka", label: "Dreka" },
    { emri: "Ikindia", label: "Ikindia" },
    { emri: "Akshami", label: "Akshami" },
    { emri: "Jacia", label: "Jacia" },
  ];

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-white rounded-xl shadow-lg">
      {/* KREU */}
      <div className="text-center mb-6">
        <div className="text-lg font-bold text-gray-800">
          {formatDaten(vaktiSot.Date)}
          {eshteXhumaMeVone && (
            <span className="block mt-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full inline-block">
              Xhuma (13:00)
            </span>
          )}
        </div>

        {vaktiSot.Festat && (
          <div className="mt-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm shadow">
            {vaktiSot.Festat}
          </div>
        )}

        {vaktiSot.Shenime && (
          <div className="mt-2 p-2 bg-gray-100 text-gray-700 rounded text-xs italic">
            {vaktiSot.Shenime}
          </div>
        )}

        {/* KUTI ME KOHO TANI */}
        {infoTani && (
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-700 to-green-600 text-white rounded-lg shadow">
            {infoTani.tani && (
              <div className="text-sm opacity-90">
                Tani: <strong>{infoTani.tani.label}</strong>{" "}
                {ne12h(infoTani.tani.kohe)}
              </div>
            )}
            <div className="mt-1 font-bold text-lg">
              {infoTani.ardhshëm.label}
              {infoTani.ardhshëm.date &&
                infoTani.ardhshëm.date !== vaktiSot.Date && (
                  <span className="block text-xs opacity-80">
                    {formatDaten(infoTani.ardhshëm.date)}
                  </span>
                )}
            </div>
            <div className="text-2xl mt-1">{ne12h(infoTani.ardhshëm.kohe)}</div>
            <div className="text-sm mt-1">
              Mbeten: <strong>{formatDallim(infoTani.mbetur)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* TABELA */}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-emerald-50 text-emerald-800 font-semibold">
            <th className="p-2 border border-emerald-200">Namazi</th>
            <th className="p-2 border border-emerald-200 text-center">Koha</th>
            <th className="p-2 border border-emerald-200 text-center">
              Falja me Xhemat
            </th>
          </tr>
        </thead>
        <tbody>
          {listaNamazeve.map(({ emri, label, veçori }) => {
            const kohe =
              vaktiSot[emri] || (emri === "Imsaku" ? vaktiSot.Imsaku : null);
            const xhemat = xhemati(emri); // NULL for Imsaku & Lindja

            const eshteArdhshëm =
              infoTani?.ardhshëm?.label.includes(label) &&
              (!infoTani.ardhshëm.date ||
                infoTani.ardhshëm.date === vaktiSot.Date);

            return (
              <tr
                key={emri}
                className={`
                  ${
                    eshteArdhshëm
                      ? "bg-emerald-50 font-bold border-l-4 border-emerald-600"
                      : "bg-white"
                  }
                  ${veçori ? "text-gray-600" : ""}
                  hover:bg-gray-100 transition-all duration-200 cursor-default
                `}>
                <td className="p-2 border border-gray-300">
                  {label}
                  {eshteArdhshëm && " ←"}
                  {eshteXhumaMeVone && emri === "Dreka" && " (Xhuma)"}
                </td>
                <td className="p-2 border border-gray-300 text-center font-mono">
                  {kohe ? ne12h(kohe) : "—"}
                </td>
                <td className="p-2 border border-gray-300 text-center font-mono text-green-500 font-semibold">
                  {xhemat ? ne12h(xhemat) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
