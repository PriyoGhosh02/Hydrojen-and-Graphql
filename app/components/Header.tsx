import { useState, Suspense } from 'react';
import { Link, useLocation, useRouteLoaderData, Await } from 'react-router';
import type { RootLoader } from '~/root';
import { openCartDrawer } from '~/components/CartDrawer';

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
            <Suspense fallback={<CartIcon count={0} />}>
              <Await resolve={rootData?.cart}>
                {(cart) => {
                  return <CartIcon count={cart?.totalQuantity || 0} />;
                }}
              </Await>
            </Suspense>

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
              {menuItems.map((item: any) => {
                const url = parseMenuUrl(item.url, publicStoreDomain);
                const hasChildren = item.items && item.items.length > 0;

                return (
                  <div key={item.id} className="flex flex-col">
                    {hasChildren ? (
                      <>
                        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase px-2 py-1">
                          {item.title}
                        </span>
                        <div className="pl-4 flex flex-col space-y-3 mt-1">
                          {item.items.map((child: any) => {
                            const childUrl = parseMenuUrl(child.url, publicStoreDomain);
                            return (
                              <Link
                                key={child.id}
                                to={childUrl}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-xs font-medium tracking-wide uppercase px-2 py-1 transition-colors hover:text-accent
                                           ${location.pathname === childUrl ? 'text-accent' : 'text-gray-600'}`}
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
                        className={`text-sm font-medium tracking-wide uppercase px-2 py-1 transition-colors hover:text-accent
                                   ${location.pathname === url ? 'text-accent' : 'text-gray-600'}`}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
