import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  try {
    const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
      variables: {
        ...paginationVariables,
        query,
        language: customerAccount.i18n.language,
      },
    });

    if (!data?.customer || errors?.length) {
      return {
        customer: {
          orders: {
            nodes: [],
            pageInfo: {hasPreviousPage: false, hasNextPage: false},
          },
        },
        filters,
      };
    }

    return {customer: data.customer, filters};
  } catch (err: any) {
    console.warn('Customer orders query notice:', err?.message || err);
    return {
      customer: {
        orders: {
          nodes: [],
          pageInfo: {hasPreviousPage: false, hasNextPage: false},
        },
      },
      filters,
    };
  }
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="orders">
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="py-16 text-center bg-white border border-gray-100 shadow-xs max-w-xl mx-auto p-8 font-sans">
      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {hasFilters ? (
        <>
          <h3 className="text-base font-bold text-primary uppercase tracking-wider mb-2">No Matching Orders</h3>
          <p className="text-sm text-gray-500 font-light mb-6">No orders found matching your filter criteria.</p>
          <Link
            to="/account/orders"
            className="inline-block px-6 py-3 bg-primary hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300"
          >
            Clear Filters
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-base font-bold text-primary uppercase tracking-wider mb-2">No Orders Placed Yet</h3>
          <p className="text-sm text-gray-500 font-light mb-6">
            You haven&apos;t placed any orders yet. Discover our curated collection of luxury timepieces and bracelets.
          </p>
          <Link
            to="/collections/all"
            className="inline-block px-8 py-3.5 bg-primary hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm"
          >
            Explore Collections
          </Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 p-6 mb-8 font-sans shadow-xs"
      aria-label="Search orders"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Search by Order # (e.g. 1001)"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-xs font-light text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
          />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-xs font-light text-primary placeholder-gray-400 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSearching}
            className="bg-primary hover:bg-[#d4af37] text-white hover:text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Filter'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className="bg-white border border-gray-100 p-6 mb-4 font-sans hover:border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="text-base font-bold text-primary hover:text-accent transition-colors"
          >
            Order #{order.number}
          </Link>
          <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-800 rounded-xs">
            {order.financialStatus || 'PAID'}
          </span>
          {fulfillmentStatus && (
            <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded-xs">
              {fulfillmentStatus}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 font-light">
          Placed on {new Date(order.processedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        {order.confirmationNumber && (
          <p className="text-xs text-gray-400 font-light">
            Confirmation Ref: <span className="font-mono">{order.confirmationNumber}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
        <div className="text-left md:text-right">
          <span className="block text-xs text-gray-400 font-light uppercase tracking-wider">Total</span>
          <span className="text-sm font-bold text-primary">
            <Money data={order.totalPrice} />
          </span>
        </div>

        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-primary text-gray-800 hover:text-white border border-gray-200 hover:border-primary text-xs font-bold uppercase tracking-wider transition-all duration-300"
        >
          <span>View Details</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
