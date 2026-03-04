import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlay,
    HiPause,
    HiSpeakerWave,
} from 'react-icons/hi2';

const QURAN_BACKUPS = [
    'https://stream.radiojar.com/0tpy1h0kxtzuv', // Saudi Quran Radio (Safest)
    'https://backup.qurango.net/radio/mix',       // Mix Quran Radio
    'https://backup.qurango.net/radio/mishary_alafasi',
    'https://backup.qurango.net/radio/ahmad_alajmy'
];

// SINGLETON AUDIO INSTANCE (Guarantees only one sound ever)
let globalAudio = null;
if (typeof window !== 'undefined') {
    globalAudio = new Audio();
    globalAudio.volume = 0.5;
    globalAudio.preload = "auto";
    globalAudio.src = QURAN_BACKUPS[0];
}

export default function GlobalQuranRadio() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const backupIndexRef = useRef(0);

    useEffect(() => {
        if (!globalAudio) return;

        const audio = globalAudio;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => {
            setIsLoading(false);
            setIsPlaying(true);
        };

        const handleError = (e) => {
            console.warn("Stream issue, switching to backup...", e);
            backupIndexRef.current = (backupIndexRef.current + 1) % QURAN_BACKUPS.length;
            audio.src = QURAN_BACKUPS[backupIndexRef.current];
            audio.load();
            if (isPlaying) {
                audio.play().catch(err => console.error("Backup failed:", err));
            }
        };

        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('error', handleError);

        // Sync initial state
        setIsPlaying(!audio.paused);

        // One-time interaction listener to unlock audio if autoplay is blocked
        const unlockAudio = () => {
            if (audio.paused) {
                audio.play().then(() => {
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                }).catch(() => { });
            }
            window.removeEventListener('click', unlockAudio);
        };
        window.addEventListener('click', unlockAudio);

        // Attempt autoplay immediately
        audio.play().then(() => {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        }).catch(() => {
            console.log("Autoplay blocked - awaiting first click.");
        });

        return () => {
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('error', handleError);
            window.removeEventListener('click', unlockAudio);
        };
    }, []);

    const togglePlay = () => {
        if (!globalAudio) return;
        if (globalAudio.paused) {
            globalAudio.play().catch(e => console.error("Play failed:", e));
        } else {
            globalAudio.pause();
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-white/95 backdrop-blur-xl border border-emerald-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto"
                    >
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                            <HiSpeakerWave size={16} className="animate-pulse" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Kurani po luan në sfond...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-end gap-2 pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] ${isPlaying
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-white text-slate-400 border border-slate-100'
                        }`}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <HiPause size={32} />
                    ) : (
                        <HiPlay size={32} className="ml-1" />
                    )}

                    {isPlaying && (
                        <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/20 animate-ping pointer-events-none" />
                    )}
                </motion.button>

                <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full transition-all ${isPlaying ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                    {isPlaying ? 'Live' : 'Dëgjo Kuranin'}
                </div>
            </div>
        </div>
    );
}
