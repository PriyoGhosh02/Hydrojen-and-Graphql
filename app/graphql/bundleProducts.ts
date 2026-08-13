export const BUNDLE_PRODUCTS_QUERY = `#graphql
  query BundleProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    watches: collection(handle: "watches") {
      products(first: 20) {
        nodes {
          id
          title
          handle
          vendor
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 20) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
          options {
            name
            optionValues {
              name
            }
          }
        }
      }
    }
    watchesFallback: collection(handle: "watch-1") {
      products(first: 20) {
        nodes {
          id
          title
          handle
          vendor
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 20) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
          options {
            name
            optionValues {
              name
            }
          }
        }
      }
    }
    bracelets: collection(handle: "bracelets") {
      products(first: 20) {
        nodes {
          id
          title
          handle
          vendor
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 20) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
          options {
            name
            optionValues {
              name
            }
          }
        }
      }
    }
    braceletsFallback: collection(handle: "bracelet-1") {
      products(first: 20) {
        nodes {
          id
          title
          handle
          vendor
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 20) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
          options {
            name
            optionValues {
              name
            }
          }
        }
      }
    }
  }
` as const;
