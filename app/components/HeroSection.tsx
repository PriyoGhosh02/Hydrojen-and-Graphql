import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';

export function HeroSection({
  collection,
  heroBanner,
}: {
  collection?: any;
  heroBanner?: any;
}) {
  const heroMediaUrl = heroBanner?.field?.value;

  const isVideo = (url?: string) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return (
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.mov') ||
      cleanUrl.endsWith('.ogg') ||
      url.includes('video')
    );
  };

  const hasVideo = isVideo(heroMediaUrl);

  return (
    <section className="relative w-full h-[90vh] bg-[#121212] overflow-hidden flex items-center">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {heroMediaUrl ? (
          hasVideo ? (
            <video
              src={heroMediaUrl}
              className="w-full h-full object-cover opacity-60 animate-subtle-zoom"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={heroMediaUrl}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-60 animate-subtle-zoom"
            />
          )
        ) : collection?.image ? (
          <Image
            data={collection.image}
            className="w-full h-full object-cover opacity-60 animate-subtle-zoom"
            sizes="100vw"
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br 
                          from-[#1a1a1a] via-[#2c1d11] to-[#121212]"
          />
        )}
      </div>

      {/* Cinematic Gradient Overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-t 
                       from-[#0e0e0e] via-[#0e0e0e]/40 to-[#0e0e0e]/10 z-[1]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r 
                       from-[#0e0e0e]/90 via-[#0e0e0e]/30 to-transparent z-[1]"
      />

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 
                       w-full h-full flex items-center"
      >
        <div className="max-w-2xl text-left">
          {/* Subtitle with premium letter-spacing and gold accent */}
          <p
            className="text-[#d4af37] text-xs sm:text-sm font-semibold tracking-[0.4em] 
                        uppercase mb-5 animate-fade-in-up"
          >
            {collection?.title || 'Never Hunt Alone'}
          </p>

          {/* Main Title with elegant styling */}
          <h1
            className="text-white text-5xl sm:text-7xl lg:text-8xl 
                         font-extrabold leading-none tracking-tight mb-8 font-sans animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Discover
            <br />
            Your
            <br />
            <span className="text-[#d4af37] drop-shadow-lg">Style</span>
          </h1>

          {/* Description */}
          <p
            className="text-gray-300 text-base sm:text-lg mb-10 max-w-lg leading-relaxed font-light animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Explore our latest collection of premium fashion. Designed for those
            who dare to stand out.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-5 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Link
              to={
                collection
                  ? `/collections/${collection.handle}`
                  : '/collections'
              }
              className="relative overflow-hidden group bg-[#d4af37] text-black px-10 py-4 text-xs sm:text-sm 
                         font-bold tracking-widest uppercase transition-all duration-300 rounded-none
                         shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)]
                         hover:-translate-y-0.5"
            >
              <span className="relative z-10">Shop Now</span>
              <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out -z-1 opacity-10"></span>
            </Link>

            <Link
              to="/collections"
              className="relative overflow-hidden group border-2 border-white/80 text-white px-10 py-4 text-xs sm:text-sm 
                         font-bold tracking-widest uppercase transition-all duration-300 rounded-none
                         hover:border-white hover:-translate-y-0.5"
            >
              <span className="relative z-10">All Collections</span>
              <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out -z-1 opacity-10"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 
                      animate-bounce opacity-80 cursor-pointer hidden sm:block"
      >
        <svg
          className="w-5 h-5 text-white/80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

