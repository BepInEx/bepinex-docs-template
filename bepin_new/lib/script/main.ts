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