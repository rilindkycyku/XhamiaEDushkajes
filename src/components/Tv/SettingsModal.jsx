import { useState } from 'react';
import { HiX, HiCheck, HiChatAlt2, HiTrash } from "react-icons/hi";

export default function SettingsModal({ show, customMsg, onClose, onSave }) {
    const [tempMsg, setTempMsg] = useState(customMsg || "");

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-12 bg-black/95 animate-in fade-in duration-300 backdrop-blur-md">
            <div className="bg-zinc-900 border border-white/10 rounded-[4rem] w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden font-sans animate-in zoom-in-95 duration-300">
                <header className="p-10 flex justify-between items-center border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-emerald-600 rounded-3xl shadow-lg shadow-emerald-900/40">
                            <HiChatAlt2 className="text-5xl text-white" />
                        </div>
                        <div>
                            <h3 className="text-5xl font-black text-white tracking-tight uppercase">Njoftim i RI</h3>
                            <p className="text-zinc-500 text-2xl mt-1 font-medium italic opacity-70 tracking-wide">Shtoni një njoftim live në ekran (p.sh. për ligjërata, programe, etj)</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-5 hover:bg-white/10 rounded-full transition-all text-zinc-500 hover:text-white active:scale-90">
                        <HiX className="text-6xl" />
                    </button>
                </header>

                <main className="p-12 space-y-10">
                    <textarea
                        value={tempMsg}
                        onChange={(e) => setTempMsg(e.target.value)}
                        placeholder="Shkruani njoftimin këtu..."
                        className="w-full h-96 bg-black/40 border-2 border-zinc-800 rounded-[3rem] p-12 text-5xl font-bold text-white focus:border-emerald-500 focus:bg-black/60 transition-all outline-none resize-none shadow-inner placeholder:text-zinc-800"
                        autoFocus
                    />
                    <div className="flex items-center gap-6 text-zinc-600 px-6">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-2xl font-bold italic tracking-wide">Ky njoftim do të shfaqet në fillim të çdo cikli sipas kohës së caktuar në site.json.</p>
                    </div>
                </main>

                <footer className="p-10 bg-black/40 border-t border-white/5 flex gap-8">
                    <button
                        onClick={() => onSave(tempMsg)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-9 rounded-[3rem] text-3xl font-black transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95 uppercase tracking-widest"
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
                        <HiTrash className="text-3xl group-hover:scale-110 transition-transform" /> FSHI
                    </button>
                </footer>
            </div>
        </div>
    );
}
