import { useState, Suspense } from 'react';
import { Link, useLocation, useRouteLoaderData, Await } from 'react-router';
import type { RootLoader } from '~/root';
import { openCartDrawer } from '~/components/CartDrawer';
import { useAside } from '~/components/Aside';

// Cart Icon Component
function CartIcon({ count }: { count: number }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCartDrawer();
  };

  return (
    <Link
      to="/cart"
      onClick={handleClick}
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
          className="absolute -top-1 -right-1 bg-accent text-white 
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
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Bundle Builder', path: '/bundle' },
  { name: 'New Arrivals', path: '/collections/new-arrivals' },
  { name: 'Sale', path: '/collections/sale' },
  { name: 'About', path: '/pages/about' },
];

function parseMenuUrl(url: string, publicStoreDomain: string) {
  if (!url) return '';
  if (url === '#' || url.endsWith('#')) return '#';
  try {
    const parsed = new URL(url);
    const domain = publicStoreDomain.replace('https://', '').replace('http://', '');
    if (parsed.host.includes(domain) || parsed.host.includes('myshopify.com')) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
    return url;
  } catch {
    return url;
  }
}

// Main Header Component
export function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const aside = useAside();

  const rootData = useRouteLoaderData<RootLoader>('root');
  const menu = rootData?.header?.menu;
  const publicStoreDomain = rootData?.publicStoreDomain || '';

  const menuItems = menu?.items || NAV_LINKS.map(link => ({
    id: link.path,
    title: link.name,
    url: link.path,
    items: []
  }));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-widest uppercase 
                       text-primary hover:text-accent transition-colors"
          >
            TIMECRAFTS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item: any) => {
              const url = parseMenuUrl(item.url, publicStoreDomain);
              const hasChildren = item.items && item.items.length > 0;

              if (hasChildren) {
                return (
                  <div key={item.id} className="relative group py-2">
                    <button
                      className="flex items-center text-sm font-medium tracking-wide uppercase
                                 transition-colors hover:text-accent text-gray-600 focus:outline-none cursor-pointer"
                    >
                      <span>{item.title}</span>
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {/* Dropdown Menu */}
                    <div
                      className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-none shadow-xl 
                                 opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                 transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <div className="py-2">
                        {item.items.map((child: any) => {
                          const childUrl = parseMenuUrl(child.url, publicStoreDomain);
                          return (
                            <Link
                              key={child.id}
                              to={childUrl}
                              className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-600 
                                         hover:text-accent hover:bg-gray-50 transition-colors"
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={url}
                  className={`text-sm font-medium tracking-wide uppercase
                             transition-colors hover:text-accent
                             ${location.pathname === url
                      ? 'text-accent border-b-2 border-accent pb-1'
                      : 'text-gray-600'
                    }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => aside.open('search')}
              aria-label="Search"
              className="p-2 hover:opacity-70 transition-opacity text-gray-700 hover:text-accent focus:outline-none cursor-pointer"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Account Icon (Desktop only) */}
            <Link
              to="/account"
              aria-label="Account"
              className="p-2 hover:opacity-70 transition-opacity text-gray-700 hover:text-accent hidden md:block"
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
            <Suspense fallback={<CartIcon count={0} />}>
              <Await resolve={rootData?.cart}>
                {(cart) => {
                  return <CartIcon count={cart?.totalQuantity || 0} />;
                }}
              </Await>
            </Suspense>

            {/* 3-Dot Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-accent focus:outline-none"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open mobile menu"
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
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Slide-Over Overlay Menu (Opens ABOVE main page) */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Side Drawer Panel */}
            <div className="relative w-4/5 max-w-xs h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <span className="text-sm font-bold tracking-widest uppercase text-primary font-sans">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-black focus:outline-none"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Drawer Navigation Links */}
                <nav className="p-5 flex flex-col space-y-4">
                  {menuItems.map((item: any) => {
                    const url = parseMenuUrl(item.url, publicStoreDomain);
                    const hasChildren = item.items && item.items.length > 0;

                    return (
                      <div key={item.id} className="flex flex-col">
                        {hasChildren ? (
                          <>
                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase py-1">
                              {item.title}
                            </span>
                            <div className="pl-3 flex flex-col space-y-2.5 mt-1 border-l-2 border-accent/30">
                              {item.items.map((child: any) => {
                                const childUrl = parseMenuUrl(child.url, publicStoreDomain);
                                return (
                                  <Link
                                    key={child.id}
                                    to={childUrl}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-xs font-medium tracking-wide uppercase py-1 transition-colors hover:text-accent
                                               ${location.pathname === childUrl ? 'text-accent font-semibold' : 'text-gray-700'}`}
                                  >
                                    {child.title}
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <Link
                            to={url}
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-sm font-medium tracking-wide uppercase py-1.5 transition-colors hover:text-accent
                                       ${location.pathname === url ? 'text-accent font-semibold' : 'text-gray-800'}`}
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Section: Account Link moved below menu items */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/70">
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-primary hover:text-accent py-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-accent"
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
                  <span>Account</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
