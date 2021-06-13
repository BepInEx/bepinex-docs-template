"use strict";
var Affix;
(function (Affix) {
    function sanitize(str) {
        return str === null || str === void 0 ? void 0 : str.replace(/[^\w. ]/gi, c => `&#${c.charCodeAt(0)};`);
    }
    function getAffixToc() {
        const mainEl = document.querySelector("main");
        const affixToc = { level: 0, items: [] };
        if (!mainEl) {
            return affixToc;
        }
        const headers = mainEl.querySelectorAll("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]");
        const addItem = (item, node) => {
            let result = false;
            if (node.level < item.level
                && (node.items.length == 0
                    || node.items.length != 0 && !(result = addItem(item, node.items[node.items.length - 1])))) {
                item.parent = node;
                node.items.push(item);
                return true;
            }
            else if (node.level > item.level && node.parent) {
                node.parent.items = [item];
                item.parent = node.parent;
                node.parent = item;
                return true;
            }
            return result;
        };
        for (const h of headers) {
            addItem({
                level: +h.tagName.substring(1),
                el: h,
                items: []
            }, affixToc);
        }
        return affixToc;
    }
    function binarySearch(arr, c) {
        if (arr.length == 0) {
            return undefined;
        }
        if (arr.length == 1) {
            return arr[0];
        }
        const search = (start, end) => {
            const mid = Math.floor((start + end) / 2);
            if (mid == start || mid == end) {
                return arr[mid];
            }
            const comp = c(arr[mid]);
            if (comp == 0) {
                return arr[mid];
            }
            if (comp < 0) {
                return search(start, mid);
            }
            return search(mid, end);
        };
        return search(0, arr.length - 1);
    }
    function init() {
        const toc = getAffixToc();
        const affixEl = document.querySelector("aside.affix > div");
        if (!affixEl) {
            return;
        }
        if (toc.items.length == 0) {
            return;
        }
        const headers = [];
        const tocAffixPrefix = "toc-affix-";
        const makeList = (node, level = 0) => {
            if (node.items.length == 0) {
                return "";
            }
            if (0 < level && level < 3) {
                const sublist = (n) => n.items.length > 0 && level < 2;
                const renderItem = (n) => {
                    var _a, _b, _c, _d, _e, _f;
                    if (n.el) {
                        headers.push(n.el);
                    }
                    return sublist(n) ? `
                    <details>
                        <summary>
                            <a id="${tocAffixPrefix}${(_a = n.el) === null || _a === void 0 ? void 0 : _a.id}" href="#${(_b = n.el) === null || _b === void 0 ? void 0 : _b.id}">${sanitize((_c = n.el) === null || _c === void 0 ? void 0 : _c.textContent)}</a>
                        </summary>
                        <ul>
                            ${makeList(n, level + 1)}
                        </ul>
                    </details>
                ` : `<a id="${tocAffixPrefix}${(_d = n.el) === null || _d === void 0 ? void 0 : _d.id}" href="#${(_e = n.el) === null || _e === void 0 ? void 0 : _e.id}">${sanitize((_f = n.el) === null || _f === void 0 ? void 0 : _f.textContent)}</a>`;
                };
                return node.items.map(n => `<li>${renderItem(n)}</li>`).join("");
            }
            else {
                return node.items.map(n => makeList(n, level + 1)).join("");
            }
        };
        const res = makeList(toc);
        if (res.trim().length == 0) {
            return;
        }
        affixEl.innerHTML = `
            <h1>Contents</h1>
            <ul class="affixTocList">${res}</ul>
        `;
        let currentSelectedItem = undefined;
        const selectCurrentAffixTocItem = () => {
            let current = binarySearch(headers, e => {
                const EPS = 0.5;
                const y = e.getBoundingClientRect().y;
                if (y < EPS) {
                    return 1;
                }
                if (y > EPS) {
                    return -1;
                }
                return 0;
            });
            if (!current) {
                return;
            }
            if (current == headers[0] && current.getBoundingClientRect().y > 0) {
                current = undefined;
            }
            if (current == currentSelectedItem) {
                return;
            }
            const applyCurrent = (applyDetails, applyAnchor) => {
                if (!currentSelectedItem) {
                    return;
                }
                const a = (n) => {
                    if (n == affixEl) {
                        return;
                    }
                    if (n instanceof HTMLDetailsElement) {
                        applyDetails(n);
                    }
                    if (n instanceof HTMLAnchorElement) {
                        applyAnchor(n);
                    }
                    if (n.parentElement) {
                        a(n.parentElement);
                    }
                };
                const tocItem = document.querySelector(`aside.affix a#${tocAffixPrefix}${currentSelectedItem.id}`);
                if (tocItem) {
                    a(tocItem);
                }
            };
            const applyOnFirstList = (n, apply) => {
                if (n instanceof HTMLLIElement) {
                    apply(n);
                }
                else if (n.parentElement) {
                    applyOnFirstList(n.parentElement, apply);
                }
            };
            applyCurrent(n => n.removeAttribute("open"), n => applyOnFirstList(n, p => p.classList.remove("active")));
            currentSelectedItem = current;
            applyCurrent(n => n.setAttribute("open", "open"), n => applyOnFirstList(n, p => p.classList.add("active")));
        };
        selectCurrentAffixTocItem();
        document.addEventListener("scroll", selectCurrentAffixTocItem);
    }
    Affix.init = init;
})(Affix || (Affix = {}));
var Theme;
(function (Theme) {
    function init() {
        const themeSwitch = document.querySelector("#theme-switch");
        if (!themeSwitch) {
            return;
        }
        themeSwitch.addEventListener("click", e => {
            e.preventDefault();
            const html = document.documentElement;
            const isDark = html.classList.contains("dark");
            if (isDark) {
                html.classList.remove("dark");
                localStorage.theme = "light";
            }
            else {
                html.classList.add("dark");
                localStorage.theme = "dark";
            }
        });
    }
    Theme.init = init;
})(Theme || (Theme = {}));
var TabGroup;
(function (TabGroup) {
    const tabGroups = [];
    function init() {
        var _a;
        const tabGroupEls = document.querySelectorAll(".tabGroup");
        for (const tabGroup of tabGroupEls) {
            const tabLinks = [...tabGroup.querySelectorAll("ul[role='tablist'] a")];
            const tabs = tabLinks.map(a => [a, document.getElementById(a.getAttribute("href").substring(1))]);
            tabLinks.forEach(a => a.addEventListener("click", e => {
                e.preventDefault();
                selectTab(a.dataset.tab);
            }));
            tabGroups.push(tabs);
        }
        const urlParams = new URLSearchParams(window.location.search);
        const selectedTabs = new Set((_a = urlParams.get("tabs")) === null || _a === void 0 ? void 0 : _a.split(","));
        for (const selectedTab of selectedTabs) {
            selectTab(selectedTab, false);
        }
    }
    TabGroup.init = init;
    function selectTab(tabName, update = true) {
        const selectedTabs = new Set();
        selectedTabs.add(tabName);
        for (const tabGroup of tabGroups) {
            const tabNames = tabGroup.map(([a, _]) => a.dataset.tab);
            const selectedTabIndex = tabNames.findIndex(t => tabName == t);
            if (selectedTabIndex < 0) {
                const selectedTab = tabGroup.find(([_, select]) => !select.hidden);
                if (selectedTab && selectedTab[0].dataset.tab) {
                    selectedTabs.add(selectedTab[0].dataset.tab);
                }
                continue;
            }
            for (const [i, [a, select]] of tabGroup.entries()) {
                select.hidden = i != selectedTabIndex;
                select.setAttribute("aria-hidden", (i != selectedTabIndex).toString());
                a.setAttribute("aria-selected", (i == selectedTabIndex).toString());
                a.setAttribute("tabindex", i == selectedTabIndex ? "0" : "-1");
            }
        }
        if (update) {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("tabs", [...selectedTabs].join(","));
            history.pushState(null, "", `${window.location.pathname}?${searchParams.toString()}`);
        }
    }
})(TabGroup || (TabGroup = {}));
var TOC;
(function (TOC) {
    function init() {
        const tocMenuButton = document.querySelector(".toc-menu-button");
        const tocItems = document.querySelector(".toc-items");
        if (!tocMenuButton || !tocItems) {
            return;
        }
        tocMenuButton.addEventListener("click", () => {
            if (tocItems.classList.contains("open")) {
                tocItems.classList.remove("open");
            }
            else {
                tocItems.classList.add("open");
            }
        });
    }
    TOC.init = init;
})(TOC || (TOC = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Versioning;
(function (Versioning) {
    function compareVersions(a, b) {
        const pad = (v) => {
            if (v.length < 3) {
                const to = 3 - v.length;
                for (let i = 0; i < to; i++) {
                    v.push(0);
                }
            }
            return v;
        };
        const verA = pad(a.split(".").map(v => Number.parseInt(v)));
        const verB = pad(b.split(".").map(v => Number.parseInt(v)));
        for (let i = 0; i < 3; i++) {
            const va = verA[i];
            const vb = verB[i];
            if (va < vb) {
                return 1;
            }
        }
        return -1;
    }
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                const result = yield fetch("/versions.json");
                data = (yield result.json());
            }
            catch (e) {
                return;
            }
            const versionPickerDiv = document.getElementById("version-picker");
            if (!versionPickerDiv) {
                return;
            }
            const selectEl = document.createElement("select");
            data.versions = data.versions.sort((a, b) => {
                if (a.tag == "master") {
                    return -1;
                }
                if (b.tag == "master") {
                    return 1;
                }
                return compareVersions(a.version, b.version);
            });
            for (const ver of data.versions) {
                const verOpt = document.createElement("option");
                verOpt.value = ver.tag;
                verOpt.textContent = ver.version + (ver.tag == data.latestTag ? " (latest)" : "");
                selectEl.appendChild(verOpt);
                if (ver.tag == "master") {
                    const divider = document.createElement("option");
                    divider.disabled = true;
                    divider.textContent = "──────────";
                    selectEl.appendChild(divider);
                }
            }
            selectEl.value = docsVersion;
            versionPickerDiv.appendChild(selectEl);
            selectEl.addEventListener("change", () => {
                const tag = selectEl.value;
                window.location.href = `/${tag}`;
            });
        });
    }
    Versioning.init = init;
})(Versioning || (Versioning = {}));
/// <reference path="affix.ts" />
/// <reference path="theme.ts" />
/// <reference path="tabGroup.ts" />
/// <reference path="toc.ts" />
/// <reference path="versioning.ts" />
function main() {
    hljs.initHighlighting();
    Versioning.init();
    Theme.init();
    Affix.init();
    TabGroup.init();
    TOC.init();
}
main();
