import { Suspense } from 'react';
import { Await } from 'react-router';
import { FeaturedProducts } from '~/components/FeaturedProducts';
import { HeroSection } from '~/components/HeroSection';
import { FeaturedCollections } from '~/components/FeaturedCollections';
import { ImageWithText } from '~/components/ImageWithText';
import { BrandShowcase } from '~/components/BrandShowcase';
import type { Route } from './+types/($locale)._index';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'TimeCrafts | Luxury Watches' }];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context }: Route.LoaderArgs) {
  const [{ collections }, { metaobject }, { metaobject: imageWithText }, { metaobject: brandShowcase }, recommendedProducts] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTIONS_QUERY),
    context.storefront.query(HERO_BANNER_QUERY),
    context.storefront.query(IMAGE_WITH_TEXT_QUERY),
    context.storefront.query(BRAND_SHOWCASE_QUERY).catch(() => ({ metaobject: null })),
    context.storefront.query(RECOMMENDED_PRODUCTS_QUERY).catch(() => null),
  ]);

  return {
    featuredCollections: collections.nodes,
    heroBanner: metaobject,
    imageWithText,
    brandShowcase,
    recommendedProducts,
  };
}

function loadDeferredData(_args: Route.LoaderArgs) {
  return {};
}

export default function Homepage({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { recommendedProducts, heroBanner, featuredCollections, imageWithText, brandShowcase } = loaderData;
  const products =
    recommendedProducts?.collection?.products?.nodes ||
    recommendedProducts?.fallbackProducts?.nodes ||
    [];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection heroBanner={heroBanner} />

      {/* Featured Collections Section */}
      <FeaturedCollections collections={featuredCollections} />

      {/* Trending Now Section */}
      <FeaturedProducts products={products} />

      {/* Image With Text Section */}
      <ImageWithText data={imageWithText} />

      {/* Brand Showcase Section */}
      <BrandShowcase data={brandShowcase} />
    </div>
  );
}

// Loading Skeleton
function ProductsSkeleton() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
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

const FEATURED_COLLECTIONS_QUERY = `#graphql
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
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
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
    images(first: 5) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "trending") {
      id
      title
      products(first: 8) {
        nodes {
          ...RecommendedProduct
        }
      }
    }
    fallbackProducts: products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const HERO_BANNER_QUERY = `#graphql
  query HeroBanner {
    metaobject(handle: {handle: "never-hunt-alone", type: "hero"}) {
      id
      title: field(key: "title") {
        value
      }
      desc: field(key: "desc") {
        value
      }
      btn: field(key: "btn") {
        value
      }
      hero_media: field(key: "hero_media") {
        value
        reference {
          __typename
          ... on MediaImage {
            id
            image {
              url
            }
          }
          ... on Video {
            id
            sources {
              url
              mimeType
            }
          }
        }
      }
      title_2: field(key: "title_2") {
        value
      }
      desc_2: field(key: "desc_2") {
        value
      }
      btn_2: field(key: "btn_2") {
        value
      }
      hero_media_2: field(key: "hero_media_2") {
        value
        reference {
          __typename
          ... on MediaImage {
            id
            image {
              url
            }
          }
          ... on Video {
            id
            sources {
              url
              mimeType
            }
          }
        }
      }
    }
  }
` as const;

const IMAGE_WITH_TEXT_QUERY = `#graphql
  query ImageWithText {
    metaobject(handle: {handle: "image-with-text", type: "image_with_text"}) {
      id
      image_1: field(key: "image_1") { value }
      title_1: field(key: "title_1") { value }
      desc_1: field(key: "desc_1") { value }
      image_2: field(key: "image_2") { value }
      title_2: field(key: "title_2") { value }
      desc_2: field(key: "desc_2") { value }
    }
  }
` as const;

const BRAND_SHOWCASE_QUERY = `#graphql
  query BrandShowcase {
    metaobject(handle: {handle: "brand-img", type: "brand"}) {
      id
      fields {
        key
        value
      }
    }
  }
` as const;
