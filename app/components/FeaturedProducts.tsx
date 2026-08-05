import { Image, Money } from '@shopify/hydrogen';
import { Link } from 'react-router';

// Product Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/products/${product.handle}`} className="group block">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-[#f5f5f5] aspect-[3/4]">
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            className="w-full h-full object-cover transition-transform 
                       duration-700 group-hover:scale-110"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
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

        {/* Quick View Overlay */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                        transition-all duration-300 flex items-end 
                        justify-center pb-6"
        >
          <span
            className="bg-white text-[#1a1a1a] px-6 py-2 text-xs 
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
      <div className="mt-4 text-center">
        {/* Product Title */}
        <h3
          className="text-sm font-medium text-[#1a1a1a] tracking-wide 
                       group-hover:text-[#c9a96e] transition-colors 
                       truncate px-2"
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Main Featured Products Component
export function FeaturedProducts({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return (
      <section className="py-20 px-4 text-center">
        <p className="text-gray-500">No products found</p>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p
          className="text-[#c9a96e] text-sm font-medium tracking-[0.3em] 
                      uppercase mb-3"
        >
          Curated For You
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
          Featured Products
        </h2>
        <div className="w-20 h-0.5 bg-[#c9a96e] mx-auto mt-4"></div>
      </div>

      {/* Products Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                      gap-4 sm:gap-6 lg:gap-8"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          to="/collections/all"
          className="inline-block border-2 border-[#1a1a1a] text-[#1a1a1a] 
                     px-10 py-3 text-sm font-semibold tracking-widest 
                     uppercase hover:bg-[#1a1a1a] hover:text-white 
                     transition-all duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
