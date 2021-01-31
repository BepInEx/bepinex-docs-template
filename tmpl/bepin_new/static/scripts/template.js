"use strict";
function sanitize(str) {
    return str === null || str === void 0 ? void 0 : str.replace(/[^\w. ]/gi, c => `&#${c.charCodeAt(0)};`);
}
function initTheming() {
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
function initAffix() {
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
            const y = e.getBoundingClientRect().y;
            if (y < 0) {
                return 1;
            }
            if (y > 0) {
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
function main() {
    hljs.initHighlighting();
    initTheming();
    initAffix();
}
main();
