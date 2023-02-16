/**
 * algolia live search
 *   sets up an overlay with live search capabilities
 *   initCloroxSearch() - setup hidden overlay
 *   showCloroxSearch() - display overlay & allow searching
 */

/* global dataLayer */

// search only library
import algoliasearch from 'algoliasearch/lite';

export function initCloroxSearch(settings) {
    // defaults to production values
    const SEARCH_CONFIG = Object.assign({
        homeURL: 'https://www.clorox.com',
        language: 'en',
        AppID: 'GTL8ORQAY1',
        searchKey: '4fb8822c5e87903f56a689b93e4a0cfa',
        guidesUrl: 'https://www.clorox.com/learn/',
        faqUrl: 'https://www.clorox.com/clorox-faqs/',
        productsUrl: 'https://shop.clorox.com/products/',
        initSearch: '*',
        shopProductIndex: 'clorox_clea_prod_cleaning_en_products',
    }, settings);

    // strings for English & Spanish
    var strings = {
        search: 'Search',
        products: 'Products',
        information: 'Information',
        noResults: 'No results',
        noResultsDetail: 'We tried as hard as we could but couldn\'t find any results',
        viewAllGuides: 'View all guides',
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
            noResults: 'No hay resultados',
            noResultsDetail: 'Buscamos por todos lados, pero no pudimos encontrar ningún resultado',
            viewAllGuides: 'Ver todos los guías',
            viewAllProducts: 'Ver todos los productos',
            guides: 'Guías de limpieza',
            resources: 'Otros Recursos',
            loadMore: {
                products: 'Ver más productos',
                guides: 'Ver más guías',
            },
            faqsLoadMore: 'Ver más preguntas frecuentes',
        };
    }

    const cropClass = '-clorox-search-is-cropped';

    // Current search state
    let moreFaq;
    let queryEventTimer;
    let scrollPosition;
    let searchQuery;

    appendOverlay();

    const client = algoliasearch(
        SEARCH_CONFIG.AppID,
        SEARCH_CONFIG.searchKey
    );

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

    let productIndex = SEARCH_CONFIG.shopProductIndex;
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
                    hitsPerPage: 4,
                },
            },
        },
    };

    let currentSection = 'products';

    /**
     * Transform search results
     */
    const transformers = {
        products: (results, queryID, page, hitsPerPage) => {
            return results.map((item, index) => {
                let brand = false;
                let title = item.name;
                let parts = splitTitleAndBrand(title);

                if (Array.isArray(parts)) {
                    brand = parts[1];
                    title = parts[2];
                }

                let html = '';

                // add queryID & position to product url
                let position = index + 1;
                if (page) {
                    position = position + page * hitsPerPage;
                }
                html += `<li><a href="${item.url}?queryID=${queryID}&position=${position}" class="search-grid__anchor" data-result="product">`;

                if (item.thumbnail_url) {
                    let simpleUrl = item.thumbnail_url.split('?')[0];

                    html += '<div class="search-grid__image">';
                    html += `<img src="${simpleUrl}?width=176&amp;height=176&amp;fit=bounds" alt="">`;
                    html += `</div>`;
                }

                html += `<div class="search-grid__name">`;

                if (brand) {
                    html += `<span class="search-products__brand">${brand}</span>`;
                }

                html += `<span class="search-label">${title}</span>`;
                html += `</div></a></li>`;

                return html;
            });
        },

        guides: results => {
            return results.map(item => {
                let html = `<li><a href="${item.url}" class="search-grid__anchor" data-result="guide">`;

                if (item.thumbnail_url) {
                    html += '<div class="search-grid__image">';
                    html += `<img src="${item.thumbnail_url}?width=176&amp;height=176&amp;fit=crop" alt="">`;
                    html += `</div>`;
                }

                return html + `<div class="search-grid__name">` +
                    `<span class="search-label">` +
                    `${item.name}</span></div></a></li>`;
            });
        },

        faqs: results => {
            return results.map((item, index) => {
                let active = (index === 0 ? 'active' : ''); // 1st faq is open
                let html = `<div class="search-faq__item ${active} js-search-faq">`;

                html += `<dt>`;
                html += `<button class="search-faq__question" id="faq-${index}" aria-expanded="true" aria-controls="faq-panel-${index}">`;
                html += `<span class="search-label" data-gtm-search-faq-heading>${item.question}</span>`;
                html += `<img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/chevron.svg" class="search-faq__icon" alt="" width="24" height="24" aria-hidden="true">`;
                html += `</button>`;
                html += '</dt>';
                html += `<dd id="faq-panel-${index}" class="search-faq__answer" aria-labelledby="faq-${index}">`;
                html += item.answer;
                html += `</dd>`;
                html += `</div>`;

                return html;
            });
        },

        links: results => {
            return results.map(item => {
                let html = `<li class="search-links__item"><a href="${item.url}" class="search-label search-links__anchor" data-result="page">`;

                return html + `${item.name}<img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/search-arrow.svg" class="search-links__arrow" alt="" width="24" height="24" aria-hidden="true"></a></li>`;
            });
        },
    };

    // no results markup
    function getNoResults() {
        let html = '';
        html += '<div class="search-fallback">';
        html += `<img src="${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/search-noresults.svg" alt="" width="54" height="54" class="search-fallback__icon" aria-hidden="true">`;
        html += `<h3 class="search-fallback__heading">${strings.noResults}</h3>`;
        html += `<p class="search-fallback__message">${strings.noResultsDetail}</p>`;

        if (currentSection === 'products') {
            html += `<a class="search-button" href="${SEARCH_CONFIG.productsUrl}">`;
            html += `${strings.viewAllProducts}</button>`;
        } else {
            html += `<a class="search-button" href="${SEARCH_CONFIG.guidesUrl}">`;
            html += `${strings.viewAllGuides}</button>`;
        }

        html += '</a>';
        html += '</div>';

        return html;
    }

    // add overlay & form markup
    function appendOverlay() {
        let html = '';

        html += '<div id="clorox-search-overlay" style="display:none;">';
        html += '<div class="search-container">';

        html += '<div class="search-controls">';
        html += '<div class="search-fields">';
        html += `<input type="search" name="s" autoComplete="off" placeholder="${strings.search}" class="search-input js-search-input" style="background-image:url('${SEARCH_CONFIG.homeURL}/wp-content/themes/electro/img/search/search.svg');">`;
        html += `<button class="search-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" d="M18.7 5.3c.4.4.4 1 0 1.4l-12 12a1 1 0 0 1-1.4-1.4l12-12a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M5.3 5.3a1 1 0 0 1 1.4 0l12 12a1 1 0 0 1-1.4 1.4l-12-12a1 1 0 0 1 0-1.4Z" clip-rule="evenodd"/></svg></button>`;
        html += '</div>';

        html += '<ul class="search-tabs js-search-tabs" role="tablist">';
        html += `<li class="search-tabs__item active js-search-tab" data-section="products">`;
        html += `<a href="#products" role="tab" class="search-tabs__anchor" aria-selected="true" id="search-products" aria-controls="search-products">`;
        html += `${strings.products} <span class="search-tabs__count js-products-count"></span>`;
        html += `</a>`;
        html += `</li>`;
        html += `<li class="search-tabs__item js-search-tab" data-section="information">`;
        html += `<a href="#information" role="tab" class="search-tabs__anchor" aria-selected="false" tabindex="-1" id="search-information" aria-controls="search-information">`;
        html += `${strings.information} <span class="search-tabs__count js-information-count"></span>`;
        html += `</a>`;
        html += `</li>`;
        html += '</ul>';
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

        if (!cancel) {
            process(e.keyCode, searchInput.value);
        }

        e.preventDefault();
        e.stopPropagation();
    });

    // switch between results tabs
    searchTabs.querySelectorAll('.js-search-tab').forEach(elem => {
        elem.addEventListener('click', e => {
            const section = e.currentTarget.dataset['section'];

            switchTab(section);
            e.preventDefault();

            // Tab event
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    event: 'globalSearchTab',
                    label: section,
                    context: {
                        query: searchQuery
                    }
                });
            }

            return false;
        });
    });

    function switchTab(newTab) {
        //console.log('switch to ' + newTab);
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

    resultsElement.addEventListener('click', e => {
        // Load more button handling
        if (e.target.classList.contains('js-load-more')) {
            let data = e.target.dataset;
            //console.log('load more', data);
            queryLoadMore(
                searchInput.value,
                data['section'],
                data['index'],
                data['page']);
        }

        // Result click event
        const result = e.target.closest('[data-result]');

        if (result && typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: 'globalSearchSelect',
                label: result.href,
                context: {
                    query: searchQuery
                }
            });
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
        } else if (value.length > 2 || !value) {
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
        // use initSearch value when value isn't good
        value = value && value.length > 2 ?
            value : SEARCH_CONFIG.initSearch;

        clearTimeout(queryEventTimer);

        searchSource = source;
        focused = null;

        value = value
            .trim() // remove spaces
            .substring(0, 500); // algolia max query string length is 511

        controller = new AbortController();
        signal = controller.signal;

        searchQuery = value;

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
                    query: searchQuery,
                    clickAnalytics: true,
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
            .then(({results}) => {
                populate(results);

                // Submit event
                if (source === 'input' && typeof dataLayer !== 'undefined') {
                    queryEventTimer = setTimeout(function() {
                        dataLayer.push({
                            event: 'globalSearchQuery',
                            label: value
                        });
                    }, 1000);
                }
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
            clickAnalytics: true,
        };
        const index = client.initIndex(indexName);
        index.search(value, opts)
            .then(results => {
                //console.log(results);
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
        //console.log('populate', results);
        let html = '';
        let sectionCount = [];

        moreFaq = false;

        if (results.length) {
            // map by index
            let resultsMap = Object.assign({}, ...results.map(result => ({
                [result.index]: result
            })));

            clearCounts();

            let lastTitle;

            Object.keys(sections).forEach(sectionName => {
                const section = sections[sectionName];
                let sectionHtml = `<div role="tabpanel" aria-labelledby="search-${sectionName}">`;

                sectionCount[sectionName] = 0;

                Object.keys(section.indices).forEach(index => {
                    const data = resultsMap[index] || {};
                    let type = section.indices[data.index].type;

                    if (type === 'links') {
                        if (! data.nbHits && ! moreFaq) {
                            return;
                        }

                        if (moreFaq) {
                            data.hits = data.hits || [];

                            data.hits.unshift({
                                name: strings['faqsLoadMore'],
                                url: SEARCH_CONFIG['faqUrl']
                            });
                        }
                    } else if (! data.hits || ! data.nbHits) {
                        return;
                    }

                    // update counts
                    sectionCount[sectionName] += data.nbHits;

                    sectionHtml += `<div class="search-results search-${type} js-results-${index}">`;

                    // heading
                    const titleName = section.indices[index].title;

                    if (strings[titleName] && titleName !== lastTitle) {
                        lastTitle = titleName;
                        sectionHtml += `<h3 class="search-heading">${strings[titleName]}</h3>`;
                    }

                    // type section
                    if (type === 'faqs') {
                        sectionHtml += '<dl class="search-faq">';
                    } else if (type === 'links') {
                        sectionHtml += '<ul class="search-links">';
                    } else {
                        sectionHtml += '<ul class="search-grid">';
                    }

                    // add results
                    let transformer = transformers[type];

                    sectionHtml += transformer(data.hits, data.queryID).join('');

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
        //console.log(`populateMoreResults ${sectionName}`);
        const section = sections[sectionName];

        let type = section.indices[indexName].type;
        //console.log('type: ' + type);
        let transformer = transformers.generic;
        if (transformers[type]) {
            transformer = transformers[type];
        }
        let html = transformer(results.hits, results.queryID, results.page, results.hitsPerPage).join('');

        // append items to ul
        const sectionResults = resultsElement.getElementsByClassName(`js-results-${indexName}`)[0];
        sectionResults.querySelector('ul').innerHTML += html;

        // update load more button
        const button = sectionResults.getElementsByClassName('js-load-more')[0];
        if (button) {
            button.parentNode.remove();

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
        const section = sections[sectionName];
        let buttonHtml = '';

        if (results.nbPages > 1) {
            if (index !== 'wp_faqs') {
                // no string, no button (links)
                let loadMoreType = section.indices[index].loadMore;
                if (strings.loadMore[loadMoreType]) {
                    // on desktop, if 1 more row would show all
                    if (!isMobile && (results.nbHits - (results.page + 1) * results.hitsPerPage) < 4) {
                        queryLoadMore(results.query, sectionName, index, results.page + 1);
                    } else {
                        buttonHtml += `<div class="search-more">`;
                        buttonHtml += `<button class="search-button -bordered js-load-more" data-page="${results.page + 1}" data-section="${sectionName}" data-index="${index}">`;
                        buttonHtml += `${strings.loadMore[loadMoreType]}`;
                        buttonHtml += `</button>`;
                        buttonHtml += `</div>`;
                    }
                }
            } else {
                moreFaq = true;
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
        let titleElem = e.target.closest('.js-search-faq');
        if (titleElem) {
            titleElem.classList.toggle('active');

            // FAQ expand event
            const heading = e.currentTarget.querySelectorAll('[data-gtm-search-faq-heading]');

            if (heading.length && typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    event: 'globalSearchFaqExpand',
                    label: heading[0].innerText,
                    context: {
                        query: searchQuery
                    }
                });
            }
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
        searchInput.value = null;

        document.getElementById('clorox-search-overlay').style.display = 'none';

        document.body.classList.remove(cropClass);
        document.body.style.top = 'auto';

        window.scroll(0, scrollPosition);
    }

    document.getElementsByClassName('search-close')[0].addEventListener('click', closeCloroxSearch);

    // called by site code to show search form overlay
    //   make globally available
    window.showCloroxSearch = function showCloroxSearch() {
        document.getElementById('clorox-search-overlay').style.display = 'block';

        scrollPosition = window.scrollY;

        document.body.classList.add(cropClass);
        document.body.style.top = (scrollPosition * -1) + 'px';

        // show some initial results
        // do this search initially to have results on panel
        if (SEARCH_CONFIG.initSearch) {
            query(SEARCH_CONFIG.initSearch, 'init');
        }

        // set focus
        searchInput.focus();

        // Focus event
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: 'globalSearchFocus'
            });
        }
    };
} // initCloroxSearch