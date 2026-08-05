import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {openCartDrawer} from './CartDrawer';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <AddToCartInner
          fetcher={fetcher}
          analytics={analytics}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </AddToCartInner>
      )}
    </CartForm>
  );
}

function AddToCartInner({
  fetcher,
  analytics,
  disabled,
  onClick,
  children,
}: {
  fetcher: FetcherWithComponents<any>;
  analytics?: unknown;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // When the fetcher completes successfully, open the cart aside drawer!
    if (fetcher.state === 'idle' && fetcher.data) {
      openCartDrawer();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <button
        type="submit"
        onClick={onClick}
        disabled={disabled ?? fetcher.state !== 'idle'}
        className="w-full bg-primary hover:bg-accent text-white hover:text-black py-4 px-6 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-none shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer uppercase border border-transparent hover:-translate-y-0.5"
      >
        {children}
      </button>
    </>
  );
}
