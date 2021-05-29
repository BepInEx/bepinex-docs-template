/// <reference path="affix.ts" />
/// <reference path="theme.ts" />
/// <reference path="tabGroup.ts" />
/// <reference path="toc.ts" />

function main() {
    hljs.initHighlighting();
    Theme.init();
    Affix.init();
    TabGroup.init();
    TOC.init();
}

main();