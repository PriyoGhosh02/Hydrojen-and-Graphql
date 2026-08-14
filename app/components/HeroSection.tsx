import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

export function HeroSection({
  collection,
  heroBanner,
}: {
  collection?: any;
  heroBanner?: any;
}) {
  const getMediaUrl = (mediaField: any) => {
    let url = mediaField?.value;
    if (mediaField?.reference) {
      const ref = mediaField.reference;
      if (ref.__typename === 'MediaImage') {
        url = ref.image?.url || url;
      } else if (ref.__typename === 'Video') {
        url = ref.sources?.[0]?.url || url;
      }
    }
    return url;
  };

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

  const getBtnText = (url: string, defaultText: string) => {
    if (url.includes('watch')) return 'Shop Watches';
    if (url.includes('bracelet')) return 'Shop Bracelets';
    return defaultText;
  };

  const slides = [
    {
      id: 1,
      mediaUrl: getMediaUrl(heroBanner?.hero_media),
      title: heroBanner?.title?.value || 'Design For Gentlemen',
      desc: heroBanner?.desc?.value || 'Premium watches crafted for men who value quality and timeless style.',
      btnUrl: heroBanner?.btn?.value || '/collections/watch-1',
      btnText: getBtnText(heroBanner?.btn?.value || '/collections/watch-1', 'Shop Watches'),
    },
    {
      id: 2,
      mediaUrl: getMediaUrl(heroBanner?.hero_media_2),
      title: heroBanner?.title_2?.value || 'Design For Elegance',
      desc: heroBanner?.desc_2?.value || 'Premium bracelets crafted for men who value quality and timeless style.',
      btnUrl: heroBanner?.btn_2?.value || '/collections/bracelet-1',
      btnText: getBtnText(heroBanner?.btn_2?.value || '/collections/bracelet-1', 'Shop Bracelets'),
    }
  ].filter(slide => slide.mediaUrl || slide.title);

  const defaultSlides = [
    {
      id: 1,
      mediaUrl: null,
      title: 'Design For Gentlemen',
      desc: 'Premium watches crafted for men who value quality and timeless style.',
      btnUrl: '/collections/watch-1',
      btnText: 'Shop Watches',
    }
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  return (
    <section className="relative w-full h-[95vh] bg-[#121212] overflow-hidden flex items-center">
      {activeSlides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const hasVideoMedia = isVideo(slide.mediaUrl);

        // Split title to format the last word in gold
        const titleWords = slide.title.split(' ');
        const lastWord = titleWords.length > 1 ? titleWords.pop() : '';
        const mainTitlePart = titleWords.join(' ');

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
              {slide.mediaUrl ? (
                hasVideoMedia ? (
                  <video
                    src={slide.mediaUrl}
                    className="w-full h-full object-cover opacity-60 animate-subtle-zoom"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={slide.mediaUrl}
                    alt={slide.title}
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
                <div className="w-full h-full bg-gradient-to-br from-primary via-[#2c1d11] to-[#121212]" />
              )}
            </div>

            {/* Content */}
            {isActive && (
              <div className="relative z-10 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 w-full h-full flex items-center">
                <div className="max-w-2xl text-left">
                  {/* Subtitle */}
                  <p className="text-[#d4af37] text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase mb-5 animate-fade-in-up">
                    {collection?.title || (slide.title !== 'NEVER HUNT ALONE' ? 'Curated Range' : 'Premium Brand')}
                  </p>

                  {/* Title */}
                  <h1
                    className="text-white text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight mb-8 font-sans animate-fade-in-up"
                    style={{ animationDelay: '100ms' }}
                  >
                    {mainTitlePart}
                    {lastWord && (
                      <>
                        <br />
                        <span className="text-[#d4af37] drop-shadow-lg">{lastWord}</span>
                      </>
                    )}
                  </h1>

                  {/* Description */}
                  <p
                    className="text-gray-300 text-base sm:text-lg mb-10 max-w-lg leading-relaxed font-light animate-fade-in-up"
                    style={{ animationDelay: '200ms' }}
                  >
                    {slide.desc}
                  </p>

                  {/* Buttons */}
                  <div
                    className="flex flex-wrap gap-5 animate-fade-in-up"
                    style={{ animationDelay: '300ms' }}
                  >
                    <Link
                      to={slide.btnUrl}
                      className="relative overflow-hidden group bg-[#d4af37] text-black px-10 py-4 text-xs sm:text-sm 
                                 font-bold tracking-widest uppercase transition-all duration-300 rounded-none
                                 shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)]
                                 hover:-translate-y-0.5"
                    >
                      <span className="relative z-10">{slide.btnText}</span>
                      <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out -z-1 opacity-10"></span>
                    </Link>

                    <Link
                      to="/collections/all"
                      className="relative overflow-hidden group border-2 border-white/80 text-white px-10 py-4 text-xs sm:text-sm 
                                 font-bold tracking-widest uppercase transition-all duration-300 rounded-none
                                 hover:border-white hover:-translate-y-0.5"
                    >
                      <span className="relative z-10">All Products</span>
                      <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out -z-1 opacity-10"></span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Dots Navigation */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-10 z-20 flex gap-3">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-1.5 transition-all duration-500 rounded-none ${idx === currentIndex ? 'bg-[#d4af37]' : 'bg-white/30 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <div className="absolute right-10 bottom-8 z-20 flex gap-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
            aria-label="Previous Slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
            className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all duration-300"
            aria-label="Next Slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-80 cursor-pointer hidden sm:block">
        <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
