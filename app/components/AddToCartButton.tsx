import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

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
            className="w-full bg-[#1a1a1a] hover:bg-[#c9a96e] text-white hover:text-black py-4 px-6 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-none shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer uppercase border border-transparent hover:-translate-y-0.5"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
