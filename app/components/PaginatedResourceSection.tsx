import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="flex flex-col items-center">
            <div className="my-6 text-center">
              <PreviousLink className="inline-flex items-center justify-center gap-2 bg-white hover:bg-primary text-gray-800 hover:text-white border border-gray-200 hover:border-primary px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-2xs">
                {isLoading ? (
                  <span>Loading previous...</span>
                ) : (
                  <span>
                    <span aria-hidden="true">↑</span> Load Previous Products
                  </span>
                )}
              </PreviousLink>
            </div>

            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={`w-full ${resourcesClassName}`}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}

            <div className="my-10 text-center">
              <NextLink className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#d4af37] text-white hover:text-black px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md">
                {isLoading ? (
                  <span>Loading Catalog...</span>
                ) : (
                  <span>
                    Load More Products <span aria-hidden="true">↓</span>
                  </span>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
