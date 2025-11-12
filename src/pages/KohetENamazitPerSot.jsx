// src/pages/StaticPrayerCard.jsx
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import vaktet from "../data/vaktet-e-namazit.json";

const PRAYER_ORDER = [
  { key: "Imsaku", label: "Imsaku", special: true },
  { key: "Sabahu", label: "Sabahu" },
  { key: "Lindja", label: "L. e Diellit", special: true },
  { key: "Dreka", label: "Dreka" },
  { key: "Ikindia", label: "Ikindia" },
  { key: "Akshami", label: "Akshami" },
  { key: "Jacia", label: "Jacia" },
];

/* ---------- UTILS ---------- */
const toMinutes = (t) => (t ? t.split(":").reduce((h, m) => h * 60 + +m, 0) : -1);
const to12h = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const p = h < 12 ? "am" : "pm";
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hr}:${m.toString().padStart(2, "0")} ${p}`;
};
const formatRemaining = (m) => {
  if (m <= 0) return "0 min";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h ? `${h}h ` : ""}${min}m`;
};
const formatDate = (d) => {
  const [day, mon] = d.split("-");
  const y = new Date().getFullYear();
  const date = new Date(`${mon} ${day}, ${y}`);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${y}`;
};

/* ---------- XHEMATI ---------- */
const calculateXhemat = (p, data, isFri) => {
  if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(p)) return null;
  if (p === "Sabahu" && data.Lindja) {
    const total = toMinutes(data.Lindja) - 40;
    return `${Math.floor(total / 60)
      .toString()
      .padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
  }
  if (p === "Dreka" && data.Dreka) {
    const adhan = toMinutes(data.Dreka);
    if (isFri && adhan >= 720) return "13:00";
    return `${Math.floor(Math.ceil(adhan / 60) * 60 / 60)
      .toString()
      .padStart(2, "0")}:00`;
  }
  return data[p] || null;
};

export default function StaticPrayerCard() {
  const [todayData, setTodayData] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [prayerInfo, setPrayerInfo] = useState(null);
  const intervalRef = useRef(null);

  const isFriday = new Date().getDay() === 5;
  const drekaMin = todayData?.Dreka ? toMinutes(todayData.Dreka) : 0;
  const isLateFriday = isFriday && drekaMin >= 720;

  /* ---------- FIND TODAY ---------- */
  useEffect(() => {
    if (!Array.isArray(vaktet) || vaktet.length === 0) return;
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en", { month: "short" });
    const row =
      vaktet.find((v) => {
        const [d, m] = v.Date.split("-");
        return +d === day && m === month;
      }) ?? vaktet[0];
    setTodayData(row);
  }, []);

  /* ---------- MOMENTS (for countdown) ---------- */
  const moments = useMemo(() => {
    if (!todayData) return [];
    const list = [];
    PRAYER_ORDER.forEach(({ key, label, special }) => {
      const time = todayData[key] || (key === "Imsaku" ? todayData.Imsaku : null);
      if (!time) return;
      list.push({ label, time, isXhemat: false, special });
      if (!special && key !== "Imsaku") {
        const xh = calculateXhemat(key, todayData, isFriday);
        if (xh) list.push({ label: `${label} (xhemat)`, time: xh, isXhemat: true });
      }
    });
    return list;
  }, [todayData, isFriday]);

  /* ---------- UPDATE PRAYER INFO ---------- */
  const updatePrayer = useCallback(() => {
    const minsNow = new Date().getHours() * 60 + new Date().getMinutes();
    const nextIdx = moments.findIndex((m) => toMinutes(m.time) > minsNow);

    if (nextIdx === -1) {
      const idx = vaktet.findIndex((v) => v.Date === todayData.Date);
      const tomorrow = vaktet[idx + 1] ?? vaktet[0];
      const sabahXh = calculateXhemat("Sabahu", tomorrow, isFriday);
      setPrayerInfo({
        current: moments[moments.length - 1] || null,
        next: { label: "Sabahu (nesër)", time: sabahXh, date: tomorrow.Date },
        remaining: 1440 - minsNow + toMinutes(sabahXh),
      });
      return;
    }

    const next = moments[nextIdx];
    const current = nextIdx > 0 ? moments[nextIdx - 1] : null;
    setPrayerInfo({
      current,
      next: { label: next.label, time: next.time, date: todayData.Date },
      remaining: toMinutes(next.time) - minsNow,
    });
  }, [moments, todayData, isFriday]);

  /* ---------- CLOCK + TICK ---------- */
  useEffect(() => {
    if (!todayData) return;
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
      updatePrayer();
    };
    tick();
    intervalRef.current = setInterval(tick, 60_000);
    return () => clearInterval(intervalRef.current);
  }, [todayData, updatePrayer]);

  /* ---------- SHARE ---------- */
  const share = useCallback(() => {
    const url = window.location.href;
    const title = `Koha e Namazit – ${todayData ? formatDate(todayData.Date) : ""}`;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => navigator.clipboard.writeText(url));
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Linku u kopjua!"));
    }
  }, [todayData]);

  /* ---------- LOADING ---------- */
  if (!todayData) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-xl font-medium text-emerald-700">Duke ngarkuar…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center p-4 md:p-6">
      {/* ===== MAIN GRID ===== */}
      <div className="w-full max-w-5xl grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">

        {/* ===== PART 1 – BIGGER CARD (LIKE MOCKUP) ===== */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-5 md:p-7 border border-white/30 flex flex-col gap-5">
          {/* Date */}
          <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 tracking-tight">
            {formatDate(todayData.Date)}
          </h1>

          {/* Festat */}
          {todayData.Festat && (
            <div className="text-center p-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold text-sm shadow-md">
              {todayData.Festat}
            </div>
          )}

          {/* Shenime */}
          {todayData.Shenime && (
            <p className="text-center text-xs text-gray-600 italic bg-gray-50 px-4 py-2 rounded-xl">
              {todayData.Shenime}
            </p>
          )}

          {/* Current / Next Prayer – Dark Green Card */}
          {prayerInfo && (
            <div
              className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-xl p-5 shadow-xl flex flex-col gap-3"
              role="status"
              aria-live="polite"
            >
              {/* Current */}
              {prayerInfo.current && (
                <div className="flex justify-between items-center text-sm opacity-90">
                  <span>Tani:</span>
                  <span className="font-medium">
                    {prayerInfo.current.label.replace(" (xhemat)", "")} — {to12h(prayerInfo.current.time)}
                  </span>
                </div>
              )}

              {/* Tomorrow Date (if next is tomorrow) */}
              {prayerInfo.next.date && prayerInfo.next.date !== todayData.Date && (
                <p className="text-center text-xs opacity-80 font-medium">
                  {formatDate(prayerInfo.next.date)}
                </p>
              )}

              {/* Next Prayer */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">
                  {prayerInfo.next.label.includes(" (nesër)")
                    ? "Sabahu"
                    : prayerInfo.next.label.replace(" (xhemat)", "")}
                </span>
                <span className="text-3xl md:text-4xl font-mono font-bold">
                  {to12h(prayerInfo.next.time)}
                </span>
              </div>

              {/* Remaining */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Deri në vaktin tjetër:</span>
                <span className="font-bold text-yellow-200 text-xl">
                  {formatRemaining(prayerInfo.remaining)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ===== PART 2 – SHORT TABLE WITH L. E DIELLIT ===== */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-5 border border-white/30 flex flex-col">
          <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 font-bold sticky top-0">
                  <th className="p-2 md:p-3 text-left">Namazi</th>
                  <th className="p-2 md:p-3 text-center">Koha</th>
                  <th className="p-2 md:p-3 text-center">Xhemat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PRAYER_ORDER.map(({ key, label, special }) => {
                  const time = todayData[key] || (key === "Imsaku" ? todayData.Imsaku : null);
                  const xh = calculateXhemat(key, todayData, isFriday);
                  const isNext = prayerInfo?.next?.label === label || prayerInfo?.next?.label === `${label} (xhemat)`;
                  const isCurrent = prayerInfo?.current?.label === label || prayerInfo?.current?.label === `${label} (xhemat)`;

                  return (
                    <tr
                      key={key}
                      className={`
                        ${isNext ? "bg-emerald-50 font-bold" : ""}
                        ${isCurrent ? "bg-yellow-50" : "bg-white"}
                        ${special ? "text-gray-500 italic" : ""}
                      `}
                    >
                      <td className="p-2 md:p-3 font-medium">
                        {label}
                        {isLateFriday && key === "Dreka" && " (Xhuma)"}
                      </td>
                      <td className="p-2 md:p-3 text-center font-mono text-emerald-800">
                        {time ? to12h(time) : "—"}
                      </td>
                      <td className="p-2 md:p-3 text-center font-mono font-semibold text-teal-700">
                        {xh ? to12h(xh) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer – Time + Share */}
          <div className="mt-3 flex items-center justify-between text-xs md:text-sm text-gray-600">
            <span>
              Data: <span className="font-mono text-emerald-700">{formatDate(todayData.Date)} - {currentTime}</span>
            </span>
            <button
              onClick={share}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 
                         text-white font-bold px-5 py-2 rounded-full shadow-md transition-all text-sm"
            >
              Ndaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}