import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router';
import type { Route } from './+types/bundle';
import { BUNDLE_PRODUCTS_QUERY } from '~/graphql/bundleProducts';
import { BundleSection } from '~/components/BundleSection/BundleSection';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Luxury Bundle Builder | TimeCrafts' },
    {
      name: 'description',
      content: 'Mix and match one luxury watch and one premium bracelet. Get 30% off your custom bundle automatically at checkout.',
    },
  ];
};

export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  // Defer the query for quick page initialization and skeleton mounting
  const bundleData = storefront
    .query(BUNDLE_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error('Failed to load bundle collections:', error);
      return null;
    });

  return {
    bundleData,
  };
}

export default function BundleRoute() {
  const { bundleData } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 mt-4">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.25em] mb-3 block">
          Exclusive Pairing
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary leading-tight">
          Bundle & Save 30%
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
          Create your perfect style combination. Select exactly <span className="text-primary font-bold">1 Luxury Watch</span> and <span className="text-primary font-bold">1 Premium Bracelet</span>, and enjoy an automatic <span className="text-accent font-extrabold">30% discount</span> applied to your custom set.
        </p>
      </div>

      {/* Suspense wrapper with Skeleton Loader */}
      <Suspense fallback={<BundleSkeleton />}>
        <Await resolve={bundleData} errorElement={<BundleError />}>
          {(resolvedData) => {
            if (!resolvedData) {
              return <BundleError />;
            }

            // Extract watch nodes from base handle watches, falling back to watch-1
            const watches =
              resolvedData.watches?.products?.nodes ||
              resolvedData.watchesFallback?.products?.nodes ||
              [];

            // Extract bracelet nodes from base handle bracelets, falling back to bracelet-1
            const bracelets =
              resolvedData.bracelets?.products?.nodes ||
              resolvedData.braceletsFallback?.products?.nodes ||
              [];

            if (watches.length === 0 && bracelets.length === 0) {
              return <BundleError message="No products are currently available in the bundle collections." />;
            }

            return <BundleSection watches={watches as any} bracelets={bracelets as any} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

function BundleError({ message = 'Unable to load bundle products.' }: { message?: string }) {
  return (
    <div className="text-center py-16 px-6 border border-red-100 bg-red-50/20 rounded-2xl max-w-lg mx-auto animate-fade-in">
      <span className="text-4xl">⚠️</span>
      <h3 className="text-sm font-black text-red-800 uppercase tracking-widest mt-4">
        {message}
      </h3>
      <p className="text-xs text-red-500 mt-2 leading-relaxed font-light">
        There was an error retrieving the items from Shopify Storefront API. Please verify collection handles are set to 'watches' & 'bracelets' or fallback 'watch-1' & 'bracelet-1'.
      </p>
    </div>
  );
}

function BundleSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-10 animate-pulse">
      {/* 4 Column Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {[1, 2, 3, 4].map((colIndex) => (
          <div
            key={colIndex}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 min-h-[450px]"
          >
            {/* Column Title Skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Column Body Skeletons */}
            <div className="flex-1 flex flex-col gap-3 mt-2">
              {colIndex % 2 !== 0 ? (
                // Lists cards skeleton
                [1, 2, 3, 4].map((cardIndex) => (
                  <div
                    key={cardIndex}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100/60"
                  >
                    <div className="w-12 h-12 rounded bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Configurator column skeleton
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="aspect-square bg-gray-150 rounded-xl w-full"></div>
                    <div className="space-y-2">
                      <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3.5 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-xl w-full mt-4"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Banner Skeleton */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 h-24 w-full"></div>
    </div>
  );
}
