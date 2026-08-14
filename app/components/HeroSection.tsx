import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function SlideContent({
  slide,
  isActive,
  collection,
  isVideo,
}: {
  slide: any;
  isActive: boolean;
  collection: any;
  isVideo: (url?: string) => boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      // Reset text states when not active
      gsap.set('.animate-item', { opacity: 0, y: 30 });
      gsap.set('.title-word', { opacity: 0, y: 25 });
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set('.animate-item', { opacity: 0, y: 30 });
      gsap.set('.title-word', { opacity: 0, y: 25 });

      // Create timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });

      tl.to('.subtitle-item', { opacity: 1, y: 0, duration: 1.0 })
        .to('.title-word', {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1.0,
        }, '-=0.8')
        .to('.desc-item', { opacity: 1, y: 0, duration: 1.0 }, '-=0.8')
        .to('.btn-item', {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.0,
        }, '-=0.8');
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, slide]);

  const hasVideoMedia = isVideo(slide.mediaUrl);

  // Split title
  const titleWords = slide.title.split(' ');
  const lastWord = titleWords.length > 1 ? titleWords.pop() : '';
  const mainTitlePart = titleWords.join(' ');
  const mainWords = mainTitlePart.split(' ');

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none"
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slide.mediaUrl ? (
          hasVideoMedia ? (
            <video
              src={slide.mediaUrl}
              className="bg-media w-full h-full object-cover opacity-60"
              autoPlay
              loop
              muted
              playsInline
              draggable="false"
            />
          ) : (
            <img
              src={slide.mediaUrl}
              alt={slide.title}
              className="bg-media w-full h-full object-cover opacity-60"
              draggable="false"
            />
          )
        ) : collection?.image ? (
          <Image
            data={collection.image}
            className="bg-media w-full h-full object-cover opacity-60"
            sizes="100vw"
            draggable="false"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-[#2c1d11] to-[#121212]" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 w-full h-full flex items-center">
        <div className="max-w-2xl text-left">
          {/* Subtitle */}
          <p className="subtitle-item animate-item text-[#d4af37] text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase mb-5">
            {collection?.title || (slide.title !== 'NEVER HUNT ALONE' ? 'Curated Range' : 'Premium Brand')}
          </p>

          {/* Title */}
          <h1 className="text-white text-5xl sm:text-7xl lg:text-8xl font-normal leading-none tracking-tight mb-8 font-sans">
            {mainWords.map((word: string, i: number) => (
              <span key={i} className="title-word inline-block mr-3 sm:mr-4">
                {word}
              </span>
            ))}
            {lastWord && (
              <>
                <br />
                <span className="title-word text-[#d4af37] drop-shadow-lg inline-block mt-2">
                  {lastWord}
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="desc-item animate-item text-gray-300 text-base sm:text-lg mb-10 max-w-lg leading-relaxed font-light">
            {slide.desc}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5">
            <Link
              to={slide.btnUrl}
              draggable="false"
              className="btn-item animate-item relative overflow-hidden group bg-[#d4af37] text-black px-10 py-4 text-xs sm:text-sm 
                         font-bold tracking-widest uppercase transition-all duration-300 rounded-none
                         shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)]
                         hover:-translate-y-0.5"
            >
              <span className="relative z-10">{slide.btnText}</span>
              <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out -z-1 opacity-10"></span>
            </Link>

            <Link
              to="/collections/all"
              draggable="false"
              className="btn-item animate-item relative overflow-hidden group border-2 border-white/80 text-white px-10 py-4 text-xs sm:text-sm 
                         font-bold tracking-widest uppercase transition-all duration-300 rounded-none
                         hover:border-white hover:-translate-y-0.5"
            >
              <span className="relative z-10">All Products</span>
              <span className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out -z-1 opacity-10"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({
  collection,
  heroBanner,
}: {
  collection?: any;
  heroBanner?: any;
}) {
  const heroRef = useRef<HTMLDivElement>(null);

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

  const getBtnText = (url: string | null | undefined, defaultText: string) => {
    if (!url) return defaultText;
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

  // Slide state variables
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [targetOffsetPercent, setTargetOffsetPercent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-playing logic (always ticks every 5 seconds unless dragging or transitioning)
  useEffect(() => {
    if (activeSlides.length <= 1 || isDragging || isTransitioning) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, activeSlides.length, isDragging, isTransitioning]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scroll, scale down, and fade out the active slide wrapper as the page scrolls
      gsap.to('.hero-slide-wrapper', {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: 30, // Moves down slower than the scroll speed (parallax)
        opacity: 0.1, // Fades out as next section overlaps
        scale: 0.90, // Subtle scaling down
        ease: 'none',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTargetOffsetPercent(33.333); // Translate right to reveal left slide
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
      setTargetOffsetPercent(0);
      setIsTransitioning(false);
    }, 700);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTargetOffsetPercent(-33.333); // Translate left to reveal right slide
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
      setTargetOffsetPercent(0);
      setIsTransitioning(false);
    }, 700);
  };

  const goToSlide = (idx: number) => {
    if (isTransitioning || idx === currentIndex) return;
    setIsTransitioning(true);

    // Determine translation direction based on relative position
    const direction = idx > currentIndex ? -33.333 : 33.333;
    setTargetOffsetPercent(direction);

    setTimeout(() => {
      setCurrentIndex(idx);
      setTargetOffsetPercent(0);
      setIsTransitioning(false);
    }, 700);
  };

  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 80; // minimum drag offset in pixels to trigger slide change
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    } else {
      // Snap back to current slide
      setIsTransitioning(true);
      setTargetOffsetPercent(0);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
      return;
    }
    setDragOffset(0);
  };

  // Virtual slide list for 3-slide infinite loop rendering
  const virtualSlides = [
    { slide: activeSlides[(currentIndex - 1 + activeSlides.length) % activeSlides.length], active: false },
    { slide: activeSlides[currentIndex], active: true },
    { slide: activeSlides[(currentIndex + 1) % activeSlides.length], active: false }
  ];

  return (
    <section ref={heroRef} className="hero-section sticky top-0 w-full h-[95vh] bg-[#121212] overflow-hidden flex items-center z-0 select-none">
      <div className="hero-slide-wrapper w-full h-full relative overflow-hidden">
        {/* Sliding Track */}
        <div
          className={`h-full flex flex-row flex-nowrap cursor-grab active:cursor-grabbing`}
          style={{
            width: '300%',
            transform: `translate3d(calc(-33.333% + ${targetOffsetPercent}% + ${dragOffset}px), 0, 0)`,
            transition: isTransitioning ? 'transform 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          }}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          {virtualSlides.map((item, idx) => {
            return (
              <div
                key={`${item.slide.id}-${idx}`}
                className="w-1/3 h-full shrink-0 relative overflow-hidden select-none"
              >
                <SlideContent
                  slide={item.slide}
                  isActive={item.active}
                  collection={collection}
                  isVideo={isVideo}
                />
              </div>
            );
          })}
        </div>

        {/* Dots Navigation */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-10 left-10 z-20 flex gap-3">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
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
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
              aria-label="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
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
      </div>
    </section>
  );
}
