import {
  data as remixData,
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import type {CustomerFragment} from 'customer-accountapi.generated';

const DEMO_CUSTOMER: CustomerFragment = {
  id: 'gid://shopify/Customer/123456789',
  firstName: 'Alexander',
  lastName: 'Vance',
  emailAddress: { emailAddress: 'alexander.vance@timecrafts.com' },
  defaultAddress: {
    id: 'gid://shopify/CustomerAddress/1',
    firstName: 'Alexander',
    lastName: 'Vance',
    company: 'TimeCrafts Club',
    address1: '742 Evergreen Terrace',
    address2: 'Suite 400',
    city: 'New York',
    zoneCode: 'NY',
    zip: '10001',
    territoryCode: 'US',
    phoneNumber: '+12125550199',
  },
  addresses: {
    nodes: [
      {
        id: 'gid://shopify/CustomerAddress/1',
        firstName: 'Alexander',
        lastName: 'Vance',
        company: 'TimeCrafts Club',
        address1: '742 Evergreen Terrace',
        address2: 'Suite 400',
        city: 'New York',
        zoneCode: 'NY',
        zip: '10001',
        territoryCode: 'US',
        phoneNumber: '+12125550199',
      },
    ],
  },
  orders: {
    nodes: [
      {
        id: 'gid://shopify/CustomerOrder/1001',
        number: 1001,
        processedAt: '2026-08-10T14:32:00Z',
        financialStatus: 'PAID',
        fulfillmentStatus: 'FULFILLED',
        confirmationNumber: 'TC-984321',
        totalPrice: { amount: '1250.00', currencyCode: 'USD' },
        fulfillments: { nodes: [{ status: 'SUCCESS' }] },
      },
      {
        id: 'gid://shopify/CustomerOrder/1002',
        number: 1002,
        processedAt: '2026-08-14T09:15:00Z',
        financialStatus: 'PAID',
        fulfillmentStatus: 'IN_TRANSIT',
        confirmationNumber: 'TC-984322',
        totalPrice: { amount: '3400.00', currencyCode: 'USD' },
        fulfillments: { nodes: [{ status: 'IN_TRANSIT' }] },
      },
    ],
  },
} as unknown as CustomerFragment;

export function shouldRevalidate() {
  return true;
}

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const url = new URL(request.url);
  const cookieHeader = request.headers.get('Cookie') || '';
  const isDemoQuery = url.searchParams.get('demo') === 'true';
  const isDemoCookie = cookieHeader.includes('demo_customer=true');
  const isDemoExit = url.searchParams.get('demo') === 'false';

  if (isDemoExit) {
    return remixData(
      { isLoggedIn: false, customer: null, isDemo: false },
      {
        headers: {
          'Set-Cookie': 'demo_customer=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        },
      },
    );
  }

  if (isDemoQuery || isDemoCookie) {
    return remixData(
      { isLoggedIn: true, customer: DEMO_CUSTOMER, isDemo: true },
      {
        headers: {
          'Set-Cookie': 'demo_customer=true; Path=/; HttpOnly; SameSite=Lax',
        },
      },
    );
  }

  try {
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return remixData(
        {
          isLoggedIn: false,
          customer: null,
          isDemo: false,
        },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        },
      );
    }

    const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
      variables: {
        language: customerAccount.i18n.language,
      },
    });

    if (!data?.customer || errors?.length) {
      return remixData(
        {
          isLoggedIn: false,
          customer: null,
          isDemo: false,
        },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        },
      );
    }

    return remixData(
      {
        isLoggedIn: true,
        customer: data.customer,
        isDemo: false,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (err: any) {
    console.warn('Customer account loader notice:', err?.message || err);
    return remixData({
      isLoggedIn: false,
      customer: null,
      isDemo: false,
    });
  }
}

export default function AccountLayout() {
  const {isLoggedIn, customer, isDemo} = useLoaderData<typeof loader>();

  if (!isLoggedIn || !customer) {
    return <AccountLoginSection />;
  }

  const heading = customer.firstName
    ? `Welcome back, ${customer.firstName}`
    : `Welcome to your account`;

  const email = customer.emailAddress?.emailAddress;
  const orderCount = customer.orders?.nodes?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-sans min-h-[65vh]">
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold uppercase tracking-wider text-[10px]">Demo Mode</span>
            <span>You are previewing the customer portal in local demo mode.</span>
          </div>
          <Link
            to="/account?demo=false"
            className="font-bold uppercase tracking-wider text-amber-900 hover:text-black underline shrink-0"
          >
            Exit Demo Mode
          </Link>
        </div>
      )}

      {/* Logged In Header Banner */}
      <div className="mb-10 bg-gradient-to-r from-primary via-[#1a1a1a] to-primary text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[#d4af37] text-xs font-bold tracking-[0.25em] uppercase mb-2">
              Gentleman VIP Portal
            </p>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-white mb-2">
              {heading}
            </h1>
            {email && (
              <p className="text-xs sm:text-sm text-gray-300 font-light flex items-center gap-2">
                <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
            <div className="text-center md:text-left">
              <span className="block text-2xl font-semibold text-[#d4af37]">{orderCount}</span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400">Total Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <AccountMenu />

      {/* Sub-page content */}
      <div className="mt-8">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}

function AccountLoginSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-100 shadow-xl overflow-hidden">
        {/* Left Side - Login Form Card */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <p className="text-[#d4af37] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
              TimeCrafts Portal
            </p>
            <h1 className="text-2xl sm:text-3xl font-normal text-primary tracking-tight mb-2">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light mb-8">
              Access your order history, manage addresses, and enjoy seamless checkout.
            </p>

            <form
              action="/account/login"
              method="GET"
              className="space-y-5"
            >
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="login_hint"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-light text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="pass" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-light text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#d4af37] text-white hover:text-black py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-col space-y-3 text-center">
              <Link
                to="/account?demo=true"
                className="w-full py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>⚡ Preview Account Portal (Demo Mode)</span>
              </Link>

              <a
                href="/account/login"
                className="inline-flex items-center justify-center text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-accent transition-colors pt-1"
              >
                Log in via Shopify Customer Account OAuth
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-light">
              Don&apos;t have an account yet?{' '}
              <Link to="/account?demo=true" className="font-semibold text-primary hover:text-accent underline">
                Create Demo Account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - VIP Benefits Visual Banner */}
        <div className="bg-primary p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-6">
              VIP Privileges
            </span>
            <h2 className="text-2xl font-normal leading-snug mb-6">
              Experience Exclusive Gentleman Services
            </h2>

            <ul className="space-y-4 text-xs font-light text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-[#d4af37] font-bold text-sm">✓</span>
                <span>Track real-time shipment updates & order status</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#d4af37] font-bold text-sm">✓</span>
                <span>Save multiple delivery addresses for faster checkout</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#d4af37] font-bold text-sm">✓</span>
                <span>Priority access to limited edition watch drops</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#d4af37] font-bold text-sm">✓</span>
                <span>Dedicated TimeCrafts concierge customer support</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
            <p className="text-[11px] text-gray-400 font-light">
              Need assistance with your account?{' '}
              <Link to="/pages/about" className="text-[#d4af37] hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <nav className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4">
      <NavLink
        to="/account/orders"
        className={({isActive}) =>
          `px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
            isActive
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-black'
          }`
        }
      >
        Orders
      </NavLink>

      <NavLink
        to="/account/profile"
        className={({isActive}) =>
          `px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
            isActive
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-black'
          }`
        }
      >
        Profile
      </NavLink>

      <NavLink
        to="/account/addresses"
        className={({isActive}) =>
          `px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
            isActive
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-black'
          }`
        }
      >
        Addresses
      </NavLink>

      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="sm:ml-auto" method="POST" action="/account/logout">
      <button
        type="submit"
        className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 transition-all cursor-pointer"
      >
        Sign Out
      </button>
    </Form>
  );
}
