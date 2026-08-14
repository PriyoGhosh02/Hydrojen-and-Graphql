import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import styles from '~/styles/tailwind.css?url';
import appStyles from '~/styles/app.css?url';
import { Suspense } from 'react';
import { Await } from 'react-router';
import { Aside } from '~/components/Aside';
import { CartMain } from '~/components/CartMain';
import { CartDrawer } from '~/components/CartDrawer';

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
  type ShouldRevalidateFunction,
} from 'react-router';
import favicon from '~/assets/fav.png';
import { Header } from '~/components/Header';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';
import type { Route } from './+types/root';
// ❌ PageLayout remove করো
// import {PageLayout} from './components/PageLayout';

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') return true;

  // Only revalidate layout when pathname changes, preventing root flashes on search parameter updates
  return currentUrl.pathname !== nextUrl.pathname;
};

export function links() {
  return [
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    { rel: 'preconnect', href: 'https://shop.app' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300..900;1,300..900&display=swap',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: appStyles },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const { storefront, env } = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

async function loadCriticalData({ context }: Route.LoaderArgs) {
  const { storefront } = context;
  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { headerMenuHandle: 'main-menu-hydro' },
    }),
  ]);
  return { header };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  const { storefront, customerAccount, cart } = context;
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { footerMenuHandle: 'footer' },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

// ✅ Layout — শুধু একটা Header
export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useNonce();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Aside.Provider>
          {/* ✅ শুধু আমাদের custom Header */}
          <Header />
          <CartDrawer />

          {/* ✅ Page content এখানে আসবে */}
          <main>{children}</main>
        </Aside.Provider>

        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

// ✅ App — PageLayout সরিয়ে দিলাম
export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      {/* ✅ সরাসরি Outlet — PageLayout নেই */}
      <Outlet />
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Oops</h1>
        <h2 className="text-2xl mt-2">{errorStatus}</h2>
        {errorMessage && <p className="mt-4 text-gray-600">{errorMessage}</p>}
      </div>
    </div>
  );
}
