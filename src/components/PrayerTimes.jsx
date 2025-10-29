// components/PrayerTimes.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function PrayerTimes() {
  const [data, setData] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_BASE}/vaktet`;

  // Fetch data
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const { data: res } = await axios.get(API_URL);
        const prayerData = res.data;
        const today = Array.isArray(prayerData) ? prayerData[0] : prayerData;
        setData(today);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load prayer times");
      } finally {
        setLoading(false);
      }
    };
    fetchTimes();
  }, [API_URL]);

  // Determine current prayer (runs every minute)
  useEffect(() => {
    if (!data) return;

    const updateCurrentPrayer = () => {
      const now = new Date();
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const prayers = [
        { name: "Imsaku", time: data.Imsaku },
        { name: "Sabahu", time: data.Sabahu },
        { name: "Lindja", time: data.Lindja },
        { name: "Dreka", time: data.Dreka },
        { name: "Ikindia", time: data.Ikindia },
        { name: "Akshami", time: data.Akshami },
        { name: "Jacia", time: data.Jacia },
      ];

      const toMinutes = (t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const nowMins = now.getHours() * 60 + now.getMinutes();

      let current = null;
      let nextDaySabahu = null;

      for (let i = 0; i < prayers.length; i++) {
        const p = prayers[i];
        const pMins = toMinutes(p.time);

        if (nowMins < pMins) {
          current = prayers[i - 1] || prayers[prayers.length - 1]; // previous
          break;
        }
      }

      // If after Jacia → show next day Sabahu
      if (!current || nowMins >= toMinutes(data.Jacia)) {
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDateStr = `${nextDay.getDate()}-${nextDay.toLocaleString("en", { month: "short" })}`;
        current = { name: "Sabahu (nesër)", time: "???", isNextDay: true, date: nextDateStr };
        nextDaySabahu = current;
      }

      setCurrentPrayer(current);
    };

    updateCurrentPrayer();
    const interval = setInterval(updateCurrentPrayer, 60000); // every minute

    return () => clearInterval(interval);
  }, [data]);

  /* ----------------------- Helpers ----------------------- */
  const formatDate = (str) => {
    const d = new Date(str);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const to12h = (time24) => {
    const [h, m] = time24.split(":");
    const hour = Number(h);
    const ampm = hour < 12 ? "am" : "pm";
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${ampm}`;
  };

  const cleanNotes = (txt) => (txt ? txt.replace(/\\r\\n/g, "\n").trim() : "");

  /* ----------------------- UI ----------------------- */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        Duke ngarkuar…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  const prayers = [
    { key: "Sabahu", label: "Sabahu" },
    { key: "Lindja", label: "L. e Diellit" },
    { key: "Dreka", label: "Dreka" },
    { key: "Ikindia", label: "Ikindia" },
    { key: "Akshami", label: "Akshami" },
    { key: "Jacia", label: "Jacia" },
  ];

  const festat = data.Festat?.trim();
  const shenime = cleanNotes(data["Shenime\r"]);

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-white rounded-xl shadow-lg">

      {/* FESTAT */}
      {festat && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg text-center font-bold text-lg shadow-md">
          {festat}
        </div>
      )}

      {/* DATE + CURRENT PRAYER */}
      <div className="text-center mb-6">
        <div className="text-lg font-bold text-gray-800">
          {formatDate(data.data_e_formatuar)}
        </div>

        {/* Current Prayer */}
        {currentPrayer && (
          <div className="mt-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow">
            {currentPrayer.isNextDay ? (
              <>
                <div className="text-sm opacity-90">{currentPrayer.date}</div>
                <div>{currentPrayer.name}</div>
              </>
            ) : (
              <>
                <div>{currentPrayer.name}</div>
                <div className="text-2xl mt-1">{to12h(currentPrayer.time)}</div>
              </>
            )}
          </div>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-indigo-50 text-indigo-800 font-semibold">
            <th className="p-2 border border-indigo-200">Namazi</th>
            <th className="p-2 border border-indigo-200 text-right">Koha</th>
          </tr>
        </thead>
        <tbody>
          {prayers.map(({ key, label }) => {
            const isCurrent = currentPrayer && currentPrayer.name === label;
            const isNextDay = currentPrayer?.isNextDay && key === "Sabahu";
            return (
              <tr
                key={key}
                className={`
                  ${isCurrent || isNextDay ? "bg-indigo-100 font-bold" : "bg-white"}
                  hover:bg-gray-50 transition
                `}
              >
                <td className="p-2 border border-gray-300">{label}</td>
                <td className="p-2 border border-gray-300 text-right font-mono">
                  {to12h(data[key])}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SHËNIME */}
      {shenime && (
        <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 whitespace-pre-line">
          <span className="font-semibold">Shënim:</span> {shenime}
        </div>
      )}
    </div>
  );
}