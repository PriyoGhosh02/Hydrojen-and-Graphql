import { useRef } from 'react';
import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!recommendations || !recommendations.productRecommendations?.length) return null;

  const products = recommendations.productRecommendations;
  const hasMoreThanThree = products.length > 3;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 border-t border-gray-100 mt-8 font-sans">
      <div className="flex flex-col gap-5">
        {/* Header Section with Navigation Arrows */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary m-0">
              Recommended For You
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {hasMoreThanThree && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  className="w-7 h-7 rounded-full border border-gray-200 hover:border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center text-[10px] cursor-pointer shadow-2xs"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  className="w-7 h-7 rounded-full border border-gray-200 hover:border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center text-[10px] cursor-pointer shadow-2xs"
                >
                  ▶
                </button>
              </div>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">
              Hand-picked
            </span>
          </div>
        </div>

        {/* Carousel Slider: Shows 3 cards initially, left/right scrollable for more */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1 scroll-smooth"
        >
          {products.map((product) => {
            const price = product.priceRange.minVariantPrice as any;
            const image = product.featuredImage;

            return (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] snap-start flex flex-col bg-white border border-gray-100 p-3 hover:border-gray-200 hover:shadow-lg transition-all duration-300 select-none"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-[#f9f9f9] aspect-square w-full">
                  {image ? (
                    <Image
                      alt={image.altText || product.title}
                      data={image}
                      aspectRatio="1/1"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      sizes="(min-width: 45em) 250px, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      TimeCrafts
                    </div>
                  )}

                  {/* Micro Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-2">
                    <span className="bg-white text-primary px-3 py-1 text-[9px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xs">
                      View
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 flex flex-col justify-between flex-1">
                  <h3 className="text-xs font-medium text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">
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
