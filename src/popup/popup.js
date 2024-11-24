document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("toggle-invert-mode")
    .addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (tabId) => {
          window.toggleInvertMode();
        },
        args: [tab.id],
      });
    });
});
