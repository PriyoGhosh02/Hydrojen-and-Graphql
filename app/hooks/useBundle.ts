import { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateBundlePrice, type BundlePriceDetails } from '~/utils/bundlePrice';

export interface SelectedOption {
  name: string;
  value: string;
}

export interface VariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: any;
  };
  selectedOptions: SelectedOption[];
  image?: {
    url: string;
    altText?: string;
    width: number;
    height: number;
  };
}

export interface OptionNode {
  name: string;
  optionValues?: Array<{
    name: string;
  }>;
  values?: string[];
}

export interface ProductNode {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
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

export interface UseBundleReturn {
  selectedWatch: ProductNode | null;
  selectedBracelet: ProductNode | null;
  watchVariant: VariantNode | null;
  braceletVariant: VariantNode | null;
  watchQty: number;
  braceletQty: number;
  watchOptions: Record<string, string>;
  braceletOptions: Record<string, string>;
  isBundleActive: boolean;
  pricing: BundlePriceDetails;
  currencyCode: string;
  selectWatch: (product: ProductNode) => void;
  selectBracelet: (product: ProductNode) => void;
  removeWatch: () => void;
  removeBracelet: () => void;
  setWatchQty: React.Dispatch<React.SetStateAction<number>>;
  setBraceletQty: React.Dispatch<React.SetStateAction<number>>;
  updateWatchOption: (name: string, value: string) => void;
  updateBraceletOption: (name: string, value: string) => void;
}

export function useBundle(): UseBundleReturn {
  const [selectedWatch, setSelectedWatch] = useState<ProductNode | null>(null);
  const [selectedBracelet, setSelectedBracelet] = useState<ProductNode | null>(null);

  const [watchVariant, setWatchVariant] = useState<VariantNode | null>(null);
  const [braceletVariant, setBraceletVariant] = useState<VariantNode | null>(null);

  const [watchQty, setWatchQty] = useState<number>(1);
  const [braceletQty, setBraceletQty] = useState<number>(1);

  const [watchOptions, setWatchOptions] = useState<Record<string, string>>({});
  const [braceletOptions, setBraceletOptions] = useState<Record<string, string>>({});

  // Helper to find variant matching selected options
  const findMatchingVariant = useCallback((product: ProductNode | null, options: Record<string, string>): VariantNode | null => {
    if (!product?.variants?.nodes) return null;
    const match = product.variants.nodes.find((variant) => {
      return variant.selectedOptions.every((opt) => {
        return options[opt.name] === opt.value;
      });
    });
    return match || product.variants.nodes[0] || null;
  }, []);

  // Update selected watch options when watch changes
  const selectWatch = useCallback((product: ProductNode) => {
    setSelectedWatch(product);
    setWatchQty(1);
    
    // Select first variant's options by default
    const firstVariant = product.variants?.nodes?.[0];
    if (firstVariant) {
      const initialOptions: Record<string, string> = {};
      firstVariant.selectedOptions.forEach((opt) => {
        initialOptions[opt.name] = opt.value;
      });
      setWatchOptions(initialOptions);
      setWatchVariant(firstVariant);
    } else {
      setWatchOptions({});
      setWatchVariant(null);
    }
  }, []);

  // Update selected bracelet options when bracelet changes
  const selectBracelet = useCallback((product: ProductNode) => {
    setSelectedBracelet(product);
    setBraceletQty(1);

    // Select first variant's options by default
    const firstVariant = product.variants?.nodes?.[0];
    if (firstVariant) {
      const initialOptions: Record<string, string> = {};
      firstVariant.selectedOptions.forEach((opt) => {
        initialOptions[opt.name] = opt.value;
      });
      setBraceletOptions(initialOptions);
      setBraceletVariant(firstVariant);
    } else {
      setBraceletOptions({});
      setBraceletVariant(null);
    }
  }, []);

  const removeWatch = useCallback(() => {
    setSelectedWatch(null);
    setWatchVariant(null);
    setWatchQty(1);
    setWatchOptions({});
  }, []);

  const removeBracelet = useCallback(() => {
    setSelectedBracelet(null);
    setBraceletVariant(null);
    setBraceletQty(1);
    setBraceletOptions({});
  }, []);

  // Update specific options
  const updateWatchOption = useCallback((name: string, value: string) => {
    setWatchOptions((prev) => {
      const next = { ...prev, [name]: value };
      if (selectedWatch) {
        const nextVariant = findMatchingVariant(selectedWatch, next);
        setWatchVariant(nextVariant);
      }
      return next;
    });
  }, [selectedWatch, findMatchingVariant]);

  const updateBraceletOption = useCallback((name: string, value: string) => {
    setBraceletOptions((prev) => {
      const next = { ...prev, [name]: value };
      if (selectedBracelet) {
        const nextVariant = findMatchingVariant(selectedBracelet, next);
        setBraceletVariant(nextVariant);
      }
      return next;
    });
  }, [selectedBracelet, findMatchingVariant]);

  // Determine if both items are fully selected and active
  const isBundleActive = useMemo(() => {
    return !!(selectedWatch && selectedBracelet && watchVariant && braceletVariant);
  }, [selectedWatch, selectedBracelet, watchVariant, braceletVariant]);

  // Get currency code
  const currencyCode = useMemo(() => {
    return watchVariant?.price?.currencyCode || braceletVariant?.price?.currencyCode || 'USD';
  }, [watchVariant, braceletVariant]);

  // Compute pricing
  const pricing = useMemo(() => {
    const watchPrice = watchVariant ? parseFloat(watchVariant.price.amount) * watchQty : 0;
    const braceletPrice = braceletVariant ? parseFloat(braceletVariant.price.amount) * braceletQty : 0;
    return calculateBundlePrice(watchPrice, braceletPrice, 30, currencyCode);
  }, [watchVariant, watchQty, braceletVariant, braceletQty, currencyCode]);

  return {
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
    currencyCode,
    selectWatch,
    selectBracelet,
    removeWatch,
    removeBracelet,
    setWatchQty,
    setBraceletQty,
    updateWatchOption,
    updateBraceletOption,
  };
}
