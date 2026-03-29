import { useState, useEffect } from 'react';
import { HiX, HiCheck, HiChatAlt2, HiTrash } from "react-icons/hi";

export default function SettingsModal({ show, customMsg, onClose, onSave }) {
    const [tempMsg, setTempMsg] = useState(customMsg || "");

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onSave(tempMsg);
            }
        };
        if (show) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, tempMsg, onSave]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-12 bg-black/90 animate-in fade-in duration-300 backdrop-blur-md">
            <div className="bg-zinc-900 border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden font-sans animate-in zoom-in-95 duration-300">
                <header className="p-10 flex justify-between items-center border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-emerald-600 rounded-3xl shadow-lg shadow-emerald-900/40">
                            <HiChatAlt2 className="text-5xl text-white" />
                        </div>
                        <div>
                            <h3 className="text-5xl font-black text-white tracking-tight uppercase">Njoftim Live</h3>
                            <p className="text-zinc-500 text-2xl mt-1 font-medium italic opacity-70 tracking-wide">Shtoni një njoftim të shpejtë në ekran</p>
                        </div>
                    </div>
                    <button onClick={() => onSave(tempMsg)} className="p-5 hover:bg-white/10 rounded-full transition-all text-zinc-500 hover:text-white">
                        <HiX className="text-6xl" />
                    </button>
                </header>

                <main className="p-12">
                    <textarea
                        value={tempMsg}
                        onChange={(e) => setTempMsg(e.target.value)}
                        placeholder="Shkruani njoftimin këtu..."
                        className="w-full h-80 bg-black/40 border-2 border-zinc-800 rounded-[3rem] p-12 text-5xl font-bold text-white focus:border-emerald-500 focus:bg-black/60 transition-all outline-none resize-none shadow-inner placeholder:text-zinc-800 font-sans"
                        autoFocus
                    />
                </main>

                <footer className="p-10 bg-black/40 border-t border-white/5 flex gap-8">
                    <button
                        onClick={() => onSave(tempMsg)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-9 rounded-[3rem] text-3xl font-black transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95 uppercase tracking-widest"
                    >
                        <HiCheck className="text-4xl" /> Ruaj Njoftimin
                    </button>
                    <button
                        onClick={() => {
                            setTempMsg("");
                            onSave("");
                        }}
                        className="px-14 bg-zinc-800 hover:bg-red-900/40 hover:text-red-400 text-white py-9 rounded-[3rem] text-2xl font-black transition-all active:scale-95 group flex items-center gap-4"
                    >
                        <HiTrash className="text-3xl" /> FSHI
                    </button>
                </footer>

                {/* 2nd-Column, 2-Row Branding Grid */}
                <div className="flex justify-between items-center px-16 py-10 border-t border-white/10 bg-black/50 mt-auto select-none">
                    {/* Column 1: Branding Identities */}
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-black uppercase tracking-[0.45em] text-zinc-400 leading-none">Mosque Screen TV</span>
                        <span className="text-emerald-500/70 text-2xl font-black uppercase tracking-widest leading-none">Rilind Kyçyku</span>
                    </div>
                    
                    {/* Column 2: Web Destinations */}
                    <div className="flex flex-col items-end gap-3 opacity-40 hover:opacity-100 transition-opacity">
                        <span className="text-sm font-black tracking-[0.25em] uppercase underline decoration-emerald-500/20 underline-offset-8">www.tv.rilindkycyku.dev</span>
                        <span className="text-sm font-black tracking-[0.25em] uppercase underline decoration-emerald-500/20 underline-offset-8">www.rilindkycyku.dev</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
