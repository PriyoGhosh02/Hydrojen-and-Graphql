import { Image, Money } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const images = product.images?.nodes || [];
  const displayImages = images.length > 0 ? images : (product.featuredImage ? [product.featuredImage] : []);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  return (
    <Link to={`/products/${product.handle}`} className="group block w-full">
      {/* Product Image Slider Container */}
      <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[3/4] w-full">
        {displayImages.length > 0 ? (
          displayImages.map((img: any, idx: number) => {
            const isActive = idx === currentImgIndex;
            return (
              <div
                key={img.id || idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
              >
                <Image
                  data={img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </div>
            );
          })
        ) : (
          <div
            className="w-full h-full flex items-center justify-center 
                           text-gray-400"
          >
            <svg
              className="w-16 h-16"
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

        {/* Slideshow Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            {/* Left Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImgIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black w-8 h-8 rounded-none flex items-center justify-center shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImgIndex((prev) => (prev + 1) % displayImages.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black w-8 h-8 rounded-none flex items-center justify-center shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {displayImages.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImgIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 transition-all duration-300 rounded-none ${idx === currentImgIndex ? 'bg-accent w-3' : 'bg-white/60 hover:bg-white'
                    }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Overlay (Only shows when hover, below navigation elements) */}
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent 
                        pointer-events-none transition-all duration-300 flex items-end 
                        justify-center pb-6"
        >
          <span
            className="bg-white/90 text-primary px-6 py-2 text-xs 
                          font-semibold tracking-widest uppercase
                          translate-y-10 opacity-0 
                          group-hover:translate-y-0 group-hover:opacity-100 
                          transition-all duration-300"
          >
            View Product
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 text-center font-sans">
        {/* Product Title */}
        <h3
          className="text-sm font-medium text-primary tracking-wide 
                       group-hover:text-accent transition-colors 
                       truncate px-2"
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-2">
          <span className="text-sm font-semibold text-primary">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Main Featured Products Component
export function FeaturedProducts({ products }: { products: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from('.products-header-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1.0,
        ease: 'power3.out',
      });

      const track = trackRef.current;
      const section = sectionRef.current;

      if (track && section) {
        // Measure horizontal overflow dynamically
        const getScrollAmount = () => {
          const overflow = track.scrollWidth - track.clientWidth;
          return overflow > 0 ? -overflow : 0;
        };

        gsap.to(track, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(0, track.scrollWidth - track.clientWidth)}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              const overflow = track.scrollWidth - track.clientWidth;
              if (overflow <= 5) {
                self.disable();
                gsap.set(track, { x: 0 });
              } else {
                self.enable();
              }
            },
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  if (!products || products.length === 0) {
    return (
      <section className="py-20 px-4 text-center relative z-10 bg-white">
        <p className="text-gray-500">No products found</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-white py-20 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Section Header */}
      <div className="products-header max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-16">
        <p
          className="products-header-item text-accent text-sm font-medium tracking-[0.3em] 
                      uppercase mb-3"
        >
          Curated For You
        </p>
        <h2 className="products-header-item text-3xl sm:text-5xl font-normal text-primary">
          Trending Now
        </h2>
        <div className="products-header-item w-20 h-0.5 bg-accent mx-auto mt-4"></div>
      </div>

      {/* Horizontal Products Grid Container */}
      <div className="relative w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div
          ref={trackRef}
          className="products-track flex flex-row flex-nowrap gap-6 sm:gap-8 w-full"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card-item shrink-0 w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3*1.5rem)/4)] lg:w-[calc((100%-3*2rem)/4)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
