import { Link } from 'react-router-dom'

import siteConfig from "../data/site.json"

export default function Header(){
  const title = siteConfig?.siteName ?? 'Masjid'
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">{title}</Link>
        <nav>
          <ul className="flex gap-4">
            <li><Link to="/">Ballina</Link></li>
            <li><Link to="/rrethxhamis">Rreth Xhamis</Link></li>
            <li><Link to="/aktivitetejavore">Aktivitet Javore</Link></li>
            <li><Link to="/dhuroperxhamin">Dhuro per Xhamin</Link></li>
            <li><Link to="/kontakti">Kontakti</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}