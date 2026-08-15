import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: Route.LoaderArgs) {
  try {
    await context.customerAccount.handleAuthStatus();
  } catch (err) {
    console.warn('Customer handleAuthStatus notice:', err);
  }

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="max-w-2xl bg-white border border-gray-100 shadow-xs p-6 sm:p-8 font-sans">
      <h2 className="text-xl font-bold text-primary uppercase tracking-wider mb-6">
        Personal Information
      </h2>
      <Form method="PUT" className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Email Address (Primary)
          </label>
          <input
            id="email"
            type="email"
            readOnly
            disabled
            value={customer?.emailAddress?.emailAddress ?? ''}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-sm font-medium text-gray-600 cursor-not-allowed"
          />
          <span className="text-[11px] text-gray-400 mt-1 block">Your email address is managed via your Shopify account.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              defaultValue={customer?.firstName ?? ''}
              minLength={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-light text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              defaultValue={customer?.lastName ?? ''}
              minLength={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-light text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {action?.error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {action.error}
          </div>
        )}

        {action && !action.error && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile information updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={state !== 'idle'}
          className="bg-primary hover:bg-[#d4af37] text-white hover:text-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {state !== 'idle' ? 'Updating Profile...' : 'Save Profile Changes'}
        </button>
      </Form>
    </div>
  );
}
