"use strict";var Affix,Theme,TabGroup,TOC;!function(e){let t;function n(e){return null===e||void 0===e?void 0:e.replace(/[^\w. ]/gi,e=>`&#${e.charCodeAt(0)};`)}!function(e){e[e.None=0]="None",e[e.Small=1]="Small",e[e.Large=2]="Large"}(t||(t={})),e.init=function(){const e=function(){const e=document.querySelector("main"),t={level:0,items:[]};if(!e)return t;const n=e.querySelectorAll("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]"),i=(e,t)=>{let n=!1;return t.level<e.level&&(0==t.items.length||0!=t.items.length&&!(n=i(e,t.items[t.items.length-1])))?(e.parent=t,t.items.push(e),!0):t.level>e.level&&t.parent?(t.parent.items=[e],e.parent=t.parent,t.parent=e,!0):n};for(const e of n)i({level:+e.tagName.substring(1),el:e,items:[]},t);return t}(),i=document.querySelector("aside.affix > div > .affix-toc");if(!i)return;if(0==e.items.length)return;const o=[],a=(e,t=0)=>{if(0==e.items.length)return"";if(0<t&&t<3){const i=e=>e.items.length>0&&t<2,s=e=>{var s,r,l,c,d,u;return e.el&&o.push(e.el),i(e)?`\n                    <details>\n                        <summary>\n                            <a id="toc-affix-${null===(s=e.el)||void 0===s?void 0:s.id}" href="#${null===(r=e.el)||void 0===r?void 0:r.id}">${n(null===(l=e.el)||void 0===l?void 0:l.textContent)}</a>\n                        </summary>\n                        <ul>\n                            ${a(e,t+1)}\n                        </ul>\n                    </details>\n                `:`<a id="toc-affix-${null===(c=e.el)||void 0===c?void 0:c.id}" href="#${null===(d=e.el)||void 0===d?void 0:d.id}">${n(null===(u=e.el)||void 0===u?void 0:u.textContent)}</a>`};return e.items.map(e=>`<li>${s(e)}</li>`).join("")}return e.items.map(e=>a(e,t+1)).join("")},s=a(e);if(0==s.trim().length)return;i.innerHTML=`\n            <h1>Contents</h1>\n            <ul class="affixTocList">${s}</ul>\n        `;let r=void 0;const l=()=>{let e=function(e,t){if(0==e.length)return;if(1==e.length)return e[0];const n=(t,i)=>{const o=Math.floor((t+i)/2);if(o==t||o==i)return e[o];const a=(e=>{const t=e.getBoundingClientRect().y;return t<.5?1:t>.5?-1:0})(e[o]);return 0==a?e[o]:a<0?n(t,o):n(o,i)};return n(0,e.length-1)}(o);if(!e)return;if(e==o[0]&&e.getBoundingClientRect().y>0&&(e=void 0),e==r)return;const t=(e,t)=>{if(!r)return;const n=o=>{o!=i&&(o instanceof HTMLDetailsElement&&e(o),o instanceof HTMLAnchorElement&&t(o),o.parentElement&&n(o.parentElement))},o=document.querySelector(`aside.affix a#toc-affix-${r.id}`);o&&n(o)},n=(e,t)=>{e instanceof HTMLLIElement?t(e):e.parentElement&&n(e.parentElement,t)};t(e=>e.removeAttribute("open"),e=>n(e,e=>e.classList.remove("active"))),r=e,t(e=>e.setAttribute("open","open"),e=>n(e,e=>e.classList.add("active")))};l();let c=t.None;const d=()=>{const e=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);e<1280&&(c==t.None||c==t.Large)?(document.removeEventListener("scroll",l),c=t.Small):e>=1280&&(c==t.None||c==t.Small)&&(document.addEventListener("scroll",l),c=t.Large)};d(),window.addEventListener("resize",d)}}(Affix||(Affix={})),(Theme||(Theme={})).init=function(){const e=document.querySelector("#theme-switch");e&&e.addEventListener("click",e=>{e.preventDefault();const t=document.documentElement;t.classList.contains("dark")?(t.classList.remove("dark"),localStorage.theme="light"):(t.classList.add("dark"),localStorage.theme="dark")})},function(e){const t=[];function n(e,n=!0){const i=new Set;i.add(e);for(const n of t){const t=n.map(([e,t])=>e.dataset.tab).findIndex(t=>e==t);if(t<0){const e=n.find(([e,t])=>!t.hidden);e&&e[0].dataset.tab&&i.add(e[0].dataset.tab)}else for(const[e,[i,o]]of n.entries())o.hidden=e!=t,o.setAttribute("aria-hidden",(e!=t).toString()),i.setAttribute("aria-selected",(e==t).toString()),i.setAttribute("tabindex",e==t?"0":"-1")}if(n){const e=new URLSearchParams(window.location.search);e.set("tabs",[...i].join(",")),history.pushState(null,"",`${window.location.pathname}?${e.toString()}`)}}(TabGroup||(TabGroup={})).init=function(){var e;const i=document.querySelectorAll(".tabGroup");for(const e of i){const i=[...e.querySelectorAll("ul[role='tablist'] a")],o=i.map(e=>[e,document.getElementById(e.getAttribute("href").substring(1))]);i.forEach(e=>e.addEventListener("click",t=>{t.preventDefault(),n(e.dataset.tab)})),t.push(o)}const o=new URLSearchParams(window.location.search),a=new Set(null===(e=o.get("tabs"))||void 0===e?void 0:e.split(","));for(const e of a)n(e,!1)}}(),(TOC||(TOC={})).init=function(){const e=document.querySelector(".toc-menu-button"),t=document.querySelector(".toc-items");e&&t&&e.addEventListener("click",()=>{t.classList.contains("open")?t.classList.remove("open"):t.classList.add("open")})};var Versioning,MainMenu,__awaiter=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))(function(o,a){function s(e){try{l(i.next(e))}catch(e){a(e)}}function r(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(s,r)}l((i=i.apply(e,t||[])).next())})};function main(){hljs.initHighlighting(),Versioning.init(),Theme.init(),Affix.init(),TabGroup.init(),TOC.init(),MainMenu.init()}(Versioning||(Versioning={})).init=function(){return __awaiter(this,void 0,void 0,function*(){let e;try{e=yield(yield fetch("/versions.json")).json()}catch(e){return}const t=document.getElementById("version-picker");if(!t)return;const n=document.createElement("select");e.versions=e.versions.sort((e,t)=>"master"==e.tag?-1:"master"==t.tag?1:function(e,t){const n=e=>{if(e.length<3){const t=3-e.length;for(let n=0;n<t;n++)e.push(0)}return e},i=n(e.split(".").map(e=>Number.parseInt(e))),o=n(t.split(".").map(e=>Number.parseInt(e)));for(let e=0;e<3;e++)if(i[e]<o[e])return 1;return-1}(e.version,t.version));for(const t of e.versions){const i=document.createElement("option");if(i.value=t.tag,i.textContent=t.version+(t.tag==e.latestTag?" (latest)":""),n.appendChild(i),"master"==t.tag){const e=document.createElement("option");e.disabled=!0,e.textContent="──────────",n.appendChild(e)}}n.value=docsVersion,t.appendChild(n),n.addEventListener("change",()=>{const e=n.value;window.location.href=`/${e}`});const i=document.getElementById("global-messages");if(i)if("master"==docsVersion){const t=document.createElement("div");t.classList.add("message"),t.innerHTML=`<span>You are viewing documentation for a yet unreleased BepInEx version.</span> <a href="/">View latest stable docs (${e.latestTag}).</a>`,t.style.backgroundColor="#CA8423",i.appendChild(t)}else if(docsVersion!=e.latestTag){const t=document.createElement("div");t.classList.add("message"),t.innerHTML=`<span>You are viewing old documentation.</span> <a href="/">View latest stable docs (${e.latestTag}).</a>`,t.style.backgroundColor="#CA3423",i.appendChild(t)}})},(MainMenu||(MainMenu={})).init=function(){let e=document.getElementById("menu-switch"),t=document.querySelector("header > nav");e&&e.addEventListener("click",e=>{e.preventDefault(),t&&(t.classList.contains("open")?t.classList.remove("open"):t.classList.add("open"))})},main();