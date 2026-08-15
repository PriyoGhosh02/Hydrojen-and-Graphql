import { data } from 'react-router';
import type { Route } from './+types/api.subscribe';

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  const formData = await request.formData();
  const email = formData.get('email')?.toString().trim();

  if (!email || !email.includes('@') || !email.includes('.')) {
    return data({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const { env } = context;
  const storeDomain = env.PUBLIC_STORE_DOMAIN || 'priyoghosh.myshopify.com';
  const adminToken = env.PRIVATE_STOREFRONT_API_TOKEN;

  if (!adminToken) {
    console.error('Missing PRIVATE_STOREFRONT_API_TOKEN in env');
    return data({ success: false, error: 'Server configuration error.' }, { status: 500 });
  }

  const adminGraphqlUrl = `https://${storeDomain}/admin/api/2024-07/graphql.json`;

  const fetchAdminApi = async (query: string, variables?: any) => {
    const res = await fetch(adminGraphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query, variables }),
    });
    return res.json();
  };

  try {
    // Step 1: Check if customer already exists in Shopify Admin
    // (Note: Plain multiline string used so Hydrogen codegen does not validate Admin API against Storefront schema)
    const findCustomerQuery = `
      query findCustomer($query: String!) {
        customers(first: 1, query: $query) {
          nodes {
            id
            email
            emailMarketingConsent {
              marketingState
            }
          }
        }
      }
    `;

    const findResult = await fetchAdminApi(findCustomerQuery, { query: `email:${email}` });
    const existingCustomer = findResult?.data?.customers?.nodes?.[0];

    if (existingCustomer?.id) {
      // Step 2A: Customer exists -> Update Email Marketing Consent to SUBSCRIBED
      const updateConsentMutation = `
        mutation updateConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
          customerEmailMarketingConsentUpdate(input: $input) {
            customer {
              id
              email
              emailMarketingConsent {
                marketingState
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const updateResult = await fetchAdminApi(updateConsentMutation, {
        input: {
          customerId: existingCustomer.id,
          emailMarketingConsent: {
            marketingState: 'SUBSCRIBED',
            marketingOptInLevel: 'SINGLE_OPT_IN',
          },
        },
      });

      const userErrors = updateResult?.data?.customerEmailMarketingConsentUpdate?.userErrors || [];
      if (userErrors.length > 0) {
        console.error('Admin API Consent Update Error:', userErrors);
        return data({ success: false, error: userErrors[0]?.message || 'Failed to update subscription.' });
      }

      return data({
        success: true,
        email,
        message: `Your email (${email}) is now subscribed in Shopify Admin!`,
      });
    } else {
      // Step 2B: New Customer -> Create customer record with SUBSCRIBED marketing consent
      const createCustomerMutation = `
        mutation createCustomer($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
              emailMarketingConsent {
                marketingState
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const createResult = await fetchAdminApi(createCustomerMutation, {
        input: {
          email,
          emailMarketingConsent: {
            marketingState: 'SUBSCRIBED',
            marketingOptInLevel: 'SINGLE_OPT_IN',
          },
        },
      });

      const userErrors = createResult?.data?.customerCreate?.userErrors || [];
      if (userErrors.length > 0) {
        console.error('Admin API Customer Create Error:', userErrors);
        return data({ success: false, error: userErrors[0]?.message || 'Subscription failed.' });
      }

      return data({
        success: true,
        email,
        message: `Welcome! Your email (${email}) has been subscribed in Shopify Admin.`,
      });
    }
  } catch (err: any) {
    console.error('Subscription Action Error:', err);
    return data({ success: false, error: 'Subscription request failed. Please try again.' }, { status: 500 });
  }
}
