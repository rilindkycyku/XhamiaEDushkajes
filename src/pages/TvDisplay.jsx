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
    const [scale, setScale] = useState(1);

    // Optimized Scaling Logic to fit any screen
    useEffect(() => {
        const handleResize = () => {
            const targetWidth = 1920;
            const targetHeight = 1080;
            const widthScale = window.innerWidth / targetWidth;
            const heightScale = window.innerHeight / targetHeight;
            // Use the smaller scale factor to ensure everything fits (letterboxing if aspect ratio differs)
            setScale(Math.min(widthScale, heightScale));
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            const shouldShow = site.tvOptions?.showQr !== false;
            if (shouldShow && durations.qr > 0) {
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
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');

                    // Listen for when the lock is released by the system
                    wakeLock.addEventListener('release', () => {
                        // Only re-request if the page is still visible
                        if (document.visibilityState === 'visible') requestWakeLock();
                    });
                }
            } catch (err) { }
        };

        requestWakeLock();

        // 1. Re-request if the screen becomes visible again (e.g. browser minimized/restored)
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
            if (key === 'r') window.location.reload();
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

            // Update state if data has changed (even on the same day)
            setVaktiSot(prev => (JSON.stringify(prev) === JSON.stringify(rreshti) ? prev : rreshti));

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
                    const now = new Date();
                    // Automatically switch between 12:55 (DST) and 11:55 (Standard Time)
                    const isDST = now.getTimezoneOffset() < new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
                    return isDST ? "12:55" : "11:55";
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
                let tani = { ...moments[nIdx - 1], label: getL(moments[nIdx - 1].id, moments[nIdx - 1].isXh) };

                // If it's past Sunrise (Lindja), Sabahu is no longer "current"
                if (tani.id === "Sabahu" && rreshti.Lindja && minTani >= neMinuta(rreshti.Lindja)) {
                    tani = { id: "Lindja", label: "Lindja e Diellit", kohe: rreshti.Lindja };
                }

                nI = {
                    tani: tani,
                    ardhshëm: { ...moments[nIdx], label: getL(moments[nIdx].id, moments[nIdx].isXh) },
                    mbetur: neMinuta(moments[nIdx].kohe) - minTani
                };
            }
            // Fix Silence Mode logic:
            // 1. Up to 5 minutes BEFORE the next prayer
            // 2. Up to 2 minutes AFTER the prayer that just started (tani)
            const diffA = nI.ardhshëm ? neMinuta(nI.ardhshëm.kohe) - minTani : 999;
            const diffT = nI.tani?.kohe ? minTani - neMinuta(nI.tani.kohe) : 999;

            const isSilenceMode = (diffA <= 5 && diffA >= 0) || (diffT >= 0 && diffT <= 2);

            setInfoTani(prev => {
                const updated = { ...nI, isSilenceMode };
                return JSON.stringify(prev) === JSON.stringify(updated) ? prev : updated;
            });
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
        <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
            <div className="tv-container bg-black text-white font-sans overflow-hidden flex flex-col px-8 pt-1 pb-4 select-none relative"
                style={{
                    width: '1920px',
                    height: '1080px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    flexShrink: 0,
                    contain: 'strict'
                }}>

                <style>{`
                    body::before { display: none !important; }
                    ::-webkit-scrollbar { display: none; }
                    @keyframes slide-up { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
                    .bg-glow { border-radius: 50%; width: 60%; height: 60%; position: absolute; pointer-events: none; opacity: 0.15; transform: translateZ(0); will-change: opacity; }
                     /* Optimized for TV performance: Apply acceleration only to the main container */
                     .tv-container { -webkit-font-smoothing: antialiased; transform: translateZ(0); backface-visibility: hidden; }
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

                <header className="grid grid-cols-3 items-center mb-2 shrink-0" style={{ contain: 'layout style' }}>
                    <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-4xl font-black tracking-widest uppercase truncate">{site.tvOptions?.adresa || "Kaçanik"}</p>
                        <p className="text-zinc-500 text-3xl font-bold tracking-wide">Imami: <span className="text-zinc-300">{site.global?.imam}</span></p>
                    </div>
                    <div className="text-center">
                        <h1 className="text-7xl font-black text-emerald-400 tracking-tighter uppercase whitespace-nowrap">{site.tvOptions?.emriXhamis || "Xhamia e Dushkajës"}</h1>
                    </div>
                    <Clock />
                </header>

                <main className="flex-1 flex flex-col gap-4 min-h-0" style={{ contain: 'layout style paint' }}>
                    <div className="flex-[1.4] grid grid-cols-2 gap-8 relative z-10 min-h-0">
                        <NextPrayer infoTani={infoTani} ne24hFn={ne24h} formatDallimFn={formatDallim} />
                        <ActivityBox displayMode={displayMode} customMsg={customMsg} currentHadith={currentHadith} vaktiSot={vaktiSot} infoTani={infoTani} />
                    </div>
                    <PrayerGrid listaNamazeve={listaNamazeve} vaktiSot={vaktiSot} infoTani={infoTani} xhematiFn={xhematiFn} ne24hFn={ne24h} isRamazan={site.ramazan?.active} />
                </main>

                <footer className="mt-2 px-8 shrink-0">
                    <div className="w-full h-12 flex justify-between items-center bg-black/40 px-12 rounded-full border border-white/10 text-zinc-400 font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-sm font-black">
                            © {new Date().getFullYear()} - Zhvilluar nga: <span className="text-emerald-500">Rilind Kyçyku</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm opacity-80 font-black">
                            <span>www.rilindkycyku.dev</span>
                        </div>
                    </div>
                </footer>

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
        </div>
    );
}
