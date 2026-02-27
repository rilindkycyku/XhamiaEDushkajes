import { memo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import site from '../../data/site.json';

const ActivityBox = memo(function ActivityBox({ displayMode, customMsg, currentHadith, vaktiSot }) {
    if (displayMode === 'qr') {
        const qrUrl = site.tvOptions?.qrUrl || "https://xhamiaedushkajes.org";
        return (
            <div className="bg-zinc-900/80 backdrop-blur-sm border-2 border-white/5 rounded-[3.5rem] p-8 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                <div className="flex flex-row items-center gap-10 w-full h-full justify-between px-8 animate-slide-up">
                    <div className="p-5 bg-white rounded-[2rem] shrink-0 shadow-2xl">
                        <QRCodeCanvas value={qrUrl} size={380} level="H" />
                    </div>
                    <div className="flex flex-col items-start gap-6 text-left flex-1 ml-4">
                        <div className="flex flex-col">
                            <p className="text-emerald-400 uppercase tracking-[0.4em] text-3xl font-black leading-tight">SKANO FAQEN</p>
                            <p className="text-zinc-500 uppercase tracking-[0.2em] text-sm font-bold mt-2">Për më shumë informata</p>
                        </div>
                        <div className="h-px w-32 bg-zinc-800" />
                        <p className="text-zinc-400 text-4xl lg:text-5xl font-black tracking-tighter opacity-80 break-all leading-tight italic">
                            {qrUrl.replace('https://', '').replace('www.', '')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border-2 border-white/5 rounded-[3.5rem] p-8 relative overflow-hidden flex flex-col items-center justify-center transition-all duration-700">
            <div className="w-full mb-2 opacity-40">
                <p className="text-zinc-400 uppercase tracking-[0.3em] text-lg font-black text-center">
                    {displayMode === 'message' ? "Shënim / Festë" :
                        displayMode === 'custom' ? "Njoftim i Rëndësishëm" : "Hadith / Ajet"}
                </p>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center animate-slide-up w-full px-2">
                {displayMode === 'custom' ? (
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h3 className="text-4xl lg:text-5xl font-black text-emerald-400 leading-tight mb-4">Njoftim</h3>
                        <p className="text-2xl lg:text-4xl text-white font-bold leading-relaxed px-4">{customMsg}</p>
                    </div>
                ) : displayMode === 'message' ? (
                    <div className="flex-1 flex flex-col justify-center items-center">
                        {vaktiSot.Festat && (
                            <div className="mb-4">
                                <div className="text-emerald-400 font-bold uppercase tracking-widest text-base mb-1 opacity-80">Festa</div>
                                <h3 className="text-3xl lg:text-5xl font-black text-white leading-tight">{vaktiSot.Festat}</h3>
                            </div>
                        )}
                        {vaktiSot.Shenime && (
                            <div>
                                {vaktiSot.Festat && <div className="w-12 h-px bg-white/10 mx-auto my-4" />}
                                <p className="text-2xl lg:text-4xl text-zinc-300 italic leading-relaxed px-4 opacity-90">"{vaktiSot.Shenime}"</p>
                            </div>
                        )}
                    </div>
                ) : currentHadith ? (
                    <div className="flex-1 flex flex-col justify-center items-center overflow-hidden">
                        {currentHadith.entryText && <p className="text-zinc-500 text-xl mb-2 italic font-medium opacity-60">{currentHadith.entryText}</p>}
                        <h3 className="text-2xl lg:text-4xl leading-tight italic font-bold text-white mb-6 line-clamp-6 px-4">"{currentHadith.textContent}"</h3>
                        <div className="w-12 h-1 bg-emerald-500 rounded-full mb-4 shrink-0" />
                        <p className="text-emerald-400 font-black text-2xl lg:text-3xl">{currentHadith.reference}</p>
                    </div>
                ) : <h3 className="text-4xl font-bold text-white uppercase tracking-tighter opacity-70">{site.global?.emriXhamis}</h3>}
            </div>
        </div>
    );
});

export default ActivityBox;
