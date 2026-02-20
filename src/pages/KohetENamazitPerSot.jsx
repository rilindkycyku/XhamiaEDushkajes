import { useEffect, useState, useCallback, useMemo } from "react";
import vaktet from "../data/vaktet-e-namazit.json";
import site from "../data/site.json";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import {
  HiOutlineShare,
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiClock
} from "react-icons/hi2";

const muajtShqip = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];

const Calendar = ({ selectedDate, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-5 md:p-8 max-w-sm w-full border border-slate-100 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 px-2">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all"><HiOutlineChevronLeft size={20} /></button>
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">{muajtShqip[month]} {year}</h3>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all"><HiOutlineChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["D", "H", "M", "M", "E", "P", "S"].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-400 py-2">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const date = new Date(year, month, dayNum);
            date.setHours(0, 0, 0, 0);
            const isToday = date.getTime() === today.getTime();
            const isSelected = date.getTime() === selectedDate.getTime();
            return (
              <button
                key={dayNum}
                onClick={() => { onSelect(date); onClose(); }}
                className={`aspect-square flex items-center justify-center rounded-xl text-xs font-black transition-all ${isSelected ? "bg-emerald-600 text-white shadow-lg" : isToday ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-600"
                  }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function KohetENamazitPerSot() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [todayData, setTodayData] = useState(null);
  const [infoTani, setInfoTani] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dNum = selectedDate.getDate();
    const mShort = selectedDate.toLocaleString("en", { month: "short" });
    const row = vaktet.find(v => {
      const [vD, vM] = v.Date.split("-");
      return parseInt(vD, 10) === dNum && vM === mShort;
    });
    setTodayData(row || vaktet[0]);
  }, [selectedDate]);

  const neMinuta = (ora) => {
    if (!ora) return 0;
    const [h, m] = ora.split(":").map(Number);
    return h * 60 + m;
  };

  const formatDallim = (min) => {
    if (min <= 0) return "0m";
    const o = Math.floor(min / 60);
    const m = min % 60;
    return `${o ? `${o}h ` : ""}${m}m`;
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
    return `${parseInt(d, 10)} ${emriMuajit}`;
  };

  const xhemati = (emri) => {
    if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(emri)) return null;
    if (emri === "Sabahu" && todayData) {
      if (site.ramazanActive) return todayData.Sabahu;
      if (todayData.Lindja) {
        const [h, m] = todayData.Lindja.split(":").map(Number);
        const total = h * 60 + m - 40;
        const o = Math.floor(total / 60);
        const min = ((total % 60) + 60) % 60;
        return `${String(o).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      }
    }
    if (emri === "Dreka" && todayData?.Dreka) {
      const isFri = selectedDate.getDay() === 5;
      const [h, m] = todayData.Dreka.split(":").map(Number);
      const minAdhan = h * 60 + m;
      if (isFri && minAdhan >= 12 * 60) return "13:00";
      const oraTjeter = Math.ceil(minAdhan / 60) * 60;
      const o = Math.floor(oraTjeter / 60);
      return `${String(o).padStart(2, "0")}:00`;
    }
    return todayData?.[emri] ?? null;
  };

  const buildMoments = useCallback(() => {
    if (!todayData) return [];
    const moments = [];
    const namazet = ["Imsaku", "Sabahu", "Lindja", "Dreka", "Ikindia", "Akshami", "Jacia"];
    namazet.forEach(n => {
      if (todayData[n]) {
        moments.push({ id: n, label: n, kohe: todayData[n] });
        const xh = xhemati(n);
        if (xh) moments.push({ id: n, label: `${n} (xhemat)`, kohe: xh });
      }
    });
    return moments;
  }, [todayData, selectedDate]);

  const perditeso = useCallback(() => {
    if (!todayData) return;
    const isToday = selectedDate.getTime() === today.getTime();
    if (!isToday) {
      setInfoTani(null);
      return;
    }

    const tani = new Date();
    const minTani = tani.getHours() * 60 + tani.getMinutes();
    const moments = buildMoments();
    let nextIdx = moments.findIndex((m) => neMinuta(m.kohe) > minTani);

    if (nextIdx === -1) {
      const v_idx = vaktet.findIndex(v => v.Date === todayData.Date);
      const neser = vaktet[v_idx + 1] ?? vaktet[0];
      setInfoTani({
        tani: moments[moments.length - 1],
        ardhshëm: { id: "Sabahu", label: "Sabahu", kohe: neser.Sabahu },
        mbetur: 24 * 60 - minTani + neMinuta(neser.Sabahu),
        total: 24 * 60 - neMinuta(moments[moments.length - 1].kohe) + neMinuta(neser.Sabahu),
      });
      return;
    }

    const currentMoment = nextIdx > 0 ? moments[nextIdx - 1] : null;
    const nextMoment = moments[nextIdx];
    const totalMin = currentMoment ? neMinuta(nextMoment.kohe) - neMinuta(currentMoment.kohe) : 60;

    setInfoTani({
      tani: currentMoment,
      ardhshëm: nextMoment,
      mbetur: neMinuta(nextMoment.kohe) - minTani,
      total: totalMin,
    });
  }, [todayData, selectedDate, buildMoments]);

  useEffect(() => {
    perditeso();
    const id = setInterval(perditeso, 10_000);
    return () => clearInterval(id);
  }, [perditeso]);

  const shareTimes = () => {
    const url = window.location.origin + "/kohetenamazitpersot";
    if (navigator.share) {
      navigator.share({ title: `Vaktet - ${formatDatenShqip(todayData.Date)}`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Linku u kopjua!");
    }
  };

  const listaNamazeve = useMemo(() => [
    { id: "Imsaku", label: site.ramazanActive ? "Syfyri (Imsaku)" : "Imsaku" },
    { id: "Sabahu", label: "Sabahu" },
    { id: "Lindja", label: "Lindja", dim: true },
    { id: "Dreka", label: "Dreka" },
    { id: "Ikindia", label: "Ikindia" },
    { id: "Akshami", label: site.ramazanActive ? "Iftari (Akshami)" : "Akshami" },
    { id: "Jacia", label: "Jacia" },
  ], []);

  if (!todayData) return null;

  const progress = infoTani ? Math.max(0, Math.min(100, (1 - infoTani.mbetur / infoTani.total) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-3 md:px-4 relative font-sans overflow-x-hidden">
      <SEO
        title="Kohët e Namazit"
        description="Shikoni kohët e sakta të namazit për sot në Kaçanik (Dushkajë). Informohuni mbi kohën e Imsakut, Sabahut, Drekës, Ikindisë, Akshamit dhe Jacisë."
        url="/kohetenamazitpersot"
      />
      {/* Immersive Background Header */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-slate-950 z-0 overflow-hidden">
        {/* Dynamic Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto max-w-lg relative z-10">
        <div className="flex flex-col gap-5">

          {/* TOP NAV & DATE CARD */}
          <div className="flex flex-col gap-6 text-white mb-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Vaktet e Namazit</span>
                </div>
                {/* Special Occasion Badge */}
                <AnimatePresence>
                  {(todayData.Festat || todayData.Shenime) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit"
                    >
                      <HiCheckCircle className="text-emerald-400 flex-shrink-0" size={14} />
                      <p className="text-[9px] uppercase font-black tracking-widest text-emerald-400 line-clamp-1">{todayData.Festat || todayData.Shenime}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={shareTimes}
                className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
              >
                <HiOutlineShare size={18} className="text-white/70" />
              </button>
            </div>

            <button onClick={() => setShowCalendar(true)} className="text-left group outline-none w-fit">
              <p className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] text-white/40 mb-1">Data e zgjedhur</p>
              <div className="flex items-center gap-3 group">
                <h1 className="text-2xl md:text-5xl font-black tracking-tighter group-hover:text-emerald-400 transition-colors">
                  {formatDatenShqip(todayData.Date)}
                </h1>
                <HiOutlineCalendar size={20} className="text-emerald-500 group-hover:scale-110 transition-transform md:w-[22px] md:h-[22px]" />
              </div>
            </button>
          </div>

          {/* COUNTDOWN CARD (MOBILE OPTIMIZED) */}
          {infoTani?.ardhshëm && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/10 bg-slate-900/40 backdrop-blur-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-white/5 pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-5 md:gap-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <HiClock className="text-white" size={20} md:size={24} />
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/80 mb-0.5">Namazi i Radhës</p>
                      <h2 className="text-lg md:text-xl font-black uppercase text-white tracking-tight">{infoTani.ardhshëm.label.split(' ')[0]}</h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">Koha</p>
                    <p className="text-base md:text-lg font-mono font-black text-white/50">{ne24h(infoTani.ardhshëm.kohe)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Mbetur edhe</span>
                    <span className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">
                      {formatDallim(infoTani.mbetur)}
                    </span>
                  </div>
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-emerald-500 rounded-full relative"
                    >
                      <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-md" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRAYER LIST (MOBILE OPTIMIZED) */}
          <div className="bg-white rounded-[2.5rem] p-2 md:p-4 shadow-xl shadow-slate-200 border border-slate-100 flex flex-col font-sans">
            {/* Table Header */}
            <div className="flex items-center text-[9px] font-black uppercase text-slate-400 px-5 py-5 border-b border-slate-50 mb-2 tracking-widest">
              <span className="flex-1">Namazi</span>
              <span className="w-16 text-center">Koha</span>
              <span className="w-24 text-center text-emerald-600">Xhemat</span>
            </div>

            <div className="flex flex-col gap-0.5 md:gap-1 pb-2">
              {listaNamazeve.map(({ id, label, dim }) => {
                const kohe = todayData[id];
                const xh = xhemati(id);
                const isCurrent = infoTani?.tani?.id === id;
                const isNext = infoTani?.ardhshëm?.id === id;
                const isJumuah = selectedDate.getDay() === 5 && id === "Dreka";

                const tani = new Date();
                const minTani = tani.getHours() * 60 + tani.getMinutes();
                const isPast = neMinuta(kohe) < minTani && !isNext && !isCurrent;

                return (
                  <motion.div
                    key={id}
                    layout
                    className={`flex items-center px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl transition-all duration-300 relative ${isNext
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 z-10"
                      : isCurrent
                        ? "bg-slate-900 text-white shadow-md z-10 scale-[1.01]"
                        : isJumuah
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : "hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex-1 flex items-center gap-2 md:gap-3 min-w-0">
                      <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full flex-shrink-0 transition-all duration-500 ${isNext ? "bg-white animate-pulse"
                          : isCurrent ? "bg-emerald-500"
                            : isJumuah ? "bg-amber-500"
                              : isPast ? "bg-slate-200"
                                : "bg-emerald-100"
                        }`} />

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className={`text-[10px] md:text-xs transition-all duration-300 ${isNext || isCurrent ? "font-black uppercase tracking-tight"
                              : isJumuah ? "font-black uppercase tracking-tight text-amber-700"
                                : "font-bold text-slate-700"
                            } ${isPast && !isJumuah ? "text-slate-400 opacity-60" : ""}`}>
                            {label}
                          </p>
                          {isJumuah && !isNext && !isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 text-[8px] uppercase font-black tracking-widest border border-amber-200">
                              Xhumaja
                            </span>
                          )}
                        </div>
                        {isNext && <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-emerald-100/70">Vakti Ardhshëm</span>}
                        {isCurrent && <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-slate-500">Aktualisht</span>}
                      </div>
                    </div>

                    <div className="w-14 md:w-16 text-center">
                      <p className={`font-mono font-black text-sm md:text-base tabular-nums ${isNext || isCurrent ? "text-white"
                          : isJumuah ? "text-amber-700"
                            : isPast ? "text-slate-200"
                              : "text-slate-900"
                        }`}>
                        {ne24h(kohe)}
                      </p>
                    </div>

                    <div className="w-20 md:w-24 flex justify-center">
                      {xh ? (
                        <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-center min-w-[55px] md:min-w-[65px] transition-all duration-300 ${isNext
                          ? "bg-white/20 text-white font-black border border-white/20"
                          : isCurrent
                            ? "bg-emerald-500/10 text-emerald-400 font-black"
                            : isJumuah
                              ? "bg-amber-100 text-amber-700 font-black border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 font-black"
                          } ${isPast && !isJumuah ? "opacity-20 grayscale" : ""}`}>
                          <p className="font-mono font-black text-sm md:text-base leading-none tabular-nums">{ne24h(xh)}</p>
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-slate-100 rounded-full opacity-30" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCalendar && (
          <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} onClose={() => setShowCalendar(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
