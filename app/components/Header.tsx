import {useState} from 'react';
import {Link, useLocation} from 'react-router';

// Cart Icon Component
function CartIcon({count}: {count: number}) {
  return (
    <Link
      to="/cart"
      className="relative p-2 hover:opacity-70 transition-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-[#c9a96e] text-white 
                         text-xs w-5 h-5 rounded-full flex items-center 
                         justify-center font-medium"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

// Navigation Links
const NAV_LINKS = [
  {name: 'Home', path: '/'},
  {name: 'Collections', path: '/collections'},
  {name: 'New Arrivals', path: '/collections/new-arrivals'},
  {name: 'Sale', path: '/collections/sale'},
  {name: 'About', path: '/pages/about'},
];

// Main Header Component
export function Header({cartCount = 0}: {cartCount?: number}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-widest uppercase 
                       text-[#1a1a1a] hover:text-[#c9a96e] transition-colors"
          >
            PriyoGhosh
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide uppercase
                           transition-colors hover:text-[#c9a96e]
                           ${
                             location.pathname === link.path
                               ? 'text-[#c9a96e] border-b-2 border-[#c9a96e] pb-1'
                               : 'text-gray-600'
                           }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 hover:opacity-70 transition-opacity hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Account Icon */}
            <Link
              to="/account"
              className="p-2 hover:opacity-70 transition-opacity hidden md:block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <CartIcon count={cartCount} />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium tracking-wide uppercase
                             px-2 py-1 transition-colors hover:text-[#c9a96e]
                             ${
                               location.pathname === link.path
                                 ? 'text-[#c9a96e]'
                                 : 'text-gray-600'
                             }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
