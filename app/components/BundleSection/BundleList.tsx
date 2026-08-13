import { BundleCard } from './BundleCard';
import type { ProductNode } from '~/hooks/useBundle';

interface BundleListProps {
  title: string;
  subtitle: string;
  products: ProductNode[];
  selectedProductId: string | undefined;
  onSelect: (product: ProductNode) => void;
}

export function BundleList({
  title,
  subtitle,
  products,
  selectedProductId,
  onSelect,
}: BundleListProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm h-full max-h-[600px] lg:max-h-[650px] overflow-hidden">
      <div>
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-0.5">
          {subtitle}
        </span>
        <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider m-0">
          {title}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {products.length > 0 ? (
          products.map((product) => {
            const isSelected = selectedProductId === product.id;
            return (
              <BundleCard
                key={product.id}
                product={product}
                isSelected={isSelected}
                onSelect={onSelect}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none text-gray-400">
            <span className="text-2xl mb-2">🔍</span>
            <span className="text-xs font-semibold uppercase tracking-wider">No Products Found</span>
            <span className="text-[10px] text-gray-400 mt-1">This collection is currently empty.</span>
          </div>
        )}
      </div>
    </div>
  );
}
