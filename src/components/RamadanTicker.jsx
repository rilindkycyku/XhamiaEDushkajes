import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import siteConfig from '../data/site.json';
import vaktet from '../data/vaktet-e-namazit.json';
import { HiMoon, HiSun, HiSparkles, HiCalendar } from 'react-icons/hi2';
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
        const ditet = sot.getDate();
        const emratEMuajve = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
        const muaji = emratEMuajve[sot.getMonth()];
        const viti = sot.getFullYear();
        return `${ditet} ${muaji} ${viti}`;
    }, []);

    const items = useMemo(() => {
        if (!vaktiSot) return [];

        const kohaTeravive = "20:00";

        return [
            { text: siteConfig.mesazhiRamazanitStart, icon: <HiSparkles className="text-gold-400" /> },
            { text: `Data Sot: ${dataSot}`, icon: <HiCalendar className="text-emerald-400" /> },
            { text: `Përfundimi i Syfyrit: ${vaktiSot.Imsaku}`, icon: <HiMoon className="text-slate-300" /> },
            { text: `Fillimi i Iftarit: ${vaktiSot.Akshami}`, icon: <HiOutlineSun className="text-gold-500" /> },
            { text: `Namazi i Teravive: ${kohaTeravive}`, icon: <HiMoon className="text-emerald-400" /> },
            { text: siteConfig.mesazhiRamazanitEnd, icon: <HiSparkles className="text-gold-400" /> },
        ];
    }, [vaktiSot, dataSot]);

    if (!siteConfig.ramazanActive || !vaktiSot) return null;

    return (
        <div className="bg-emerald-950 text-white py-2 overflow-hidden relative z-40">
            <div className="flex whitespace-nowrap animate-marquee">
                {/* Repeat the content to create a seamless loop */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-12 px-6">
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
                ))}
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </div>
    );
}
