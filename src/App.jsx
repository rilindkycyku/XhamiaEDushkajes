import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import DhuroPerXhamin from './pages/DhuroPerXhamin'
import Kontakti from './pages/Kontakti'
import AktiviteteJavore from './pages/AktiviteteJavore'
import RrethXhamis from './pages/RrethXhamis'
import Home from './pages/Home'
import { Analytics } from "@vercel/analytics/react"

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Analytics />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dhuroperxhamin" element={<DhuroPerXhamin />} />
          <Route path="/kontakti" element={<Kontakti />} />
          <Route path="/aktivitetejavore" element={<AktiviteteJavore />} />
          <Route path="/rrethxhamis" element={<RrethXhamis />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
