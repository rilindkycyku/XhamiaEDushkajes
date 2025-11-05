// components/Header.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import siteConfig from '../data/site.json';

export default function Header() {
  const titulli = siteConfig?.emriXhamis ?? 'Xhamia';
  const [menuHapur, setMenuHapur] = useState(false);

  const ndryshoMenune = () => {
    setMenuHapur(!menuHapur);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          {titulli}
        </Link>

        <button
          className="md:hidden focus:outline-none"
          onClick={ndryshoMenune}
          aria-label="Hap/Mbyll menunë"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={menuHapur ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>

        <nav className="hidden md:block">
          <ul className="flex gap-4">
            <li><Link to="/" className="hover:text-blue-600">Ballina</Link></li>
            <li><Link to="/rrethxhamis" className="hover:text-blue-600">Rreth Xhamisë</Link></li>
            <li><Link to="/aktivitetejavore" className="hover:text-blue-600">Aktivitet Javore</Link></li>
            {/* <li><Link to="/dhuroperxhamin" className="hover:text-blue-600">Dhuro për Xhaminë</Link></li> */}
            <li><Link to="/kontakti" className="hover:text-blue-600">Kontakti</Link></li>
          </ul>
        </nav>
      </div>

      {menuHapur && (
        <nav className="md:hidden bg-white border-t">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li><Link to="/" className="hover:text-blue-600" onClick={ndryshoMenune}>Ballina</Link></li>
            <li><Link to="/rrethxhamis" className="hover:text-blue-600" onClick={ndryshoMenune}>Rreth Xhamisë</Link></li>
            <li><Link to="/aktivitetejavore" className="hover:text-blue-600" onClick={ndryshoMenune}>Aktivitet Javore</Link></li>
            {/* <li><Link to="/dhuroperxhamin" className="hover:text-blue-600" onClick={ndryshoMenune}>Dhuro për Xhaminë</Link></li> */}
            <li><Link to="/kontakti" className="hover:text-blue-600" onClick={ndryshoMenune}>Kontakti</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}