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

import GlobalQuranRadio from "./components/GlobalQuranRadio";
import CookieConsent from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";

import siteConfig from "./data/site.json";
import useConsentAccepted from "./hooks/useConsentAccepted";
import ErrorBoundary from "./components/Tv/ErrorBoundary/ErrorBoundary";

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
    <ErrorBoundary fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Ndodhi një gabim gjatë ngarkimit. Ju lutem rifreskoni faqen.</div>}>
      <div className={`min-h-screen flex flex-col ${isTvPage ? 'bg-slate-950' : 'bg-gray-50'}`}>

        {/* Analytics only loads when the user has explicitly accepted */}
        {consentAccepted && <Analytics />}

        {/* Header hidden on TV subdomain */}
        {!isTvPage && <Header />}

        <main className={`flex-1 ${offsetHeight}`}>
          <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm md:text-base animate-pulse">Duke u hapur...</p>
            </div>
          }>
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
        {!isTvPage && <GlobalQuranRadio />}

        {/* Footer hidden on TV subdomain */}
        {!isTvPage && <Footer />}

        {/* Cookie consent - hidden on TV page (not needed there) */}
        {!isTvPage && <CookieConsent />}
      </div>
    </ErrorBoundary>
  );
}
