import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Kontakti from "./pages/Kontakti";
import AktiviteteJavore from "./pages/AktiviteteJavore";
import RrethXhamis from "./pages/RrethXhamis";
import Home from "./pages/Home";
import { Analytics } from "@vercel/analytics/react";
import KohetENamazitPerSot from "./pages/KohetENamazitPerSot";
import DhuroPerXhamin from "./pages/DhuroPerXhamin";
import TvDisplay from "./pages/TvDisplay";
import siteConfig from "./data/site.json";

export default function App() {
  const location = useLocation();
  const isTvPage = location.pathname === "/tv";

  // Calculate offset height only for non-TV pages
  const offsetHeight = isTvPage
    ? ""
    : (siteConfig.ramazanActive ? "pt-[100px] md:pt-[120px]" : "pt-[64px] md:pt-[80px]");

  return (
    <div className={`min-h-screen flex flex-col ${isTvPage ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Analytics />

      {!isTvPage && <Header />}

      <main className={`flex-1 ${offsetHeight}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dhuroperxhamin" element={<DhuroPerXhamin />} />
          <Route path="/kontakti" element={<Kontakti />} />
          <Route path="/aktivitetejavore" element={<AktiviteteJavore />} />
          <Route path="/rrethxhamis" element={<RrethXhamis />} />
          <Route
            path="/kohetenamazitpersot"
            element={<KohetENamazitPerSot />}
          />
          <Route path="/tv" element={<TvDisplay />} />
        </Routes>
      </main>

      {!isTvPage && <Footer />}
    </div>
  );
}
