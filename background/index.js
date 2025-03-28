import kg from "./sdk/kg.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fetchLyric") {
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
          sendResponse(lrc);
        })
        .catch(() => {
          sendResponse(null);
        });
    });
  }

  return true;
});

let playerWindow = null;
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "openPlayer") {
    try {
      playerWindow = await chrome.windows.get(playerWindow.id);
      await chrome.windows.update(playerWindow.id, { focused: true });
    } catch {
      playerWindow = await chrome.windows.create({
        url: "player.html",
        width: 800,
        height: 600,
        type: "popup",
      });
    }
    sendResponse(playerWindow)
  }
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
