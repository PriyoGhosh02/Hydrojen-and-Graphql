import { Link } from 'react-router';
import type { Route } from './+types/about';

const ABOUT_HERO_IMAGE =
  'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/banner-content-1785351024-Picsart_26-07-29_23-24-16-209.png?v=1786776749';

const WORKSHOP_IMAGE =
  'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/banner-content-1781340981-L3.jpg?v=1786782423';

const CTA_image = 'https://cdn.shopify.com/s/files/1/0972/7393/8288/files/banner390793039.webp?v=1786782423';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Our Story & Heritage | TimeCrafts Luxury Horology' },
    { name: 'description', content: 'Learn about the legacy, artisan craftsmanship, and Swiss precision mechanics behind TimeCrafts luxury timepieces.' },
  ];
};

export default function AboutPage() {
  return (
    <div className="about-page font-sans min-h-screen bg-white text-primary pb-20 select-none">
      {/* 1. HERO BANNER (~30% VIEWPORT HEIGHT) */}
      <section className="relative w-full h-[60vh] min-h-[280px] max-h-[360px] overflow-hidden flex items-center justify-center bg-[#121212] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={ABOUT_HERO_IMAGE}
            alt="TimeCrafts Atelier"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <nav className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d4af37] mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300 font-light">Our Heritage</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight uppercase mb-3">
            The Legacy of TimeCrafts
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Pioneering Swiss precision mechanics, timeless aesthetics, and hand-finished artistry for over three decades.
          </p>
        </div>
      </section>

      {/* 2. HERITAGE & STORY SECTION */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Workshop Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900 border border-gray-200 shadow-xl">
              <img
                src={WORKSHOP_IMAGE}
                alt="TimeCrafts Master Horologist Workshop"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xs text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-700">
                Geneva Atelier Est. 1994
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block w-48 h-48 bg-[#f6f6f6] border border-gray-200 p-4 shadow-md -z-10"></div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.25em] block">
              Crafted Without Compromise
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary uppercase leading-tight">
              Where Engineering Meets Artistry
            </h2>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Founded in 1994, TimeCrafts was born from a singular passion: creating extraordinary wristwatches that combine classic Swiss horological tradition with modern architectural elegance.
            </p>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Every TimeCrafts timepiece is meticulously engineered in our Swiss ateliers and finished in our New York flagship facility. From the hand-sculpted rotors to the double-domed sapphire crystals, our watchmakers dedicate hundreds of hours to ensuring each piece passes rigorous chronometric tests.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-gray-100">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-primary block">30+ Years</span>
                <span className="text-xs text-gray-500 font-light uppercase tracking-wider">Horological Excellence</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#d4af37] block">1,000 Hours</span>
                <span className="text-xs text-gray-500 font-light uppercase tracking-wider">Testing Per Watch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES & PILLARS */}
      <section className="bg-gray-50/80 border-y border-gray-200 py-16 sm:py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] block mb-2">
              Uncompromising Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-primary uppercase tracking-tight">
              Our Four Pillars of Horology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col items-start shadow-2xs hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-[#d4af37] flex items-center justify-center text-xl mb-6">
                ⚙️
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider text-primary mb-3">
                Automatic Movements
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Self-winding mechanical movements featuring anti-magnetic balance springs and up to 72 hours of continuous power reserve.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col items-start shadow-2xs hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-[#d4af37] flex items-center justify-center text-xl mb-6">
                💎
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider text-primary mb-3">
                Sapphire & Steel
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Ultra-durable 316L surgical stainless steel cases matched with scratch-resistant double anti-reflective sapphire crystals.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col items-start shadow-2xs hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-[#d4af37] flex items-center justify-center text-xl mb-6">
                🎨
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider text-primary mb-3">
                Hand-Finished Dials
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Intricate sunray brushing, enamel coats, and hand-applied luminous indices designed for maximum legibility day and night.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col items-start shadow-2xs hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-[#d4af37] flex items-center justify-center text-xl mb-6">
                🛡️
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider text-primary mb-3">
                2-Year Global Warranty
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Every timepiece is backed by our comprehensive international 2-year warranty and dedicated master watchmaker servicing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HISTORICAL MILESTONES TIMELINE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-14">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] block mb-2">
            Chronology
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-primary uppercase tracking-tight">
            Key Milestones in Our History
          </h2>
        </div>

        <div className="relative border-l-2 border-gray-200 ml-4 sm:ml-32 space-y-12">
          {/* Milestone 1 */}
          <div className="relative pl-8 sm:pl-12 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-primary rounded-full group-hover:bg-[#d4af37] transition-colors"></div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-1">
              1994
            </span>
            <h3 className="text-lg font-bold text-primary uppercase">Atelier Founding in Geneva</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed mt-1 max-w-xl">
              Master horologist Jean-Luc Laurent establishes the first TimeCrafts workshop, producing limited bespoke mechanical timepieces.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="relative pl-8 sm:pl-12 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-primary rounded-full group-hover:bg-[#d4af37] transition-colors"></div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-1">
              2008
            </span>
            <h3 className="text-lg font-bold text-primary uppercase">The Executive Series Launch</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed mt-1 max-w-xl">
              Unveiling of our signature automatic chronograph line, setting new benchmarks in durability and wrist comfort.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="relative pl-8 sm:pl-12 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-primary rounded-full group-hover:bg-[#d4af37] transition-colors"></div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-1">
              2016
            </span>
            <h3 className="text-lg font-bold text-primary uppercase">New York Fifth Avenue Flagship</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed mt-1 max-w-xl">
              Opening of our premier showroom in Manhattan, offering private VIP consultations and custom engraving services.
            </p>
          </div>

          {/* Milestone 4 */}
          <div className="relative pl-8 sm:pl-12 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-primary rounded-full group-hover:bg-[#d4af37] transition-colors"></div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-1">
              Present Day
            </span>
            <h3 className="text-lg font-bold text-primary uppercase">Global Reach & Sustainable Innovation</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed mt-1 max-w-xl">
              Delivering precision watches to collectors worldwide while integrating recycled metals and eco-conscious luxury packaging.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (CTA) */}
      <section className="relative text-white text-center overflow-hidden">
        {CTA_image && (
          <img
            src={CTA_image}
            alt=""
            className="w-full h-auto block"
          />
        )}

        <div className="absolute inset-0 bg-black/50" />


        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-3xl mx-auto space-y-4">

            <h2 className="text-2xl sm:text-4xl font-normal uppercase tracking-wider">
              Explore Our Curated Collections
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/collections/all"
                className="w-full sm:w-auto px-8 py-4 bg-white text-primary hover:bg-[#d4af37] hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
              >
                Shop All Watches
              </Link>

              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 border border-gray-600 hover:border-white text-white text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
