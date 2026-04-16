export const GA_MEASUREMENT_ID = 'G-51XF1CD60L';

export const initGA = () => {
    if (!GA_MEASUREMENT_ID) return;

    // Check localStorage for existing cookie consent
    let hasConsent = false;
    try {
        const raw = localStorage.getItem('cookie-consent');
        if (raw) hasConsent = JSON.parse(raw).accepted === true;
    } catch (e) {
        // Ignore parsing errors
    }

    // Dynamically inject the native Google Analytics script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Setup the global layer
    window.dataLayer = window.dataLayer || [];
    function gtag() { 
        window.dataLayer.push(arguments); 
    }
    window.gtag = gtag;

    gtag("js", new Date());
    
    // Set default consent mode BEFORE initializing GA
    gtag('consent', 'default', {
        'analytics_storage': hasConsent ? 'granted' : 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });

    gtag("config", GA_MEASUREMENT_ID);
    console.log("Native Google Analytics initialized with ID:", GA_MEASUREMENT_ID);
};

export const updateConsent = (accepted) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            'analytics_storage': accepted ? 'granted' : 'denied'
        });
    }
};

export const logPageView = (path) => {
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag("event", "page_view", { page_path: path });
    }
};

export const logEvent = (eventName, params = {}) => {
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag("event", eventName, params);
    }
};
