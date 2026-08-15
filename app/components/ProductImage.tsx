import { useState, useEffect } from 'react';
import { Image } from '@shopify/hydrogen';

export function ProductImage({
  image,
  images = [],
}: {
  image?: any;
  images?: Array<any>;
}) {
  const galleryNodes = images && images.length > 0 ? images : image ? [image] : [];
  const [activeImage, setActiveImage] = useState(image || galleryNodes[0]);

  useEffect(() => {
    if (image) {
      setActiveImage(image);
    }
  }, [image]);

  if (!galleryNodes.length) {
    return (
      <div className="w-full h-full bg-[#f9f9f9] border border-gray-100 flex items-center justify-center text-gray-400 text-xs font-light min-h-[300px]">
        TimeCrafts Item
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between gap-4 font-sans">
      {/* Main Active Image Display - Fills container height */}
      <div className="relative flex-1 w-full bg-[#f9f9f9] border border-gray-100/80 overflow-hidden group shadow-2xs flex items-center justify-center min-h-[250px]">
        <Image
          alt={activeImage?.altText || 'Product Image'}
          aspectRatio="1/1"
          data={activeImage}
          key={activeImage?.id || activeImage?.url}
          sizes="(min-width: 64em) 50vw, 100vw"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Thumbnail Selector Gallery at bottom of div */}
      {galleryNodes.length > 1 && (
        <div className="shrink-0 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {galleryNodes.map((imgItem, idx) => {
            const isSelected =
              (activeImage?.id && activeImage.id === imgItem.id) ||
              activeImage?.url === imgItem.url;
            return (
              <button
                key={imgItem.id || idx}
                type="button"
                onClick={() => setActiveImage(imgItem)}
                aria-label={`Select product image ${idx + 1}`}
                className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#f9f9f9] border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-accent ring-2 ring-accent/20 opacity-100 scale-102 shadow-xs'
                    : 'border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  alt={imgItem.altText || `Thumbnail ${idx + 1}`}
                  aspectRatio="1/1"
                  data={imgItem}
                  sizes="80px"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
