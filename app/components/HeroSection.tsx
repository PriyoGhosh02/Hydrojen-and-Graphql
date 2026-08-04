import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';

export function HeroSection({collection}: {collection?: any}) {
  return (
    <section className="relative w-full h-[90vh] bg-[#1a1a1a] overflow-hidden">
      {/* ✅ Background Image — Shopify Collection থেকে */}
      <div className="absolute inset-0">
        {collection?.image ? (
          <Image
            data={collection.image}
            className="w-full h-full object-cover opacity-60"
            sizes="100vw"
          />
        ) : (
          // Fallback — যদি image না থাকে
          <div
            className="w-full h-full bg-gradient-to-br 
                          from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]"
          />
        )}
      </div>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r 
                      from-black/70 to-transparent"
      />

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
                      h-full flex items-center"
      >
        <div className="max-w-xl">
          {/* Subtitle */}
          <p
            className="text-[#c9a96e] text-sm font-medium tracking-[0.3em] 
                        uppercase mb-4"
          >
            {collection?.title || 'New Collection 2025'}
          </p>

          {/* Main Title */}
          <h1
            className="text-white text-5xl sm:text-6xl lg:text-7xl 
                         font-bold leading-tight mb-6"
          >
            Discover
            <br />
            Your
            <br />
            <span className="text-[#c9a96e]">Style</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
            Explore our latest collection of premium fashion. Designed for those
            who dare to stand out.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={
                collection
                  ? `/collections/${collection.handle}`
                  : '/collections'
              }
              className="bg-[#c9a96e] text-white px-8 py-4 text-sm 
                         font-semibold tracking-widest uppercase
                         hover:bg-[#b8954f] transition-all duration-300
                         shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Link>

            <Link
              to="/collections"
              className="border-2 border-white text-white px-8 py-4 text-sm 
                         font-semibold tracking-widest uppercase
                         hover:bg-white hover:text-[#1a1a1a] 
                         transition-all duration-300"
            >
              All Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Down */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 
                      animate-bounce"
      >
        <svg
          className="w-6 h-6 text-white opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
