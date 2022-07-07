/*! For license information please see clorox-search.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CloroxSearch=t():e.CloroxSearch=t()}(self,(()=>(()=>{var e={290:function(e){e.exports=function(){"use strict";function e(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function t(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function r(r){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?t(Object(a),!0).forEach((function(t){e(r,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(a)):t(Object(a)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(a,e))}))}return r}function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var r=[],n=!0,a=!1,s=void 0;try{for(var o,i=e[Symbol.iterator]();!(n=(o=i.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(e){a=!0,s=e}finally{try{n||null==i.return||i.return()}finally{if(a)throw s}}return r}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function a(e){return function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function s(e){var t,r="algoliasearch-client-js-".concat(e.key),a=function(){return void 0===t&&(t=e.localStorage||window.localStorage),t},s=function(){return JSON.parse(a().getItem(r)||"{}")};return{get:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}};return Promise.resolve().then((function(){var r=JSON.stringify(e),n=s()[r];return Promise.all([n||t(),void 0!==n])})).then((function(e){var t=n(e,2),a=t[0],s=t[1];return Promise.all([a,s||r.miss(a)])})).then((function(e){return n(e,1)[0]}))},set:function(e,t){return Promise.resolve().then((function(){var n=s();return n[JSON.stringify(e)]=t,a().setItem(r,JSON.stringify(n)),t}))},delete:function(e){return Promise.resolve().then((function(){var t=s();delete t[JSON.stringify(e)],a().setItem(r,JSON.stringify(t))}))},clear:function(){return Promise.resolve().then((function(){a().removeItem(r)}))}}}function o(e){var t=a(e.caches),r=t.shift();return void 0===r?{get:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}};return t().then((function(e){return Promise.all([e,r.miss(e)])})).then((function(e){return n(e,1)[0]}))},set:function(e,t){return Promise.resolve(t)},delete:function(e){return Promise.resolve()},clear:function(){return Promise.resolve()}}:{get:function(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}};return r.get(e,n,a).catch((function(){return o({caches:t}).get(e,n,a)}))},set:function(e,n){return r.set(e,n).catch((function(){return o({caches:t}).set(e,n)}))},delete:function(e){return r.delete(e).catch((function(){return o({caches:t}).delete(e)}))},clear:function(){return r.clear().catch((function(){return o({caches:t}).clear()}))}}}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{serializable:!0},t={};return{get:function(r,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}},s=JSON.stringify(r);if(s in t)return Promise.resolve(e.serializable?JSON.parse(t[s]):t[s]);var o=n(),i=a&&a.miss||function(){return Promise.resolve()};return o.then((function(e){return i(e)})).then((function(){return o}))},set:function(r,n){return t[JSON.stringify(r)]=e.serializable?JSON.stringify(n):n,Promise.resolve(n)},delete:function(e){return delete t[JSON.stringify(e)],Promise.resolve()},clear:function(){return t={},Promise.resolve()}}}function c(e){for(var t=e.length-1;t>0;t--){var r=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[r],e[r]=n}return e}function u(e,t){return t?(Object.keys(t).forEach((function(r){e[r]=t[r](e)})),e):e}function l(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];var a=0;return e.replace(/%s/g,(function(){return encodeURIComponent(r[a++])}))}var d=0,f=1;function h(e,t){var r=e||{},n=r.data||{};return Object.keys(r).forEach((function(e){-1===["timeout","headers","queryParameters","data","cacheable"].indexOf(e)&&(n[e]=r[e])})),{data:Object.entries(n).length>0?n:void 0,timeout:r.timeout||t,headers:r.headers||{},queryParameters:r.queryParameters||{},cacheable:r.cacheable}}var p={Read:1,Write:2,Any:3};function m(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return r(r({},e),{},{status:t,lastUpdate:Date.now()})}function g(e){return"string"==typeof e?{protocol:"https",url:e,accept:p.Any}:{protocol:e.protocol||"https",url:e.url,accept:e.accept||p.Any}}var v="GET",y="POST";function b(e,t,n,s){var o=[],i=function(e,t){if(e.method!==v&&(void 0!==e.data||void 0!==t.data)){var n=Array.isArray(e.data)?e.data:r(r({},e.data),t.data);return JSON.stringify(n)}}(n,s),c=function(e,t){var n=r(r({},e.headers),t.headers),a={};return Object.keys(n).forEach((function(e){var t=n[e];a[e.toLowerCase()]=t})),a}(e,s),u=n.method,l=n.method!==v?{}:r(r({},n.data),s.data),d=r(r(r({"x-algolia-agent":e.userAgent.value},e.queryParameters),l),s.queryParameters),f=0,h=function t(r,a){var l=r.pop();if(void 0===l)throw{name:"RetryError",message:"Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",transporterStackTrace:w(o)};var h={data:i,headers:c,method:u,url:O(l,n.path,d),connectTimeout:a(f,e.timeouts.connect),responseTimeout:a(f,s.timeout)},p=function(e){var t={request:h,response:e,host:l,triesLeft:r.length};return o.push(t),t},g={onSuccess:function(e){return function(e){try{return JSON.parse(e.content)}catch(t){throw function(e,t){return{name:"DeserializationError",message:e,response:t}}(t.message,e)}}(e)},onRetry:function(n){var s=p(n);return n.isTimedOut&&f++,Promise.all([e.logger.info("Retryable failure",q(s)),e.hostsCache.set(l,m(l,n.isTimedOut?3:2))]).then((function(){return t(r,a)}))},onFail:function(e){throw p(e),function(e,t){var r=e.content,n=e.status,a=r;try{a=JSON.parse(r).message}catch(e){}return function(e,t,r){return{name:"ApiError",message:e,status:t,transporterStackTrace:r}}(a,n,t)}(e,w(o))}};return e.requester.send(h).then((function(e){return function(e,t){return function(e){var t=e.status;return e.isTimedOut||function(e){var t=e.isTimedOut,r=e.status;return!t&&0==~~r}(e)||2!=~~(t/100)&&4!=~~(t/100)}(e)?t.onRetry(e):2==~~(e.status/100)?t.onSuccess(e):t.onFail(e)}(e,g)}))};return function(e,t){return Promise.all(t.map((function(t){return e.get(t,(function(){return Promise.resolve(m(t))}))}))).then((function(e){var r=e.filter((function(e){return function(e){return 1===e.status||Date.now()-e.lastUpdate>12e4}(e)})),n=e.filter((function(e){return function(e){return 3===e.status&&Date.now()-e.lastUpdate<=12e4}(e)})),s=[].concat(a(r),a(n));return{getTimeout:function(e,t){return(0===n.length&&0===e?1:n.length+3+e)*t},statelessHosts:s.length>0?s.map((function(e){return g(e)})):t}}))}(e.hostsCache,t).then((function(e){return h(a(e.statelessHosts).reverse(),e.getTimeout)}))}function P(e){var t={value:"Algolia for JavaScript (".concat(e,")"),add:function(e){var r="; ".concat(e.segment).concat(void 0!==e.version?" (".concat(e.version,")"):"");return-1===t.value.indexOf(r)&&(t.value="".concat(t.value).concat(r)),t}};return t}function O(e,t,r){var n=j(r),a="".concat(e.protocol,"://").concat(e.url,"/").concat("/"===t.charAt(0)?t.substr(1):t);return n.length&&(a+="?".concat(n)),a}function j(e){return Object.keys(e).map((function(t){return l("%s=%s",t,(r=e[t],"[object Object]"===Object.prototype.toString.call(r)||"[object Array]"===Object.prototype.toString.call(r)?JSON.stringify(e[t]):e[t]));var r})).join("&")}function w(e){return e.map((function(e){return q(e)}))}function q(e){var t=e.request.headers["x-algolia-api-key"]?{"x-algolia-api-key":"*****"}:{};return r(r({},e),{},{request:r(r({},e.request),{},{headers:r(r({},e.request.headers),t)})})}var x=function(e){var t=e.appId,a=function(e,t,r){var n={"x-algolia-api-key":r,"x-algolia-application-id":t};return{headers:function(){return e===f?n:{}},queryParameters:function(){return e===d?n:{}}}}(void 0!==e.authMode?e.authMode:f,t,e.apiKey),s=function(e){var t=e.hostsCache,r=e.logger,a=e.requester,s=e.requestsCache,o=e.responsesCache,i=e.timeouts,c=e.userAgent,u=e.hosts,l=e.queryParameters,d={hostsCache:t,logger:r,requester:a,requestsCache:s,responsesCache:o,timeouts:i,userAgent:c,headers:e.headers,queryParameters:l,hosts:u.map((function(e){return g(e)})),read:function(e,t){var r=h(t,d.timeouts.read),a=function(){return b(d,d.hosts.filter((function(e){return 0!=(e.accept&p.Read)})),e,r)};if(!0!==(void 0!==r.cacheable?r.cacheable:e.cacheable))return a();var s={request:e,mappedRequestOptions:r,transporter:{queryParameters:d.queryParameters,headers:d.headers}};return d.responsesCache.get(s,(function(){return d.requestsCache.get(s,(function(){return d.requestsCache.set(s,a()).then((function(e){return Promise.all([d.requestsCache.delete(s),e])}),(function(e){return Promise.all([d.requestsCache.delete(s),Promise.reject(e)])})).then((function(e){var t=n(e,2);return t[0],t[1]}))}))}),{miss:function(e){return d.responsesCache.set(s,e)}})},write:function(e,t){return b(d,d.hosts.filter((function(e){return 0!=(e.accept&p.Write)})),e,h(t,d.timeouts.write))}};return d}(r(r({hosts:[{url:"".concat(t,"-dsn.algolia.net"),accept:p.Read},{url:"".concat(t,".algolia.net"),accept:p.Write}].concat(c([{url:"".concat(t,"-1.algolianet.com")},{url:"".concat(t,"-2.algolianet.com")},{url:"".concat(t,"-3.algolianet.com")}]))},e),{},{headers:r(r(r({},a.headers()),{"content-type":"application/x-www-form-urlencoded"}),e.headers),queryParameters:r(r({},a.queryParameters()),e.queryParameters)}));return u({transporter:s,appId:t,addAlgoliaAgent:function(e,t){s.userAgent.add({segment:e,version:t})},clearCache:function(){return Promise.all([s.requestsCache.clear(),s.responsesCache.clear()]).then((function(){}))}},e.methods)},S=function(e){return function(t,r){return t.method===v?e.transporter.read(t,r):e.transporter.write(t,r)}},C=function(e){return function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return u({transporter:e.transporter,appId:e.appId,indexName:t},r.methods)}},T=function(e){return function(t,n){var a=t.map((function(e){return r(r({},e),{},{params:j(e.params||{})})}));return e.transporter.read({method:y,path:"1/indexes/*/queries",data:{requests:a},cacheable:!0},n)}},$=function(e){return function(t,n){return Promise.all(t.map((function(t){var a=t.params,s=a.facetName,o=a.facetQuery,i=function(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}(a,["facetName","facetQuery"]);return C(e)(t.indexName,{methods:{searchForFacetValues:k}}).searchForFacetValues(s,o,r(r({},n),i))})))}},A=function(e){return function(t,r,n){return e.transporter.read({method:y,path:l("1/answers/%s/prediction",e.indexName),data:{query:t,queryLanguages:r},cacheable:!0},n)}},E=function(e){return function(t,r){return e.transporter.read({method:y,path:l("1/indexes/%s/query",e.indexName),data:{query:t},cacheable:!0},r)}},k=function(e){return function(t,r,n){return e.transporter.read({method:y,path:l("1/indexes/%s/facets/%s/query",e.indexName,t),data:{facetQuery:r},cacheable:!0},n)}};function N(e,t,n){var a={appId:e,apiKey:t,timeouts:{connect:1,read:2,write:30},requester:{send:function(e){return new Promise((function(t){var r=new XMLHttpRequest;r.open(e.method,e.url,!0),Object.keys(e.headers).forEach((function(t){return r.setRequestHeader(t,e.headers[t])}));var n,a=function(e,n){return setTimeout((function(){r.abort(),t({status:0,content:n,isTimedOut:!0})}),1e3*e)},s=a(e.connectTimeout,"Connection timeout");r.onreadystatechange=function(){r.readyState>r.OPENED&&void 0===n&&(clearTimeout(s),n=a(e.responseTimeout,"Socket timeout"))},r.onerror=function(){0===r.status&&(clearTimeout(s),clearTimeout(n),t({content:r.responseText||"Network request failed",status:r.status,isTimedOut:!1}))},r.onload=function(){clearTimeout(s),clearTimeout(n),t({content:r.responseText,status:r.status,isTimedOut:!1})},r.send(e.data)}))}},logger:(3,{debug:function(e,t){return Promise.resolve()},info:function(e,t){return Promise.resolve()},error:function(e,t){return console.error(e,t),Promise.resolve()}}),responsesCache:i(),requestsCache:i({serializable:!1}),hostsCache:o({caches:[s({key:"".concat("4.13.1","-").concat(e)}),i()]}),userAgent:P("4.13.1").add({segment:"Browser",version:"lite"}),authMode:d};return x(r(r(r({},a),n),{},{methods:{search:T,searchForFacetValues:$,multipleQueries:T,multipleSearchForFacetValues:$,customRequest:S,initIndex:function(e){return function(t){return C(e)(t,{methods:{search:E,searchForFacetValues:k,findAnswers:A}})}}}}))}return N.version="4.13.1",N}()}},t={};function r(n){var a=t[n];if(void 0!==a)return a.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{"use strict";r.r(n),r.d(n,{initCloroxSearch:()=>a});var e=r(290),t=r.n(e);function a(e){const r=Object.assign({homeURL:"https://www.clorox.com",language:"en",AppID:"GTL8ORQAY1",searchKey:"4fb8822c5e87903f56a689b93e4a0cfa",faqUrl:"https://www.clorox.com/clorox-faq/",productsUrl:"https://shop.clorox.com/products/",initSearch:"bleach",shopProductIndex:"clorox_clea_prod_cleaning_en_products"},e);console.log(r);var n={search:"Search",products:"Products",information:"Information",noResults:"No results",noResultsDetail:"We tried as hard as we could but couldn't find any results",viewAllProducts:"View all products",guides:"Cleaning Guides",resources:"Other Resources",loadMore:{products:"Load more products",guides:"Load more guides"},faqsLoadMore:"More Frequently Asked Questions"};"es"===r.language&&(n={search:"Buscar",products:"Productos",information:"Información",noResults:"No hay resultados",noResultsDetail:"Buscamos por todos lados, pero no pudimos encontrar ningún resultado",viewAllProducts:"Ver todos los productos",guides:"Guías de limpieza",resources:"Otros Recursos",loadMore:{products:"Ver más productos",guides:"Ver más guías"},faqsLoadMore:"Ver más preguntas frecuentes"}),function(){let e="";e+='<div id="clorox-search-overlay" style="display:none;">',e+='<div class="container-inner-redesign search-container">',e+='<div class="search-controls">',e+='<div class="search-fields">',e+=`<input type="search" name="s" autoComplete="off" placeholder="${n.search}" class="js-search-input" style="background-image:url('${r.homeURL}/wp-content/themes/electro/img/search/search.svg');">`,e+=`<button class="search-close" type="button" aria-label="Close"><img src="${r.homeURL}/wp-content/themes/electro/img/search/close.svg" alt=""/></button>`,e+="</div>",e+='<ul class="search-tabs js-search-tabs" role="tablist">',e+='<li class="js-search-tab active" data-section="products">',e+='<a role="tab" aria-selected="true" id="search-products" aria-controls="search-products" href="#products">',e+=`${n.products} <span class="js-products-count"></span>`,e+="</a>",e+="</li>",e+='<li class="js-search-tab" data-section="information">',e+='<a role="tab" aria-selected="false" tabindex="-1" id="search-information" aria-controls="search-information"  href="#information">',e+=`${n.information} <span class="js-information-count"></span>`,e+="</a>",e+="</li>",e+="</ul>",e+="</div>",e+='<div class="js-search-results"></div>',e+="</div>",e+="</div>",document.body.insertAdjacentHTML("beforeend",e)}();const a=t()(r.AppID,r.searchKey),s=document.getElementsByClassName("js-search-input")[0],o=document.getElementsByClassName("js-search-results")[0],i=document.getElementsByClassName("js-search-tabs")[0],c=window.innerWidth/parseFloat(getComputedStyle(document.querySelector("html"))["font-size"])<=48,u={fields:["name","url","thumbnail_url"]};let l=r.shopProductIndex;"es"===r.language&&(l="wp_posts_product");const d={products:{indices:{[l]:{loadMore:"products",hitsPerPage:12,hitsPerPageMobile:8,type:"products"}}},information:{indices:{wp_posts_guides:{title:"guides",loadMore:"guides",hitsPerPage:9,hitsPerPageMobile:6,type:"guides"},wp_faqs:{title:"resources",fields:["question","answer"],hitsPerPage:3,type:"faqs"},wp_posts_page:{title:"resources",type:"links",hitsPerPage:25}}}};let f="products";const h={products:e=>e.map((e=>{let t=!1,r=e.name,n=function(e){let t=e.match(S);return t||e}(r);Array.isArray(n)&&(t=n[1],r=n[2]);let a="";return a+=`<li><a href="${e.url}/" class="search__item">`,e.thumbnail_url&&(a+='<div class="search-result-img">',a+=`<img src="${e.thumbnail_url.split("?")[0]}?width=176&amp;height=176&amp;fit=crop" alt="">`,a+="</div>"),a+='<div class="search-result-txt">',t&&(a+=`<span class="brand label-small">${t}</span>`),a+=`<span class="name label-large-strong">${r}</span>`,a+="</div></a></li>",a})),guides:e=>e.map((e=>{let t=`<li><a href="${e.url}" class="search__item">`;return e.thumbnail_url&&(t+='<div class="search-result-img">',t+=`<img src="${e.thumbnail_url}?width=88&amp;height=88&amp;fit=crop" alt="">`,t+="</div>"),t+'<div class="search-result-txt"><span class="name label-large-strong">'+`${e.name}</span></div></a></li>`})),faqs:e=>e.map(((e,t)=>{let n="";return n+=`<span class="question ${0===t?"active":""}">`,n+="<dt>",n+=`<button class="resource-title" id="faq-${t}" aria-expanded="true" aria-controls="faq-panel-${t}">`,n+=`<p class="label-large-strong">${e.question}</p>`,n+=`<div><img src="${r.homeURL}/wp-content/themes/electro/img/search/chevron.svg" class="chevron" alt=""></div>`,n+="</button>",n+="</dt>",n+=`<dd id="faq-panel-${t}" class="answer" aria-labelledby="faq-${t}">`,n+=e.answer,n+="</dd>",n+="</span>",n})),links:e=>e.map((e=>`<li><a href="${e.url}" class="label-large-strong">${e.name}<img src="${r.homeURL}/wp-content/themes/electro/img/search/search-arrow.svg" class="arrow" alt="" /></a></li>`))};let p,m,g,v,y,b,P="init";function O(e){let t=i.querySelector(".active");t&&t.classList.remove("active"),i.querySelectorAll(".js-search-tab").forEach((t=>{t.dataset.section===e&&t.classList.add("active")})),f=e,j(s.value.length>2?s.value:r.initSearch,"tab")}function j(e,t){e=e&&e.length>2?e:r.initSearch,P=t,g=null,e=e.trim().substring(0,500),p=new AbortController,m=p.signal;const s=e,l=[];Object.keys(d).forEach((e=>{const t=d[e];Object.keys(t.indices).forEach((n=>{let a=0;e===f&&(a=t.indices[n].hitsPerPage,c&&(a=t.indices[n].hitsPerPageMobile||a)),l.push({indexName:n,query:s,params:{hitsPerPage:a,attributesToRetrieve:t.indices[n].fields||u.fields,filters:"products"===e&&"en"===r.language?"":`language:${r.language}`}})}))})),a.multipleQueries(l).then((({results:e})=>{!function(e){let t="",a=[];if(e.length){let r,s=Object.assign({},...e.map((e=>({[e.index]:e}))));Object.keys(d).forEach((e=>{i.getElementsByClassName(`js-${e}-count`)[0].innerHTML=0})),Object.keys(d).forEach((e=>{const o=`<div role="tabpanel" aria-labelledby="search-${e}" class="search-results-${e}">`,c=d[e];a[e]=0;let u=o;Object.keys(c.indices).forEach((t=>{const o=s[t];if(!o||!o.hits||!o.nbHits)return;a[e]+=o.nbHits;let i=c.indices[o.index].type;const l=c.indices[t].title;n[l]&&l!==r&&(r=l,u+=`<h3 class="">${n[l]}</h3>`),"faqs"!==i?(u+=`<div class="search-results-${i} js-results-${t}">`,u+="<ul>"):u+=' <dl class="search-results-faqs">',u+=(0,h[i])(o.hits).join(""),u+="faqs"!==i?"</ul>":"</dl>",o.nbPages>1&&(u+=q(e,t,o)),u+="</div>"})),a[e]&&(i.getElementsByClassName(`js-${e}-count`)[0].innerHTML=a[e],f===e&&(t+=u+"</div>"))}))}if(!t){let e=!1;Object.keys(a).forEach((t=>{if(a[t]&&"tab"!==P)return O(t),e=!0,!1})),e||(t=function(){let e="";return e+='<div class="search-results-no-results">',e+=`<img src="${r.homeURL}/wp-content/themes/electro/img/search/search-noresults.svg" alt=""/>`,e+=`<h3>${n.noResults}</h3>`,e+=`<p>${n.noResultsDetail}</p>`,e+=`<a class="icon-block-cta button button-solid" href="${r.productsUrl}">`,e+=`${n.viewAllProducts}</button>`,e+="</a>",e+="</div>",e}())}o.innerHTML=t}(e)})).catch((e=>{"AbortError"!==e.name&&console.error(e)}))}function w(e,t,n,s){let i=d[t],l=0;t===f&&(l=i.indices[n].hitsPerPage,c&&(l=i.indices[n].hitsPerPageMobile||l));let p={hitsPerPage:l,attributesToRetrieve:i.indices[n].fields||u.fields,filters:d.products.indices[n]?"":`language:${r.language}`,page:s};a.initIndex(n).search(e,p).then((e=>{!function(e,t,r){let n=d[t].indices[r].type,a=h.generic;h[n]&&(a=h[n]);let s=a(e.hits).join("");const i=o.getElementsByClassName(`js-results-${r}`)[0];i.querySelector("ul").innerHTML+=s;const c=i.getElementsByClassName("js-load-more")[0];if(c&&(c.parentNode.removeChild(c),e.nbPages>c.dataset.page)){let n=q(t,r,e);i.insertAdjacentHTML("beforeend",n)}}(e,t,n)})).catch((e=>{"AbortError"!==e.name&&console.error(e)}))}function q(e,t,a){let s="";const o=d[e];if(a.nbPages>1)if("wp_faqs"!==t){let r=o.indices[t].loadMore;n.loadMore[r]&&(!c&&a.nbHits-(a.page+1)*a.hitsPerPage<4?w(a.query,e,t,a.page+1):(s+=`<button class="js-load-more icon-block-cta button" data-page="${a.page+1}" data-section="${e}" data-index="${t}">`,s+=`${n.loadMore[r]}`,s+="</button>"))}else s+=`<a class="icon-block-cta button" href="${r.faqUrl}">`,s+=`${n.faqsLoadMore}`,s+="</a>";return s}function x(){clearTimeout(y),y=null}s.addEventListener("keyup",(e=>{27!==e.keyCode?(function(e,t){if(v=!0,g&&g.classList.remove("-is-active"),40===e||38===e){if(g){const t=Array.from(b).indexOf(g);g=40===e?b[t===b.length-1?0:t+1]:b[t?t-1:b.length-1]}else g=null;g&&g.classList.add("-is-active")}else(t.length>2||!t)&&(32!==e&&(x(),p&&p.abort()),y=setTimeout((()=>{x(),j(t,"input")}),t?150:0))}(e.keyCode,s.value),e.preventDefault(),e.stopPropagation()):C()})),i.querySelectorAll(".js-search-tab").forEach((e=>{e.addEventListener("click",(e=>(O(e.currentTarget.dataset.section),e.preventDefault(),!1)))})),o.addEventListener("click",(e=>{if(e.target.classList.contains("js-load-more")){let t=e.target.dataset;w(s.value,t.section,t.index,t.page)}})),o.addEventListener("click",(e=>{let t=e.target.closest(".question");t&&t.classList.toggle("active")}));const S=new RegExp(`(${["Glad® with Clorox™ ","Clorox® Plus Tilex® ","Tilex® ","Clorox® ","Clorox 2® ","Clorox<sup>®</sup> ","Clorox 2<sup>®</sup> ","Glad® ","Clorox Turbo™ ","Clorox Clinical™ "].join("|")})(.*)`);function C(){document.getElementById("clorox-search-overlay").style.display="none",s.value=null}document.getElementsByClassName("search-close")[0].addEventListener("click",C),window.showCloroxSearch=function(){document.getElementById("clorox-search-overlay").style.display="block",r.initSearch&&j(r.initSearch,"init"),s.focus()}}})(),n})()));