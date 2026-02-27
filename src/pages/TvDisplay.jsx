import { useEffect, useState, useMemo, useCallback } from 'react';
import vaktet from '../data/vaktet-e-namazit.json';
import site from '../data/site.json';
import haditheData from '../data/hadithe.json';
// TV Components
import Clock from '../components/Tv/Clock';
import NextPrayer from '../components/Tv/NextPrayer';
import PrayerGrid from '../components/Tv/PrayerGrid';
import ActivityBox from '../components/Tv/ActivityBox';
import SettingsModal from '../components/Tv/SettingsModal';
import { HiCog } from 'react-icons/hi';

// Move static helpers outside to reduce component overhead
const PRAYERS = ["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"];
const neMinuta = (ora) => {
    if (!ora) return 0;
    const [h, m] = ora.split(":").map(Number);
    return h * 60 + m;
};

export default function TvDisplay() {
    const [vaktiSot, setVaktiSot] = useState(null);
    const [infoTani, setInfoTani] = useState(null);
    const [currentHadith, setCurrentHadith] = useState(null);
    const [displayMode, setDisplayMode] = useState('hadith');
    const [showSettings, setShowSettings] = useState(false);

    // Live Notification (Stored locally on this TV only)
    const [customMsg, setCustomMsg] = useState(() => localStorage.getItem('tv_custom_msg') || "");

    // Optimized Duration Calculator
    const durations = useMemo(() => {
        const raw = site.tvDurations || { hadith: 2, qr: 1, notification: 10, announcement: 1 };
        return {
            hadith: raw.hadith * 60000,
            qr: raw.qr * 60000,
            notification: raw.notification * 60000,
            announcement: raw.announcement * 60000
        };
    }, []);

    // --- DISPLAY CYCLE CONTROL ---
    useEffect(() => {
        let timeoutId;

        const showHadith = () => {
            setDisplayMode('hadith');
            // If there's a priority message, show hadith for less time to rotate faster
            const duration = customMsg ? Math.min(durations.hadith, 30000) : durations.hadith;
            timeoutId = setTimeout(showQR, duration);
        };

        const showQR = () => {
            if (durations.qr > 0) {
                setDisplayMode('qr');
                const duration = customMsg ? Math.min(durations.qr, 15000) : durations.qr;
                timeoutId = setTimeout(showMsgIfAny, duration);
            } else {
                showMsgIfAny();
            }
        };

        const showMsgIfAny = () => {
            const hasMessage = vaktiSot?.Festat || vaktiSot?.Shenime;
            if (hasMessage && durations.announcement > 0) {
                setDisplayMode('message');
                timeoutId = setTimeout(showCustomIfAny, durations.announcement);
            } else {
                showCustomIfAny();
            }
        };

        const showCustomIfAny = () => {
            if (customMsg && durations.notification > 0) {
                setDisplayMode('custom');
                timeoutId = setTimeout(showHadith, durations.notification);
            } else {
                showHadith();
            }
        };

        showHadith();
        return () => clearTimeout(timeoutId);
    }, [vaktiSot, customMsg, durations]);

    // --- HADITH REFRESH LOGIC ---
    useEffect(() => {
        const refreshMin = site.tvDurations?.hadithRefresh || 60;
        const pickHadith = () => {
            if (haditheData.a?.length) {
                const randomIdx = Math.floor(Math.random() * haditheData.a.length);
                setCurrentHadith(haditheData.a[randomIdx]);
            }
        };
        pickHadith();
        const interval = setInterval(pickHadith, refreshMin * 60000);
        return () => clearInterval(interval);
    }, []);

    // --- MAINTENANCE & STABILITY (STAGGERED) ---
    // This effect ensures the TV browser reloads every night to prevent memory leaks and crashes.
    useEffect(() => {
        let timerId;
        let retryTimerId;

        const scheduleReload = () => {
            const now = new Date();
            const target = new Date();

            // 1. Randomly picks a time between 1:00 AM and 3:59 AM to stagger server load
            const randomHour = Math.floor(Math.random() * 3) + 1;
            const randomMinute = Math.floor(Math.random() * 60);

            target.setHours(randomHour, randomMinute, 0, 0);

            // 2. If it is already past that time today, schedule for tomorrow
            if (now > target) {
                target.setDate(target.getDate() + 1);
            }

            const msUntilTrigger = target.getTime() - now.getTime();

            // 3. Set timer for the reload
            timerId = setTimeout(() => {
                // Only reload if the TV is connected to avoid "No Internet" screen
                if (navigator.onLine) {
                    window.location.reload();
                } else {
                    // If offline, wait 30 mins and check again before reloading
                    retryTimerId = setTimeout(() => {
                        if (navigator.onLine) window.location.reload();
                        else scheduleReload(); // Still offline? Try again next day (or loop)
                    }, 30 * 60000);
                }
            }, msUntilTrigger);
        };

        scheduleReload();

        return () => {
            clearTimeout(timerId);
            clearTimeout(retryTimerId);
        };
    }, []);

    useEffect(() => {
        let wakeLock = null;
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) { }
        };
        requestWakeLock();
        const handleVisibility = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            wakeLock?.release();
        };
    }, []);

    // Remote Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (['s', 'm', 'enter', 'select'].includes(key)) setShowSettings(true);
            if (e.key === 'Escape') setShowSettings(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- PRAYER TIMES CORE LOGIC ---
    useEffect(() => {
        if (!vaktet?.length) return;
        const perditeso = () => {
            const sot = new Date();
            const d = sot.getDate();
            const mStr = sot.toLocaleString("en", { month: "short" });
            const isR = site.ramazan?.active;
            const rreshti = vaktet.find(v => {
                const [vd, vm] = v.Date.split("-");
                return Number(vd) === d && vm === mStr;
            }) ?? vaktet[0];

            // Only update state if the day has changed to avoid resetting the display cycle
            setVaktiSot(prev => (prev?.Date === rreshti.Date ? prev : rreshti));

            const xhemati_inner = (emri) => {
                if (!PRAYERS.includes(emri)) return null;
                if (emri === "Sabahu" && rreshti) {
                    if (isR) return rreshti.Sabahu;
                    if (rreshti.Lindja) {
                        const [h, min] = rreshti.Lindja.split(":").map(Number);
                        const total = h * 60 + min - 40;
                        return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(((total % 60) + 60) % 60).padStart(2, "0")}`;
                    }
                }
                if (emri === "Dreka" && rreshti?.Dreka) {
                    const isDST = (dt) => {
                        const jan = new Date(dt.getFullYear(), 0, 1).getTimezoneOffset();
                        return dt.getTimezoneOffset() < jan;
                    };
                    return isDST(sot) ? "12:55" : "11:55";
                }
                if (emri === "Jacia" && rreshti?.Jacia) {
                    if (isR && site.ramazan?.kohaTeravise && site.ramazan?.kohaTeravise !== "00:00") return site.ramazan.kohaTeravise;
                    return rreshti.Jacia;
                }
                return rreshti?.[emri] ?? null;
            };

            const moments = [];
            const PRAYER_KEYS = isR ? ["Imsaku", ...PRAYERS] : PRAYERS;

            PRAYER_KEYS.forEach(n => {
                if (rreshti[n]) {
                    moments.push({ id: n, kohe: rreshti[n], isXh: false });
                    const xh = xhemati_inner(n);
                    if (xh) moments.push({ id: n, kohe: xh, isXh: true });
                }
            });

            const getL = (id, xh) => {
                const isF = sot.getDay() === 5;
                let base = id;
                if (id === 'Imsaku' && isR) base = "Syfyri (Imsaku)";
                else if (id === 'Dreka' && isF) base = "Xhumaja";
                else if (id === 'Akshami' && isR) base = "Iftari (Akshami)";
                else if (id === 'Jacia' && isR) base = "Teravia (Jacia)";
                return xh ? `ME XHEMAT: ${base}` : base;
            };

            const minTani = sot.getHours() * 60 + sot.getMinutes();
            let nIdx = moments.findIndex(mm => neMinuta(mm.kohe) > minTani);
            let nI;

            if (nIdx === -1) {
                const neser = vaktet[vaktet.findIndex(v => v.Date === rreshti.Date) + 1] ?? vaktet[0];
                nI = { tani: { id: "Jacia", label: getL("Jacia", false) }, ardhshëm: { id: "Sabahu", label: getL("Sabahu", false), kohe: neser.Sabahu, isXh: false }, mbetur: (24 * 60 - minTani) + neMinuta(neser.Sabahu) };
            } else if (nIdx === 0) {
                const idxS = vaktet.findIndex(v => v.Date === rreshti.Date);
                const dje = idxS > 0 ? vaktet[idxS - 1] : vaktet[vaktet.length - 1];
                nI = { tani: { id: "Jacia", label: getL("Jacia", false), kohe: dje.Jacia }, ardhshëm: { ...moments[0], label: getL(moments[0].id, moments[0].isXh) }, mbetur: neMinuta(moments[0].kohe) - minTani };
            } else {
                nI = {
                    tani: { ...moments[nIdx - 1], label: getL(moments[nIdx - 1].id, moments[nIdx - 1].isXh) },
                    ardhshëm: { ...moments[nIdx], label: getL(moments[nIdx].id, moments[nIdx].isXh) },
                    mbetur: neMinuta(moments[nIdx].kohe) - minTani
                };
            }
            setInfoTani(prev => (JSON.stringify(prev) === JSON.stringify(nI) ? prev : nI));
        };
        perditeso();
        const intv = setInterval(perditeso, 10000);
        return () => clearInterval(intv);
    }, []);

    const formatDallim = useCallback((min) => {
        if (min <= 0) return "0m";
        const o = Math.floor(min / 60);
        const m = min % 60;
        let res = "";
        if (o > 0) res += `${o}h `;
        if (m > 0 || o === 0) res += `${m}m`;
        return res.trim();
    }, []);

    const ne24h = useCallback((ora) => {
        if (!ora) return "—";
        const [h, m] = ora.split(":").map(Number);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }, []);

    const xhematiFn = useCallback((emri) => {
        if (!vaktiSot) return null;
        const isR = site.ramazan?.active;
        if (emri === "Sabahu") {
            if (isR) return vaktiSot.Sabahu;
            if (vaktiSot.Lindja) {
                const [h, m] = vaktiSot.Lindja.split(":").map(Number);
                const t = h * 60 + m - 40;
                return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(((t % 60) + 60) % 60).padStart(2, "0")}`;
            }
        }
        if (emri === "Dreka" && vaktiSot?.Dreka) {
            const isDST = (dt) => {
                const jan = new Date(dt.getFullYear(), 0, 1).getTimezoneOffset();
                return dt.getTimezoneOffset() < jan;
            };
            return isDST(new Date()) ? "12:55" : "11:55";
        }
        if (emri === "Jacia" && vaktiSot?.Jacia) {
            if (isR && site.ramazan?.kohaTeravise && site.ramazan?.kohaTeravise !== "00:00") return site.ramazan.kohaTeravise;
            return vaktiSot.Jacia;
        }
        return vaktiSot?.[emri] ?? null;
    }, [vaktiSot]);

    const listaNamazeve = useMemo(() => {
        const isR = site.ramazan?.active;
        const isF = new Date().getDay() === 5;
        const list = [
            { id: "Sabahu", label: "Sabahu" },
            { id: "Dreka", label: isF ? "Xhumaja" : "Dreka" },
            { id: "Ikindia", label: "Ikindia" },
            { id: "Akshami", label: isR ? "Iftari (Akshami)" : "Akshami" },
            { id: "Jacia", label: isR ? "Teravia (Jacia)" : "Jacia" },
        ];
        if (isR) {
            list.unshift({ id: "Imsaku", label: "Syfyri (Imsaku)" });
        }
        return list;
    }, [vaktiSot]);

    if (!vaktiSot) return (
        <div className="h-screen bg-black flex items-center justify-center text-white text-3xl font-black animate-pulse">
            DUKE NGARKUAR...
        </div>
    );

    return (
        <div className="tv-container h-screen bg-black text-white font-sans overflow-hidden flex flex-col p-8 select-none relative"
            style={{ contain: 'strict' }}>

            <style>{`
                body::before { display: none !important; }
                ::-webkit-scrollbar { display: none; }
                @keyframes slide-up { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
                .bg-glow { border-radius: 50%; width: 60%; height: 60%; position: absolute; pointer-events: none; opacity: 0.15; transform: translateZ(0); will-change: opacity; }
                /* Optimized for TV performance: No shadows or filters for maximum stability */
                * { text-rendering: auto; transform: translateZ(0); backface-visibility: hidden; }
                .tv-container { -webkit-font-smoothing: antialiased; }
            `}</style>

            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: 'strict' }}>
                <div className="bg-glow -top-[20%] -left-[20%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
                <div className="bg-glow -bottom-[20%] -right-[20%]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
            </div>

            <button
                onClick={() => setShowSettings(true)}
                className="absolute top-4 right-4 z-[100] p-4 bg-white/5 hover:bg-emerald-600/20 rounded-full text-zinc-600 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer opacity-0 hover:opacity-100 group"
                title="Cilësimet"
            >
                <HiCog className="text-4xl group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <header className="grid grid-cols-3 items-center mb-8 shrink-0" style={{ contain: 'layout style' }}>
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-400 text-4xl font-black tracking-widest uppercase truncate">{site.tvOptions?.adresa || "Kaçanik"}</p>
                    <p className="text-zinc-500 text-3xl font-bold tracking-wide">Imami: <span className="text-zinc-300">{site.global?.imam}</span></p>
                </div>
                <div className="text-center">
                    <h1 className="text-7xl font-black text-emerald-400 tracking-tighter uppercase whitespace-nowrap">{site.tvOptions?.emriXhamis || "Xhamia e Dushkajës"}</h1>
                </div>
                <Clock />
            </header>

            <main className="flex-1 flex flex-col gap-6 min-h-0" style={{ contain: 'layout style paint' }}>
                <div className="flex-[1.2] grid grid-cols-2 gap-8 relative z-10 min-h-0">
                    <NextPrayer infoTani={infoTani} ne24hFn={ne24h} formatDallimFn={formatDallim} />
                    <ActivityBox displayMode={displayMode} customMsg={customMsg} currentHadith={currentHadith} vaktiSot={vaktiSot} />
                </div>
                <PrayerGrid listaNamazeve={listaNamazeve} vaktiSot={vaktiSot} infoTani={infoTani} xhematiFn={xhematiFn} ne24hFn={ne24h} isRamazan={site.ramazan?.active} />
            </main>

            <SettingsModal
                show={showSettings}
                customMsg={customMsg}
                onClose={() => setShowSettings(false)}
                onSave={(msg) => {
                    setCustomMsg(msg);
                    localStorage.setItem('tv_custom_msg', msg);
                    setShowSettings(false);
                }}
            />
        </div>
    );
}
