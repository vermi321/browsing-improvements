async function contentScriptFn() {
  const COOKIE_NAME = "__bi_invert";
  const INVERT_VALUE = "invert";

  // Expose the API for the popup to call
  window.toggleInvertMode = toggleInvertMode;

  // Apply the saved mode
  applyInvertMode();

  function applyInvertMode() {
    const invertCookieValue = getCookie(COOKIE_NAME);
    if (invertCookieValue === INVERT_VALUE) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.cssText = `
        color-scheme: dark;
        filter: invert(1);
        background-color: black;
        background-image: none !important;
      `;

      let existingStyle = document.querySelector(`style#${COOKIE_NAME}`);
      const style = existingStyle || document.createElement("style");
      style.id = COOKIE_NAME;
      style.textContent = `
        /* Jupiter */
        .bg-v2-background-page,
        /* Kamino */
        #root > [class^="_root_"],
        [class^="__variant-primary_"] {
          background-color: black !important;
          background-image: none !important;
          background-gradient: none !important;
        }
      `;
      if (!existingStyle) {
        document.addEventListener("DOMContentLoaded", () => {
          document.head.appendChild(style);
        });
      }
    } else {
      const style = document.querySelector(`style#${COOKIE_NAME}`);
      style && (style.textContent = ``);
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.cssText = ``;
    }
  }

  function doInvert() {
    document.cookie = `${COOKIE_NAME}=${INVERT_VALUE}; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365 * 20
    ).toUTCString()}; path=/;`;
    applyInvertMode();
  }

  function redoInvert() {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    applyInvertMode();
  }

  function toggleInvertMode() {
    const invertCookieValue = getCookie(COOKIE_NAME);
    if (invertCookieValue === INVERT_VALUE) {
      redoInvert();
    } else {
      doInvert();
    }
  }

  function getCookie(value) {
    return document.cookie
      .split(";")
      .find((x) => x.includes(value))
      ?.replace(value + "=", "")
      .trim();
  }
}

(async () => {
  try {
    await contentScriptFn();
  } catch (e) {
    console.log(`Failed to execute the content script fn`, e);
  }
})();
