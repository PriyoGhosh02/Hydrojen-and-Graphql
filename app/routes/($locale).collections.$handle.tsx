import { Link, redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics, Image } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';

const FALLBACK_COLLECTION_IMAGE =
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1920&auto=format&fit=crop';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `${data?.collection.title ?? ''} Collection | TimeCrafts` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{ collection }] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle, ...paginationVariables },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection,
  };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();
  const bannerImage = collection?.image?.url || FALLBACK_COLLECTION_IMAGE;
  const productCount = collection?.products?.nodes?.length || 0;

  return (
    <div className="collection-page font-sans min-h-screen bg-white">
      {/* 1. TOP COLLECTION HERO BANNER: 30% VIEWPORT HEIGHT (~30vh) */}
      <section className="relative w-full h-[30vh] min-h-[280px] max-h-[360px] overflow-hidden flex items-center justify-center bg-[#121212] text-white select-none">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImage}
            alt={collection?.image?.altText || collection?.title}
            className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70 backdrop-blur-[0.5px]"></div>
        </div>

        {/* Banner Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d4af37] mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-white transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-gray-300 font-light">{collection.title}</span>
          </nav>

          {/* Main Collection Title */}
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-white uppercase mb-3">
            {collection.title}
          </h1>

          {/* Collection Description */}
          {collection.description && (
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-2xl mx-auto leading-relaxed line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      {/* 2. COLLECTION CONTENT & PRODUCT GRID */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Filter & Count Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-sans">
              Showing {productCount} Timepieces
            </span>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Authentic horology, precision engineering & bespoke luxury.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Curated Catalog
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {({ node: product, index }) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
      </section>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
