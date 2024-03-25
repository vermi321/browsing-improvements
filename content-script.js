// Run the script in the same sandbox as a host site
(async () => {
    const load = async (scriptPath) => {
        return new Promise(res => {
            const s = document.createElement('script');
            s.src = chrome.runtime.getURL(scriptPath);
            s.onload = function () {
                this.remove();
                res();
            };
            (document.head || document.documentElement).appendChild(s);
        })
    }
    await load('levenshtein.js');
    await load('twitter.js');
})();
