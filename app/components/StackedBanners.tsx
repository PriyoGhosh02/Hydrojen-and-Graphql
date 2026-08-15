import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StackedBannersProps {
  data: any;
}

export function StackedBanners({ data }: StackedBannersProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const getFieldValue = (keyName: string, fallback: string = '') => {
    if (!data?.fields) return fallback;
    const cleanKey = keyName.toLowerCase();
    const field = data.fields.find((f: any) => {
      const k = f.key?.toLowerCase();
      return (
        k === cleanKey ||
        k === cleanKey.replace('-', '_') ||
        k === cleanKey.replace('_', '-')
      );
    });
    return field?.value || fallback;
  };

  const mainTitle = getFieldValue(
    'main-title',
    'Authentic home of fashion & luxury watch brands.'
  );

  const banners = [
    {
      id: 1,
      image: getFieldValue(
        'banner-1',
        'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/1920_X_667_ab2ab381-ae69-4d35-8208-4ba8385a498b.jpg?v=1786717333'
      ),
      title: getFieldValue('title-1', 'Precision Meets Timeless Style'),
      link: '/collections/all',
    },
    {
      id: 2,
      image: getFieldValue(
        'banner-2',
        'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/Qtimex-2780x1600.jpg?v=1786717337'
      ),
      title: getFieldValue('title-2', 'Precision Meets Timeless Style'),
      link: '/collections/watch-1',
    },
    {
      id: 3,
      image: getFieldValue(
        'banner-3',
        'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/Nautica--2780x1600.jpg?v=1786717342'
      ),
      title: getFieldValue('title-3', 'Precision Meets Timeless Style'),
      link: '/collections/bracelet-1',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calculate initial title height offset so Banner 1 sits right under the title initially
      const rawTitleHeight = titleRef.current ? titleRef.current.offsetHeight + 15 : 150;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const titleHeight = isMobile ? Math.min(rawTitleHeight, 130) : rawTitleHeight;

      // Set initial positions:
      // Banner 1 sits right below the title so both are visible together on scroll-in
      gsap.set('.stacked-banner-1', { y: titleHeight });
      // Banner 2 and 3 start below the screen
      gsap.set('.stacked-banner-2', { yPercent: 100 });
      gsap.set('.stacked-banner-3', { yPercent: 100 });

      // Create pin timeline for the full 3-banner sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=200%' : '+=300%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Banner 1 slides up to y: 0, slowly overlapping the title and taking full screen (100vh)
      tl.to('.stacked-banner-1', { y: 0, ease: 'none', duration: 1 }, 0)
        // 2. Banner 2 slides up to take full screen over Banner 1
        .to('.stacked-banner-2', { yPercent: 0, ease: 'none', duration: 1 }, 1)
        // 3. Banner 3 slides up to take full screen over Banner 2
        .to('.stacked-banner-3', { yPercent: 0, ease: 'none', duration: 1 }, 2);
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [data]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-white h-screen overflow-hidden"
    >
      {/* Main Title Section - Visible at top behind/above Banner 1 */}
      <div
        ref={titleRef}
        className="title-area absolute top-0 inset-x-0 w-full flex justify-center max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-12 pb-2 sm:pb-4 z-0"
      >
        <h2 className="text-primary text-center text-2xl sm:text-5xl md:text-7xl lg:text-[80px] xl:text-[85px] font-normal tracking-tight leading-[1.1] sm:leading-[1.05] max-w-6xl font-sans">
          {mainTitle}
        </h2>
      </div>

      {/* Stacked Banners Container taking full screen */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            style={{ zIndex: (index + 1) * 10 }}
            className={`stacked-banner-${index + 1} absolute inset-0 w-full h-full overflow-hidden shadow-2xl`}
          >
            {/* Banner Image taking full screen */}
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable="false"
              />
            )}

            {/* Bottom Dark Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Banner Content: Title on Bottom-Left, Button on Bottom-Right */}
            <div className="absolute inset-x-0 bottom-0 max-w-8xl mx-auto p-4 sm:p-10 lg:p-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-6 z-10 w-full">
              <h3 className="text-white text-lg sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-xl font-sans drop-shadow-md">
                {banner.title}
              </h3>

              <Link
                to={banner.link}
                className="inline-flex items-center gap-2 sm:gap-3 bg-[#d4af37] hover:bg-white text-black font-bold uppercase tracking-widest text-xs sm:text-sm px-5 py-3 sm:px-8 sm:py-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
