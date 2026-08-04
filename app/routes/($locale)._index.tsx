import { Suspense } from 'react';
import { Await } from 'react-router';
import { HeroSection } from '~/components/HeroSection';
import type { Route } from './+types/($locale)._index';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'PriyoGhosh | Fashion Store' }];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context }: Route.LoaderArgs) {
  const [{ collections }, { metaobject }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HERO_BANNER_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    heroBanner: metaobject,
  };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { recommendedProducts, heroBanner } = loaderData;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection heroBanner={heroBanner} />

      {/* ✅ Simple Test - Without FeaturedProducts component */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Products
        </h2>

        <Suspense fallback={<p className="text-center text-xl">Loading...</p>}>
          <Await resolve={recommendedProducts}>
            {(response) => {
              const products = response?.products?.nodes || [];

              console.log('Total products:', products.length);
              console.log('First product:', products[0]?.title);

              if (products.length === 0) {
                return <p className="text-center text-red-500">No products</p>;
              }

              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {products.map((product: any) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 p-4 text-center"
                    >
                      {/* Simple Image */}
                      {product.featuredImage && (
                        <img
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="w-full h-64 object-cover mb-4"
                        />
                      )}

                      {/* Title */}
                      <h3 className="font-bold text-lg mb-2">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <p className="text-gray-600">
                        {product.priceRange.minVariantPrice.currencyCode}{' '}
                        {product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </section>
    </div>
  );
}

// Loading Skeleton
function ProductsSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[3/4] rounded"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const HERO_BANNER_QUERY = `#graphql
  query HeroBanner {
    metaobject(handle: {handle: "never-hunt-alone", type: "hero"}) {
      field(key: "hero_media") {
        value
      }
    }
  }
` as const;
