// Run the script in the same sandbox as a host site
(() => {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('twitter.js');
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
})();
