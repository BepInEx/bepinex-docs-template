"use strict";function sanitize(e){return null===e||void 0===e?void 0:e.replace(/[^\w. ]/gi,e=>`&#${e.charCodeAt(0)};`)}function initThemeSwitch(){const e=document.querySelector("#theme-switch");e&&e.addEventListener("click",e=>{e.preventDefault();const t=document.documentElement;t.classList.contains("dark")?t.classList.remove("dark"):t.classList.add("dark")})}function getAffixToc(){const e=document.querySelector("main"),t={level:0,items:[]};if(!e)return t;const n=e.querySelectorAll("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]"),i=(e,t)=>{let n=!1;return t.level<e.level&&(0==t.items.length||0!=t.items.length&&!(n=i(e,t.items[t.items.length-1])))?(e.parent=t,t.items.push(e),!0):t.level>e.level&&t.parent?(t.parent.items=[e],e.parent=t.parent,t.parent=e,!0):n};for(const e of n)i({level:+e.tagName.substring(1),el:e,items:[]},t);return t}function binarySearch(e,t){if(0==e.length)return;if(1==e.length)return e[0];const n=(i,r)=>{const l=Math.floor((i+r)/2);if(l==i||l==r)return e[l];const o=t(e[l]);return 0==o?e[l]:o<0?n(i,l):n(l,r)};return n(0,e.length-1)}function initAffix(){const e=getAffixToc(),t=document.querySelector("aside.affix > div");if(!t)return;if(0==e.items.length)return;const n=[],i=(e,t=0)=>{if(0==e.items.length)return"";if(0<t&&t<3){const r=e=>e.items.length>0&&t<2,l=e=>{var l,o,s,a,c,u;return e.el&&n.push(e.el),r(e)?`\n                <details>\n                    <summary>\n                        <a id="toc-affix-${null===(l=e.el)||void 0===l?void 0:l.id}" href="#${null===(o=e.el)||void 0===o?void 0:o.id}">${sanitize(null===(s=e.el)||void 0===s?void 0:s.textContent)}</a>\n                    </summary>\n                    <ul>\n                        ${i(e,t+1)}\n                    </ul>\n                </details>\n            `:`<a id="toc-affix-${null===(a=e.el)||void 0===a?void 0:a.id}" href="#${null===(c=e.el)||void 0===c?void 0:c.id}">${sanitize(null===(u=e.el)||void 0===u?void 0:u.textContent)}</a>`};return e.items.map(e=>`<li>${l(e)}</li>`).join("")}return e.items.map(e=>i(e,t+1)).join("")},r=i(e);if(0==r.trim().length)return;t.innerHTML=`\n        <h1>Contents</h1>\n        <ul class="affixTocList">${r}</ul>\n    `;let l=void 0;const o=()=>{let e=binarySearch(n,e=>{const t=e.getBoundingClientRect().y;return t<0?1:t>0?-1:0});if(!e)return;if(e==n[0]&&e.getBoundingClientRect().y>0&&(e=void 0),e==l)return;const i=(e,n)=>{if(!l)return;const i=r=>{r!=t&&(r instanceof HTMLDetailsElement&&e(r),r instanceof HTMLAnchorElement&&n(r),r.parentElement&&i(r.parentElement))},r=document.querySelector(`aside.affix a#toc-affix-${l.id}`);r&&i(r)},r=(e,t)=>{e instanceof HTMLLIElement?t(e):e.parentElement&&r(e.parentElement,t)};i(e=>e.removeAttribute("open"),e=>r(e,e=>e.classList.remove("active"))),l=e,i(e=>e.setAttribute("open","open"),e=>r(e,e=>e.classList.add("active")))};o(),document.addEventListener("scroll",o)}function main(){hljs.initHighlighting(),initThemeSwitch(),initAffix()}main();