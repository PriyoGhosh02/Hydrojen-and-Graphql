import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {getLocaleFromRequest} from '~/lib/i18n';

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
} as const;

type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
  interface HydrogenCustomCartFragment extends CartApiQueryFragment {}
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  const sessionSecret =
    env?.SESSION_SECRET || '5894f0bdb2351f9684411c11c436399f0e6ae688';

  let cache: Cache | undefined;
  try {
    if (typeof caches !== 'undefined' && typeof caches.open === 'function') {
      cache = await caches.open('hydrogen');
    }
  } catch (e) {
    cache = undefined;
  }

  const session = await AppSession.init(request, [sessionSecret]);
  const waitUntil =
    executionContext?.waitUntil
      ? executionContext.waitUntil.bind(executionContext)
      : () => {};

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromRequest(request),
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}
