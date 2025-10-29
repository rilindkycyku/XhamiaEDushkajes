// proxy/index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PROXY_PORT || 3001;   // ← unchanged

// ---------- CORS ----------
app.use(cors({ origin: true }));

// ---------- Health ----------
app.get('/health', (_, res) => res.json({ ok: true }));

// ---------- Helpers ----------
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Fixed: Returns "21-Dec", "1-Jan", etc.
const formatDateParam = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" }); // "Dec", "Jan"
  return `${day}-${month}`; // → "21-Dec"
};

// ---------- Proxy ----------
const EXTERNAL = process.env.EXTERNAL_API || 'https://prayer-api.takvimi.workers.dev';

app.get('/api/vaktet', async (req, res) => {
  try {
    // 1. Fetch today
    const todayUrl = `${EXTERNAL}/api/vaktet`;
    const todayRes = await fetch(todayUrl, {
      headers: { 'User-Agent': 'XhamiaProxy/1.0' },
    });

    if (!todayRes.ok) {
      return res.status(todayRes.status).json({ error: 'Upstream error' });
    }

    const { data: rawToday } = await todayRes.json();
    const today = Array.isArray(rawToday) ? rawToday[0] : rawToday;

    // 2. Check if after Jacia
    const now = new Date();
    const jaciaMins = toMinutes(today.Jacia);
    const nowMins = now.getHours() * 60 + now.getMinutes();

    let enhanced = { ...today };

    if (nowMins >= jaciaMins) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateParam = formatDateParam(tomorrow); // → "30-Oct", "1-Jan", etc.

      try {
        const tomorrowUrl = `${EXTERNAL}/api/vaktet?date=${dateParam}`;
        const tomorrowRes = await fetch(tomorrowUrl, {
          headers: { 'User-Agent': 'XhamiaProxy/1.0' },
        });

        if (tomorrowRes.ok) {
          const { data: rawTomorrow } = await tomorrowRes.json();
          const tomorrowData = Array.isArray(rawTomorrow) ? rawTomorrow[0] : rawTomorrow;

          enhanced.nextDaySabahu = tomorrowData.Sabahu;
          enhanced.nextDayDate = tomorrowData.data_e_formatuar;
        }
      } catch (e) {
        console.warn("Warning: Could not fetch tomorrow's Sabahu:", e.message);
      }
    }

    // 3. Return enhanced data
    res.json({ data: enhanced });
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(502).json({ error: 'Bad gateway' });
  }
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`Proxy → http://localhost:${PORT}/api/vaktet`);
});