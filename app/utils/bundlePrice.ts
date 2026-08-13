/**
 * Calculates bundle price details based on watch and bracelet prices.
 * Default discount is 30%.
 */
export interface BundlePriceDetails {
  originalTotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalTotal: number;
  savings: number;
  formattedOriginalTotal: string;
  formattedDiscountAmount: string;
  formattedFinalTotal: string;
  formattedSavings: string;
}

export function calculateBundlePrice(
  watchPrice: number | string | undefined | null,
  braceletPrice: number | string | undefined | null,
  discountPercentage = 30,
  currencyCode = 'USD'
): BundlePriceDetails {
  const watchVal = typeof watchPrice === 'string' ? parseFloat(watchPrice) : (watchPrice || 0);
  const braceletVal = typeof braceletPrice === 'string' ? parseFloat(braceletPrice) : (braceletPrice || 0);

  const originalTotal = watchVal + braceletVal;
  const discountRate = discountPercentage / 100;
  const discountAmount = originalTotal * discountRate;
  const finalTotal = originalTotal - discountAmount;
  const savings = discountAmount;

  // Format with currency symbol helper or default dollar format
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });

  return {
    originalTotal,
    discountPercentage,
    discountAmount,
    finalTotal,
    savings,
    formattedOriginalTotal: formatter.format(originalTotal),
    formattedDiscountAmount: formatter.format(discountAmount),
    formattedFinalTotal: formatter.format(finalTotal),
    formattedSavings: formatter.format(savings),
  };
}
