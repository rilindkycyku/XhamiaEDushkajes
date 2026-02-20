import { useEffect, useState, useMemo } from 'react';
import QRCode from "react-qr-code";
import vaktet from '../data/vaktet-e-namazit.json';
import site from '../data/site.json';
import haditheData from '../data/hadithe.json';

const HADITH_UPDATE_INTERVAL = 3600000; // 1 hour in ms

export default function TvDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [vaktiSot, setVaktiSot] = useState(null);
    const [infoTani, setInfoTani] = useState(null);
    const [currentHadith, setCurrentHadith] = useState(null);
    const [showMesazh, setShowMesazh] = useState(false);

    // Initial cycle: Start with Hadith (10min), then Message (1min)
    useEffect(() => {
        let timeoutId;

        const showHadith = () => {
            setShowMesazh(false); // Show Hadith
            // Wait 10 mins before showing Message
            timeoutId = setTimeout(showMsg, 600000);
        };

        const showMsg = () => {
            setShowMesazh(true); // Show Message
            // Wait 1 min before returning to Hadith
            timeoutId = setTimeout(showHadith, 60000);
        };

        // Start cycle
        showHadith();

        return () => clearTimeout(timeoutId);
    }, []);

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
                    if (site.ramazanActive) return rreshti.Sabahu;
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
                return rreshti?.[emri] ?? null;
            };

            const getLabel = (id) => {
                if (id === 'Imsaku' && site.ramazanActive) return "Syfyri (Imsaku)";
                if (id === 'Akshami' && site.ramazanActive) return "Iftari (Akshami)";
                return id;
            };

            const moments = [];
            const namazet = ["Imsaku", "Sabahu", "Lindja", "Dreka", "Ikindia", "Akshami", "Jacia"];

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
        if (o > 0) result += `${o} ${o === 1 ? 'orë' : 'orë'} e `;
        if (m > 0) result += `${m} ${m === 1 ? 'minut' : 'minuta'}`;

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
            if (site.ramazanActive) return vaktiSot.Sabahu;
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
        return vaktiSot?.[emri] ?? null;
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

    const hijriDate = useMemo(() => {
        try {
            // Subtract 1 day for proper moon sighting adjustment in Kosovo
            const adjustedDate = new Date(currentTime);
            adjustedDate.setDate(adjustedDate.getDate() - 1);

            const dateStr = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(adjustedDate);

            // Map English Islamic months to Albanian
            const monthMap = {
                "Muharram": "Muharrem",
                "Safar": "Safer",
                "Rabiʻ I": "Rebiul Evel",
                "Rabiʻ II": "Rebiul Ahir",
                "Jumada I": "Xhumadel Ula",
                "Jumada II": "Xhumadel Ahire",
                "Rajab": "Rexhep",
                "Shaʻban": "Shaban",
                "Ramadan": "Ramazan",
                "Shawwal": "Sheval",
                "Dhuʻl-Qiʻdah": "Dhul Kade",
                "Dhuʻl-Hijjah": "Dhul Hixhe"
            };

            let formatted = dateStr;
            Object.keys(monthMap).forEach(key => {
                formatted = formatted.replace(key, monthMap[key]);
            });
            // Cleanup "AH" suffix if present and formatting
            return formatted.replace(" AH", "").trim();
        } catch (e) {
            return "";
        }
    }, [currentTime]);

    if (!vaktiSot) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">Duke ngarkuar...</div>;

    return (
        <div className="h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col p-6">

            {/* Top Header */}
            <header className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent mb-1">
                        Xhamia e Dushkajës
                    </h1>
                    <p className="text-slate-400 text-xl font-medium">Kaçanik</p>
                    <p className="text-slate-500 text-lg font-medium mt-1 tracking-wide">
                        Imami: <span className="text-slate-400">{site.emriImamitXhamis}</span>
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-6xl font-black tabular-nums tracking-tight leading-none mb-1 text-white">
                        {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-2xl text-slate-500 font-bold ml-2">
                            {currentTime.getSeconds().toString().padStart(2, '0')}
                        </span>
                    </div>
                    <div className="text-emerald-400/80 text-xl font-medium tracking-wide uppercase">
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
                    <div className="text-emerald-600/60 text-lg font-medium tracking-wider uppercase mt-1">
                        {hijriDate}
                    </div>
                </div>
            </header>

            {/* Main Content Grid - Static Layout */}
            <main className="flex-1 grid grid-cols-12 gap-6 min-h-0">

                {/* Left Col: Next Prayer (Top) + Hadith (Bottom) */}
                <div className="col-span-5 flex flex-col gap-6 h-full">

                    {/* Next Prayer Card */}
                    <div className="flex-1 bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/20 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />

                        <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs lg:text-sm mb-4">
                            Vakti i radhës
                        </p>
                        {infoTani?.ardhshëm ? (
                            <>
                                <h2 className="text-6xl lg:text-7xl font-black text-white mb-2 tracking-tight leading-none">
                                    {infoTani.ardhshëm.label.split(' ')[0]}
                                </h2>
                                <div className="text-3xl lg:text-4xl text-emerald-200/80 font-mono font-bold mb-6">
                                    {ne24h(infoTani.ardhshëm.kohe)}
                                </div>

                                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 mt-auto">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
                                        Koha e mbetur
                                    </p>
                                    <p className="text-4xl lg:text-5xl font-mono font-bold text-white tabular-nums">
                                        {formatDallim(infoTani.mbetur)}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    {/* Hadith Card (Dynamic Cycle) */}
                    <div className="flex-[1.2] bg-slate-900/90 border border-slate-700/50 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center text-center">
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />

                        {(() => {
                            const hasMessage = vaktiSot?.Festat || vaktiSot?.Shenime;
                            // If message exists, toggle between it and Hadith based on showMesazh. Otherwise always Hadith.
                            const displayingMessage = hasMessage && showMesazh;

                            return (
                                <>
                                    <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-4">
                                        {displayingMessage ? "Mesazh Dite" : "Hadith / Info"}
                                    </p>

                                    {displayingMessage ? (
                                        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
                                            {vaktiSot.Festat && (
                                                <div className="mb-6">
                                                    <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2 opacity-80">Festa</div>
                                                    <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                                        {vaktiSot.Festat}
                                                    </h3>
                                                </div>
                                            )}
                                            {vaktiSot.Shenime && (
                                                <div>
                                                    {vaktiSot.Festat && <div className="w-16 h-px bg-white/10 mx-auto my-6" />}
                                                    <p className="text-xl lg:text-2xl text-slate-300 italic serif leading-relaxed px-4">
                                                        "{vaktiSot.Shenime}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : currentHadith ? (
                                        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
                                            {currentHadith.entryText && (
                                                <p className="text-slate-400 text-base mb-3 italic line-clamp-2">
                                                    {currentHadith.entryText}
                                                </p>
                                            )}
                                            <h3 className="text-2xl lg:text-3xl leading-relaxed italic font-medium text-white mb-6 line-clamp-6">
                                                "{currentHadith.textContent}"
                                            </h3>
                                            <div className="w-12 h-1 bg-emerald-500/30 rounded-full mb-3 shrink-0" />
                                            <p className="text-emerald-400 font-medium text-lg">
                                                {currentHadith.reference}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-4">
                                            <h3 className="text-3xl font-bold text-white">{site.emriImamitXhamis}</h3>
                                            <p className="text-slate-400">{site.email}</p>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                </div>

                {/* Right Col: Timetable (Static) */}
                <div className="col-span-7 h-full relative">
                    <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-6 border border-white/5 shadow-2xl h-full flex flex-col relative z-20">

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-white/10 text-slate-400 uppercase text-xs font-black tracking-widest mb-2">
                            <div className="col-span-6">Vakti</div>
                            <div className="col-span-3 text-center">Koha</div>
                            <div className="col-span-3 text-center text-emerald-500">Me Xhemat</div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            {listaNamazeve.map(({ id, label, dim }) => {
                                const kohe = vaktiSot[id];
                                // Explicitly check for Syfyri(Imsaku) and Lindja to exclude Xhemat time
                                const hasXhemat = !['Imsaku', 'Lindja'].includes(id);
                                const xh = hasXhemat ? xhemati(id) : null;

                                const isCurrent = infoTani?.tani?.id === id;
                                const isNext = infoTani?.ardhshëm?.id === id;
                                const isFriday = new Date().getDay() === 5;
                                const isJumuah = isFriday && id === 'Dreka';

                                return (
                                    <div
                                        key={id}
                                        className={`grid grid-cols-12 gap-4 px-6 py-4 rounded-xl items-center ${isNext ? 'bg-emerald-900/40 border border-emerald-500/30 relative z-10' :
                                            isCurrent ? 'bg-slate-800/80 border border-slate-700' :
                                                isJumuah ? 'bg-amber-900/20 border border-amber-500/30' :
                                                    'bg-transparent border border-transparent'
                                            }`}
                                    >
                                        <div className="col-span-6 flex items-center gap-4">
                                            <div className={`text-xl md:text-2xl font-bold tracking-tight ${isNext ? 'text-white' :
                                                isCurrent ? 'text-white' :
                                                    isJumuah ? 'text-amber-400' :
                                                        dim ? 'text-slate-500' : 'text-slate-300'
                                                }`}>
                                                {label}
                                            </div>
                                            {isCurrent && <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest border border-white/10">Tani</span>}
                                            {isJumuah && !isCurrent && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-widest border border-amber-500/20">Xhumaja</span>}
                                        </div>

                                        <div className={`col-span-3 text-center font-mono text-2xl md:text-3xl font-bold ${isNext ? 'text-white' :
                                            isCurrent ? 'text-emerald-400' :
                                                isJumuah ? 'text-amber-400' : 'text-slate-400'
                                            }`}>
                                            {ne24h(kohe)}
                                        </div>

                                        <div className="col-span-3 flex justify-center">
                                            {xh ? (
                                                <div className={`px-3 py-1 rounded-lg font-mono text-xl md:text-2xl font-bold ${isNext ? 'bg-white/10 text-white' :
                                                    isCurrent ? 'bg-slate-700 text-slate-300' :
                                                        isJumuah ? 'bg-amber-500/20 text-amber-500' :
                                                            'bg-emerald-500/10 text-emerald-500'
                                                    }`}>
                                                    {ne24h(xh)}
                                                </div>
                                            ) : (
                                                <span className="text-slate-700 font-mono text-xl">—</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dedicated Footer for QR Code to prevent overlap */}
                        <div className="pt-2 mt-2 border-t border-white/5 flex justify-end items-center opacity-80">
                            <div className="p-2 bg-white rounded-lg shadow-xl">
                                <QRCode value={site.website || site.faqeFB} size={100} />
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
