import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

const COLLECTIONS_HERO_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop';

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const totalCount = collections?.nodes?.length || 0;

  return (
    <div className="collections-index-page font-sans min-h-screen bg-white">
      {/* 1. TOP COLLECTIONS HERO BANNER: 30% VIEWPORT HEIGHT (~30vh) */}
      <section className="relative w-full h-[30vh] min-h-[280px] max-h-[360px] overflow-hidden flex items-center justify-center bg-[#121212] text-white select-none">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src={COLLECTIONS_HERO_IMAGE}
            alt="TimeCrafts Collections"
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
            <span className="text-gray-300 font-light">Collections</span>
          </nav>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-white uppercase mb-3">
            Our Watch Collections
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-2xl mx-auto leading-relaxed line-clamp-2">
            Explore curated series of luxury automatic timepieces, executive chronographs, and artisanal accessories.
          </p>
        </div>
      </section>

      {/* 2. COLLECTIONS CONTENT & CARDS GRID */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Showing {totalCount} Curated Categories
            </span>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Hand-picked horology collections for gentlemen
            </p>
          </div>
        </div>

        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {({node: collection, index}) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </section>
    </div>
  );
}

function CollectionCard({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative flex flex-col h-80 sm:h-96 overflow-hidden bg-gray-900 shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-500 select-none"
    >
      {/* Image */}
      {collection?.image ? (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="4/3"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(min-width: 45em) 500px, 100vw"
          className="w-full h-full object-cover object-center opacity-75 group-hover:opacity-90 group-hover:scale-108 transition-all duration-700 ease-out"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary via-[#24180d] to-[#121212] opacity-80 group-hover:scale-105 transition-transform duration-700" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-colors duration-500"></div>

      {/* Card Content */}
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left z-10">
        <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-[0.3em] mb-2">
          TimeCrafts Series
        </span>
        <h3 className="text-xl sm:text-2xl font-normal text-white uppercase tracking-wider mb-4 group-hover:text-[#d4af37] transition-colors">
          {collection.title}
        </h3>
        <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white group-hover:translate-x-1.5 transition-transform duration-300">
          <span>Explore Collection</span>
          <svg className="w-4 h-4 ml-2 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
