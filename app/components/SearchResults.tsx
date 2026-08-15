import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold uppercase tracking-wider text-primary border-b border-gray-100 pb-3">
        Products
      </h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                key={product.id}
                prefetch="intent"
                to={productUrl}
                className="group block w-full bg-white border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                  {image ? (
                    <Image
                      data={image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-sm font-medium text-primary group-hover:text-accent transition-colors truncate">
                    {product.title}
                  </h3>
                  <div className="mt-1 text-sm font-semibold text-primary">
                    {price && <Money data={price} />}
                  </div>
                </div>
              </Link>
            );
          });

          return (
            <div className="space-y-8">
              {PreviousLink && (
                <div className="text-center">
                  <PreviousLink className="inline-block px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-primary text-xs font-bold uppercase tracking-wider transition-colors">
                    {isLoading ? 'Loading...' : '↑ Load previous results'}
                  </PreviousLink>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {ItemsMarkup}
              </div>

              {NextLink && (
                <div className="text-center pt-4">
                  <NextLink className="inline-block px-8 py-3 bg-primary hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300">
                    {isLoading ? 'Loading...' : 'Load more results ↓'}
                  </NextLink>
                </div>
              )}
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="py-16 text-center bg-gray-50 border border-gray-100 max-w-2xl mx-auto p-8">
      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-lg font-bold text-primary uppercase tracking-wider mb-2">No Results Found</h3>
      <p className="text-sm text-gray-500 font-light mb-6">
        We couldn&apos;t find any products matching your search term. Try searching for watch brands, collections, or materials.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/collections/all" className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-colors">
          Browse All Products
        </Link>
        <Link to="/collections/watch-1" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider hover:border-primary transition-colors">
          Explore Watches
        </Link>
      </div>
    </div>
  );
}
