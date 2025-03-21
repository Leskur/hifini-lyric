chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetchLyric(request.songInfo, sender.tab.id)
    .then(async (lrc) => {
      Promise.all([
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ["assets/APlayer.min.js"],
        }),
        chrome.scripting.insertCSS({
          files: ["assets/APlayer.min.css"],
          target: { tabId: sender.tab.id },
        }),
      ]).then(() => {
        // 将歌词发送给content script
        sendResponse({
          lrc,
        });
      });
    })
    .catch((e) => {
      sendResponse({
        lrc: null,
      });
    });
  return true;
});

async function fetchLyric(songInfo) {
  return fetch(
    `https://api.lrc.cx/lyrics?title=${songInfo.name}&artist=${songInfo.artist}`
  ).then((res) => res.text());
}

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
