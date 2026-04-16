import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const AktiviteteJavore = lazy(() => import("./pages/AktiviteteJavore"));
const RrethXhamis = lazy(() => import("./pages/RrethXhamis"));
const Home = lazy(() => import("./pages/Home"));
const KohetENamazitPerSot = lazy(() => import("./pages/KohetENamazitPerSot"));
const DhuroPerXhamin = lazy(() => import("./pages/DhuroPerXhamin"));

import GlobalQuranRadio from "./components/GlobalQuranRadio";
import CookieConsent from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import { initGA, logPageView } from "./lib/analytics";

import siteConfig from "./data/site.json";
import useConsentAccepted from "./hooks/useConsentAccepted";

export default function App() {
  const location = useLocation();
  const consentAccepted = useConsentAccepted();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  const offsetHeight = siteConfig.ramazan?.active ? "pt-[100px] md:pt-[120px]" : "pt-[64px] md:pt-[80px]";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Analytics only loads when the user has explicitly accepted */}
      {consentAccepted && <Analytics />}

      <Header />

      <main className={`flex-1 ${offsetHeight}`}>
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm md:text-base animate-pulse">Duke u hapur...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dhuroperxhamin" element={<DhuroPerXhamin />} />
            <Route path="/aktivitetejavore" element={<AktiviteteJavore />} />
            <Route path="/rrethxhamis" element={<RrethXhamis />} />
            <Route path="/kohetenamazitpersot" element={<KohetENamazitPerSot />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Quran Radio - audio everywhere */}
      <GlobalQuranRadio />

      <Footer />

      {/* Cookie consent */}
      <CookieConsent />
    </div>
  );
}
