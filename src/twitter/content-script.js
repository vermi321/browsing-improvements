(async () => {
  const levenshtein = window.Levenshtein;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const markSus = (tweet) => {
    tweet.style.background = "#fb616169";
  };

  const handleToName = {};
  const verify = debounce(() => {
    const isTweetPage = window.location.pathname.split("/")[2] === "status";
    if (!isTweetPage) return;

    const safeHandle = window.location.pathname.split("/")[1].toLowerCase();
    const tweets = document.querySelectorAll('[data-testid="tweet"]');

    tweets.forEach((tweet, index) => {
      const { tweetHandle, displayName, tweetText, isRepliedTo } =
        getTweetInfo(tweet);
      if (/^[0-9]+$/.test(tweetText)) {
        return markSus(tweet);
      }
      if (tweetHandle.toLowerCase() === safeHandle) {
        handleToName[safeHandle] = displayName.toLowerCase();
        return;
      }
      if (handleToName[safeHandle]) {
        const distance = levenshtein.get(
          handleToName[safeHandle],
          displayName.toLowerCase()
        );
        if (distance <= 1) {
          if (index === 0 && isRepliedTo) {
            tweets.forEach((tweet2) => {
              if (
                getTweetInfo(tweet2).tweetHandle.toLowerCase() === safeHandle
              ) {
                markSus(tweet2);
              }
            });
          } else {
            markSus(tweet);
          }
        }
      }
    });
  }, 100);

  function getTweetInfo(tweet) {
    let element = tweet.querySelectorAll('a[role="link"]');
    if (
      element[0].innerText.endsWith("retweeted") ||
      element[0].innerText.endsWith("reposted")
    )
      element = Array.from(element).slice(1);
    const tweetText =
      tweet.querySelector('[data-testid="tweetText"]')?.innerText || "";
    const isRepliedTo =
      tweet.querySelector('[data-testid="Tweet-User-Avatar"]')?.parentElement
        ?.children?.length > 1;
    return {
      tweetHandle: element[2].innerText.replace("@", ""),
      displayName: element[1].innerText,
      tweetText,
      isRepliedTo,
    };
  }

  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  const observer = new MutationObserver((mutations) => {
    mutations.some(function (mutation) {
      if (mutation.type === "childList") {
        if (
          Array.from(mutation.addedNodes).some((el) =>
            el.querySelector('[data-testid="tweet"]')
          )
        ) {
          verify();
          return true;
        }
      }
    });
  });

  let target;
  while (!(target = document.querySelector('main[role="main"]'))) {
    await sleep(100);
  }

  observer.observe(target, { childList: true, subtree: true });
})();
