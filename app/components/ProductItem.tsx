import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const compareAtPrice = (product as any)?.compareAtPriceRange?.minVariantPrice;
  const price = product.priceRange.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  return (
    <Link
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      className="group flex flex-col bg-white border border-gray-100/80 shadow-2xs hover:shadow-xl hover:border-gray-200 transition-all duration-300 font-sans select-none"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f9f9f9]">
        {isOnSale && (
          <span className="absolute top-3 left-3 z-10 bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-none shadow-xs">
            Sale
          </span>
        )}
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-light">
            TimeCrafts Item
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <span className="bg-white text-primary hover:bg-[#d4af37] hover:text-black text-[11px] font-bold uppercase tracking-widest px-4 py-2 shadow-md transition-all duration-200">
            View Details
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col justify-between flex-1 text-left bg-white">
        <div>
          <p className="text-[10px] font-semibold text-[#d4af37] tracking-[0.2em] uppercase mb-1.5">
            Luxury Horology
          </p>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-3">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-primary">
            <Money data={price} />
          </span>
          {isOnSale && (
            <span className="text-xs text-gray-400 line-through font-light">
              <Money data={compareAtPrice} />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
