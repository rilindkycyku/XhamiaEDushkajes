// components/PrayerTimes.jsx
import { useEffect, useState } from "react";
import vaktetData from "../data/vaktet-e-namazit.json";

export default function PrayerTimes() {
  const [data, setData] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);

  // ---------------- Load today's data ----------------
  useEffect(() => {
    if (!vaktetData || !Array.isArray(vaktetData)) return;

    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.toLocaleString("en", { month: "short" });

    // Find today's prayer data
    const todayData =
      vaktetData.find((v) => {
        const [dayStr, monthStr] = v.Date.split("-");
        return Number(dayStr) === todayDay && monthStr === todayMonth;
      }) || vaktetData[0];

    setData(todayData);
  }, []);

  // ---------------- Determine current prayer ----------------
  useEffect(() => {
    if (!data) return;

    const updateCurrentPrayer = () => {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      const prayers = [
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

      let current = null;

      for (let i = 0; i < prayers.length; i++) {
        const pMins = toMinutes(prayers[i].time);
        if (nowMins < pMins) {
          current = prayers[i - 1] || { name: "Sabahu", time: data.Sabahu };
          break;
        }
      }

      // If after Jacia → show next day Sabahu
      if (!current || nowMins >= toMinutes(data.Jacia)) {
        const todayIndex = vaktetData.findIndex((v) => v.Date === data.Date);
        const nextDayData = vaktetData[todayIndex + 1] || vaktetData[0];
        current = {
          name: "Sabahu (nesër)",
          time: nextDayData.Sabahu,
          isNextDay: true,
          date: nextDayData.Date,
        };
      }

      setCurrentPrayer(current);
    };

    updateCurrentPrayer();
    const interval = setInterval(updateCurrentPrayer, 60000); // update every minute
    return () => clearInterval(interval);
  }, [data]);

  /* ----------------------- Helpers ----------------------- */
  const to12h = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    const ampm = h < 12 ? "am" : "pm";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  if (!data)
    return (
      <div className="p-6 text-center text-gray-600 font-medium">
        Duke ngarkuar…
      </div>
    );

  const prayersList = [
    { key: "Sabahu", label: "Sabahu" },
    { key: "Lindja", label: "L. e Diellit" },
    { key: "Dreka", label: "Dreka" },
    { key: "Ikindia", label: "Ikindia" },
    { key: "Akshami", label: "Akshami" },
    { key: "Jacia", label: "Jacia" },
  ];

  const formatDate = (str) => {
    // str example: "30-Oct"
    const [day, monthStr] = str.split("-");
    const date = new Date(`${monthStr} ${day}, ${new Date().getFullYear()}`);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="max-w-md mx-auto p-4 font-sans bg-white rounded-xl shadow-lg">
      {/* DATE + CURRENT PRAYER */}
      <div className="text-center mb-6">
        <div className="text-lg font-bold text-gray-800">{formatDate(data.Date)}</div>


        {currentPrayer && (
          <div className="mt-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow">
            {currentPrayer.isNextDay ? (
              <>
                <div className="text-sm opacity-90">{currentPrayer.date}</div>
                <div>{currentPrayer.name}</div>
                <div className="text-2xl mt-1">{to12h(currentPrayer.time)}</div>
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
          {prayersList.map(({ key, label }) => {
            const isCurrent =
              currentPrayer && currentPrayer.name.includes(label);
            return (
              <tr
                key={key}
                className={`${
                  isCurrent ? "bg-indigo-100 font-bold" : "bg-white"
                } hover:bg-gray-50 transition`}>
                <td className="p-2 border border-gray-300">{label}</td>
                <td className="p-2 border border-gray-300 text-right font-mono">
                  {to12h(data[key])}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
