import { memo } from 'react';
import site from '../../data/site.json';

const BN = { fontFamily: "'Bebas Neue', sans-serif" };

const PrayerGrid = memo(function PrayerGrid({ listaNamazeve, vaktiSot, infoTani, xhematiFn, ne24hFn, isRamazan }) {
    const namazNateActive = isRamazan && site.ramazan?.namazNate?.active;

    const colCount = listaNamazeve.length;
    const is6Col = colCount >= 6;

    // Responsive font sizes based on column count
    const labelSize    = is6Col ? 'text-3xl lg:text-4xl' : 'text-4xl lg:text-5xl';
    const subLabelSize = is6Col ? 'text-xl lg:text-2xl'  : 'text-2xl lg:text-3xl';
    const timeNoSub    = is6Col ? 'text-5xl lg:text-[10rem]' : 'text-5xl lg:text-[13rem]';
    const timeSub      = is6Col ? 'text-5xl lg:text-[7rem]'  : 'text-5xl lg:text-[9rem]';
    const cardPx       = is6Col ? 'px-6' : 'px-10';

    return (
        <div className="flex-1 min-h-0 relative z-10">
            <div className="bg-zinc-900 rounded-[3.5rem] p-2 border border-white/5 shadow-premium h-full flex flex-col justify-center">
                <div className={`grid gap-2 h-full ${listaNamazeve.length === 5 ? 'grid-cols-5' : 'grid-cols-6'}`}>
                    {listaNamazeve.map(({ id, label }) => {
                        const xh = xhematiFn(id);
                        const isCurrent = infoTani?.tani?.id === id;
                        const isNext = infoTani?.ardhshëm?.id === id;
                        const isFriday = new Date().getDay() === 5;
                        const isJumuah = isFriday && id === 'Dreka';

                        const hasLindja = id === 'Sabahu' && !isRamazan && vaktiSot.Lindja;
                        const hasNamazNate = namazNateActive && id === 'Jacia';
                        const hasSubCard = hasLindja || hasNamazNate;

                        // Sub-card content (bottom footer)
                        const subCardContent = hasLindja ? (
                            <div className={`py-3 px-8 rounded-[2rem] flex flex-col items-center border-2 transition-all duration-500 ${isCurrent ? 'bg-black/30 border-white/30 shadow-inner' : 'bg-white/5 border-white/20'}`}>
                                <span className={`text-[13px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${isCurrent ? 'text-emerald-200' : 'text-zinc-500'}`}>Lindja e Diellit</span>
                                <span className={`text-4xl font-black leading-none ${isCurrent ? 'text-white' : 'text-emerald-400'}`} style={BN}>{ne24hFn(vaktiSot.Lindja)}</span>
                            </div>
                        ) : hasNamazNate ? (() => {
                            const kohaNN = site.ramazan?.namazNate?.koha || '00:30';
                            return (
                                <div className={`py-3 px-8 rounded-[2rem] flex flex-col items-center border-2 transition-all duration-500 ${isCurrent ? 'bg-black/30 border-white/30 shadow-inner' : 'bg-white/5 border-white/20'}`}>
                                    <span className={`text-[13px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${isCurrent ? 'text-emerald-200' : 'text-zinc-500'}`}>Namazi i Natës</span>
                                    <span className={`text-4xl font-black leading-none ${isCurrent ? 'text-white' : 'text-emerald-400'}`} style={BN}>{ne24hFn(kohaNN)}</span>
                                </div>
                            );
                        })() : null;

                        return (
                            <div
                                key={id}
                                className={`flex flex-col rounded-[3rem] p-0 border-2 transition-[background-color,border-color,transform,box-shadow] duration-500 relative overflow-hidden h-full
                                    ${isCurrent ? 'bg-emerald-600 border-white/60 z-10 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : isNext ? 'bg-zinc-800/80 border-emerald-500/50' : isJumuah ? 'bg-amber-900/20 border-amber-500/30' : 'bg-black/40 border-white/5'}`}
                            >
                                <div className={`relative z-10 w-full h-full flex flex-col justify-start ${cardPx} pt-4 pb-1`}>
                                    {/* Top: Label */}
                                    <div className="flex-none flex flex-col items-center justify-start pt-2 pb-0">
                                        <div className={`${labelSize} font-black uppercase tracking-[0.2em] text-center leading-none ${isCurrent ? 'text-white' : isJumuah ? 'text-amber-400' : 'text-zinc-500'}`} style={BN}>
                                            {label.split(' (')[0]}
                                        </div>
                                        {label.includes('(') && (
                                            <div className={`${subLabelSize} font-black uppercase tracking-[0.15em] leading-none opacity-70 ${isCurrent ? 'text-white' : 'text-zinc-500'}`} style={BN}>
                                                {label.split('(')[1].replace(')', '')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Middle: Time — flex-1 fills all remaining space */}
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <div className={`font-black whitespace-nowrap leading-none tracking-tight ${hasSubCard ? timeSub : timeNoSub} ${isCurrent ? 'text-white' : isJumuah ? 'text-amber-400' : 'text-white'}`} style={BN}>
                                            {xh ? ne24hFn(xh) : '—'}
                                        </div>
                                    </div>

                                    {/* Bottom: Sub-card (Lindja / NamazNate) */}
                                    <div className="flex-none flex flex-col items-center justify-end w-full pb-2">
                                        {hasSubCard && subCardContent}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default PrayerGrid;
