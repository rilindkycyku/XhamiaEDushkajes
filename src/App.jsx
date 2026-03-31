import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const AktiviteteJavore = lazy(() => import("./pages/AktiviteteJavore"));
const RrethXhamis = lazy(() => import("./pages/RrethXhamis"));
const Home = lazy(() => import("./pages/Home"));
const KohetENamazitPerSot = lazy(() => import("./pages/KohetENamazitPerSot"));
const DhuroPerXhamin = lazy(() => import("./pages/DhuroPerXhamin"));
const TvDisplay = lazy(() => import("./pages/TvDisplay"));

const GlobalQuranRadio = lazy(() => import("./components/GlobalQuranRadio"));
const CookieConsent = lazy(() => import("./components/CookieConsent"));
const Analytics = lazy(() => import("@vercel/analytics/react").then(mod => ({ default: mod.Analytics })));

import siteConfig from "./data/site.json";

import useConsentAccepted from "./hooks/useConsentAccepted";

export default function App() {
  const location = useLocation();
  const consentAccepted = useConsentAccepted();

  // Check if we are on the 'tv' subdomain
  const isTvSubdomain = window.location.hostname.startsWith("tv.");
  const isTvPage = isTvSubdomain || location.pathname === "/tv";

  const offsetHeight = isTvPage
    ? ""
    : (siteConfig.ramazan?.active ? "pt-[100px] md:pt-[120px]" : "pt-[64px] md:pt-[80px]");

  return (
    <div className={`min-h-screen flex flex-col ${isTvPage ? 'bg-slate-950' : 'bg-gray-50'}`}>

      {/* Analytics only loads when the user has explicitly accepted */}
      {consentAccepted && <Analytics />}

      {/* Header hidden on TV subdomain */}
      {!isTvPage && <Header />}

      <main className={`flex-1 ${offsetHeight}`}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Duke ngarkuar...</div>}>
          <Routes>
            {/* If on TV subdomain, the root "/" should show the TV display */}
            <Route path="/" element={isTvSubdomain ? <TvDisplay /> : <Home />} />

            <Route path="/dhuroperxhamin" element={<DhuroPerXhamin />} />
            <Route path="/aktivitetejavore" element={<AktiviteteJavore />} />
            <Route path="/rrethxhamis" element={<RrethXhamis />} />
            <Route path="/kohetenamazitpersot" element={<KohetENamazitPerSot />} />

            {/* Keep this route so the redirect from vercel.json has a target */}
            <Route path="/tv" element={<TvDisplay />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Quran Radio - audio everywhere except TV */}
      {!isTvPage && (
        <Suspense fallback={null}>
          <GlobalQuranRadio />
        </Suspense>
      )}

      {/* Footer hidden on TV subdomain */}
      {!isTvPage && <Footer />}

      {/* Cookie consent - hidden on TV page (not needed there) */}
      {!isTvPage && (
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      )}
    </div>
  );
}
