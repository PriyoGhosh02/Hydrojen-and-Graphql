import { Money } from '@shopify/hydrogen';
import type { ProductNode, VariantNode } from '~/hooks/useBundle';
import type { BundlePriceDetails } from '~/utils/bundlePrice';
import { BundleButton } from './BundleButton';

interface BundleSummaryProps {
  selectedWatch: ProductNode | null;
  watchVariant: VariantNode | null;
  selectedBracelet: ProductNode | null;
  braceletVariant: VariantNode | null;
  pricing: BundlePriceDetails;
  isActive: boolean;
  isSubmitting: boolean;
}

export function BundleSummary({
  selectedWatch,
  watchVariant,
  selectedBracelet,
  braceletVariant,
  pricing,
  isActive,
  isSubmitting,
}: BundleSummaryProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 mt-8 animate-fade-in relative overflow-hidden">
      {/* Visual background gradient accent */}
      <div className="absolute inset-y-0 left-0 w-2.5 bg-accent pointer-events-none" />

      {/* Column 1: Thumbnails of Selections */}
      <div className="flex items-center gap-4 w-full md:w-auto pl-2">
        {/* Watch Thumbnail */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 relative">
            {watchVariant?.image || selectedWatch?.featuredImage ? (
              <img
                src={watchVariant?.image?.url || selectedWatch?.featuredImage!.url}
                alt={selectedWatch?.title || 'Selected Watch'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl select-none">⌚</span>
            )}
          </div>
          <div className="max-w-[120px] hidden sm:block">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
              Watch
            </h5>
            <p className="text-xs font-bold text-primary truncate leading-tight">
              {selectedWatch ? selectedWatch.title : 'Not Selected'}
            </p>
          </div>
        </div>

        {/* Plus Sign */}
        <span className="text-lg font-light text-gray-300 select-none px-1">&#43;</span>

        {/* Bracelet Thumbnail */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 relative">
            {braceletVariant?.image || selectedBracelet?.featuredImage ? (
              <img
                src={braceletVariant?.image?.url || selectedBracelet?.featuredImage!.url}
                alt={selectedBracelet?.title || 'Selected Bracelet'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl select-none">📿</span>
            )}
          </div>
          <div className="max-w-[120px] hidden sm:block">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
              Bracelet
            </h5>
            <p className="text-xs font-bold text-primary truncate leading-tight">
              {selectedBracelet ? selectedBracelet.title : 'Not Selected'}
            </p>
          </div>
        </div>
      </div>

      {/* Column 2: Pricing Summary */}
      {isActive ? (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full md:w-auto text-center sm:text-left justify-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Original Price
            </span>
            <span className="text-sm font-semibold text-gray-400 line-through">
              {pricing.formattedOriginalTotal}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
              Bundle Savings
              <span className="bg-accent/15 text-accent text-[8px] font-black px-1 rounded-sm uppercase">
                {pricing.discountPercentage}% OFF
              </span>
            </span>
            <span className="text-sm font-bold text-accent">
              Save {pricing.formattedSavings}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Final Total
            </span>
            <span className="text-base font-black text-primary">
              {pricing.formattedFinalTotal}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider w-full md:w-auto py-1">
          Select <span className="text-primary font-black">1 Watch</span> and <span className="text-primary font-black">1 Bracelet</span> to activate your discount
        </div>
      )}

      {/* Column 3: Add to Cart Button */}
      <div className="w-full md:w-64">
        <BundleButton isActive={isActive} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
