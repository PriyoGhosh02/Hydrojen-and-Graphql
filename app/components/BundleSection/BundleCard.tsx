import { Money } from '@shopify/hydrogen';
import type { ProductNode } from '~/hooks/useBundle';

interface BundleCardProps {
  product: ProductNode;
  isSelected: boolean;
  onSelect: (product: ProductNode) => void;
}

export function BundleCard({ product, isSelected, onSelect }: BundleCardProps) {
  const isSoldOut = product.variants?.nodes?.every((v) => !v.availableForSale) ?? true;
  const startingPrice = product.variants?.nodes?.[0]?.price;

  const handleClick = () => {
    if (!isSoldOut) {
      onSelect(product);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSoldOut}
      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 relative group cursor-pointer focus:outline-none overflow-hidden select-none
        ${isSoldOut 
          ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed' 
          : isSelected
            ? 'border-accent bg-accent/5 shadow-md shadow-accent/5 scale-[1.01]'
            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 hover:shadow-xs'
        }
      `}
      aria-label={`Select ${product.title}`}
    >
      {/* Background Micro-animation Highlight */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/3 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Product Image */}
      <div className="w-16 h-16 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100/50 relative">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-[10px] text-gray-300">No Image</span>
        )}

        {/* Sold Out Overlay Badge */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-black/80">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5 relative z-10">
        <div className="flex items-center gap-2">
          {product.vendor && (
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate">
              {product.vendor}
            </span>
          )}
          {!isSoldOut && (
            <span className="text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded-sm uppercase tracking-wider ml-auto flex-shrink-0">
              In Stock
            </span>
          )}
        </div>
        <h4 className="text-xs font-bold text-primary truncate pr-4 group-hover:text-accent transition-colors">
          {product.title}
        </h4>
        {startingPrice && (
          <span className="text-xs font-semibold text-gray-500 mt-0.5 block">
            From <span className="text-primary font-bold"><Money data={startingPrice} /></span>
          </span>
        )}
      </div>

      {/* Selected Indicator Checkbox Icon */}
      {isSelected && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white border border-accent/20 animate-fade-in shadow-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
