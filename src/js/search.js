/**
 * algolia live search
 *   sets up an overlay with live search capabilities
 *   initCloroxSearch() - setup hidden overlay
 *   showCloroxSearch() - display overlay & allow searching
 */

// search only iibrary
import algoliasearch from 'algoliasearch/lite';

export function initCloroxSearch(settings) {
  const SEARCH_CONFIG = Object.assign({
    homeURL: 'https://dtc.clorox.com',
    language: 'en',
    AppID: 'GRSV9LRTAJ',
    searchKey: '54ea8a2e1cfd0dd6e84ab89892df4da6',
    faqUrl: 'https://dtc.clorox.com/clorox-faq/',
    productsUrl: 'https://dtc.clorox.com/products/',
    initSearch: 'bleach',
  }, settings);
  console.log(SEARCH_CONFIG);

  // strings for English & Spanish
  var strings = {
    search: 'Search',
    products: 'Products',
    information: 'Information',
    noResults: 'No results',
    noResultsDetail: 'We tried as hard as we could but couldn\'t find any results',
    viewAllProducts: 'View all products',
    guides: 'Cleaning Guides',
    resources: 'Other Resources',
    loadMore: {
      products: 'Load more products',
      guides: 'Load more guides',
    },
    faqsLoadMore: 'More Frequently Asked Questions',
  };
  if (SEARCH_CONFIG.language === 'es') {
    strings = {
      search: 'Buscar',
      products: 'Productos',
      information: 'Información',
      noResults:'No results (es)',
      noResultsDetail: 'We tried as hard as we could but couldn\'t find any results (es)',
      viewAllProducts: 'View all products (es)',
      guides: 'Cleaning Guides (es)',
      resources: 'Other Resources (es)',
      loadMore: {
        products: 'Load more products (es)',
        guides: 'Load more guides (es)',
      },
      faqsLoadMore: 'More Frequently Asked Questions (es)',
    };
  }

  appendOverlay();

  const client = algoliasearch(
    SEARCH_CONFIG.AppID,
    SEARCH_CONFIG.searchKey
  );
  console.log('client', client);


  const searchInput = document.getElementsByClassName('js-search-input')[0];
  const resultsElement = document.getElementsByClassName('js-search-results')[0];
  const searchTabs = document.getElementsByClassName('js-search-tabs')[0];


  // determine if mobile rules apply
  const windowWidthEMs = window.innerWidth / parseFloat(
    getComputedStyle(document.querySelector('html'))['font-size']
  );
  const isMobile = windowWidthEMs <= 48;

  // detail indices / types
  const indexDefault = {
    fields: [
      'name',
      'url',
      'thumbnail_url',
    ],
  };


  let productIndex = 'clorox_clea_integration_cleaning_en_products';
  if (SEARCH_CONFIG.language === 'es') {
    productIndex = 'wp_posts_product';
  }


  // tab sections & related content
  const sections = {
    products: {
      indices: {
        [productIndex]: {
          loadMore: 'products',
          hitsPerPage: 12,
          hitsPerPageMobile: 8,
          type: 'products',
        },
      },
    },
    information: {
      indices: {
        wp_posts_guides: {
          title: 'guides',
          loadMore: 'guides',
          hitsPerPage: 9,
          hitsPerPageMobile: 6,
          type: 'guides',
        },
        wp_faqs: {
          title: 'resources',
          fields: [
            'question',
            'answer',
          ],
          hitsPerPage: 3,
          type: 'faqs',
        },
        wp_posts_page: {
          title: 'resources',
          type: 'links',
          hitsPerPage: 25,
        },
      },
    },
  };

  let currentSection = 'products';


  /**
   * Transform product results
   *
   * @param {Array} results
   * @return {Array}
   */
  const transformers = {
    products: results => {
      return results.map(item => {
        let brand = false;
        let title = item.name;
        let parts = splitTitleAndBrand(title);
        if (Array.isArray(parts)) {
          brand = parts[1];
          title = parts[2];
        }

        let html = '';
        html += `<li><a href="${item.url}/" class="search__item">`;

        if (item.thumbnail_url) {
          html += '<div class="search-result-img">';
            html += `<img src="${item.thumbnail_url}?width=176&amp;height=176&amp;fit=crop" alt="">`;
            html += '</div>';
        }

        html += `<div class="search-result-txt">`;
        if (brand) {
          html += `<span class="brand label-small">${brand}</span>`;
        }
        html += `<span class="name label-large-strong">${title}</span>`;
        html += `</div></a></li>`;

        return html;
      });
    },

    guides: results => {
      return results.map(item => {
        let html = `<li><a href="${item.url}" class="search__item">`;

        if (item.thumbnail_url) {
          html += '<div class="search-result-img">';
          html += `<img src="${item.thumbnail_url}?width=88&amp;height=88&amp;fit=crop" alt="">`;
          html += '</div>';
        }

        return html + `<div class="search-result-txt">` +
          `<span class="name label-large-strong">` +
          `${item.name}</span></div></a></li>`;
      });
    },

    faqs: results => {
      return results.map((item, index) => {
        let active = (index === 0 ? 'active' : ''); // 1st faq is open
        let html = '';
        html += `<span class="question ${active}">`;
        html +=   '<dt>';
        html +=     `<button class="resource-title" id="faq-${index}" aria-expanded="true" aria-controls="faq-panel-${index}">`;
        html +=       `<p class="label-large-strong">${item.question}</p>`;
        html +=       `<div><img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/chevron.svg" class="chevron" alt=""></div>`;
        html +=     `</button>`;
        html +=   '</dt>';
        html +=   `<dd id="faq-panel-${index}" class="answer" aria-labelledby="faq-${index}">`;
        html +=     item.answer;
        html +=   `</dd>`;
        html +=  `</span>`;
        return html;
      });
    },

    links: results => {
      return results.map(item => {
        let html = `<li><a href="${item.url}" class="label-large-strong">`;
        return html +  `${item.name}<img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/search-arrow.svg" class="arrow" alt="" /></a></li>`;
      });
    },
  };

  // no results markup
  function getNoResults() {
    let html = '';
    html += '<div class="search-results-no-results">';
    html +=   `<img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/search-noresults.svg" alt=""/>`;
    html +=   `<h3>${strings.noResults}</h3>`;
    html +=   `<p>${strings.noResultsDetail}</p>`;
    html +=   `<a class="icon-block-cta button button-solid" href="${SEARCH_CONFIG.productsUrl}">`;
    html +=     `${strings.viewAllProducts}</button>`;
    html +=   '</a>';
    html += '</div>';

    return html;
  }

  // add overlay & form markup
  function appendOverlay() {
    let html = '';

    // load css for search
    //html += `<link disabled id="js-clorox-search-css" rel="stylesheet" href="/wp-content/themes/electro/search-test/search.css?ver=1.0">`;

    html += '<div id="clorox-search-overlay" style="display:none;">';
    html += '<div class="container-inner-redesign search-container">';

    html += '<div class="search-controls">';
    html +=   '<div class="search-fields">';
    html +=     `<input type="search" name="s" autoComplete="off" placeholder="${strings.search}" class="js-search-input" style="background-image:url('${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/search.svg');">`;
    html +=     `<button class="search-close" type="button" aria-label="Close"><img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/close.svg" alt=""/></button>`;
    html +=   '</div>';

    html +=   '<ul class="search-tabs js-search-tabs" role="tablist">';
    html +=     `<li class="js-search-tab active" data-section="products">`;
    html +=       `<a role="tab" aria-selected="true" id="search-products" aria-controls="search-products" href="#products">`;
    html +=         `${strings.products} <span class="js-products-count"></span>`;
    html +=       `</a>`;
    html +=     `</li>`;
    html +=     `<li class="js-search-tab" data-section="information">`;
    html +=       `<a role="tab" aria-selected="false" tabindex="-1" id="search-information" aria-controls="search-information"  href="#information">`;
    html +=         `${strings.information} <span class="js-information-count"></span>`;
    html +=       `</a>`;
    html +=     `</li>`;
    html +=   '</ul>';
    html += '</div>';

    html += '<div class="js-search-results"></div>';
    html += '</div>';
    html += '</div>';

    // add html to body
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // vars for handling user input
  let controller;
  let signal;

  let cancel = false;
  let focused;
  let active;
  let pending;
  let entries;

  // how was search started: init,input,tab
  let searchSource = 'init';

  searchInput.addEventListener('keyup', e => {
    // escape key handling
    if (e.keyCode === 27) {
      closeCloroxSearch();
      return;
    }

    if (! cancel) {
      process(e.keyCode, searchInput.value);
    }

    e.preventDefault();
    e.stopPropagation();
  });

  // switch between results tabs
  searchTabs.querySelectorAll('.js-search-tab').forEach(elem => {
    elem.addEventListener('click', e => {
      switchTab(e.currentTarget.dataset['section']);
      e.preventDefault();
      return false;
    });
  });

  function switchTab(newTab) {
    console.log('switch to ' + newTab);
    let activeTab = searchTabs.querySelector('.active');
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    searchTabs.querySelectorAll('.js-search-tab').forEach(elem => {
      if (elem.dataset['section'] === newTab) {
        elem.classList.add('active');
      }
    });
    currentSection = newTab;
    query(searchInput.value.length > 2 ? searchInput.value : SEARCH_CONFIG.initSearch, 'tab');
  }

  // load more button handling
  resultsElement.addEventListener('click', e => {
    if (e.target.classList.contains('js-load-more')) {
      let data = e.target.dataset;
      console.log('load more', data);
      queryLoadMore(
        searchInput.value,
        data['section'],
        data['index'],
        data['page']);
    }
  });

  /**
   * Process search entry
   *
   * @param {Number} key
   * @param {String} value
   */
  function process(key, value) {
    active = true;

    if (focused) {
      focused.classList.remove('-is-active');
    }

    if (key === 40 || key === 38) {
      // Arrow up or down
      if (focused) {
        const index = Array.from(entries).indexOf(focused)

        if (key === 40) {
          focused = entries[index === entries.length - 1 ? 0 : index + 1];
        } else {
          focused = entries[index ? index - 1 : entries.length - 1];
        }
      } else if (
        entries &&
        entries.length
      ) {
        focused = key === 40 ?
          entries[0] :
          entries[entries.length - 1];
      } else {
        focused = null;
      }

      if (focused) {
        focused.classList.add('-is-active');
      }
    } else if (value.length > 2 || ! value) {
      // Space
      if (key !== 32) {
        flush();
      }

      pending = setTimeout(() => {
        clear();
        query(value, 'input');
      }, value ? 150 : 0);
    }
  }

  // run new query against all indices
  function query(value, source) {
    searchSource = source;
    focused = null;

    value = value.trim();

    controller = new AbortController();
    signal = controller.signal;

    const queryString = value;
    const queries = [];
    Object.keys(sections).forEach(sectionName => {
      const section = sections[sectionName];
      Object.keys(section.indices).forEach(index => {
        let perPage = 0;
        if (sectionName === currentSection) {
          perPage = section.indices[index].hitsPerPage;
          if (isMobile) {
            perPage = section.indices[index].hitsPerPageMobile || perPage;
          }
        }
        queries.push({
          indexName: index,
          query: queryString,
          params: {
            hitsPerPage: perPage,
            attributesToRetrieve: section.indices[index].fields || indexDefault.fields,
            // English product index does not support language filtering
            filters: (sectionName === 'products' && SEARCH_CONFIG.language === 'en') ? '' : `language:${SEARCH_CONFIG.language}`,
          },
        });
      });
    });

    client.multipleQueries(queries)
      .then(({ results }) => {
        populate(results);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error)
        }
      });
  }

  // run a load more query
  //   for single index for a new page of data
  function queryLoadMore(value, sectionName, indexName, page) {
    let section = sections[sectionName];
    let perPage = 0;
    if (sectionName === currentSection) {
      perPage = section.indices[indexName].hitsPerPage;
      if (isMobile) {
        perPage = section.indices[indexName].hitsPerPageMobile || perPage;
      }
    }

    let opts = {
      hitsPerPage: perPage,
      attributesToRetrieve: section.indices[indexName].fields || indexDefault.fields,
      filters: !sections['products'].indices[indexName] ? `language:${SEARCH_CONFIG.language}` : '',
      page: page,
    };
    const index = client.initIndex(indexName);
    index.search(value, opts)
      .then(results => {
          console.log(results);
          populateMoreResults(results, sectionName, indexName);
        })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error)
        }
      });
  }

  /**
   * Render results
   *
   * @param {Object} results
   */
  function populate(results) {
    console.log('populate', results);
    let html = '';
    let sectionCount = [];

    if (results.length) {
      // map by index
      let resultsMap = Object.assign({}, ...results.map(result => ({
        [result.index]: result
      })));

      clearCounts();
      let lastTitle;
      //let totalResults = 0;
      Object.keys(sections).forEach(sectionName => {
        const wrapper = `<div role="tabpanel" aria-labelledby="search-${sectionName}" class="search-results-${sectionName}">`;
        const section = sections[sectionName];
        sectionCount[sectionName] = 0;
        let sectionHtml = wrapper;

        Object.keys(section.indices).forEach(index => {
          const data = resultsMap[index];
          if (!data || !data.hits || !data.nbHits) {
            return;
          }
          //console.log(data.index);

          // update counts
          sectionCount[sectionName] += data.nbHits;

          let type = section.indices[data.index].type;

          // titles
          const titleName = section.indices[index].title;
          if (strings[titleName] && titleName !== lastTitle) {
            lastTitle = titleName;
            sectionHtml += `<h3 class="">${strings[titleName]}</h3>`;
          }

          // type section
          if (type !== 'faqs') {
            sectionHtml += `<div class="search-results-${type} js-results-${index}">`;
            sectionHtml += '<ul>';
          } else {
            sectionHtml += ' <dl class="search-results-faqs">';
          }

          // add results
          let transformer = transformers[type];
          sectionHtml += transformer(data.hits).join('');

          if (type !== 'faqs') {
            sectionHtml += '</ul>';
          } else {
            sectionHtml += '</dl>';
          }

          // add load more button
          if (data.nbPages > 1) {
            sectionHtml += getLoadMoreButton(sectionName, index, data);
          }

          sectionHtml += '</div>'; // js-results-{index}
        });

        // add count to tab
        if (sectionCount[sectionName]) {
          searchTabs.getElementsByClassName(`js-${sectionName}-count`)[0].innerHTML = sectionCount[sectionName];
          // close section div
          if (currentSection === sectionName) {
            html += sectionHtml + '</div>';
          }
        }
      });

      //searchTabs.getElementsByClassName(`js-all-count`)[0].innerHTML = totalResults ? totalResults : '';
    }

    if (!html) {
      // did we get results in another section?
      let switched = false;
      Object.keys(sectionCount).forEach((section) => {
        if (sectionCount[section] && searchSource !== 'tab') {
          // fn to selectTab
          switchTab(section);
          switched = true;
          return false;
        }
      });

      // otherwise
      if (!switched) {
        html = getNoResults();
      }
    }

    resultsElement.innerHTML = html;

    //show();
  }

  function populateMoreResults(results, sectionName, indexName) {
    console.log(`populateMoreResults ${sectionName}`);
    const section = sections[sectionName];

    let type = section.indices[indexName].type;
    console.log('type: ' + type);
    let transformer = transformers.generic;
    if (transformers[type]) {
      transformer = transformers[type];
    }
    let html = transformer(results.hits).join('');

    // append items to ul
    const sectionResults = resultsElement.getElementsByClassName(`js-results-${indexName}`)[0];
    sectionResults.querySelector('ul').innerHTML += html;

    // update load more button
    const button = sectionResults.getElementsByClassName('js-load-more')[0];
    if (button) {
      button.parentNode.removeChild(button);

      // add more button
      if (results.nbPages > button.dataset['page']) {
        let buttonHtml = getLoadMoreButton(sectionName, indexName, results);
        //sectionResults.appendChild(buttonHtml);
        sectionResults.insertAdjacentHTML('beforeend', buttonHtml);
      }
    }
  }

  // get load more button
  function getLoadMoreButton(sectionName, index, results) {
    let buttonHtml = '';
    const section = sections[sectionName];
    if (results.nbPages > 1) {
      if (index !== 'wp_faqs') {
        // no string, no button (links)
        let loadMoreType = section.indices[index].loadMore;
        if (strings.loadMore[loadMoreType]) {
          // on desktop, if 1 more row would show all
          if (!isMobile && (results.nbHits - (results.page + 1) * results.hitsPerPage) < 4) {
            queryLoadMore(results.query, sectionName, index, results.page + 1);
          } else {
            buttonHtml += `<button class="js-load-more icon-block-cta button" data-page="${results.page+1}" data-section="${sectionName}" data-index="${index}">`;
            buttonHtml += `${strings.loadMore[loadMoreType]}`;
            buttonHtml += `</button>`;
          }
        }
      } else {
        // faqs
        buttonHtml += `<a class="icon-block-cta button" href="${SEARCH_CONFIG.faqUrl}">`;
        buttonHtml +=   `${strings.faqsLoadMore}`;
        buttonHtml += `</a>`;
      }
    }

    return buttonHtml;
  }

  // clear counts in result tabs
  function clearCounts() {
    Object.keys(sections).forEach(type => {
      searchTabs.getElementsByClassName(`js-${type}-count`)[0].innerHTML = 0;
    })
  }


  /**
   * Clear pending requests
   */
  function clear() {
    clearTimeout(pending);
    pending = null;
  }

  /**
   * Flush pending operations
   */
  function flush() {
    clear();

    if (controller) {
      controller.abort();
    }
  }

  // accordion for faqs
  resultsElement.addEventListener('click', e => {
    let titleElem = e.target.closest('.question');
    if (titleElem) {
      titleElem.classList.toggle("active");
    }
  });

  // split product title into brand & remainder of name
  const BRANDS = [
    'Glad® with Clorox™ ',
    'Clorox® Plus Tilex® ',
    'Tilex® ',
    'Clorox® ',
    'Clorox 2® ',
    'Clorox<sup>®</sup> ',
    'Clorox 2<sup>®</sup> ',
    'Glad® ',
    'Clorox Turbo™ ',
    'Clorox Clinical™ ',
  ];

  const regexSplitProductName = new RegExp(
    `(${BRANDS.join('|')})(.*)`
  );

  //  returns regex match array 0 - original, 1 - brand, 2 - remainder
  function splitTitleAndBrand(title) {
    let match = title.match(regexSplitProductName);

    if (match) {
      return match;
    }
    return title;
  }


  // handle closing overlay
  function closeCloroxSearch() {
    document.getElementById('clorox-search-overlay').style.display = 'none';
    //document.getElementById('js-clorox-search-css').disabled = true;
    searchInput.value = null;
  }
  document.getElementsByClassName('search-close')[0].addEventListener('click', closeCloroxSearch);

  // called by site code to show search form overlay
  //   make globally available
  window.showCloroxSearch = function showCloroxSearch() {
    // show clorox-search-overlay
    //document.getElementById('js-clorox-search-css').disabled = false;
    document.getElementById('clorox-search-overlay').style.display = 'block';

    // show some initial results
    // do this search initially to have results on panel
    if (SEARCH_CONFIG.initSearch) {
      query(SEARCH_CONFIG.initSearch, 'init');
    }

    // set focus
    searchInput.focus();
  };
} // initCloroxSearch

