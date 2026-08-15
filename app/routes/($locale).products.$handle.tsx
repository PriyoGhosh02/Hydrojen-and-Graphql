import {redirect, useLoaderData, Await, Link, type ShouldRevalidateFunction} from 'react-router';
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
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product, recommendations} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const productImages = product.images?.nodes || [];

  return (
    <div className="product-page font-sans min-h-screen bg-white pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-3 mb-8 sm:mb-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collections/all" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-accent truncate max-w-[200px] sm:max-w-xs">{title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column - Product Image & Gallery in 1 div sticky at 95vh */}
          <div className="lg:col-span-7 lg:sticky lg:top-20 lg:h-[95vh] flex flex-col justify-between bg-[#fcfcfc] border border-gray-100/80 p-4 sm:p-6 shadow-2xs overflow-hidden">
            <ProductImage
              image={selectedVariant?.image}
              images={productImages}
            />
          </div>

          {/* Right Column - Product Info & Form (5 Columns on Large Screens) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              {/* Vendor / Brand Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-accent text-[11px] font-bold uppercase tracking-[0.25em]">
                  {product.vendor || 'TimeCrafts Luxury'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
                  {selectedVariant?.availableForSale ? 'In Stock & Ready to Ship' : 'Sold Out'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary leading-tight mb-3">
                {title}
              </h1>

              {/* Product Price */}
              <div className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Product Options & Quantity & Add to Cart Form */}
            <div>
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            {/* Trust & Guarantee Badges Box */}
            <div className="bg-gray-50/80 border border-gray-200/80 p-4 sm:p-5 grid grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">Express Shipping</h4>
                  <p className="text-[10px] text-gray-500 font-light">Free delivery over $150</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">Official Warranty</h4>
                  <p className="text-[10px] text-gray-500 font-light">2-Year global protection</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">Easy Returns</h4>
                  <p className="text-[10px] text-gray-500 font-light">30-Day Money-Back Guarantee</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">Secure Checkout</h4>
                  <p className="text-[10px] text-gray-500 font-light">256-Bit SSL Encrypted</p>
                </div>
              </div>
            </div>

            {/* Expandable Accordion Tabs */}
            <div className="space-y-3 pt-2">
              {/* Accordion 1: Description */}
              <details className="border border-gray-200 group cursor-pointer select-none bg-white">
                <summary className="w-full flex items-center justify-between p-4 text-left focus:outline-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-bold tracking-widest uppercase text-primary group-hover:text-accent transition-colors">
                    Product Description
                  </span>
                  <span className="text-gray-400 group-hover:text-black transition-colors text-lg font-light group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="p-4 pt-0 border-t border-gray-100 text-xs text-gray-600 leading-relaxed font-light font-sans prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </details>

              {/* Accordion 2: Watch Specifications */}
              <details className="border border-gray-200 group cursor-pointer select-none bg-white">
                <summary className="w-full flex items-center justify-between p-4 text-left focus:outline-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-bold tracking-widest uppercase text-primary group-hover:text-accent transition-colors">
                    Specifications & Details
                  </span>
                  <span className="text-gray-400 group-hover:text-black transition-colors text-lg font-light group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="p-4 pt-2 border-t border-gray-100 text-xs text-gray-700 space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 font-light">Case Diameter</span>
                    <span className="font-medium">41 mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 font-light">Movement Type</span>
                    <span className="font-medium">Automatic Self-Winding</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 font-light">Glass Crystal</span>
                    <span className="font-medium">Scratch-Resistant Sapphire</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 font-light">Water Resistance</span>
                    <span className="font-medium">100 meters / 10 ATM</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400 font-light">Strap Material</span>
                    <span className="font-medium">Grade 316L Stainless Steel</span>
                  </div>
                </div>
              </details>

              {/* Accordion 3: Shipping & Returns */}
              <details className="border border-gray-200 group cursor-pointer select-none bg-white">
                <summary className="w-full flex items-center justify-between p-4 text-left focus:outline-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-bold tracking-widest uppercase text-primary group-hover:text-accent transition-colors">
                    Shipping & Returns
                  </span>
                  <span className="text-gray-400 group-hover:text-black transition-colors text-lg font-light group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="p-4 pt-2 border-t border-gray-100 text-xs text-gray-600 leading-relaxed font-light space-y-2">
                  <p>All orders are dispatched in signature TimeCrafts protective gift boxes within 24-48 business hours.</p>
                  <p>We provide tracked worldwide courier delivery via DHL Express or FedEx. Returns are accepted within 30 days of delivery provided items remain unworn in original packaging.</p>
                </div>
              </details>
            </div>

            {/* Recommendations Section */}
            <Suspense fallback={<p className="text-gray-400 text-xs py-4 text-center">Loading recommendations...</p>}>
              <Await resolve={recommendations}>
                {(resolvedRecs) => <RelatedProducts recommendations={resolvedRecs} />}
              </Await>
            </Suspense>
          </div>
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
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
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
