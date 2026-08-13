import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { CartForm } from '@shopify/hydrogen';
import { openCartDrawer } from '~/components/CartDrawer';
import { useBundle, type ProductNode } from '~/hooks/useBundle';
import { BundleList } from './BundleList';
import { SelectedProduct } from './SelectedProduct';
import { BundlePrice } from './BundlePrice';
import { BundleSummary } from './BundleSummary';

interface BundleSectionProps {
  watches: ProductNode[];
  bracelets: ProductNode[];
}

export function BundleSection({ watches, bracelets }: BundleSectionProps) {
  const {
    selectedWatch,
    selectedBracelet,
    watchVariant,
    braceletVariant,
    watchQty,
    braceletQty,
    watchOptions,
    braceletOptions,
    isBundleActive,
    pricing,
    selectWatch,
    selectBracelet,
    removeWatch,
    removeBracelet,
    setWatchQty,
    setBraceletQty,
    updateWatchOption,
    updateBraceletOption,
  } = useBundle();

  // Fetchers for adding to cart and updating discount
  const cartFetcher = useFetcher();
  const discountFetcher = useFetcher();

  const isAddingToCart = cartFetcher.state !== 'idle';
  const isApplyingDiscount = discountFetcher.state !== 'idle';
  const isSubmitting = isAddingToCart || isApplyingDiscount;

  const wasAdding = useRef(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor cart addition status
  useEffect(() => {
    if (cartFetcher.state === 'submitting') {
      wasAdding.current = true;
    }

    if (cartFetcher.state === 'idle' && wasAdding.current) {
      wasAdding.current = false;
      
      const hasErrors = cartFetcher.data?.errors && cartFetcher.data.errors.length > 0;
      if (hasErrors) {
        setToastMessage('Something went wrong. Unable to add products.');
      } else {
        // Option 2: Automatically apply BUNDLE30 discount code after addition succeeds
        discountFetcher.submit(
          {
            action: CartForm.ACTIONS.DiscountCodesUpdate,
            inputs: JSON.stringify({
              discountCode: 'BUNDLE30',
              discountCodes: [],
            }),
          },
          { method: 'POST', action: '/cart' }
        );
        
        // Open the slide-out cart drawer
        openCartDrawer();
      }
    }
  }, [cartFetcher.state, cartFetcher.data]);

  // Clear toast notification after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const lines = isBundleActive
    ? [
        {
          merchandiseId: watchVariant!.id,
          quantity: watchQty,
        },
        {
          merchandiseId: braceletVariant!.id,
          quantity: braceletQty,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8 py-10 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-red-500 text-white font-semibold text-xs py-3.5 px-6 rounded-xl shadow-xl z-50 border border-red-400 flex items-center gap-2 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {/* Column 1: Watch list */}
        <div className="flex flex-col">
          <BundleList
            title="Luxury Watches"
            subtitle="Step 1"
            products={watches}
            selectedProductId={selectedWatch?.id}
            onSelect={selectWatch}
          />
        </div>

        {/* Column 2: Selected Watch preview */}
        <div className="flex flex-col">
          <SelectedProduct
            product={selectedWatch}
            selectedVariant={watchVariant}
            quantity={watchQty}
            selectedOptions={watchOptions}
            placeholderText="No Watch Selected"
            placeholderEmoji="⌚"
            onRemove={removeWatch}
            onQtyChange={setWatchQty}
            onOptionChange={updateWatchOption}
          />
        </div>

        {/* Column 3: Bracelet list */}
        <div className="flex flex-col">
          <BundleList
            title="Premium Bracelets"
            subtitle="Step 2"
            products={bracelets}
            selectedProductId={selectedBracelet?.id}
            onSelect={selectBracelet}
          />
        </div>

        {/* Column 4: Selected Bracelet preview */}
        <div className="flex flex-col">
          <SelectedProduct
            product={selectedBracelet}
            selectedVariant={braceletVariant}
            quantity={braceletQty}
            selectedOptions={braceletOptions}
            placeholderText="No Bracelet Selected"
            placeholderEmoji="📿"
            onRemove={removeBracelet}
            onQtyChange={setBraceletQty}
            onOptionChange={updateBraceletOption}
          />
        </div>
      </div>

      {/* Pricing and checkout details */}
      {isBundleActive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            {/* Empty spacer or custom messages can go here */}
          </div>
          <div>
            <BundlePrice pricing={pricing} />
          </div>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <cartFetcher.Form method="POST" action="/cart">
        <input type="hidden" name="action" value={CartForm.ACTIONS.LinesAdd} />
        <input type="hidden" name="lines" value={JSON.stringify(lines)} />
        <BundleSummary
          selectedWatch={selectedWatch}
          watchVariant={watchVariant}
          selectedBracelet={selectedBracelet}
          braceletVariant={braceletVariant}
          pricing={pricing}
          isActive={isBundleActive}
          isSubmitting={isSubmitting}
        />
      </cartFetcher.Form>
    </div>
  );
}
