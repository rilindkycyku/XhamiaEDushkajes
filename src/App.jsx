import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AktiviteteJavore from "./pages/AktiviteteJavore";
import RrethXhamis from "./pages/RrethXhamis";
import Home from "./pages/Home";
import { Analytics } from "@vercel/analytics/react";
import KohetENamazitPerSot from "./pages/KohetENamazitPerSot";
import DhuroPerXhamin from "./pages/DhuroPerXhamin";
import TvDisplay from "./pages/TvDisplay";
import GlobalQuranRadio from "./components/GlobalQuranRadio";
import siteConfig from "./data/site.json";

export default function App() {
  const location = useLocation();

  // NEW LOGIC: Check if we are on the 'tv' subdomain
  // This works for tv.xhamiaedushkajes.org and local testing like tv.localhost
  const isTvSubdomain = window.location.hostname.startsWith("tv.");

  // Keep support for the old /tv path during transition, or strictly use subdomain
  const isTvPage = isTvSubdomain || location.pathname === "/tv";

  const offsetHeight = isTvPage
    ? ""
    : (siteConfig.ramazan?.active ? "pt-[100px] md:pt-[120px]" : "pt-[64px] md:pt-[80px]");

  return (
    <div className={`min-h-screen flex flex-col ${isTvPage ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Analytics />

      {/* Header hidden on TV subdomain */}
      {!isTvPage && <Header />}

      <main className={`flex-1 ${offsetHeight}`}>
        <Routes>
          {/* If on TV subdomain, the root "/" should show the TV display */}
          <Route path="/" element={isTvSubdomain ? <TvDisplay /> : <Home />} />

          <Route path="/dhuroperxhamin" element={<DhuroPerXhamin />} />
          <Route path="/aktivitetejavore" element={<AktiviteteJavore />} />
          <Route path="/rrethxhamis" element={<RrethXhamis />} />
          <Route path="/kohetenamazitpersot" element={<KohetENamazitPerSot />} />

          {/* Keep this route for now so the redirect from vercel.json has a target */}
          <Route path="/tv" element={<TvDisplay />} />
        </Routes>
      </main>

      {/* Global Quran Radio (Sound everywhere) */}
      {!isTvPage && <GlobalQuranRadio />}

      {/* Footer hidden on TV subdomain */}
      {!isTvPage && <Footer />}
    </div>
  );
}
