import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCalculator, HiArrowTopRightOnSquare } from 'react-icons/hi2';

// Nisab thresholds per Islamic jurisprudence: 85g of gold or 595g of silver.
const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZEKAT_RATE = 0.025; // 2.5%

function parseNumber(value) {
  const n = parseFloat(String(value).replace(',', '.').trim());
  return Number.isFinite(n) ? n : null;
}

function formatNumber(n) {
  return n.toLocaleString('sq-AL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ZekatCalculator() {
  const [goldPrice, setGoldPrice] = useState('');
  const [silverPrice, setSilverPrice] = useState('');
  const [wealth, setWealth] = useState('');
  const [fitrPerPerson, setFitrPerPerson] = useState('');
  const [household, setHousehold] = useState('');

  const goldPriceNum = parseNumber(goldPrice);
  const silverPriceNum = parseNumber(silverPrice);
  const wealthNum = parseNumber(wealth) ?? 0;

  const nisabGold = goldPriceNum != null ? NISAB_GOLD_GRAMS * goldPriceNum : null;
  const nisabSilver = silverPriceNum != null ? NISAB_SILVER_GRAMS * silverPriceNum : null;

  let nisab = null;
  if (nisabGold != null && nisabSilver != null) {
    nisab = Math.min(nisabGold, nisabSilver);
  } else {
    nisab = nisabGold ?? nisabSilver;
  }

  const meetsNisab = nisab != null && wealthNum >= nisab;
  const zekatDue = meetsNisab ? wealthNum * ZEKAT_RATE : 0;

  const fitrPerPersonNum = parseNumber(fitrPerPerson) ?? 0;
  const householdNum = parseInt(household, 10) || 0;
  const fitrTotal = fitrPerPersonNum * householdNum;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
    >
      {/* Dark Header — same style as PrayerTimes / EsmaulHusnaWidget */}
      <div className="bg-slate-900 p-5 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <HiCalculator className="text-xl text-emerald-300" />
          </div>
          <div>
            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mb-0.5">
              Vegël
            </p>
            <p className="font-bold text-base leading-tight">Kalkulatori i Zekatit</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <p className="text-slate-500 text-xs leading-relaxed">
          Ky kalkulim është vetëm orientues. Për raste specifike, konsultohuni me një dijetar fetar.
        </p>

        {/* ── Zekati i Pasurisë ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
            Zekati i Pasurisë
          </p>

          <a
            href="https://www.google.com/search?q=%C3%A7mimi+i+arit+dhe+argjendit+sot+p%C3%ABr+gram"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
          >
            <span>Kontrollo çmimin e sotëm të arit/argjendit</span>
            <HiArrowTopRightOnSquare className="text-sm shrink-0 ml-2" />
          </a>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Çmimi i Arit</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="€ / gram"
                value={goldPrice}
                onChange={(e) => setGoldPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Çmimi i Argjendit</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="€ / gram"
                value={silverPrice}
                onChange={(e) => setSilverPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Pasuria Juaj Totale</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Para, kursime, ar, argjend, biznes (1 vit hënor)"
              value={wealth}
              onChange={(e) => setWealth(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
          </label>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
            {nisab == null ? (
              <p className="text-emerald-800 text-xs font-medium">
                Vendosni çmimin e arit ose argjendit për të llogaritur nisabin.
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-xs text-emerald-700 font-semibold">
                  Nisabi (pragu): {formatNumber(nisab)}
                </p>
                {meetsNisab ? (
                  <>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">
                      Zekati për të dhënë (2.5%)
                    </p>
                    <p className="text-2xl font-black text-emerald-700">{formatNumber(zekatDue)}</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    Pasuria juaj është nën nisab — Zekati nuk është obligim.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* ── Sadaka-el-Fitri ───────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
            Sadaka-el-Fitri
          </p>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Shuma për person</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="€"
                value={fitrPerPerson}
                onChange={(e) => setFitrPerPerson(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Anëtarë familjeje</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="p.sh. 4"
                value={household}
                onChange={(e) => setHousehold(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
            </label>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
            {fitrTotal > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">
                  Sadaka-el-Fitri Gjithsej
                </p>
                <p className="text-2xl font-black text-emerald-700">{formatNumber(fitrTotal)}</p>
              </div>
            ) : (
              <p className="text-emerald-800 text-xs font-medium">
                Plotësoni fushat më lart për të llogaritur.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
