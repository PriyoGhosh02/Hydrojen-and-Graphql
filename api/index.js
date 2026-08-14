import server from '../dist/server/index.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const env = {
    ...process.env,
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || 'priyoghosh.myshopify.com',
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN,
    PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID,
    PRIVATE_STOREFRONT_API_TOKEN: process.env.PRIVATE_STOREFRONT_API_TOKEN,
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
    SHOP_ID: process.env.SHOP_ID,
    SESSION_SECRET: process.env.SESSION_SECRET,
  };

  const executionContext = {
    waitUntil(promise) {
      if (promise && typeof promise.then === 'function') {
        promise.catch((err) => console.error('ExecutionContext background task error:', err));
      }
    },
  };

  return server.fetch(request, env, executionContext);
}
