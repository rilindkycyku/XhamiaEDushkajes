// ─── Google Analytics for an offline-capable PWA ────────────────────────────
//
// Two things quietly break GA once the site is installed to a home screen, and
// both make real usage look far smaller than it is:
//
//  1. The document outlives the "visit". An installed PWA parses index.html
//     ONCE. React mounts once, so after that first page_view the app is only
//     ever frozen and resumed — every relaunch from the home screen is
//     invisible to GA until someone does a hard refresh. Handled below by
//     watching the page lifecycle and re-sending page_view whenever the app
//     comes back after GA4's 30 minute session timeout.
//
//  2. Offline hits are lost for good. gtag.js is fetched from the network, so
//     an offline launch has no GA at all, and anything pushed into dataLayer
//     while the library is missing dies with the page. Handled below by a
//     queue that survives reloads and is replayed once the device is back
//     online.
//
// Replayed hits carry `offline_replay: 1` plus `queued_seconds` /
// `offline_time`, because GA4 stamps a hit when it *arrives*: without those
// params a visit read on the bus this morning would look like it happened
// whenever the phone found wifi. Segment on them if arrival time matters.

export const GA_MEASUREMENT_ID = 'G-51XF1CD60L';

const QUEUE_KEY = 'ga-offline-queue';
const QUEUE_LIMIT = 200;
// GA4 closes a session after 30 minutes without a hit.
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
// Below this, a resume is just a blink (keyboard closing, app switcher) — no event.
const RESUME_MIN_MS = 60 * 1000;

// ─── Module Level Queueing ──────────────────────────────────────────────────
// This ensures gtag() can be called even before the script finishes loading
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;

let started = false;
let scriptLoaded = false;
let scriptPending = false;
let queue = [];
let lastActiveAt = Date.now();
let lastPath = null;
let offlineSince = null;

const isOnline = () => typeof navigator === 'undefined' || navigator.onLine !== false;

const readStore = (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
};
const writeStore = (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode / full quota */ }
};
const clearStore = (key) => {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
};

const hasConsent = () => {
    try {
        const raw = readStore('cookie-consent');
        if (raw) return JSON.parse(raw).accepted === true;
    } catch (e) {
        // Ignore parsing errors
    }
    return false;
};

// The queue always lives in memory; it is only written to disk once the
// visitor has accepted, so a declined visit leaves nothing behind on the device.
const persistQueue = () => {
    if (!queue.length || !hasConsent()) {
        clearStore(QUEUE_KEY);
        return;
    }
    writeStore(QUEUE_KEY, JSON.stringify(queue));
};

const restoreQueue = () => {
    const raw = readStore(QUEUE_KEY);
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) queue = parsed.slice(-QUEUE_LIMIT);
    } catch (e) {
        clearStore(QUEUE_KEY);
    }
};

// Tells an installed launch apart from a normal browser visit.
const displayMode = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'unknown';
    if (document.referrer.startsWith('android-app://')) return 'twa';
    const modes = ['fullscreen', 'standalone', 'minimal-ui'];
    const match = modes.find((mode) => window.matchMedia(`(display-mode: ${mode})`).matches);
    if (match) return match;
    return window.navigator.standalone ? 'standalone' : 'browser';
};

// GA4 only accepts letters, digits and underscores, 40 chars max.
const safeName = (name) => String(name).trim().replace(/[^A-Za-z0-9_]/g, '_').slice(0, 40);

const launchParams = () => ({
    display_mode: displayMode(),
    sw_controlled: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
    booted_offline: !isOnline(),
});

const loadScript = () => {
    if (scriptLoaded || scriptPending || !GA_MEASUREMENT_ID || !isOnline()) return;
    scriptPending = true;
    // Dynamically inject the native Google Analytics script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.onload = () => {
        scriptPending = false;
        scriptLoaded = true;
        flushQueue();
    };
    script.onerror = () => {
        // Offline or blocked. Drop the tag and retry on the next 'online'
        // event instead of leaving a dead script in the head.
        scriptPending = false;
        script.remove();
    };
    document.head.appendChild(script);
};

const flushQueue = () => {
    if (!queue.length || !scriptLoaded || !isOnline()) return;
    const pending = queue;
    queue = [];
    persistQueue();
    const now = Date.now();
    pending.forEach((entry) => {
        // Only hits that were actually taken offline get the replay params —
        // an event queued for the two seconds gtag.js takes to load is not an
        // offline visit and should not pollute the reports as one.
        if (!entry.o) {
            window.gtag("event", entry.n, entry.p);
            return;
        }
        window.gtag("event", entry.n, {
            ...entry.p,
            offline_replay: 1,
            queued_seconds: Math.max(0, Math.round((now - entry.t) / 1000)),
            offline_time: new Date(entry.t).toISOString(),
        });
    });
};

const track = (name, params = {}) => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
    const eventName = safeName(name);
    if (scriptLoaded && isOnline()) {
        window.gtag("event", eventName, params);
        return;
    }
    queue.push({ n: eventName, p: params, t: Date.now(), o: isOnline() ? 0 : 1 });
    if (queue.length > QUEUE_LIMIT) queue = queue.slice(-QUEUE_LIMIT);
    persistQueue();
};

const sendPageView = (path, extra = {}) => {
    const page = path || window.location.pathname + window.location.search;
    lastPath = page;
    track("page_view", {
        page_path: page,
        page_location: window.location.origin + page,
        page_title: document.title,
        ...launchParams(),
        ...extra,
    });
};

// Called whenever the app comes back to the foreground — the moment GA used to
// miss completely, because nothing reloads when a PWA is resumed.
const handleResume = () => {
    const awayMs = Date.now() - lastActiveAt;
    lastActiveAt = Date.now();

    loadScript();
    flushQueue();

    if (awayMs >= SESSION_TIMEOUT_MS) {
        // GA4 has already dropped the session. Without this page_view the
        // relaunch is never counted at all.
        sendPageView(lastPath, { resume: 1, away_seconds: Math.round(awayMs / 1000) });
        track('app_resume', { away_seconds: Math.round(awayMs / 1000), new_session: 1 });
    } else if (awayMs >= RESUME_MIN_MS) {
        track('app_resume', { away_seconds: Math.round(awayMs / 1000), new_session: 0 });
    }
};

const installLifecycleHooks = () => {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            lastActiveAt = Date.now();
            persistQueue();
            return;
        }
        handleResume();
    });

    // Back/forward cache restore: the document is reused, so nothing else fires.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) handleResume();
    });

    // Chrome page lifecycle: a frozen tab that is brought back.
    document.addEventListener('resume', handleResume);

    window.addEventListener('pagehide', () => {
        lastActiveAt = Date.now();
        persistQueue();
    });

    window.addEventListener('online', () => {
        loadScript();
        flushQueue();
        track('connection_restored', {
            offline_seconds: offlineSince ? Math.round((Date.now() - offlineSince) / 1000) : 0,
        });
        offlineSince = null;
    });

    window.addEventListener('offline', () => {
        offlineSince = Date.now();
        // Queued by definition — this is what proves the app was used offline.
        track('connection_lost', launchParams());
    });

    window.addEventListener('appinstalled', () => {
        track('pwa_install', { display_mode: displayMode() });
    });
};

export const initGA = () => {
    if (started || !GA_MEASUREMENT_ID) return;
    started = true;

    restoreQueue();

    // Set default consent mode BEFORE configuring GA
    const consent = hasConsent();
    gtag('consent', 'default', {
        'analytics_storage': consent ? 'granted' : 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false, // Manual override to prevent duplicate hits and track SPA navigation correctly
        ...launchParams(),
    });

    // Inject the script (a no-op while offline; retried once we reconnect)
    loadScript();
    installLifecycleHooks();
};

export const updateConsent = (accepted) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            'analytics_storage': accepted ? 'granted' : 'denied'
        });
    }
    // Consent just granted: persist whatever is queued so a reload keeps it.
    // Consent withdrawn: persistQueue() drops the stored copy.
    persistQueue();
};

export const logPageView = (path) => {
    sendPageView(path);
};

export const logEvent = (eventName, params = {}) => {
    track(eventName, params);
};
