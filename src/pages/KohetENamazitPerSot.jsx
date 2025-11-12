// src/pages/StaticPrayerCard.jsx
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import vaktet from "../data/vaktet-e-namazit.json";

/* ---------- MUAJT SHQIP ---------- */
const muajtShqip = [
  "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
  "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"
];

const PRAYER_ORDER = [
  { key: "Imsaku", label: "Imsaku", special: true },
  { key: "Sabahu", label: "Sabahu" },
  { key: "Lindja", label: "L. e Diellit", special: true },
  { key: "Dreka", label: "Dreka" },
  { key: "Ikindia", label: "Ikindia" },
  { key: "Akshami", label: "Akshami" },
  { key: "Jacia", label: "Jacia" },
];

/* ---------- FUNKCIONE NDIMËSE ---------- */
const toMinutes = (t) => (t ? t.split(":").reduce((h, m) => h * 60 + +m, 0) : -1);

// NEW: 24-hour format (e.g., 14:05)
const to24h = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const formatRemaining = (m) => {
  if (m <= 0) return "0 min";
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h ? `${h} orë ` : ""}${min} min`;
};

/* ---------- FORMATIMI I DATËS (PA ZERO NË FILLIM) ---------- */
const formatDate = (dateStr) => {
  const [dayStr, monShort] = dateStr.split("-");
  const day = parseInt(dayStr, 10);
  const year = new Date().getFullYear();
  const monthIndex = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(monShort);
  const monthName = monthIndex >= 0 ? muajtShqip[monthIndex] : monShort;
  return `${day} ${monthName} ${year}`;
};

/* ---------- LLOGARITJA E XHEMATIT ---------- */
const calculateXhemat = (p, data, isFri) => {
  if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(p)) return null;

  if (p === "Sabahu" && data.Lindja) {
    const total = toMinutes(data.Lindja) - 40;
    const hrs = Math.floor(total / 60);
    const mins = ((total % 60) + 60) % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  if (p === "Dreka" && data.Dreka) {
    const adhan = toMinutes(data.Dreka);
    if (isFri && adhan >= 720) return "13:00";
    const nextHour = Math.ceil(adhan / 60) * 60;
    const hrs = Math.floor(nextHour / 60);
    return `${hrs.toString().padStart(2, "0")}:00`;
  }

  return data[p] || null;
};

/* ---------- KALENDARI (ME BUTONIN "SOT") ---------- */
const Calendar = ({ selectedDate, onSelect, onClose, vaktet, minDate, maxDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrev = () => {
    const prev = new Date(year, month - 1);
    if (prev >= minDate) setCurrentMonth(prev);
  };

  const handleNext = () => {
    const next = new Date(year, month + 1);
    if (next <= maxDate) setCurrentMonth(next);
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentMonth(today);
    onSelect(today);
    onClose();
  };

  const hasData = (day) => {
    const monthShort = currentMonth.toLocaleString("en", { month: "short" });
    const padded = `${day.toString().padStart(2, "0")}-${monthShort}`;
    const unpadded = `${day}-${monthShort}`;
    return vaktet.some(v => v.Date === padded || v.Date === unpadded);
  };

  const isInRange = (day) => {
    const date = new Date(year, month, day);
    return date >= minDate && date <= maxDate;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            disabled={new Date(year, month - 1) < minDate}
            aria-label="Mbrapa"
            className="p-3 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-emerald-800">
              {muajtShqip[month]} {year}
            </h3>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-colors"
              title="Kthehu te sot"
            >
              Sot
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={new Date(year, month + 1) > maxDate}
            aria-label="Përpara"
            className="p-3 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-2">
          {["D", "H", "M", "M", "E", "P", "S"].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm">
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            const isToday = date.getTime() === today.getTime();
            const isSelected = date.getTime() === selectedDate.getTime();
            const inRange = isInRange(day);
            const hasEntry = inRange && hasData(day);
            const dateStr = `${day.toString().padStart(2, "0")}-${currentMonth.toLocaleString("en", { month: "short" })}`;
            const hasFesta = hasEntry && vaktet.find(v => v.Date === dateStr)?.Festat;

            return (
              <button
                key={day}
                onClick={() => hasEntry && onSelect(date)}
                disabled={!hasEntry}
                className={`
                  p-2 rounded-lg transition-all relative text-xs
                  ${isToday ? "bg-emerald-100 font-bold" : ""}
                  ${isSelected ? "bg-emerald-600 text-white" : "hover:bg-emerald-50"}
                  ${!hasEntry ? "text-gray-300 cursor-not-allowed" : "text-gray-800"}
                  ${hasFesta ? "ring-2 ring-green-500 ring-offset-1" : ""}
                `}
              >
                {day}
                {hasFesta && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
        >
          Mbyll
        </button>
      </div>
    </div>
  );
};

export default function StaticPrayerCard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [minDate, maxDate] = useMemo(() => {
    if (!vaktet.length) return [today, today];
    const dates = vaktet.map(v => {
      const [d, m] = v.Date.split("-");
      return new Date(`${m} ${d}, ${new Date().getFullYear()}`);
    });
    return [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [todayData, setTodayData] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [prayerInfo, setPrayerInfo] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const intervalRef = useRef(null);

  const isFriday = selectedDate.getDay() === 5;
  const drekaMin = todayData?.Dreka ? toMinutes(todayData.Dreka) : 0;
  const isLateFriday = isFriday && drekaMin >= 720;

  useEffect(() => {
    const day = selectedDate.getDate();
    const monthShort = selectedDate.toLocaleString("en", { month: "short" });
    const padded = `${day.toString().padStart(2, "0")}-${monthShort}`;
    const unpadded = `${day}-${monthShort}`;

    const row = vaktet.find(v => v.Date === padded || v.Date === unpadded);
    setTodayData(row || null);
  }, [selectedDate]);

  const moments = useMemo(() => {
    if (!todayData) return [];
    const list = [];
    PRAYER_ORDER.forEach(({ key, label, special }) => {
      const time =
        todayData[key] || (key === "Imsaku" ? todayData.Imsaku : null);
      if (!time) return;
      list.push({ label, time, isXhemat: false, special });
      if (!special && key !== "Imsaku") {
        const xh = calculateXhemat(key, todayData, isFriday);
        if (xh)
          list.push({ label: `${label} (xhemat)`, time: xh, isXhemat: true });
      }
    });
    return list;
  }, [todayData, isFriday]);

  const updatePrayer = useCallback(() => {
    const now = new Date();
    const isToday =
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    if (!isToday || !todayData) {
      setPrayerInfo(null);
      return;
    }

    const minsNow = now.getHours() * 60 + now.getMinutes();
    const nextIdx = moments.findIndex((m) => toMinutes(m.time) > minsNow);

    if (nextIdx === -1) {
      const todayIdx = vaktet.findIndex((v) => v.Date === todayData.Date);
      if (todayIdx === -1) {
        setPrayerInfo(null);
        return;
      }

      const tomorrow = vaktet[todayIdx + 1] ?? vaktet[0];
      if (!tomorrow?.Sabahu) {
        setPrayerInfo(null);
        return;
      }

      const sabahAdhan = tomorrow.Sabahu;
      const sabahXhemat = calculateXhemat("Sabahu", tomorrow, isFriday);

      const minAdhan = toMinutes(sabahAdhan);
      const minXhemat = toMinutes(sabahXhemat);
      const minUntilAdhan = 1440 - minsNow + minAdhan;

      let nextLabel, nextTime, remaining;

      if (minUntilAdhan > 0) {
        nextLabel = "Sabahu";
        nextTime = sabahAdhan;
        remaining = minUntilAdhan;
      } else {
        nextLabel = "Sabahu (xhemat)";
        nextTime = sabahXhemat;
        remaining = minXhemat - minsNow;
      }

      setPrayerInfo({
        current: moments[moments.length - 1] || null,
        next: {
          label: `${nextLabel} (nesër)`,
          time: nextTime,
          date: tomorrow.Date,
        },
        remaining,
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
  }, [moments, todayData, isFriday, selectedDate]);

  /* ---------- ORA + TICK (24-hour format) ---------- */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
      updatePrayer();
    };
    tick();
    intervalRef.current = setInterval(tick, 60_000);
    return () => clearInterval(intervalRef.current);
  }, [updatePrayer]);

  /* ---------- NDAJ ---------- */
  const share = useCallback(async () => {
    const url = window.location.href;
    const title = `Koha e Namazit – ${todayData ? formatDate(todayData.Date) : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        console.log("Shared natively");
      } catch (err) {
        if (err.name !== "AbortError") {
          await fallbackCopy(url);
        }
      }
    } else {
      await fallbackCopy(url);
    }
  }, [todayData]);

  const fallbackCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Linku u kopjua në kujtesë!");
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Linku u kopjua!");
    }
  };

  if (!todayData) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-xl font-medium text-emerald-700">
          {vaktet.length > 0 ? "Nuk ka të dhëna për këtë datë" : "Duke u ngarkuar…"}
        </div>
      </div>
    );
  }

  const isToday =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center p-4 md:p-6">
      <div className="mb-4">
        <button
          onClick={() => setShowCalendar(true)}
          className="bg-white/80 backdrop-blur px-6 py-2.5 rounded-full shadow-md text-emerald-700 font-medium text-sm hover:bg-white transition flex items-center gap-2"
        >
          {formatDate(todayData.Date)} {isToday && "(Sot)"}
        </button>
      </div>

      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
          vaktet={vaktet}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}

      <div className="w-full max-w-5xl grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-5 md:p-7 border border-white/30 flex flex-col gap-5">
          <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 tracking-tight">
            {formatDate(todayData.Date)}
            {!isToday && <span className="block text-sm text-emerald-600 mt-1">Jo sot</span>}
          </h1>

          {todayData.Festat && (
            <div className="text-center p-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold text-sm shadow-md">
              {todayData.Festat}
            </div>
          )}

          {todayData.Shenime && (
            <p className="text-center text-xs text-gray-600 italic bg-gray-50 px-4 py-2 rounded-xl">
              {todayData.Shenime}
            </p>
          )}

          {prayerInfo && isToday && (
            <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-3xl text-white p-5 shadow-xl flex flex-col gap-3">
              {prayerInfo.current && (
                <div className="flex justify-between items-center text-sm opacity-90">
                  <span>Tani:</span>
                  <span className="font-medium">
                    {prayerInfo.current.label.replace(" (xhemat)", "")} — {to24h(prayerInfo.current.time)}
                  </span>
                </div>
              )}

              {prayerInfo.next.date && prayerInfo.next.date !== todayData.Date && (
                <p className="text-center text-xs opacity-80 font-medium">
                  {formatDate(prayerInfo.next.date)}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">
                  {prayerInfo.next.label.includes("nesër") ? "Sabahu" : prayerInfo.next.label.replace(" (xhemat)", "")}
                </span>
                <span className="text-3xl md:text-4xl font-bold">
                  {to24h(prayerInfo.next.time)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Deri në namazin tjetër:</span>
                <span className="font-bold text-yellow-200 text-xl">
                  {formatRemaining(prayerInfo.remaining)}
                </span>
              </div>
            </div>
          )}

          {!isToday && (
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl p-5 shadow-xl text-center">
              <p className="text-sm opacity-90">Koha aktuale:</p>
              <p className="text-3xl font-bold">{currentTime}</p>
              <p className="text-xs mt-2">Zgjidh sot për të parë kohën e namazit të ardhshëm</p>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-5 border border-white/30 flex flex-col">
          <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 font-bold sticky top-0">
                  <th className="p-2 md:p-3 text-left">Namazi</th>
                  <th className="p-2 md:p-3 text-center">Koha</th>
                  <th className="p-2 md:p-3 text-center">Xhemati</th>
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
                        ${isNext && isToday ? "bg-emerald-50 font-bold" : ""}
                        ${isCurrent && isToday ? "bg-yellow-50" : "bg-white"}
                        ${special ? "text-gray-500 italic" : ""}
                      `}
                    >
                      <td className="p-2 md:p-3 font-medium">
                        {label}
                        {isLateFriday && key === "Dreka" && " (Xhuma)"}
                      </td>
                      <td className="p-2 md:p-3 text-center text-emerald-800">
                        {time ? to24h(time) : "—"}
                      </td>
                      <td className="p-2 md:p-3 text-center font-semibold text-teal-700">
                        {xh ? to24h(xh) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs md:text-sm text-gray-600">
            <span>
              Data: <span className="font-semibold text-emerald-700">{formatDate(todayData.Date)} - {currentTime}</span>
            </span>
            <button
              onClick={share}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 
                         text-white font-bold px-5 py-2 rounded-full shadow-md transition-all text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ndaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}