import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Kontakti from "./pages/Kontakti";
import AktiviteteJavore from "./pages/AktiviteteJavore";
import RrethXhamis from "./pages/RrethXhamis";
import Home from "./pages/Home";
import { Analytics } from "@vercel/analytics/react";
import KohetENamazitPerSot from "./pages/KohetENamazitPerSot";
import DhuroPerXhamin from "./pages/DhuroPerXhamin";


import siteConfig from "./data/site.json";

export default function App() {
  const offsetHeight = siteConfig.ramazanActive ? "pt-[100px] md:pt-[120px]" : "pt-[64px] md:pt-[80px]";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Analytics />
      <Header />
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
