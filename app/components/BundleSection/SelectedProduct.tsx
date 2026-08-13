import { Money } from '@shopify/hydrogen';
import type { ProductNode, VariantNode } from '~/hooks/useBundle';

interface SelectedProductProps {
  product: ProductNode | null;
  selectedVariant: VariantNode | null;
  quantity: number;
  selectedOptions: Record<string, string>;
  placeholderText: string;
  placeholderEmoji: string;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
  onOptionChange: (name: string, value: string) => void;
}

export function SelectedProduct({
  product,
  selectedVariant,
  quantity,
  selectedOptions,
  placeholderText,
  placeholderEmoji,
  onRemove,
  onQtyChange,
  onOptionChange,
}: SelectedProductProps) {
  if (!product || !selectedVariant) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[400px] lg:min-h-[450px] bg-gray-50/20 select-none animate-pulse">
        <span className="text-4xl mb-3 drop-shadow-sm select-none">{placeholderEmoji}</span>
        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
          {placeholderText}
        </h4>
        <p className="text-[10px] text-gray-400 max-w-xs mt-1.5 leading-normal">
          Select an item from the list on the left to configure your bundle.
        </p>
      </div>
    );
  }

  const isAvailable = selectedVariant.availableForSale;

  const handleIncrement = () => {
    onQtyChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQtyChange(quantity - 1);
    }
  };

  // Helper to determine background colors for color options
  const getColorStyle = (colorName: string): string => {
    const lower = colorName.toLowerCase();
    const map: Record<string, string> = {
      gold: '#d4af37',
      silver: '#c0c0c0',
      rose: '#b76e79',
      'rose gold': '#b76e79',
      charcoal: '#36454f',
      navy: '#000080',
      chocolate: '#7b3f00',
      black: '#000000',
      white: '#ffffff',
    };
    return map[lower] || lower;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm min-h-[450px] lg:min-h-[500px] relative animate-fade-in">
      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 cursor-pointer focus:outline-none z-20 border border-transparent hover:border-red-100"
        title={`Remove ${product.title}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Product Details Section */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Large Product Image */}
        <div className="aspect-square bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100/50 relative shadow-inner">
          {selectedVariant.image || product.featuredImage ? (
            <img
              src={selectedVariant.image?.url || product.featuredImage!.url}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}

          {/* Stock Badges on Image */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-10">
            {isAvailable ? (
              <span className="text-[9px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Vendor and Title */}
        <div className="flex flex-col gap-1">
          {product.vendor && (
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest">
              {product.vendor}
            </span>
          )}
          <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide leading-tight">
            {product.title}
          </h3>
          <div className="text-xs font-semibold text-gray-500 flex items-center gap-2 mt-0.5">
            <span>Price:</span>
            <span className="text-sm font-black text-primary">
              <Money data={selectedVariant.price} />
            </span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Variant / Option Selector */}
        {product.options && product.options.length > 0 && (
          <div className="flex flex-col gap-3">
            {product.options.map((option) => {
              const optionValues = option.optionValues
                ? option.optionValues.map((v) => v.name)
                : option.values || [];

              // Skip option selectors that only have a default / single value
              if (optionValues.length <= 1) return null;

              const isColorOption =
                option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

              return (
                <div key={option.name} className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Select {option.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {optionValues.map((val) => {
                      const isSelected = selectedOptions[option.name] === val;

                      if (isColorOption) {
                        const colorHex = getColorStyle(val);
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => onOptionChange(option.name, val)}
                            title={val}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center p-0.5 transition-all duration-300 cursor-pointer focus:outline-none hover:scale-110
                              ${isSelected
                                ? 'border-accent ring-2 ring-accent/20 scale-105 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                              }
                            `}
                          >
                            <span
                              className="w-full h-full rounded-full border border-gray-100"
                              style={{ backgroundColor: colorHex }}
                            />
                          </button>
                        );
                      } else {
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => onOptionChange(option.name, val)}
                            className={`px-3 py-1.5 text-[9px] font-bold tracking-wider uppercase border rounded-md transition-all duration-300 cursor-pointer focus:outline-none
                              ${isSelected
                                ? 'border-accent bg-accent text-white shadow-xs'
                                : 'border-gray-200 text-gray-800 hover:border-gray-400 bg-white'
                              }
                            `}
                          >
                            {val}
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quantity & Actions Area */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Quantity
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || !isAvailable}
              className="w-7 h-7 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black flex items-center justify-center text-sm font-bold bg-white cursor-pointer select-none focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &minus;
            </button>
            <span className="text-xs font-bold text-primary w-6 text-center select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={!isAvailable}
              className="w-7 h-7 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-black flex items-center justify-center text-sm font-bold bg-white cursor-pointer select-none focus:outline-none transition-colors disabled:opacity-40"
            >
              &#43;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
