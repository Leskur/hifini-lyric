import kg from "./sdk/kg.js";
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  kg.fetchLyric(request.songInfo).then((lrc) => {
    Promise.all([
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ["assets/APlayer.min.js"],
      }),
      chrome.scripting.insertCSS({
        files: ["assets/APlayer.min.css"],
        target: { tabId: sender.tab.id },
      }),
    ])
      .then(() => {
        // 将歌词发送给content script
        sendResponse({
          lrc,
        });
      })
      .catch(() => {
        sendResponse({
          lrc: null,
        });
      });
  });

  return true;
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.storage.local.get("enabled").then(({ enabled = true }) => {
    chrome.storage.local.set({ enabled: !enabled }).then(() => {
      chrome.action.setBadgeText({
        text: !enabled ? "" : "OFF",
      });
    });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});
