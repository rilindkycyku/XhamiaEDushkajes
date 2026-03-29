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
    const [isNightDimmed, setIsNightDimmed] = useState(false);
    const [nextHadith, setNextHadith] = useState(null);

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
        const d = site.tvDurations || {};
        return {
            hadith: (d.hadith ?? 5) * 60000,
            qr: (d.qr ?? 1) * 60000,
            notification: (d.notification ?? 10) * 60000,
            announcement: (d.announcement ?? 1) * 60000
        };
    }, []);

    // --- DISPLAY CYCLE CONTROL ---
    useEffect(() => {
        let timeoutId;

        const showHadith = () => {
            setDisplayMode('hadith');
            // Seamless Hadith Refresh: If we have a queued hadith, swap it now while rotation is happening
            if (nextHadith) {
                setCurrentHadith(nextHadith);
                setNextHadith(null);
            }
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
        const refreshMin = site.tvDurations?.hadithRefresh ?? 45;
        const pickHadith = () => {
            if (haditheData.a?.length) {
                const chosen = haditheData.a[Math.floor(Math.random() * haditheData.a.length)];
                setCurrentHadith(prev => prev ? (setNextHadith(chosen), prev) : chosen);
            }
        };
        pickHadith();
        const interval = setInterval(pickHadith, refreshMin * 60000);
        return () => clearInterval(interval);
    // Only re-run if refresh interval changes — not on every hadith change
    }, []);

    // --- BURN-IN PROTECTION: Night dimming only (pixel shift is a CSS animation in index.css) ---
    useEffect(() => {
        const checkDim = () => {
            const now = new Date();
            const minTani = now.getHours() * 60 + now.getMinutes();

            // Night Dimming: dims 30 minutes after Jacia until 10m before Sabahu
            let dimStart = 23 * 60;
            let dimEnd = 4 * 60;

            if (vaktiSot) {
                const isR = site.ramazan?.active;
                const jaciaTime = (isR && site.ramazan?.kohaTeravise && site.ramazan?.kohaTeravise !== "00:00")
                    ? site.ramazan.kohaTeravise
                    : vaktiSot.Jacia;
                if (jaciaTime) dimStart = neMinuta(jaciaTime) + 30;
                if (vaktiSot.Sabahu) dimEnd = neMinuta(vaktiSot.Sabahu) - 10;
            }

            setIsNightDimmed(minTani >= dimStart || minTani < dimEnd);
        };

        checkDim();
        const interval = setInterval(checkDim, 60000);
        return () => clearInterval(interval);
    }, [vaktiSot]);

    // --- MAINTENANCE & STABILITY (STAGGERED) ---
    // This effect ensures the TV browser reloads every night to prevent memory leaks and crashes.
    useEffect(() => {
        let timerId;
        let retryTimerId;

        const scheduleReload = () => {
            const now = new Date();
            const nightTarget = new Date();
            const morningTarget = new Date();

            // 1. Night Reload (01:00 - 03:59) - For memory/stability
            nightTarget.setHours(Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 60), 0, 0);
            if (now > nightTarget) nightTarget.setDate(nightTarget.getDate() + 1);

            // 2. Daytime Reload (10:00 - 17:00) - Random sync during daylight hours
            morningTarget.setHours(Math.floor(Math.random() * 8) + 10, Math.floor(Math.random() * 60), 0, 0);
            if (now > morningTarget) morningTarget.setDate(morningTarget.getDate() + 1);

            // Pick whichever happens sooner
            const nextTarget = nightTarget < morningTarget ? nightTarget : morningTarget;
            const msUntilTrigger = nextTarget.getTime() - now.getTime();

            timerId = setTimeout(() => {
                if (navigator.onLine) {
                    window.location.reload();
                } else {
                    retryTimerId = setTimeout(() => {
                        if (navigator.onLine) window.location.reload();
                        else scheduleReload();
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
                    const xh = xhemati_inner(n);

                    // LOGIC: Skip raw astronomical Dreka to prioritize the mosque fixed time (11:55/12:55)
                    const skipRawDreka = (n === "Dreka");
                    // LOGIC: Skip raw astronomical Sabahu (Imsak/Adhan target) to point the countdown directly to the congregation time
                    const skipRawSabahu = (n === "Sabahu" && xh && xh !== rreshti[n]);
                    // In Ramazan, skip the raw Jacia (Adhan) time to prioritize Teravia (if configured)
                    const skipRawJacia = (n === "Jacia" && isR && site.ramazan?.kohaTeravise && site.ramazan?.kohaTeravise !== "00:00");

                    if (!skipRawDreka && !skipRawJacia && !skipRawSabahu) {
                        moments.push({ id: n, kohe: rreshti[n], isXh: false });
                    }

                    if (xh) {
                        // Avoid adding duplicate entries if the xhemat time is identical to the vakti time
                        // unless we skipped the raw time, in which case we definitely need the xhemat entry.
                        if (xh !== rreshti[n] || skipRawJacia || skipRawSabahu) {
                            moments.push({ id: n, kohe: xh, isXh: true });
                        }
                    }
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
                const isR = site.ramazan?.active;
                const hasNN = isR && site.ramazan?.namazNate?.active;
                
                let tomId, tomK, isXh;
                if (hasNN) {
                    tomId = "NamazNate";
                    tomK = site.ramazan?.namazNate?.koha || "00:30";
                    isXh = true;
                } else if (isR) {
                    tomId = "Imsaku";
                    tomK = neser.Imsaku;
                    isXh = false;
                } else {
                    tomId = "Sabahu";
                    isXh = true;
                    if (neser.Lindja) {
                        const [h, min] = neser.Lindja.split(":").map(Number);
                        const total = h * 60 + min - 40;
                        tomK = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(((total % 60) + 60) % 60).padStart(2, "0")}`;
                    } else {
                        tomK = neser.Sabahu;
                    }
                }

                nI = { 
                    tani: { id: "Jacia", label: getL("Jacia", false) }, 
                    ardhshëm: { id: tomId, label: getL(tomId, isXh), kohe: tomK, isXh: isXh }, 
                    mbetur: (24 * 60 - minTani) + neMinuta(tomK) 
                };
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
        <div className="fixed top-0 left-0 w-full h-full bg-black z-[50] overflow-hidden">
            <div className="tv-container bg-black text-white font-sans overflow-hidden flex flex-col p-1 select-none"
                style={{
                    width: '1920px',
                    height: '1080px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${Math.max(0.01, scale)})`,
                    transformOrigin: 'center center',
                    flexShrink: 0,
                    contain: 'strict'
                }}>


                {isNightDimmed && <div className="dimmed-overlay" style={{ opacity: 0.6 }} />}

                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
                    <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', willChange: 'transform' }} />
                    <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', willChange: 'transform' }} />
                </div>

                <header className="mb-2 shrink-0 relative z-20">
                    <div className="flex justify-between items-center w-full px-10">
                        {/* Left Column: Location & Personnel */}
                        <div className="flex flex-col gap-0 flex-1 min-w-0">
                            <p className="text-zinc-500 text-4xl font-black tracking-wider uppercase whitespace-nowrap overflow-visible">{site.tvOptions?.adresa || "Kaçanik"}</p>
                            <p className="text-zinc-600 text-2xl font-bold tracking-tight uppercase">
                                Imami: <span className="text-zinc-400 font-black">{site.global?.imam}</span>
                            </p>

                            <button
                                onClick={() => setShowSettings(true)}
                                className="flex items-center gap-4 px-8 py-3 w-fit rounded-[1.5rem] bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 group mt-1 shadow-2xl backdrop-blur-xl -ml-2"
                            >
                                <HiCog className="text-4xl text-zinc-600 group-hover:text-emerald-400 group-hover:rotate-180 transition-all duration-700" />
                                <span className="text-xl font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-emerald-400">Konfiguro</span>
                            </button>
                        </div>

                        {/* Center Column: Mosque Brand */}
                        <div className="flex-[2] flex justify-center px-0">
                            <h1 className={`font-black text-emerald-500 tracking-tighter uppercase text-center leading-[0.8] whitespace-nowrap ${(site.tvOptions?.emriXhamis || "").length > 20 ? 'text-5xl' : 'text-7xl'
                                }`}>
                                {site.tvOptions?.emriXhamis}
                            </h1>
                        </div>

                        {/* Right Column: Time & Calendar */}
                        <div className="flex-1 flex justify-end">
                            <Clock />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col gap-2 min-h-0" style={{ contain: 'layout style paint' }}>
                    <div className="flex-[1.4] grid grid-cols-2 gap-2 relative z-10 min-h-0">
                        <NextPrayer infoTani={infoTani} ne24hFn={ne24h} formatDallimFn={formatDallim} />
                        <ActivityBox displayMode={displayMode} customMsg={customMsg} currentHadith={currentHadith} vaktiSot={vaktiSot} infoTani={infoTani} />
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
        </div>
    );
}
