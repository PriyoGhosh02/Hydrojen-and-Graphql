import { Link, useLocation, useNavigate } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { openCartDrawer } from './CartDrawer';
import type { ProductFragment } from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const { pathname } = useLocation();

  return (
    <div className="product-form flex flex-col gap-4">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options flex flex-col" key={option.name}>
            <h5 className="text-xs font-semibold tracking-wider text-gray-400 
                           uppercase mb-2">
              {option.name}
            </h5>
            <div className="product-options-grid flex flex-wrap gap-2.5">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const isColorOption =
                  option.name.toLowerCase() === 'color' ||
                  option.name.toLowerCase() === 'colour';

                const buttonClass = isColorOption
                  ? `w-8 h-8 rounded-full border flex items-center justify-center 
                     p-0.5 transition-all duration-200 cursor-pointer ${selected
                    ? 'border-accent ring-2 ring-accent/20 scale-105 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${available ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`
                  : `min-w-[3rem] text-center px-4 py-2.5 text-xs font-semibold 
                     tracking-wider uppercase border transition-all duration-200 
                     cursor-pointer ${selected
                    ? 'border-accent bg-accent text-white'
                    : 'border-gray-200 text-gray-800 hover:border-gray-400 bg-white'
                  } ${available ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`;

                const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
                const localePrefix =
                  match && match.length > 0 ? match[0] : '/';

                const to = isDifferentProduct
                  ? `${localePrefix}products/${handle}?${variantUriQuery}`
                  : `${pathname}?${variantUriQuery}`;

                return (
                  <Link
                    key={option.name + name}
                    to={to}
                    // ✅ এই ৩টা line page reload বন্ধ করবে
                    preventScrollReset
                    replace
                    prefetch="intent"
                    className={buttonClass}
                  >
                    <ProductOptionSwatch
                      swatch={swatch}
                      name={name}
                      optionName={option.name}
                    />
                  </Link>
                );
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          openCartDrawer();
        }}
        lines={
          selectedVariant
            ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
                selectedVariant,
              },
            ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
  optionName,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  optionName: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  const isColorOption =
    optionName.toLowerCase() === 'color' ||
    optionName.toLowerCase() === 'colour';

  if (!image && !color && !isColorOption) return <span>{name}</span>;

  const getColorValue = (colorName: string) => {
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

  const bgColor =
    color || (isColorOption ? getColorValue(name) : 'transparent');

  return (
    <div
      aria-label={name}
      className="w-full h-full rounded-full border border-gray-100 flex 
                 items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {!!image && (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}