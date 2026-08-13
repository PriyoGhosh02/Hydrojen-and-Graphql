import {redirect, useLoaderData, Await, type ShouldRevalidateFunction} from 'react-router';
import {useState, Suspense} from 'react';
import type {Route} from './+types/products.$handle';
import {RelatedProducts} from '~/components/RelatedProducts';

import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  return currentUrl.toString() !== nextUrl.toString();
};

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product.title ?? ''} | TimeCrafts`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);

  const recommendations = args.context.storefront
    .query(RECOMMENDATIONS_QUERY, {
      variables: {productId: criticalData.product.id},
    })
    .catch((err) => {
      console.error('Recommendations error', err);
      return null;
    });

  return {
    ...criticalData,
    recommendations,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
      cache: storefront.CacheNone(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column - Product Image */}
        <div className="bg-[#fcfcfc] border border-gray-100 p-6 sm:p-12 shadow-sm rounded-none sticky top-28 flex justify-center items-center">
          <div className="w-full max-w-lg aspect-square overflow-hidden hover:scale-105 transition-transform duration-500">
            <ProductImage image={selectedVariant?.image} />
          </div>
        </div>

        {/* Right Column - Product details */}
        <div className="flex flex-col gap-6 lg:py-2">
          <div>
            {/* Vendor / Brand */}
            {product.vendor && (
              <span className="text-accent text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
                {product.vendor}
              </span>
            )}
            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
              {title}
            </h1>
            {/* Product Price */}
            <div className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>
          </div>

          <hr className="border-gray-100 my-2" />

          {/* Form wrapper */}
          <div className="py-2">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
          </div>

          <hr className="border-gray-100 my-2" />

          {/* Description Section Accordion */}
          <details className="border-t border-b border-gray-100 py-4 group cursor-pointer select-none">
            <summary className="w-full flex items-center justify-between text-left focus:outline-none list-none [&::-webkit-details-marker]:hidden bg-transparent border-0 p-0">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900 m-0 group-hover:text-accent transition-colors">
                Description
              </h3>
              <span className="text-gray-400 group-hover:text-black transition-colors text-xl font-light group-open:hidden">
                +
              </span>
              <span className="text-gray-400 group-hover:text-black transition-colors text-xl font-light hidden group-open:block">
                −
              </span>
            </summary>
            <div 
              className="prose prose-sm text-gray-600 leading-relaxed font-light font-sans max-w-none pb-2 mt-4"
              dangerouslySetInnerHTML={{__html: descriptionHtml}} 
            />
          </details>


          {/* Related Products Section */}
          <Suspense fallback={<p className="text-gray-400 text-xs py-4 text-center">Loading similar items...</p>}>
            <Await resolve={recommendations}>
              {(resolvedRecs) => <RelatedProducts recommendations={resolvedRecs} />}
            </Await>
          </Suspense>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
    }
  }
` as const;



const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
