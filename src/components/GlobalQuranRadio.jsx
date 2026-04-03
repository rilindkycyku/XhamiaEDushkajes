import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlay,
    HiPause,
    HiSpeakerWave
} from 'react-icons/hi2';
import useConsentAccepted from '../hooks/useConsentAccepted';

// ─── Permanent Yasser Al-Dosari Radio Stream ─────────────────────────────────
const RADIO_URL = 'https://backup.qurango.net/radio/yasser_aldosari/;';

export default function GlobalQuranRadio() {
    const consentAccepted = useConsentAccepted();
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // ── Lazy Audio Initialization ───────────────────────────────────────────
    useEffect(() => {
        if (!consentAccepted || typeof window === 'undefined') {
            if (audio) {
                audio.pause();
                audio.src = "";
                setAudio(null);
            }
            return;
        }

        const newAudio = new Audio();
        newAudio.src = RADIO_URL;
        newAudio.volume = 0.7;
        newAudio.preload = 'none';
        newAudio.crossOrigin = 'anonymous';
        setAudio(newAudio);

        return () => {
            newAudio.pause();
            newAudio.src = "";
            setAudio(null);
        };
    }, [consentAccepted]);

    // ── Audio event wiring ────────────────────────────────────────────────────
    useEffect(() => {
        if (!audio) return;

        const onPlay = () => {
            setIsPlaying(true);
            setIsLoading(false);
        };
        const onPause = () => setIsPlaying(false);
        const onWaiting = () => setIsLoading(true);
        const onPlaying = () => {
            setIsLoading(false);
            setIsPlaying(true);
        };
        const onError = (e) => {
            // Only log if it's a real playback error after user started it
            if (audio.src && audio.src !== window.location.href) {
                console.error("Radio Audio Error:", e);
            }
            setIsLoading(false);
            setIsPlaying(false);
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('error', onError);

        setIsPlaying(!audio.paused);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('playing', onPlaying);
            audio.removeEventListener('error', onError);
        };
    }, [audio]);

    // ── Autoplay Attempt ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!audio) return;

        const startRadio = () => {
            if (audio.paused) {
                togglePlay();
            }
            cleanup();
        };

        const cleanup = () => {
            window.removeEventListener('mousedown', startRadio);
            window.removeEventListener('touchstart', startRadio);
            window.removeEventListener('keydown', startRadio);
        };

        // 1. Try immediate autoplay
        audio.play()
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            })
            .catch(() => {
                // 2. If blocked, wait for ANY interaction
                window.addEventListener('mousedown', startRadio);
                window.addEventListener('touchstart', startRadio);
                window.addEventListener('keydown', startRadio);
            });

        return cleanup;
    }, [audio]);

    const togglePlay = () => {
        if (!audio) return;

        if (audio.paused) {
            setIsLoading(true);
            if (!audio.src || audio.src === window.location.href) {
                audio.src = RADIO_URL;
            }

            audio.play()
                .then(() => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                })
                .catch(err => {
                    console.error("Play blocked or failed:", err);
                    setIsLoading(false);
                });
        } else {
            audio.pause();
            // Clear src to stop background download of the live stream
            audio.src = "";
            audio.load();
        }
    };

    if (!consentAccepted || !audio) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none select-none">

            {/* ── Toast Feedback ── */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-md border border-emerald-100 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto"
                    >
                        <HiSpeakerWave className="text-emerald-500 animate-pulse" size={14} />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Radio Kuran: LIVE</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main Toggle Button ── */}
            <div className="pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-4 ${isPlaying
                        ? 'bg-emerald-600 border-white text-white shadow-emerald-500/20'
                        : 'bg-white border-slate-50 text-slate-400'
                        }`}
                >
                    {isLoading ? (
                        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <HiPause size={32} />
                    ) : (
                        <HiPlay size={32} className="ml-1" />
                    )}

                    {isPlaying && (
                        <div className="absolute -inset-4 rounded-full border-2 border-emerald-400/20 animate-ping pointer-events-none" />
                    )}
                </motion.button>
            </div>
        </div>
    );
}
