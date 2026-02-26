// components/PrayerTimes.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import vaktet from "../data/vaktet-e-namazit.json";
import site from "../data/site.json";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShare, HiCheckCircle } from "react-icons/hi2";

const muajtShqip = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];

export default function PrayerTimes() {
  const [vaktiSot, setVaktiSot] = useState(null);
  const [infoTani, setInfoTani] = useState(null);

  useEffect(() => {
    if (!Array.isArray(vaktet) || vaktet.length === 0) return;
    const sot = new Date();
    const dite = sot.getDate();
    const muajiSot = sot.toLocaleString("en", { month: "short" });
    const rreshti = vaktet.find((v) => {
      const [d, m] = v.Date.split("-");
      return Number(d) === dite && m === muajiSot;
    }) ?? vaktet[0];
    setVaktiSot(rreshti);
  }, []);

  const neMinuta = (ora) => {
    if (!ora) return 0;
    const [h, m] = ora.split(":").map(Number);
    return h * 60 + m;
  };

  const formatDallim = (min) => {
    if (min <= 0) return "0 minuta";
    const o = Math.floor(min / 60);
    const m = min % 60;
    let res = "";
    if (o > 0) res += `${o} orë${m > 0 ? ' e ' : ''}`;
    if (m > 0) res += `${m} ${m === 1 ? 'minutë' : 'minuta'}`;
    return res || "0 minuta";
  };

  const ne24h = (ora24) => {
    if (!ora24) return "—";
    const [h, m] = ora24.split(":").map(Number);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const formatDatenShqip = (str) => {
    if (!str) return "";
    const [d, m] = str.split("-");
    const muajtEnglish = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const muajiIndex = muajtEnglish.indexOf(m);
    const emriMuajit = muajiIndex >= 0 ? muajtShqip[muajiIndex] : m;
    return `${d} ${emriMuajit}`;
  };

  const xhemati = (emri) => {
    if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(emri)) return null;
    if (emri === "Sabahu" && vaktiSot) {
      if (site.ramazan?.active) return vaktiSot.Sabahu;
      if (vaktiSot.Lindja) {
        const [h, m] = vaktiSot.Lindja.split(":").map(Number);
        const total = h * 60 + m - 40;
        const o = Math.floor(total / 60);
        const min = ((total % 60) + 60) % 60;
        return `${String(o).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      }
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
    if (emri === "Jacia" && vaktiSot?.Jacia) {
      if (site.ramazan?.active && site.ramazan?.kohaTeravise) return site.ramazan?.kohaTeravise;
      return vaktiSot.Jacia;
    }
    return vaktiSot?.[emri] ?? null;
  };

  const buildMoments = useCallback(() => {
    if (!vaktiSot) return [];
    const moments = [];
    const namazet = ["Imsaku", "Sabahu", "Lindja", "Dreka", "Ikindia", "Akshami", "Jacia"];
    const getLabel = (id) => {
      if (id === 'Imsaku' && site.ramazan?.active) return "Syfyri (Imsaku)";
      if (id === 'Akshami' && site.ramazan?.active) return "Iftari (Akshami)";
      if (id === 'Jacia' && site.ramazan?.active) return "Teravia (Jacia)";
      return id;
    };
    namazet.forEach(n => {
      if (vaktiSot[n]) {
        moments.push({ id: n, label: getLabel(n), kohe: vaktiSot[n] });
        const xh = xhemati(n);
        if (xh) moments.push({ id: n, label: `${getLabel(n)} (xhemat)`, kohe: xh });
      }
    });
    return moments;
  }, [vaktiSot]);

  const perditeso = useCallback(() => {
    if (!vaktiSot) return;
    const tani = new Date();
    const minTani = tani.getHours() * 60 + tani.getMinutes();
    const moments = buildMoments();
    let nextIdx = moments.findIndex((m) => neMinuta(m.kohe) > minTani);

    // Case: End of Day (After last moment, usually Jacia Xhemat) -> Next is Tomorrow Sabahu
    if (nextIdx === -1) {
      const idxSot = vaktet.findIndex((v) => v.Date === vaktiSot.Date);
      const neser = vaktet[idxSot + 1] ?? vaktet[0];
      const nextSabahu = neser.Sabahu;
      const lastMoment = moments[moments.length - 1]; // usually Jacia or Jacia Xhemat

      setInfoTani({
        tani: { id: "Jacia", label: "Jacia" }, // Highlight Jacia
        ardhshëm: { id: "Sabahu", label: "Sabahu", kohe: nextSabahu },
        mbetur: (24 * 60 - minTani) + neMinuta(nextSabahu),
        total: (24 * 60 - neMinuta(lastMoment.kohe)) + neMinuta(nextSabahu),
      });
      return;
    }

    // Case: Start of Day (Before Imsaku) -> Current is Last Night's Jacia
    if (nextIdx === 0) {
      const idxSot = vaktet.findIndex((v) => v.Date === vaktiSot.Date);
      // Get yesterday's data to find Jacia time
      const dje = idxSot > 0 ? vaktet[idxSot - 1] : vaktet[vaktet.length - 1];
      const djeJacia = dje.Jacia;
      const nextMoment = moments[0]; // Imsaku

      // Time from yesterday's Jacia to Imsaku today
      const totalDuration = (24 * 60 - neMinuta(djeJacia)) + neMinuta(nextMoment.kohe);
      // Time remaining to Imsaku
      const remaining = neMinuta(nextMoment.kohe) - minTani;

      setInfoTani({
        tani: { id: "Jacia", label: "Jacia" }, // Highlight Jacia row
        ardhshëm: nextMoment,
        mbetur: remaining,
        total: totalDuration
      });
      return;
    }

    // Normal Case
    const currentMoment = moments[nextIdx - 1];
    const nextMoment = moments[nextIdx];
    const totalMin = neMinuta(nextMoment.kohe) - neMinuta(currentMoment.kohe);

    setInfoTani({
      tani: currentMoment,
      ardhshëm: nextMoment,
      mbetur: neMinuta(nextMoment.kohe) - minTani,
      total: totalMin,
    });
  }, [vaktiSot, buildMoments]);

  useEffect(() => {
    perditeso();
    const id = setInterval(perditeso, 1000);
    return () => clearInterval(id);
  }, [perditeso]);

  const shareTimes = () => {
    const url = `${window.location.origin}/kohetenamazitpersot`;
    if (navigator.share) {
      navigator.share({ title: `Vaktet - ${formatDatenShqip(vaktiSot.Date)}`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Linku u kopjua!");
    }
  };

  const listaNamazeve = useMemo(() => [
    { id: "Imsaku", label: site.ramazan?.active ? "Syfyri (Imsaku)" : "Imsaku" },
    { id: "Sabahu", label: "Sabahu" },
    { id: "Lindja", label: "Lindja", dim: true },
    { id: "Dreka", label: "Dreka" },
    { id: "Ikindia", label: "Ikindia" },
    { id: "Akshami", label: site.ramazan?.active ? "Iftari (Akshami)" : "Akshami" },
    { id: "Jacia", label: site.ramazan?.active ? "Teravia (Jacia)" : "Jacia" },
  ], []);

  if (!vaktiSot) return <div className="h-64 bg-slate-50 animate-pulse rounded-2xl" />;

  const progress = infoTani ? Math.max(0, Math.min(100, (1 - infoTani.mbetur / infoTani.total) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col max-w-md mx-auto font-sans">
      <div className="bg-slate-900 p-5 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
          <motion.div animate={{ width: `${progress}%` }} className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>

        <AnimatePresence>
          {(vaktiSot.Festat || vaktiSot.Shenime) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 bg-emerald-600/10 border border-emerald-500/20 p-3 rounded-xl font-sans">
              {vaktiSot.Festat && <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400 flex items-center gap-2"><HiCheckCircle size={14} /> {vaktiSot.Festat}</p>}
              {vaktiSot.Shenime && <p className="text-[10px] text-slate-400 font-medium italic mt-1">"{vaktiSot.Shenime}"</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-4 md:mb-5 font-sans">
          <div>
            <p className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Vaktet</p>
            <p className="text-lg md:text-xl font-black">{formatDatenShqip(vaktiSot.Date)}</p>
          </div>
          <button onClick={shareTimes} className="p-2 text-slate-500 hover:text-white transition-colors"><HiOutlineShare size={18} /></button>
        </div>

        {infoTani?.ardhshëm && (
          <div className="grid grid-cols-2 gap-4 items-end pt-4 border-t border-white/5 font-sans">
            <div>
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1 text-left">Vakti i radhës</p>
              <div className="flex items-baseline gap-2">
                <p className="text-base md:text-lg font-black text-white">{infoTani.ardhshëm.label.split(' ')[0]}</p>
                <p className="text-[10px] md:text-sm font-mono text-emerald-500/50">{ne24h(infoTani.ardhshëm.kohe)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1">Mbetur</p>
              <p className="text-xl md:text-2xl font-black text-emerald-400 font-mono tracking-tighter">{formatDallim(infoTani.mbetur)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-1 md:p-2 bg-white">
        <div className="flex items-center text-[9px] md:text-[10px] font-black uppercase text-slate-400 px-3 md:px-4 py-2 md:py-3 border-b border-slate-50 mb-1 font-sans">
          <span className="flex-1 tracking-widest text-left">Namazi</span>
          <span className="w-12 md:w-14 text-center tracking-widest">Koha</span>
          <span className="w-16 md:w-20 text-center text-emerald-600 tracking-widest">Falja me Xhemat</span>
        </div>

        <div className="space-y-0.5 pb-2">
          {listaNamazeve.map(({ id, label, dim }) => {
            const kohe = vaktiSot[id];
            const xh = xhemati(id);
            const isCurrent = infoTani?.tani?.id === id;
            const isNext = infoTani?.ardhshëm?.id === id;
            const isJumuah = new Date().getDay() === 5 && id === "Dreka";

            // Subtle past prayers
            const tani = new Date();
            const minTani = tani.getHours() * 60 + tani.getMinutes();
            const isPast = neMinuta(kohe) < minTani && !isNext && !isCurrent;

            return (
              <div
                key={id}
                className={`flex items-center px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all duration-300 ${isNext ? "bg-emerald-600/5 ring-1 ring-emerald-500/10 shadow-sm"
                  : isCurrent ? "bg-slate-50/50 ring-1 ring-slate-200"
                    : isJumuah ? "bg-amber-50 ring-1 ring-amber-100" // Jumuah style
                      : "bg-transparent hover:bg-slate-50"
                  }`}>
                <div className="flex-1 flex items-center gap-1.5 md:gap-2 min-w-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className={`text-[10px] md:text-xs uppercase truncate font-sans tracking-tight ${isNext ? "text-emerald-700 font-black"
                        : isCurrent ? "text-slate-900 font-black"
                          : isJumuah ? "text-amber-700 font-black" // Jumuah text color
                            : isPast ? "text-slate-400"
                              : dim ? "text-slate-300"
                                : "text-slate-700 font-bold"
                        }`}>
                        {label}
                      </p>
                      {isJumuah && !isNext && !isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 text-[9px] uppercase font-black tracking-widest border border-amber-200">
                          Xhumaja
                        </span>
                      )}
                    </div>
                  </div>
                  {isNext && <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />}
                  {isCurrent && <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-400 rounded-full flex-shrink-0" />}
                </div>

                <div className="w-12 md:w-14 text-center">
                  <p className={`font-mono font-bold text-xs md:text-sm ${isNext ? "text-emerald-700"
                    : isCurrent ? "text-slate-900"
                      : isJumuah ? "text-amber-700"
                        : isPast ? "text-slate-400"
                          : "text-slate-600"
                    }`}>{ne24h(kohe)}</p>
                </div>

                <div className="w-16 md:w-20 flex justify-center">
                  {xh ? (
                    <div className={`w-14 md:w-16 py-0.5 md:py-1 rounded-lg text-center transition-all ${isNext ? 'bg-emerald-600 text-white shadow-md'
                      : isCurrent ? 'bg-slate-200 text-slate-700 font-bold'
                        : isJumuah ? 'bg-amber-100 text-amber-700 font-bold ring-1 ring-amber-200'
                          : isPast ? 'bg-slate-50 text-slate-400'
                            : 'bg-emerald-50 text-emerald-700 font-bold'
                      }`}>
                      <p className="font-mono font-bold text-xs md:text-sm leading-tight">{ne24h(xh)}</p>
                    </div>
                  ) : (
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-slate-100 rounded-full opacity-40 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
