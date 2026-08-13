import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CollectionFragment } from 'storefrontapi.generated';

interface FeaturedCollectionsProps {
  collections: CollectionFragment[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto border-b border-gray-100">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p
          className="text-accent text-sm font-medium tracking-[0.3em] 
                     uppercase mb-3"
        >
          Curated Ranges
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Featured Collections
        </h2>
        <div className="w-20 h-0.5 bg-accent mx-auto mt-4"></div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {collections.map((collection, idx) => {
          return (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              prefetch="intent"
              className="group relative block aspect-[4/5] bg-gray-50 overflow-hidden border border-gray-100/50 shadow-xs"
            >
              {/* Image background */}
              {collection.image ? (
                <Image
                  data={collection.image}
                  className="w-full h-full object-cover transition-transform 
                             duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  loading={idx < 4 ? 'eager' : 'lazy'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <svg
                    className="w-12 h-12 stroke-[1.25]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Overlay with details */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                           group-hover:from-black/90 group-hover:via-black/35 transition-all 
                           duration-500 flex flex-col justify-end p-6 sm:p-8"
              >
                <h3
                  className="text-lg sm:text-xl font-bold text-white tracking-wider 
                             uppercase mb-1 group-hover:text-accent transition-colors duration-300"
                >
                  {collection.title}
                </h3>
                <div
                  className="h-[2px] w-6 bg-accent group-hover:w-12 transition-all 
                             duration-500 ease-out mb-4"
                ></div>
                <span
                  className="inline-flex items-center text-xs font-semibold tracking-widest 
                             uppercase text-white/95 group-hover:text-white transition-colors duration-300"
                >
                  Explore Now
                  <svg
                    className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-1.5 
                               transition-transform duration-300 ease-out"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
