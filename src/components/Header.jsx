import { Link } from 'react-router-dom';
import { useState } from 'react';
import siteConfig from '../data/site.json';

export default function Header() {
  const title = siteConfig?.siteName ?? 'Masjid';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          {title}
        </Link>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
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
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>
        {/* Navigation for desktop */}
        <nav className="hidden md:block">
          <ul className="flex gap-4">
            <li><Link to="/" className="hover:text-blue-600">Ballina</Link></li>
            <li><Link to="/rrethxhamis" className="hover:text-blue-600">Rreth Xhamis</Link></li>
            <li><Link to="/aktivitetejavore" className="hover:text-blue-600">Aktivitet Javore</Link></li>
            <li><Link to="/dhuroperxhamin" className="hover:text-blue-600">Dhuro per Xhamin</Link></li>
            <li><Link to="/kontakti" className="hover:text-blue-600">Kontakti</Link></li>
          </ul>
        </nav>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li><Link to="/" className="hover:text-blue-600" onClick={toggleMenu}>Ballina</Link></li>
            <li><Link to="/rrethxhamis" className="hover:text-blue-600" onClick={toggleMenu}>Rreth Xhamis</Link></li>
            <li><Link to="/aktivitetejavore" className="hover:text-blue-600" onClick={toggleMenu}>Aktivitet Javore</Link></li>
            <li><Link to="/dhuroperxhamin" className="hover:text-blue-600" onClick={toggleMenu}>Dhuro per Xhamin</Link></li>
            <li><Link to="/kontakti" className="hover:text-blue-600" onClick={toggleMenu}>Kontakti</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}