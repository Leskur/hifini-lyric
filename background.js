// 后台服务工作线程
console.debug("HiFiNi歌词扩展后台脚本已启动");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetchLyrics(request.songInfo, sender.tab.id).then(async (lrc) => {
    Promise.all([
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ["APlayer.min.js"],
      }),
      chrome.scripting.insertCSS({
        files: ["APlayer.min.css"],
        target: { tabId: sender.tab.id },
      }),
    ]).then(() => {
      // 将歌词发送给content script
      sendResponse({
        lrc,
      });
    });
  });
  return true;
});

async function fetchLyrics(songInfo, tabId) {
  try {
    const apiUrl = `https://api.lrc.cx/lyrics?title=${songInfo.name}&artist=${songInfo.artist}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.error("获取歌词时出错:", error);
  }
}
