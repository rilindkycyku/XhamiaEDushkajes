// api/vaktet.js
import fetch from "node-fetch";

const EXTERNAL =
  process.env.EXTERNAL_API || "https://prayer-api.takvimi.workers.dev";

const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatDateParam = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" });
  return `${day}-${month}`;
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const todayUrl = `${EXTERNAL}/api/vaktet`;
    const todayRes = await fetch(todayUrl, {
      headers: { "User-Agent": "XhamiaProxy/1.0" },
    });

    if (!todayRes.ok)
      return res.status(todayRes.status).json({ error: "Upstream error" });

    const { data: rawToday } = await todayRes.json();
    const today = Array.isArray(rawToday) ? rawToday[0] : rawToday;

    const now = new Date();
    const jaciaMins = toMinutes(today.Jacia);
    const nowMins = now.getHours() * 60 + now.getMinutes();

    let enhanced = { ...today };

    if (nowMins >= jaciaMins) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateParam = formatDateParam(tomorrow);

      try {
        const tomorrowUrl = `${EXTERNAL}/api/vaktet?date=${dateParam}`;
        const tomorrowRes = await fetch(tomorrowUrl, {
          headers: { "User-Agent": "XhamiaProxy/1.0" },
        });

        if (tomorrowRes.ok) {
          const { data: rawTomorrow } = await tomorrowRes.json();
          const tomorrowData = Array.isArray(rawTomorrow)
            ? rawTomorrow[0]
            : rawTomorrow;
          enhanced.nextDaySabahu = tomorrowData.Sabahu;
          enhanced.nextDayDate = tomorrowData.data_e_formatuar;
        }
      } catch (e) {
        console.warn("Warning: Could not fetch tomorrow's Sabahu:", e.message);
      }
    }

    res.status(200).json({ data: enhanced });
  } catch (e) {
    console.error("Proxy error:", e?.message || e);
    return res.status(502).json({
      error: "Bad gateway",
      details: e?.message || e.toString(),
    });
  }
}
