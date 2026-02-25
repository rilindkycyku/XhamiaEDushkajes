import { useEffect, useState, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { HiCog, HiX } from "react-icons/hi";
import vaktet from '../data/vaktet-e-namazit.json';
import site from '../data/site.json';
import haditheData from '../data/hadithe.json';

const HADITH_UPDATE_INTERVAL = 3600000; // 1 hour in ms

export default function TvDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [vaktiSot, setVaktiSot] = useState(null);
    const [infoTani, setInfoTani] = useState(null);
    const [currentHadith, setCurrentHadith] = useState(null);

    // Optimized time formatter to avoid creating objects every second
    const timeFormatter = useMemo(() => new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }), []);
    const [displayMode, setDisplayMode] = useState('hadith'); // 'hadith', 'message', 'qr', 'custom'
    const [localMessage, setLocalMessage] = useState(localStorage.getItem('tv_custom_msg') || "");
    const [showSettings, setShowSettings] = useState(false);
    const [tempMessage, setTempMessage] = useState(localMessage);

    // Updated Display Cycle: 
    // If localMessage exists: Custom(10min) -> Hadith(2min) -> QR(1min) -> Shenime(1min)
    // Else: Hadith(10min) -> QR(1min) -> Shenime(1min)
    useEffect(() => {
        let timeoutId;

        const showCustom = () => {
            if (localMessage) {
                setDisplayMode('custom');
                timeoutId = setTimeout(showHadith, 600000); // 10 minutes
            } else {
                showHadith();
            }
        };

        const showHadith = () => {
            setDisplayMode('hadith');
            const duration = localMessage ? 120000 : 600000; // 2 min if custom exists, else 10 min
            timeoutId = setTimeout(showQR, duration);
        };

        const showQR = () => {
            setDisplayMode('qr');
            timeoutId = setTimeout(showMsgIfAny, 60000); // 1 minute
        };

        const showMsgIfAny = () => {
            const hasMessage = vaktiSot?.Festat || vaktiSot?.Shenime;
            if (hasMessage) {
                setDisplayMode('message');
                timeoutId = setTimeout(localMessage ? showCustom : showHadith, 60000); // 1 minute
            } else {
                if (localMessage) showCustom(); else showHadith();
            }
        };

        if (localMessage) showCustom(); else showHadith();

        return () => clearTimeout(timeoutId);
    }, [vaktiSot, localMessage]);

    // Handle Keyboard Input on TV (Press 'S' or 'M' to open settings)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'm') {
                setShowSettings(true);
            }
            if (e.key === 'Escape') {
                setShowSettings(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const saveSettings = () => {
        setLocalMessage(tempMessage);
        localStorage.setItem('tv_custom_msg', tempMessage);
        setShowSettings(false);
    };

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Hadith Update Logic (Every 1 Hour)
    useEffect(() => {
        const pickHadith = () => {
            if (haditheData.a?.length) {
                const randomIndex = Math.floor(Math.random() * haditheData.a.length);
                setCurrentHadith(haditheData.a[randomIndex]);
            }
        };

        pickHadith(); // Initial pick
        const interval = setInterval(pickHadith, HADITH_UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // Update prayer times logic
    useEffect(() => {
        if (!Array.isArray(vaktet) || vaktet.length === 0) return;

        const perditeso = () => {
            const sot = new Date();
            const dite = sot.getDate();
            const muajiSot = sot.toLocaleString("en", { month: "short" });

            const rreshti = vaktet.find((v) => {
                const [d, m] = v.Date.split("-");
                return Number(d) === dite && m === muajiSot;
            }) ?? vaktet[0];

            setVaktiSot(rreshti);

            const neMinuta = (ora) => {
                if (!ora) return 0;
                const [h, m] = ora.split(":").map(Number);
                return h * 60 + m;
            };

            const xhemati = (emri) => {
                if (!["Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"].includes(emri)) return null;
                if (emri === "Sabahu" && rreshti) {
                    if (site.ramazan?.active) return rreshti.Sabahu;
                    if (rreshti.Lindja) {
                        const [h, m] = rreshti.Lindja.split(":").map(Number);
                        const total = h * 60 + m - 40;
                        const o = Math.floor(total / 60);
                        const min = ((total % 60) + 60) % 60;
                        return `${String(o).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
                    }
                }
                if (emri === "Dreka" && rreshti?.Dreka) {
                    const eshteXhuma = new Date().getDay() === 5;
                    const [h, m] = rreshti.Dreka.split(":").map(Number);
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
                return rreshti?.[emri] ?? null;
            };

            const getLabel = (id) => {
                if (id === 'Imsaku' && site.ramazan?.active) return "Syfyri (Imsaku)";
                if (id === 'Akshami' && site.ramazan?.active) return "Iftari (Akshami)";
                if (id === 'Jacia' && site.ramazan?.active) return "Teravia (Jacia)";
                return id;
            };

            const moments = [];
            const namazet = ["Imsaku", "Sabahu", "Dreka", "Ikindia", "Akshami", "Jacia"];

            namazet.forEach(n => {
                if (rreshti[n]) {
                    moments.push({ id: n, label: getLabel(n), kohe: rreshti[n] });
                    const xh = xhemati(n);
                    if (xh) moments.push({ id: n, label: `${n} (xhemat)`, kohe: xh });
                }
            });

            const tani = new Date();
            const minTani = tani.getHours() * 60 + tani.getMinutes();
            let nextIdx = moments.findIndex((m) => neMinuta(m.kohe) > minTani);

            // Case: End of Day (After last moment) -> Next is Tomorrow Sabahu
            if (nextIdx === -1) {
                const idxSot = vaktet.findIndex((v) => v.Date === rreshti.Date);
                const neser = vaktet[idxSot + 1] ?? vaktet[0];
                const nextSabahu = neser.Sabahu;

                setInfoTani({
                    tani: { id: "Jacia", label: "Jacia" },
                    ardhshëm: { id: "Sabahu", label: "Sabahu", kohe: nextSabahu },
                    mbetur: (24 * 60 - minTani) + neMinuta(nextSabahu),
                });
                return;
            }

            // Case: Start of Day (Before Imsaku) -> Current is Last Night's Jacia
            if (nextIdx === 0) {
                // Get yesterday's data to find Jacia time
                const idxSot = vaktet.findIndex((v) => v.Date === rreshti.Date);
                const dje = idxSot > 0 ? vaktet[idxSot - 1] : vaktet[vaktet.length - 1];
                const djeJacia = dje.Jacia;

                const nextMoment = moments[0]; // Imsaku

                setInfoTani({
                    tani: { id: "Jacia", label: "Jacia", kohe: djeJacia },
                    ardhshëm: nextMoment,
                    mbetur: neMinuta(nextMoment.kohe) - minTani,
                });
                return;
            }

            // Normal Case
            const currentMoment = moments[nextIdx - 1];
            const nextMoment = moments[nextIdx];
            setInfoTani({
                tani: currentMoment,
                ardhshëm: nextMoment,
                mbetur: neMinuta(nextMoment.kohe) - minTani,
            });
        };

        perditeso();
        const interval = setInterval(perditeso, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatDallim = (min) => {
        if (min <= 0) return "0m";
        const o = Math.floor(min / 60);
        const m = min % 60;

        let result = "";
        if (o > 0) {
            result += `${o} ${o === 1 ? 'orë' : 'orë'}`;
            if (m > 0) result += " e ";
        }
        if (m > 0) {
            result += `${m} ${m === 1 ? 'minut' : 'minuta'}`;
        }

        return result || "0 minut";
    };

    const ne24h = (ora24) => {
        if (!ora24) return "—";
        const [h, m] = ora24.split(":").map(Number);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const xhemati = (emri) => {
        if (!vaktiSot) return null;
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

    const listaNamazeve = useMemo(() => [
        { id: "Imsaku", label: site.ramazan?.active ? "Syfyri (Imsaku)" : "Imsaku" },
        { id: "Sabahu", label: "Sabahu" },
        { id: "Dreka", label: "Dreka" },
        { id: "Ikindia", label: "Ikindia" },
        { id: "Akshami", label: site.ramazan?.active ? "Iftari (Akshami)" : "Akshami" },
        { id: "Jacia", label: site.ramazan?.active ? "Teravia (Jacia)" : "Jacia" },
    ], []);

    const hijriDate = useMemo(() => {
        try {
            // Subtract 1 day for proper moon sighting adjustment in Kosovo
            const adjustedDate = new Date(currentTime);
            adjustedDate.setDate(adjustedDate.getDate() - 1);

            // Use 'numeric' for parts to avoid translation and era issues (like "bc" on Safari)
            // We try 'u-ca-islamic-umalqura' first, then fallback to 'u-ca-islamic'
            let parts;
            try {
                parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                }).formatToParts(adjustedDate);
            } catch (e) {
                parts = new Intl.DateTimeFormat('en-u-ca-islamic', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                }).formatToParts(adjustedDate);
            }

            const d = parts.find(p => p.type === 'day')?.value;
            const m = parts.find(p => p.type === 'month')?.value;
            let y = parts.find(p => p.type === 'year')?.value;

            // Clean year from any era suffixes (like "AH" or "bc")
            if (y) {
                y = y.replace(/[^0-9]/g, '');
            }

            const monthNames = [
                "Muharrem", "Safer", "Rebiul Evel", "Rebiul Ahir",
                "Xhumadel Ula", "Xhumadel Ahire", "Rexhep", "Shaban",
                "Ramazan", "Sheval", "Dhul Kade", "Dhul Hixhe"
            ];

            const monthIndex = parseInt(m) - 1;
            const albanianMonth = monthNames[monthIndex] || "";

            return `${d} ${albanianMonth} ${y}`;
        } catch (e) {
            return "";
        }
    }, [currentTime]);

    if (!vaktiSot) return <div className="h-screen bg-black flex items-center justify-center text-white">Duke ngarkuar...</div>;

    return (
        <div className="tv-container h-screen bg-black text-white font-sans overflow-hidden flex flex-col p-10 select-none relative">
            <style>
                {`
                    body::before { display: none !important; }
                    ::-webkit-scrollbar { display: none; }
                    
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(0.99); }
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        will-change: transform, opacity;
                    }

                    .bg-glow {
                        will-change: transform;
                    }
                `}
            </style>

            {/* Background Ambient Glow (Ultra-light gradients for TV) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
            </div>

            {/* Settings Trigger (Top-right or press 'S') */}
            <button
                onClick={() => setShowSettings(true)}
                className="absolute top-0 right-0 w-32 h-32 flex items-start justify-end p-6 bg-transparent opacity-0 hover:opacity-100 transition-opacity z-[100] cursor-pointer"
                title="Settings"
            >
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                    <HiCog className="text-2xl text-zinc-400" />
                </div>
            </button>

            <header className="grid grid-cols-3 items-center mb-8 shrink-0" style={{ contain: 'layout' }}>
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-400 text-5xl font-black tracking-widest uppercase mb-1">
                        {site.tvOptions?.adresa || "Kaçanik"}
                    </p>
                    <p className="text-zinc-500 text-4xl font-bold tracking-wide">
                        Imami: <span className="text-zinc-300">{site.global?.imam}</span>
                    </p>
                </div>

                <div className="text-center flex flex-col items-center justify-center">
                    <h1 className="text-7xl font-black text-emerald-400 tracking-tighter uppercase whitespace-nowrap">
                        {site.tvOptions?.emriXhamis || "Xhamia e Dushkajës"}
                    </h1>
                </div>

                <div className="text-right flex flex-col items-end" style={{ isolation: 'isolate', contain: 'layout' }}>
                    <div className="flex items-baseline text-7xl font-black tabular-nums tracking-tight leading-none mb-1 text-white">
                        <span>
                            {timeFormatter.format(currentTime)}
                        </span>
                        <span className="text-4xl text-zinc-500 font-bold w-[70px] text-center inline-block border-l-2 border-zinc-800/50 ml-4 font-mono">
                            {currentTime.getSeconds().toString().padStart(2, '0')}
                        </span>
                    </div>
                    <div className="text-emerald-400 text-2xl font-medium tracking-wide uppercase">
                        {(() => {
                            const days = ['E Diele', 'E Hëne', 'E Marte', 'E Mërkure', 'E Enjte', 'E Premte', 'E Shtune'];
                            const months = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
                            const dayName = days[currentTime.getDay()];
                            const day = currentTime.getDate();
                            const monthName = months[currentTime.getMonth()];
                            const year = currentTime.getFullYear();
                            return `${dayName}, ${day} ${monthName} ${year}`;
                        })()}
                    </div>
                    <div className="text-emerald-600 text-xl font-medium tracking-wider uppercase mt-1">
                        {hijriDate}
                    </div>
                </div>
            </header>

            {/* Main Content Sections */}
            <main className="flex-1 flex flex-col gap-6 min-h-0">

                {/* Top Row: Next Prayer & Hadith Side-by-Side */}
                <div className="flex-[1.1] grid grid-cols-2 gap-8 relative z-10 min-h-0" style={{ contain: 'layout' }}>

                    {/* Next Prayer Card - Optimized for TV GPU */}
                    <div className="bg-zinc-900 border-2 border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden flex flex-col justify-center">
                        {infoTani?.ardhshëm ? (
                            <div className="relative z-10 w-full">
                                <div className="flex justify-between items-start mb-8 w-full">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-emerald-500 font-black uppercase tracking-[0.4em] text-xl">
                                                Vakti i radhës
                                            </p>
                                        </div>
                                        <h2 className="text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-none">
                                            {infoTani.ardhshëm.label.split(' ')[0]}
                                        </h2>
                                        {infoTani.ardhshëm.label.includes('(') && (
                                            <p className="text-3xl text-emerald-500/80 font-black mt-2 uppercase tracking-widest">
                                                {infoTani.ardhshëm.label.split('(')[1].replace(')', '')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-emerald-500 text-black px-10 py-8 rounded-[3rem] font-mono text-6xl lg:text-7xl font-black border-4 border-emerald-400/30">
                                        {ne24h(infoTani.ardhshëm.kohe)}
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-zinc-800 via-zinc-800 to-transparent mb-8" />

                                <div className="flex flex-col">
                                    <p className="text-zinc-500 text-sm uppercase font-black tracking-widest mb-6 flex items-center gap-4">
                                        Koha e mbetur
                                        <span className="flex-1 h-px bg-zinc-800/50" />
                                    </p>
                                    <div className={`text-6xl lg:text-7xl xl:text-8xl font-black tabular-nums tracking-tighter italic leading-none whitespace-nowrap ${infoTani.mbetur <= 15 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                                        {formatDallim(infoTani.mbetur)}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-zinc-500 animate-pulse text-2xl font-black uppercase tracking-widest">Duke u përditësuar...</p>
                            </div>
                        )}
                    </div>

                    {/* Hadith / Info / QR Card - Flat borders for better performance */}
                    <div className="bg-zinc-900 border-2 border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden flex flex-col items-center justify-center transition-all duration-700">
                        {displayMode === 'qr' ? (
                            <div className="flex flex-row items-center gap-16 w-full h-full justify-center px-10">
                                <div className="p-5 bg-white rounded-[2rem] shrink-0">
                                    <QRCodeCanvas
                                        value={site.tvOptions?.qrUrl || site.socials?.facebook}
                                        size={410}
                                        level="L"
                                        style={{
                                            display: 'block',
                                            imageRendering: 'pixelated'
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col items-start gap-6 text-left">
                                    <div className="flex flex-col">
                                        <p className="text-emerald-400 uppercase tracking-[0.5em] text-3xl font-black leading-tight">
                                            SKANO FAQEN
                                        </p>
                                        <p className="text-zinc-500 uppercase tracking-[0.2em] text-sm font-bold mt-2">
                                            Për më shumë informata
                                        </p>
                                    </div>

                                    <div className="h-px w-32 bg-zinc-800" />

                                    <div className="flex flex-col">
                                        <p className="text-zinc-400 text-4xl font-black tracking-tighter opacity-80 break-all max-w-[400px] leading-tight italic">
                                            {site.tvOptions?.qrUrl?.replace('https://', '')?.replace('www.', '') || "xhamiaedushkajes.org"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-full mb-6 opacity-50">
                                    <p className="text-zinc-500 uppercase tracking-widest text-sm font-black text-center">
                                        {displayMode === 'message' ? "Shënim / Festë" :
                                            displayMode === 'custom' ? "Njoftim i Rëndësishëm" : "Hadith / Ajet"}
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {displayMode === 'custom' ? (
                                        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
                                            <h3 className="text-5xl lg:text-6xl font-black text-emerald-400 leading-tight mb-8">
                                                Njoftim
                                            </h3>
                                            <p className="text-3xl lg:text-5xl text-white font-bold leading-relaxed px-4">
                                                {localMessage}
                                            </p>
                                        </div>
                                    ) : displayMode === 'message' ? (
                                        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
                                            {vaktiSot.Festat && (
                                                <div className="mb-6">
                                                    <div className="text-emerald-400 font-bold uppercase tracking-widest text-lg mb-2 opacity-80">Festa</div>
                                                    <h3 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                                                        {vaktiSot.Festat}
                                                    </h3>
                                                </div>
                                            )}
                                            {vaktiSot.Shenime && (
                                                <div>
                                                    {vaktiSot.Festat && <div className="w-16 h-px bg-white/10 mx-auto my-6" />}
                                                    <p className="text-3xl lg:text-5xl text-zinc-300 italic serif leading-relaxed px-4">
                                                        "{vaktiSot.Shenime}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : currentHadith ? (
                                        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
                                            {currentHadith.entryText && (
                                                <p className="text-zinc-400 text-2xl mb-4 italic">
                                                    {currentHadith.entryText}
                                                </p>
                                            )}
                                            <h3 className="text-3xl lg:text-4xl leading-relaxed italic font-bold text-white mb-8 line-clamp-5">
                                                "{currentHadith.textContent}"
                                            </h3>
                                            <div className="w-16 h-1.5 bg-emerald-500 rounded-full mb-4 shrink-0" />
                                            <p className="text-emerald-400 font-black text-3xl">
                                                {currentHadith.reference}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-4">
                                            <h3 className="text-4xl font-bold text-white">{site.global?.emriXhamis}</h3>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div >

                {/* Bottom Row: Timetable Grid */}
                <div className="flex-1 min-h-0 relative z-10">
                    <div className="bg-black/40 rounded-[3.5rem] p-6 border border-white/5 shadow-2xl h-full flex flex-col justify-center">
                        <div className="grid grid-cols-6 gap-3 h-full">
                            {listaNamazeve.map(({ id, label }) => {
                                const kohe = vaktiSot[id];
                                const xh = !['Imsaku', 'Lindja'].includes(id) ? xhemati(id) : null;

                                const isCurrent = infoTani?.tani?.id === id;
                                const isNext = infoTani?.ardhshëm?.id === id;
                                const isFriday = new Date().getDay() === 5;
                                const isJumuah = isFriday && id === 'Dreka';

                                return (
                                    <div
                                        key={id}
                                        className={`flex flex-col rounded-[3rem] px-2 py-6 items-center justify-between border-2 transition-all duration-500 relative overflow-hidden group ${isCurrent ? 'bg-emerald-600 border-white/60 z-10' :
                                            isNext ? 'bg-zinc-800/80 border-emerald-500' :
                                                isJumuah ? 'bg-amber-900/20 border-amber-500/30' :
                                                    'bg-black/40 border-white/5'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`text-2xl font-black uppercase tracking-[0.1em] transform group-hover:translate-y-[-2px] transition-transform text-center leading-tight ${isCurrent ? 'text-white' :
                                                isJumuah ? 'text-amber-400' : 'text-zinc-500'
                                                }`}>
                                                {label.split(' (')[0]}
                                            </div>
                                            {label.includes('(') && (
                                                <div className={`text-xs font-bold uppercase tracking-widest opacity-60 ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>
                                                    {label.split('(')[1].replace(')', '')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center gap-1 py-2">
                                            <div className={`text-7xl font-black font-mono tracking-tighter whitespace-nowrap ${isCurrent ? 'text-white' :
                                                isJumuah ? 'text-amber-400' : 'text-white'
                                                }`}>
                                                {ne24h(kohe)}
                                            </div>
                                            {isJumuah && !isCurrent && <span className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg">Xhumaja</span>}
                                        </div>

                                        <div className="w-full relative px-2">
                                            <div className={`text-[11px] font-black uppercase tracking-[0.2em] text-center mb-3 ${isCurrent ? 'text-white/70' : 'text-zinc-500'
                                                }`}>
                                                Me Xhemat
                                            </div>
                                            <div className={`w-full py-5 rounded-[2.5rem] font-mono text-5xl font-black text-center shadow-inner transition-colors whitespace-nowrap ${isCurrent ? 'bg-white text-emerald-950 shadow-2xl' :
                                                isJumuah ? 'bg-amber-500 text-black' :
                                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                {xh ? ne24h(xh) : "—"}
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </main>

            {/* Settings Modal */}
            {showSettings && (
                <div className="settings-modal fixed inset-0 z-[200] flex items-center justify-center p-12 bg-black/95 animate-in fade-in duration-300">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] w-full max-w-5xl p-12 shadow-2xl scale-in-center overflow-hidden relative">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-5xl font-black text-white">Konfigurimi i TV-së</h2>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="p-4 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            >
                                <HiX className="text-5xl text-zinc-500" />
                            </button>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <label className="block text-emerald-500 uppercase tracking-[0.4em] text-2xl font-black mb-8">
                                    Njoftim Special për TV
                                </label>
                                <textarea
                                    value={tempMessage}
                                    onChange={(e) => setTempMessage(e.target.value)}
                                    placeholder="Shkruani njoftimin këtu... (Shembull: Sot pas namazit të drekës ka ligjëratë)"
                                    className="w-full h-96 bg-black/60 border-2 border-zinc-800 rounded-[2.5rem] p-12 text-white text-4xl font-bold focus:border-emerald-500 focus:bg-black transition-all outline-none resize-none shadow-inner"
                                />
                                <div className="flex items-center gap-4 mt-8 text-zinc-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-2xl font-medium tracking-tight">
                                        Ky mesazh do të shfaqet në ekranin kryesor për 10 minuta.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 pt-4">
                                <button
                                    onClick={saveSettings}
                                    className="py-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] font-black text-4xl transition-all cursor-pointer shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 active:scale-95"
                                >
                                    RUAJ NDRYSHIMET
                                </button>
                                <button
                                    onClick={() => { setTempMessage(""); }}
                                    className="py-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-[2.5rem] font-black text-4xl transition-all cursor-pointer flex items-center justify-center gap-4 active:scale-95 border-2 border-zinc-700"
                                >
                                    FSHI MESAZHIN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
