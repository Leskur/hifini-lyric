// 在HiFiNi网站上运行的内容脚本
console.debug("HiFiNi歌词扩展已加载");

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "insertLyrics") {
    insertLyricsToPage(message.lyrics);
    sendResponse({ status: "success" });
  }
});

// 获取当前播放的歌曲信息
function getCurrentSongInfo() {
  const title = document.querySelector(".aplayer-title")?.textContent;
  const artist = document.querySelector(".aplayer-author")?.textContent;
  return {
    title,
    artist,
  };
}

// 将歌词插入到页面中
function insertLyricsToPage(lyrics) {}

window.addEventListener("load", () => {
  const songInfo = getCurrentSongInfo();
  if (songInfo.title) {
    chrome.runtime.sendMessage({
      action: "fetchLyrics",
      songInfo: songInfo,
    });
  }
});
