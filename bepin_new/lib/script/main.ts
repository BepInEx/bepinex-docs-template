/// <reference path="affix.ts" />
/// <reference path="theme.ts" />
/// <reference path="tabGroup.ts" />

function main() {
    hljs.initHighlighting();
    Theme.init();
    Affix.init();
    TabGroup.init();
}

main();