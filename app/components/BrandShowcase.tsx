import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface BrandShowcaseProps {
  data: any;
}

export function BrandShowcase({ data }: BrandShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Extract all valid image URLs from data fields
  const userLogos = data?.fields
    ? data.fields
        .filter((f: any) => f.key.startsWith('img') && f.value)
        .map((f: any) => f.value)
    : [
        data?.img_1?.value,
        data?.img_2?.value,
        data?.img_3?.value,
        data?.img_4?.value,
        data?.img_5?.value,
        data?.img_6?.value,
      ].filter(Boolean);

  // High-end fallback luxury brand logos / text if user hasn't provided all 6 yet
  const fallbackLogos = [
    'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/jewelry_logo_colored.png?v=17574815',
    'ROLEX',
    'PATEK PHILIPPE',
    'AUDEMARS PIGUET',
    'CARTIER',
    'OMEGA',
    'TAG HEUER',
    'VACHERON CONSTANTIN',
  ];

  // Base list of items
  const baseItems = userLogos.length > 0 ? userLogos : fallbackLogos;

  // Duplicate items sufficiently to ensure a seamless non-stop infinite loop
  const displayItems = [
    ...baseItems,
    ...baseItems,
    ...baseItems,
    ...baseItems,
    ...baseItems,
    ...baseItems,
  ];

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    
    // Ensure layout is measured after render
    const halfWidth = track.scrollWidth / 2;

    const ctx = gsap.context(() => {
      // Infinitely translate the marquee from right to left
      tweenRef.current = gsap.to(track, {
        x: -halfWidth,
        duration: Math.max(20, displayItems.length * 2.5),
        ease: 'none',
        repeat: -1,
      });
    }, trackRef);

    return () => ctx.revert();
  }, [displayItems.length]);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.3, duration: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
    }
  };

  return (
    <section 
      className="relative z-10 w-full py-12 sm:py-16 overflow-hidden select-none bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Edge gradient fade masks for smooth entrance and exit */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div
          ref={trackRef}
          className="flex flex-row flex-nowrap items-center gap-16 sm:gap-24 whitespace-nowrap will-change-transform"
        >
          {displayItems.map((item: string, idx: number) => {
            const isImage = typeof item === 'string' && (item.startsWith('http') || item.includes('/'));

            return (
              <div
                key={`${item}-${idx}`}
                className="flex items-center justify-center shrink-0 h-14 sm:h-16 px-4 group cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                {isImage ? (
                  <img
                    src={item}
                    alt="Brand Logo"
                    className="max-h-10 sm:max-h-12 w-auto object-contain opacity-50 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                    draggable="false"
                  />
                ) : (
                  <span className="text-gray-400 group-hover:text-primary transition-colors duration-300 text-lg sm:text-xl font-bold tracking-[0.3em] uppercase font-sans">
                    {item}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
