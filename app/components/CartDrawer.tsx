import { Suspense, useEffect, useState } from 'react';
import { Await, useRouteLoaderData } from 'react-router';
import { CartMain } from '~/components/CartMain';
import type { RootLoader } from '~/root';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const rootData = useRouteLoaderData<RootLoader>('root');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-cart', handleOpen);
    window.addEventListener('close-cart', handleClose);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-cart', handleOpen);
      window.removeEventListener('close-cart', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const cart = rootData?.cart;

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Drawer Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col justify-between ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 h-16">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 m-0">
            Cart
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-black transition-colors text-2xl focus:outline-none cursor-pointer pb-1 bg-transparent border-0"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {cart ? (
            <Suspense fallback={<p className="text-gray-500 text-sm">Loading cart ...</p>}>
              <Await resolve={cart}>
                {(resolvedCart) => {
                  return (
                    <div className="h-full flex flex-col justify-between">
                      <CartMain cart={resolvedCart} layout="aside" />
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          ) : (
            <p className="text-gray-500 text-sm">Loading cart ...</p>
          )}
        </div>
      </div>
    </>
  );
}

export function openCartDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-cart'));
  }
}

export function closeCartDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('close-cart'));
  }
}
