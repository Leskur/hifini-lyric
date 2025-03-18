// 后台服务工作线程
console.debug("HiFiNi歌词扩展后台脚本已启动");

import "./modifier.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, sender, sendResponse);
  fetchLyrics(request.songInfo, sender.tab.id);
});

async function fetchLyrics(songInfo, tabId) {
  try {
    const apiUrl = `https://ipinfo.leskur.cn/`;

    const response = await fetch(apiUrl, {});
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
  } catch (error) {
    console.error("获取歌词时出错:", error);
  }
}
