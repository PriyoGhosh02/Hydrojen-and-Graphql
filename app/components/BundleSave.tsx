import { useState, useEffect, useRef } from 'react';
import { CartForm, Image, Money } from '@shopify/hydrogen';
import { type FetcherWithComponents } from 'react-router';
import { openCartDrawer } from './CartDrawer';

interface SelectedOption {
  name: string;
  value: string;
}

interface VariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: SelectedOption[];
  image?: {
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
}

interface OptionNode {
  name: string;
  optionValues?: Array<{
    name: string;
  }>;
  values?: string[];
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
  options: OptionNode[];
  variants: {
    nodes: VariantNode[];
  };
}

interface CollectionData {
  products: {
    nodes: ProductNode[];
  };
}

interface BundleDataResponse {
  watchCollection: CollectionData | null;
  braceletCollection: CollectionData | null;
}

export function BundleSave({
  bundleData,
}: {
  bundleData: BundleDataResponse | null;
}) {
  const watchProducts = bundleData?.watchCollection?.products?.nodes || [];
  const braceletProducts = bundleData?.braceletCollection?.products?.nodes || [];

  // Track selection indices
  const [selectedWatchIndex, setSelectedWatchIndex] = useState<number | null>(null);
  const [selectedBraceletIndex, setSelectedBraceletIndex] = useState<number | null>(null);

  // Active products
  const selectedWatch = selectedWatchIndex !== null ? watchProducts[selectedWatchIndex] : null;
  const selectedBracelet = selectedBraceletIndex !== null ? braceletProducts[selectedBraceletIndex] : null;

  // States to track variant option configurations
  const [watchOptions, setWatchOptions] = useState<Record<string, string>>({});
  const [braceletOptions, setBraceletOptions] = useState<Record<string, string>>({});

  // Synchronize watch options state ONLY when the selected watch product actually changes
  useEffect(() => {
    if (selectedWatch) {
      const initialVariant = selectedWatch.variants?.nodes?.[0];
      if (initialVariant) {
        const opts: Record<string, string> = {};
        initialVariant.selectedOptions.forEach((opt) => {
          opts[opt.name] = opt.value;
        });
        setWatchOptions(opts);
      }
    } else {
      setWatchOptions({});
    }
  }, [selectedWatch?.id]);

  // Synchronize bracelet options state ONLY when the selected bracelet product actually changes
  useEffect(() => {
    if (selectedBracelet) {
      const initialVariant = selectedBracelet.variants?.nodes?.[0];
      if (initialVariant) {
        const opts: Record<string, string> = {};
        initialVariant.selectedOptions.forEach((opt) => {
          opts[opt.name] = opt.value;
        });
        setBraceletOptions(opts);
      }
    } else {
      setBraceletOptions({});
    }
  }, [selectedBracelet?.id]);

  if (!watchProducts.length || !braceletProducts.length) return null;

  const findMatchingVariant = (product: ProductNode | null, options: Record<string, string>) => {
    if (!product?.variants?.nodes) return null;
    const match = product.variants.nodes.find((variant) => {
      return variant.selectedOptions.every((opt) => {
        return options[opt.name] === opt.value;
      });
    });
    return match || product.variants.nodes[0];
  };

  const selectedWatchVariant = selectedWatch ? findMatchingVariant(selectedWatch, watchOptions) : null;
  const selectedBraceletVariant = selectedBracelet ? findMatchingVariant(selectedBracelet, braceletOptions) : null;

  const isBothSelected = selectedWatchVariant !== null && selectedBraceletVariant !== null;

  const watchPrice = selectedWatchVariant ? parseFloat(selectedWatchVariant.price.amount) : 0;
  const braceletPrice = selectedBraceletVariant ? parseFloat(selectedBraceletVariant.price.amount) : 0;
  const currencyCode = selectedWatchVariant?.price.currencyCode || selectedBraceletVariant?.price.currencyCode || 'USD';

  // Apply 30% discount once both watch and bracelet are fully configured/selected
  const originalTotal = watchPrice + braceletPrice;
  const discountRate = 0.30;
  const discountAmount = originalTotal * discountRate;
  const bundleTotal = originalTotal - discountAmount;

  const lines = isBothSelected
    ? [
      {
        merchandiseId: selectedWatchVariant!.id,
        quantity: 1,
      },
      {
        merchandiseId: selectedBraceletVariant!.id,
        quantity: 1,
      },
    ]
    : [];

  const renderVariantSelectors = (
    product: ProductNode,
    currentOptions: Record<string, string>,
    setOptions: React.Dispatch<React.SetStateAction<Record<string, string>>>
  ) => {
    if (!product.options || product.options.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mt-2">
        {product.options.map((option) => {
          // Normalize values list from GraphQL schema differences
          const optionValues = option.optionValues
            ? option.optionValues.map((v) => v.name)
            : option.values || [];

          if (optionValues.length <= 1) return null;

          const isColorOption = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

          return (
            <div key={option.name} className="flex flex-col gap-0.5">
              <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider">
                {option.name}: <span className="text-gray-900 font-bold">{currentOptions[option.name] || ''}</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {optionValues.map((valName) => {
                  const isSelected = currentOptions[option.name] === valName;

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

                  const handleSelect = () => {
                    setOptions((prev) => ({
                      ...prev,
                      [option.name]: valName,
                    }));
                  };

                  if (isColorOption) {
                    return (
                      <button
                        key={valName}
                        type="button"
                        onClick={handleSelect}
                        title={valName}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center p-0.5 transition-all duration-200 cursor-pointer focus:outline-none ${isSelected
                          ? 'border-accent ring-1 ring-accent/20 scale-105 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                      >
                        <div
                          className="w-full h-full rounded-full border border-gray-100"
                          style={{ backgroundColor: getColorValue(valName) }}
                        />
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={valName}
                        type="button"
                        onClick={handleSelect}
                        className={`px-2 py-1 text-[8px] font-semibold tracking-wider uppercase border transition-all duration-200 cursor-pointer focus:outline-none ${isSelected
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-200 text-gray-800 hover:border-gray-400 bg-white'
                          }`}
                      >
                        {valName}
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-6 border-t border-gray-100 mt-6">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <span className="text-accent text-[9px] font-bold uppercase tracking-widest block">
            Bundle Offer
          </span>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary m-0 mt-0.5">
            Bundle & Save 30%
          </h2>
        </div>

        {/* 4 Column Sidebar Grid */}
        <div className="grid grid-cols-4 gap-2 items-stretch">
          {/* COLUMN 1: Watch Product Selector */}
          <div className="bg-[#fcfcfc] border border-gray-100 p-2 flex flex-col gap-2">
            <span className="text-[8px] font-bold text-accent tracking-widest uppercase block border-b border-gray-100 pb-1">
              1. Choose Watch
            </span>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px] scrollbar-none pr-0.5">
              {watchProducts.map((product, idx) => {
                const isSelected = selectedWatchIndex === idx;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedWatchIndex(idx)}
                    className={`flex items-center gap-2 w-full text-left p-1.5 transition-all duration-200 border bg-white focus:outline-none ${isSelected
                      ? 'border-accent shadow-xs'
                      : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <div className="w-8 h-8 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {product.featuredImage ? (
                        <img
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[6px] text-gray-300">No Image</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-[9px] font-semibold text-primary truncate">
                        {product.title}
                      </h4>
                      <span className="text-[8px] text-gray-400 mt-0.5 block">
                        From <Money data={product.variants.nodes[0].price} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Configurator / Empty Placeholder (Watch) */}
          <div className="border border-gray-100 p-2 flex flex-col justify-between min-h-[200px] bg-white">
            {selectedWatch && selectedWatchVariant ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">
                    Watch Selected
                  </span>
                  <div
                    key={`watch-cfg-${selectedWatch.id}-${selectedWatchVariant.id}`}
                    className="aspect-square bg-[#fcfcfc] overflow-hidden flex items-center justify-center relative w-full h-24 mb-2 border border-gray-50 animate-fade-in"
                  >
                    {selectedWatchVariant.image || selectedWatch.featuredImage ? (
                      <Image
                        key={selectedWatchVariant.id}
                        alt={selectedWatch.title}
                        data={selectedWatchVariant.image || selectedWatch.featuredImage!}
                        aspectRatio="1/1"
                        className="w-full h-full object-cover"
                        sizes="100px"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-300">No image</span>
                    )}
                  </div>
                  <h3 className="text-[9px] font-bold text-primary uppercase tracking-wide truncate">
                    {selectedWatch.title}
                  </h3>
                  <span className="text-[9px] font-bold text-accent mt-0.5 block" key={`watch-prc-${selectedWatchVariant.id}`}>
                    <Money data={selectedWatchVariant.price} />
                  </span>
                </div>
                <div>
                  {renderVariantSelectors(selectedWatch, watchOptions, setWatchOptions)}
                  <div className="mt-2.5">
                    <CartForm
                      route="/cart"
                      inputs={{
                        lines: [
                          {
                            merchandiseId: selectedWatchVariant.id,
                            quantity: 1,
                          },
                        ],
                      }}
                      action={CartForm.ACTIONS.LinesAdd}
                    >
                      {(fetcher: FetcherWithComponents<any>) => (
                        <IndividualAddToCartButton fetcher={fetcher} />
                      )}
                    </CartForm>
                  </div>
                </div>
              </div>
            ) : (
              /* Dotted Placeholder State */
              <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-sm h-full p-4 text-center select-none bg-gray-50/50">
                <span className="text-xl text-gray-300">⌚</span>
                <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mt-2">
                  No Watch Selected
                </span>
                <span className="text-[7px] text-gray-300 mt-1 leading-normal">
                  Select a watch from column 1
                </span>
              </div>
            )}
          </div>

          {/* COLUMN 3: Bracelet Product Selector */}
          <div className="bg-[#fcfcfc] border border-gray-100 p-2 flex flex-col gap-2">
            <span className="text-[8px] font-bold text-accent tracking-widest uppercase block border-b border-gray-100 pb-1">
              2. Choose Bracelet
            </span>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px] scrollbar-none pr-0.5">
              {braceletProducts.map((product, idx) => {
                const isSelected = selectedBraceletIndex === idx;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedBraceletIndex(idx)}
                    className={`flex items-center gap-2 w-full text-left p-1.5 transition-all duration-200 border bg-white focus:outline-none ${isSelected
                      ? 'border-accent shadow-xs'
                      : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <div className="w-8 h-8 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {product.featuredImage ? (
                        <img
                          src={product.featuredImage.url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[6px] text-gray-300">No Image</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-[9px] font-semibold text-primary truncate">
                        {product.title}
                      </h4>
                      <span className="text-[8px] text-gray-400 mt-0.5 block">
                        From <Money data={product.variants.nodes[0].price} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMN 4: Configurator / Empty Placeholder (Bracelet) */}
          <div className="border border-gray-100 p-2 flex flex-col justify-between min-h-[200px] bg-white">
            {selectedBracelet && selectedBraceletVariant ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 block">
                    Bracelet Selected
                  </span>
                  <div
                    key={`bracelet-cfg-${selectedBracelet.id}-${selectedBraceletVariant.id}`}
                    className="aspect-square bg-[#fcfcfc] overflow-hidden flex items-center justify-center relative w-full h-24 mb-2 border border-gray-50 animate-fade-in"
                  >
                    {selectedBraceletVariant.image || selectedBracelet.featuredImage ? (
                      <Image
                        key={selectedBraceletVariant.id}
                        alt={selectedBracelet.title}
                        data={selectedBraceletVariant.image || selectedBracelet.featuredImage!}
                        aspectRatio="1/1"
                        className="w-full h-full object-cover"
                        sizes="100px"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-300">No image</span>
                    )}
                  </div>
                  <h3 className="text-[9px] font-bold text-primary uppercase tracking-wide truncate">
                    {selectedBracelet.title}
                  </h3>
                  <span className="text-[9px] font-bold text-accent mt-0.5 block" key={`bracelet-prc-${selectedBraceletVariant.id}`}>
                    <Money data={selectedBraceletVariant.price} />
                  </span>
                </div>
                <div>
                  {renderVariantSelectors(selectedBracelet, braceletOptions, setBraceletOptions)}
                  <div className="mt-2.5">
                    <CartForm
                      route="/cart"
                      inputs={{
                        lines: [
                          {
                            merchandiseId: selectedBraceletVariant.id,
                            quantity: 1,
                          },
                        ],
                      }}
                      action={CartForm.ACTIONS.LinesAdd}
                    >
                      {(fetcher: FetcherWithComponents<any>) => (
                        <IndividualAddToCartButton fetcher={fetcher} />
                      )}
                    </CartForm>
                  </div>
                </div>
              </div>
            ) : (
              /* Dotted Placeholder State */
              <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-sm h-full p-4 text-center select-none bg-gray-50/50">
                <span className="text-xl text-gray-300">📿</span>
                <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mt-2">
                  No Bracelet Selected
                </span>
                <span className="text-[7px] text-gray-300 mt-1 leading-normal">
                  Select a bracelet from column 3
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price discount footer */}
        <div className="border border-gray-100 bg-[#fcfcfc] p-3 flex flex-col gap-2 mt-1">
          {isBothSelected ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-gray-400 font-medium uppercase tracking-wider">Regular Total:</span>
                <span className="text-gray-400 line-through font-semibold">
                  <Money data={{ amount: originalTotal.toFixed(2), currencyCode }} />
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-primary">
                <span className="uppercase tracking-wider">Bundle Total:</span>
                <span>
                  <Money data={{ amount: bundleTotal.toFixed(2), currencyCode }} />
                </span>
              </div>
              <div className="flex justify-between items-center mt-1 border-t border-gray-100 pt-2 gap-3">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest">
                  Saving: <Money data={{ amount: discountAmount.toFixed(2), currencyCode }} /> (30% OFF)
                </span>
                <div className="w-auto">
                  <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
                    {(fetcher: FetcherWithComponents<any>) => (
                      <BundleSubmitButton fetcher={fetcher} />
                    )}
                  </CartForm>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-[9px] font-medium tracking-wide text-gray-400 leading-normal">
              Select 1 Watch and 1 Bracelet from the lists above to claim your <span className="text-accent font-bold">30% Bundle Discount</span>!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BundleSubmitButton({ fetcher }: { fetcher: FetcherWithComponents<any> }) {
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      isSubmitting.current = true;
    } else if (isSubmitting.current && fetcher.state === 'idle' && fetcher.data) {
      openCartDrawer();
      isSubmitting.current = false;
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <button
      type="submit"
      disabled={fetcher.state !== 'idle'}
      className="bg-primary hover:bg-accent text-white hover:text-black py-2 px-5 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer border border-transparent"
    >
      {fetcher.state !== 'idle' ? 'Adding Bundle...' : 'Add Bundle'}
    </button>
  );
}

function IndividualAddToCartButton({ fetcher }: { fetcher: FetcherWithComponents<any> }) {
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      isSubmitting.current = true;
    } else if (isSubmitting.current && fetcher.state === 'idle' && fetcher.data) {
      openCartDrawer();
      isSubmitting.current = false;
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <button
      type="submit"
      disabled={fetcher.state !== 'idle'}
      className="w-full bg-primary hover:bg-accent text-white hover:text-black py-2 px-4 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer border border-transparent"
    >
      {fetcher.state !== 'idle' ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}