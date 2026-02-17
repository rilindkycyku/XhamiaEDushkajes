import { useState, useEffect, useMemo, useRef } from 'react';
import siteConfig from '../data/site.json';
import vaktet from '../data/vaktet-e-namazit.json';
import { HiMoon, HiSparkles, HiCalendar } from 'react-icons/hi2';
import { HiOutlineSun } from 'react-icons/hi';

const ITEMS_CONFIG = (dataSot, vaktiSot) => [
    { text: siteConfig.mesazhiRamazanitStart,              icon: 'sparkles' },
    { text: `Data Sot: ${dataSot}`,                        icon: 'calendar' },
    { text: `Përfundimi i Syfyrit: ${vaktiSot.Imsaku}`,   icon: 'moon'     },
    { text: `Fillimi i Iftarit: ${vaktiSot.Akshami}`,     icon: 'sun'      },
    { text: `Namazi i Teravive: 20:00`,                    icon: 'moon2'    },
    { text: siteConfig.mesazhiRamazanitEnd,                icon: 'sparkles2'},
];

function Icon({ type }) {
    switch (type) {
        case 'sparkles':
        case 'sparkles2': return <HiSparkles style={{ color: '#d4af37' }} />;
        case 'calendar':  return <HiCalendar style={{ color: '#6ee7b7' }} />;
        case 'moon':
        case 'moon2':     return <HiMoon     style={{ color: '#cbd5e1' }} />;
        case 'sun':       return <HiOutlineSun style={{ color: '#fbbf24' }} />;
        default:          return null;
    }
}

function Separator() {
    return (
        <span className="rt-sep" aria-hidden="true">
            <span />
            <span />
            <span />
        </span>
    );
}

export default function RamadanTicker() {
    const [vaktiSot, setVaktiSot] = useState(null);
    const trackRef = useRef(null);

    useEffect(() => {
        if (!vaktet?.length) return;
        const sot = new Date();
        const dite = sot.getDate();
        const muajiSot = sot.toLocaleString('en', { month: 'short' });
        const rreshti = vaktet.find((v) => {
            const [d, m] = v.Date.split('-');
            return Number(d) === dite && m === muajiSot;
        }) ?? vaktet[0];
        setVaktiSot(rreshti);
    }, []);

    const dataSot = useMemo(() => {
        const sot = new Date();
        const muajt = ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor'];
        return `${sot.getDate()} ${muajt[sot.getMonth()]} ${sot.getFullYear()}`;
    }, []);

    const items = useMemo(() => {
        if (!vaktiSot) return [];
        return ITEMS_CONFIG(dataSot, vaktiSot);
    }, [vaktiSot, dataSot]);

    if (!siteConfig.ramazanActive || !vaktiSot) return null;

    // Render one full strip of items
    const renderStrip = (keyPrefix) =>
        items.map((item, idx) => (
            <span key={`${keyPrefix}-${idx}`} className="rt-item">
                <span className="rt-icon"><Icon type={item.icon} /></span>
                <span className="rt-text">{item.text}</span>
                <Separator />
            </span>
        ));

    return (
        <>
            <div className="rt-root" role="marquee" aria-label="Informacione Ramazani">
                {/* Crescent decorative left badge */}
                <span className="rt-badge" aria-hidden="true">☽</span>

                <div className="rt-viewport">
                    {/* Two identical strips; -50% translateX = seamless loop */}
                    <div className="rt-track" ref={trackRef}>
                        <span className="rt-strip">{renderStrip('a')}</span>
                        <span className="rt-strip">{renderStrip('b')}</span>
                    </div>
                </div>

                <span className="rt-badge rt-badge--right" aria-hidden="true">☽</span>
            </div>

            <style>{`
                /* ── Root ── */
                .rt-root {
                    position: relative;
                    z-index: 40;
                    display: flex;
                    align-items: center;
                    background: #022c22;
                    background-image:
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 80px,
                            rgba(255,255,255,0.015) 80px,
                            rgba(255,255,255,0.015) 81px
                        );
                    border-top: 1px solid rgba(110,231,183,0.12);
                    border-bottom: 1px solid rgba(110,231,183,0.12);
                    height: 36px;
                    overflow: hidden;
                    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                }

                /* ── Badge ── */
                .rt-badge {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    font-size: 14px;
                    color: #6ee7b7;
                    background: rgba(6,78,59,0.7);
                    border-right: 1px solid rgba(110,231,183,0.15);
                    letter-spacing: 0;
                    user-select: none;
                }
                .rt-badge--right {
                    border-right: none;
                    border-left: 1px solid rgba(110,231,183,0.15);
                }

                /* ── Viewport clips overflow ── */
                .rt-viewport {
                    flex: 1;
                    overflow: hidden;
                    height: 100%;
                    position: relative;
                    /* Fade edges */
                    -webkit-mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 4%,
                        black 96%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to right,
                        transparent 0%,
                        black 4%,
                        black 96%,
                        transparent 100%
                    );
                }

                /* ── Track: must be wide enough to hold both strips ── */
                .rt-track {
                    display: inline-flex;   /* shrinks to content width  */
                    align-items: center;
                    height: 100%;
                    white-space: nowrap;
                    will-change: transform;
                    animation: rt-scroll 40s linear infinite;
                }

                /* ── Each strip is one full set of items ── */
                .rt-strip {
                    display: inline-flex;
                    align-items: center;
                    height: 100%;
                }

                /* ── Individual item ── */
                .rt-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0 2px;
                    white-space: nowrap;
                }

                .rt-icon {
                    display: inline-flex;
                    align-items: center;
                    font-size: 13px;
                    flex-shrink: 0;
                }

                .rt-text {
                    font-size: 10.5px;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #e2e8f0;
                    white-space: nowrap;
                }

                /* ── Separator dots ── */
                .rt-sep {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    margin: 0 14px;
                    flex-shrink: 0;
                }
                .rt-sep span {
                    display: inline-block;
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: #065f46;
                }
                .rt-sep span:nth-child(2) {
                    background: #10b981;
                    width: 4px;
                    height: 4px;
                }

                /* ── Keyframe: scroll exactly one strip's width (50% of track) ── */
                @keyframes rt-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }

                /* ── Mobile: slightly faster ── */
                @media (max-width: 640px) {
                    .rt-track { animation-duration: 28s; }
                    .rt-badge  { display: none; }
                }

                /* ── Pause on hover/focus for accessibility ── */
                .rt-root:hover .rt-track,
                .rt-root:focus-within .rt-track {
                    animation-play-state: paused;
                }
            `}</style>
        </>
    );
}
