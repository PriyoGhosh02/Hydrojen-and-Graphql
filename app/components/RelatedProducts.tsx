import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

export function RelatedProducts({
  recommendations,
}: {
  recommendations: {
    productRecommendations: Array<{
      id: string;
      title: string;
      handle: string;
      vendor: string;
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
      featuredImage?: {
        url: string;
        altText?: string;
        width: number;
        height: number;
      };
    }>;
  } | null;
}) {
  if (!recommendations || !recommendations.productRecommendations?.length) return null;

  // We slice to 4 to maintain a strict 4-column grid layout
  const products = recommendations.productRecommendations.slice(0, 4);

  return (
    <section className="py-6 border-t border-gray-100 mt-6">
      <div className="flex flex-col gap-3">
        {/* Header Section */}
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary m-0">
            Shop Similar
          </h2>
        </div>

        {/* Strict 4-Column Grid */}
        <div className="grid grid-cols-4 gap-2">
          {products.map((product) => {
            const price = product.priceRange.minVariantPrice;
            const image = product.featuredImage;

            return (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group block"
              >
                {/* Image Container with Hover Trigger */}
                <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[3/4] border border-gray-50">
                  {image ? (
                    <Image
                      alt={image.altText || product.title}
                      data={image}
                      aspectRatio="3/4"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="120px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Micro Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-2">
                    <span className="bg-white text-primary px-2.5 py-1 text-[8px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      View
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-1.5 text-center">
                  <h3 className="text-[9px] font-medium text-primary tracking-wide group-hover:text-accent transition-colors truncate px-0.5">
                    {product.title}
                  </h3>
                  <div className="mt-0.5">
                    <span className="text-[9px] font-bold text-primary">
                      <Money data={price} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
