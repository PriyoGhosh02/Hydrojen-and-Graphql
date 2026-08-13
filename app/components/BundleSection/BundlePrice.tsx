import type { BundlePriceDetails } from '~/utils/bundlePrice';

interface BundlePriceProps {
  pricing: BundlePriceDetails;
  className?: string;
}

export function BundlePrice({ pricing, className = '' }: BundlePriceProps) {
  return (
    <div className={`flex flex-col gap-2 p-4 bg-gray-50/50 border border-gray-100 rounded-xl ${className}`}>
      {/* Original Price */}
      <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
        <span className="uppercase tracking-wider">Original Price</span>
        <span className="line-through font-semibold text-gray-400">
          {pricing.formattedOriginalTotal}
        </span>
      </div>

      {/* Discount Badge & Percentage */}
      <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
        <span className="uppercase tracking-wider flex items-center gap-1.5">
          Bundle Discount
          <span className="bg-accent/15 text-accent text-[9px] font-black px-1.5 py-0.2 rounded-sm tracking-wide">
            {pricing.discountPercentage}% OFF
          </span>
        </span>
        <span className="font-bold text-accent">
          &minus;{pricing.formattedDiscountAmount}
        </span>
      </div>

      <hr className="border-gray-100/80 my-1" />

      {/* Savings Summary Banner */}
      <div className="flex justify-between items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 rounded-lg">
        <span className="uppercase tracking-wider">You Save</span>
        <span className="text-xs font-black">{pricing.formattedSavings}</span>
      </div>

      {/* Final Total */}
      <div className="flex justify-between items-center text-sm font-extrabold text-primary pt-1">
        <span className="uppercase tracking-wider">Final Price</span>
        <span className="text-base font-black text-primary">{pricing.formattedFinalTotal}</span>
      </div>
    </div>
  );
}
