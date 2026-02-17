import { useState, useEffect, useMemo } from 'react';
import siteConfig from '../data/site.json';
import vaktet from '../data/vaktet-e-namazit.json';
import { HiMoon, HiSparkles, HiCalendar } from 'react-icons/hi2';
import { HiOutlineSun } from 'react-icons/hi';

export default function RamadanTicker() {
    const [vaktiSot, setVaktiSot] = useState(null);

    useEffect(() => {
        if (!vaktet || vaktet.length === 0) return;
        const sot = new Date();
        const dite = sot.getDate();
        const muajiSot = sot.toLocaleString("en", { month: "short" });
        const rreshti = vaktet.find((v) => {
            const [d, m] = v.Date.split("-");
            return Number(d) === dite && m === muajiSot;
        }) ?? vaktet[0];
        setVaktiSot(rreshti);
    }, []);

    const dataSot = useMemo(() => {
        const sot = new Date();
        const emratEMuajve = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
        return `${sot.getDate()} ${emratEMuajve[sot.getMonth()]} ${sot.getFullYear()}`;
    }, []);

    const items = useMemo(() => {
        if (!vaktiSot) return [];
        return [
            { text: siteConfig.mesazhiRamazanitStart, icon: <HiSparkles className="text-gold-400" /> },
            { text: `Data Sot: ${dataSot}`, icon: <HiCalendar className="text-emerald-400" /> },
            { text: `Përfundimi i Syfyrit: ${vaktiSot.Imsaku}`, icon: <HiMoon className="text-slate-300" /> },
            { text: `Fillimi i Iftarit: ${vaktiSot.Akshami}`, icon: <HiOutlineSun className="text-gold-500" /> },
            { text: `Namazi i Teravive: 20:00`, icon: <HiMoon className="text-emerald-400" /> },
            { text: siteConfig.mesazhiRamazanitEnd, icon: <HiSparkles className="text-gold-400" /> },
        ];
    }, [vaktiSot, dataSot]);

    if (!siteConfig.ramazanActive || !vaktiSot) return null;

    const strip = (
        <div className="flex items-center gap-12 px-6 shrink-0">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest font-sans whitespace-nowrap">
                        {item.text}
                    </span>
                    <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-emerald-950 text-white py-2 overflow-hidden relative z-40">
            {/* 4 copies — translateX(-25%) guarantees full coverage at any screen width */}
            <div className="flex whitespace-nowrap ticker-track">
                {strip}
                {strip}
                {strip}
                {strip}
            </div>

            <style jsx>{`
                @keyframes ticker {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-25%); }
                }
                .ticker-track {
                    will-change: transform;
                    animation: ticker 18s linear infinite;
                }
                @media (max-width: 768px) {
                    .ticker-track {
                        animation-duration: 12s;
                    }
                }
            `}</style>
        </div>
    );
}
