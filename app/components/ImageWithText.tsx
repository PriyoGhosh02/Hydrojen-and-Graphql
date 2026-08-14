import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageWithTextProps {
  data: any;
}

export function ImageWithText({ data }: ImageWithTextProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set('.anim-image-2', { yPercent: 100 });
      gsap.set('.anim-content-1', { opacity: 1, y: 0, pointerEvents: 'auto' });
      gsap.set('.anim-content-2', { opacity: 0, y: 30, pointerEvents: 'none' });

      // Create timeline directly on the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Animate Image 2 sliding up from bottom to top starting at 20% scroll progress (duration: 0.8)
      tl.to('.anim-image-2', { yPercent: 0, ease: 'none', duration: 0.8 }, 0.2);

      // Fade out Content 1 during the first part of transition (0.2 to 0.5)
      tl.to('.anim-content-1', {
        opacity: 0,
        y: -30,
        pointerEvents: 'none',
        ease: 'power1.out',
        duration: 0.3
      }, 0.2);

      // Fade in Content 2 during the second part of transition (0.5 to 0.8)
      tl.to('.anim-content-2', {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        ease: 'power1.out',
        duration: 0.3
      }, 0.5);

    }, sectionRef);

    // Refresh ScrollTrigger calculations after initial DOM paint
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [data]);

  if (!data) return null;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-white min-h-screen flex items-center overflow-hidden"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 w-full items-center">
          {/* Left Side Content */}
          <div className="relative w-full min-h-[350px] sm:min-h-[400px] flex flex-col justify-center order-2 md:order-1">
            {/* Content Set 1 */}
            <div className="anim-content-1 absolute inset-0 w-full flex flex-col justify-center">
              <p className="text-accent text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                Timeless Gold
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight font-sans">
                {data.title_1?.value || 'Timeless Gold, Effortless Elegance'}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-light">
                {data.desc_1?.value}
              </p>
            </div>

            {/* Content Set 2 */}
            <div className="anim-content-2 absolute inset-0 w-full flex flex-col justify-center opacity-0 pointer-events-none">
              <p className="text-accent text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                Precision Craft
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight font-sans">
                {data.title_2?.value || 'Precision Meets Timeless Style'}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-light">
                {data.desc_2?.value}
              </p>
            </div>
          </div>

          {/* Right Side Image Container (95vh height on desktop, 60vh on mobile) */}
          <div className="relative w-full h-[60vh] md:h-[95vh] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm order-1 md:order-2">
            {/* Image 1 */}
            {data.image_1?.value && (
              <img
                src={data.image_1.value}
                alt={data.title_1?.value || 'Timeless Gold'}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                draggable="false"
              />
            )}

            {/* Image 2 overlay sliding up */}
            {data.image_2?.value && (
              <img
                src={data.image_2.value}
                alt={data.title_2?.value || 'Precision'}
                className="anim-image-2 absolute inset-0 w-full h-full object-cover z-10 select-none pointer-events-none"
                draggable="false"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
