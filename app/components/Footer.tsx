import { useState } from 'react';
import { NavLink } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer?: FooterQuery | Promise<FooterQuery | null> | null | any;
  header?: HeaderQuery | null | any;
  publicStoreDomain?: string;
}

export function Footer({
  footer,
  header,
  publicStoreDomain = '',
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const mainMenu = header?.menu?.items || FALLBACK_MAIN_MENU;
  const footerMenu = footer?.menu?.items || FALLBACK_FOOTER_MENU;
  const brandName = header?.shop?.name || 'TIMECRAFTS';
  const primaryDomainUrl = header?.shop?.primaryDomain?.url || '';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const sanitizeUrl = (url: string) => {
    if (!url) return '/';
    if (
      url.includes('myshopify.com') ||
      (publicStoreDomain && url.includes(publicStoreDomain)) ||
      (primaryDomainUrl && url.includes(primaryDomainUrl))
    ) {
      try {
        return new URL(url).pathname;
      } catch {
        return url;
      }
    }
    return url;
  };

  return (
    <footer className="relative z-10 w-full bg-[#f6f6f6] text-primary border-t border-gray-200/80 pt-12 sm:pt-20 pb-8 sm:pb-12 font-sans select-none">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 pb-12 sm:pb-16 border-b border-gray-300/70">
          {/* Column 1: Brand Info & Social Icons */}
          <div className="flex flex-col items-start">
            <h3 className="text-3xl font-bold tracking-[0.2em] uppercase text-primary mb-4 font-sans text-[#d8b74b]">
              {/* {brandName} */}
              TIMECRAFTS
            </h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-6 max-w-sm">
              Curators of exceptional horology and bespoke jewelry. Authentic timepieces crafted for precision, elegance, and enduring luxury.
            </p>

            {/* 4 Social Icons */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-2xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-2xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-2xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Main Menu (Handle: main-menu-hydro) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {mainMenu.map((item: any) => {
                if (!item?.title) return null;
                const path = sanitizeUrl(item.url || '/');
                const isExternal = path.startsWith('http');

                return (
                  <li key={item.id || item.title}>
                    {isExternal ? (
                      <a
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-light"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <NavLink
                        to={path}
                        className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-light"
                      >
                        {item.title}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Footer Menu (Handle: footer) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-5">
              Information
            </h4>
            <ul className="space-y-3">
              {footerMenu.map((item: any) => {
                if (!item?.title) return null;
                const path = sanitizeUrl(item.url || '/');
                const isExternal = path.startsWith('http');

                return (
                  <li key={item.id || item.title}>
                    {isExternal ? (
                      <a
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-light"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <NavLink
                        to={path}
                        className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-light"
                      >
                        {item.title}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-5">
              Newsletter
            </h4>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
              Subscribe for exclusive access to curated drops, private horology events, and seasonal offers.
            </p>

            {subscribed ? (
              <div className="p-4 bg-white border border-accent/40 text-xs text-primary font-medium">
                Thank you for subscribing to our private list.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-sm font-light text-primary placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-light">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <p className="text-gray-400">Precision Horology & Luxury Collections</p>
        </div>
      </div>
    </footer>
  );
}

const FALLBACK_MAIN_MENU = [
  { id: '1', title: 'Home', url: '/' },
  { id: '2', title: 'Watch', url: '/collections/watch-1' },
  { id: '3', title: 'Bracelet', url: '/collections/bracelet-1' },
  { id: '4', title: 'Contact', url: '/pages/contact' },
];

const FALLBACK_FOOTER_MENU = [
  { id: '1', title: 'Privacy Policy', url: '/policies/privacy-policy' },
  { id: '2', title: 'Refund Policy', url: '/policies/refund-policy' },
  { id: '3', title: 'Shipping Policy', url: '/policies/shipping-policy' },
  { id: '4', title: 'Terms of Service', url: '/policies/terms-of-service' },
];
