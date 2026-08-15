import { data as remixData, Link, redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/account_.login';

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Check if demo mode requested
  if (url.searchParams.get('demo') === 'true') {
    return redirect('/account?demo=true', {
      headers: {
        'Set-Cookie': 'demo_customer=true; Path=/; HttpOnly; SameSite=Lax',
      },
    });
  }

  const acrValues = url.searchParams.get('acr_values') || undefined;
  const loginHint = url.searchParams.get('login_hint') || undefined;
  const loginHintMode = url.searchParams.get('login_hint_mode') || undefined;
  const locale = url.searchParams.get('locale') || undefined;

  try {
    return await context.customerAccount.login({
      countryCode: context.storefront.i18n.country,
      acrValues,
      loginHint,
      loginHintMode,
      locale,
    });
  } catch (err: any) {
    // If it's a redirect Response object (thrown by React Router / Hydrogen for OAuth redirect), rethrow it!
    if (err instanceof Response) {
      throw err;
    }

    console.warn('Customer Account Login notice:', err?.message || err);
    return remixData({
      errorNotice: err?.message || 'Customer Account API OAuth requires a Hydrogen tunnel in local development.',
      isLocalDev: true,
    });
  }
}

export default function AccountLogin() {
  const data = useLoaderData<typeof loader>();
  const errorNotice = data?.errorNotice;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans min-h-[70vh] flex items-center justify-center">
      <div className="w-full bg-white border border-gray-200 shadow-xl overflow-hidden p-8 sm:p-12">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-widest mb-3">
            Local Development Mode
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal text-primary tracking-tight mb-3">
            Shopify Customer Account Authentication
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
            Shopify Customer Account API OAuth requires an HTTPS tunnel during local development.
          </p>
        </div>

        {errorNotice && (
          <div className="bg-gray-50 border-l-4 border-accent p-6 mb-8 text-left space-y-3 font-mono text-xs text-gray-800">
            <p className="font-semibold text-primary font-sans text-sm">CLI Tunnel Command:</p>
            <div className="bg-primary text-gray-100 p-3.5 select-all flex items-center justify-between">
              <code>npx shopify hydrogen dev --customer-account-push</code>
            </div>
            <p className="text-[11px] text-gray-500 font-sans font-light">
              Run the command above in your terminal, then open the generated tunnel URL (<code className="text-accent">https://*.tryhydrogen.dev</code>) to test live OAuth with Shopify.
            </p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account?demo=true"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md text-center"
          >
            Launch Customer Portal (Demo Mode)
          </Link>

          <Link
            to="/account"
            className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-widest transition-all duration-300 text-center"
          >
            Back to Account Page
          </Link>
        </div>
      </div>
    </div>
  );
}
