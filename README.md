# Clorox Algolia Search Integration

The goal with this code is to simplify the integration into the WordPress and Magento servers and have similar search capability on each.


1. Add this package as a project dependency in package.json

    `"clorox-search": "github:electro-creative-workshop/clorox-search#semver:^1.0.0",`


2. Load required JS & CSS from this package

    - import {initCloroxSearch} from 'clorox-search';


    - @import "../../node_modules/clorox-search/dist/clorox-search";




3. call initCloroxSearch() to initialize. Defaults are for production and should be overridden for development. Here are the parameters which can be overridden when calling:
  
        initCloroxSearch({
          homeURL: 'https://www.clorox.com',
          language: 'en',
          AppID: 'GTL8ORQAY1',
          searchKey: '4fb8822c5e87903f56a689b93e4a0cfa',
          faqUrl: 'https://www.clorox.com/clorox-faq/',
          productsUrl: 'https://shop.clorox.com/products/',
          initSearch: 'bleach',
          shopProductIndex: 'clorox_clea_prod_cleaning_en_products',
        })

4. call showCloroxSearch() - to invoke
