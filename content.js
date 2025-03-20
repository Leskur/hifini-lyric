// 在HiFiNi网站上运行的内容脚本
console.debug("HiFiNi歌词扩展已加载");

function generateParam(data) {
  if (!data) return "";
  var key = "95wwwHiFiNicom27";
  var outText = "";
  for (var i = 0, j = 0; i < data.length; i++, j++) {
    if (j == key.length) j = 0;
    outText += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(j));
  }
  return base32Encode(outText);
}

function base32Encode(str) {
  var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  var bits = "";
  var base32 = "";
  for (var i = 0; i < str.length; i++) {
    var bit = str.charCodeAt(i).toString(2);
    while (bit.length < 8) {
      bit = "0" + bit;
    }
    bits += bit;
  }
  while (bits.length % 5 !== 0) {
    bits += "0";
  }
  for (var i = 0; i < bits.length; i += 5) {
    var chunk = bits.substring(i, i + 5);
    base32 += base32chars[parseInt(chunk, 2)];
  }
  while (base32.length % 8 !== 0) {
    base32 += "=";
  }
  return base32.replace(/=/g, "HiFiNiYINYUECICHANG");
}

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateLyrics") {
    // 处理接收到的歌词
    console.log("收到歌词数据");
    return;
    document.getElementById("player4").innerHTML = "";
    new APlayer({
      element: document.getElementById("player4"),
      narrow: false,
      autoplay: false,
      preload: "none",
      showlrc: 1,
      mutex: true,
      theme: "#ad7a86",
      music: [
        {
          title: "一直很安静",
          author: "阿桑",
          url:
            "get_music.php?key=qlD0uparuWz4IftrVWpVjXPNSdR91iNCmLT1xxHiFiNixxppb9ETxtmwermCKofsxUHPxOroXZwMwIhHl81zZDbr3ovM&p=" +
            generateParam(
              "I3PQE0CZCVWCVQJcJ1wwwHiFiNicom1A39p71ZGqloRi23ycjB7Pc3ZxxipTPDXjJBxxHiFiNixxkwiqzjP8ur9ICZ7wrflxxHiFiNixxtE4OL8wwwHiFiNicom9FaPSQU5cGy1pPVXwwwHiFiNicomdxxHiFiNixxVEwwwHiFiNicomlKq0ODM16g"
            ),
          pic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000000Z5NxR0IQ5te.jpg",
          lrc: message.lyrics.toString(),
        },
      ],
    });
  }
});

function initAPlayer(option) {
  console.debug(option);
  if (option) {
    removeOldAPlayerCSS();
    const ap = new APlayer(option);
    ap.on("error", () => {
      ap.pause();
      ap.container.querySelector(".aplayer-author").innerText += " 播放失败";
      ap.options.audio[0].artist += " 播放失败 ╥﹏╥";
    });
  }
}

// 获取当前播放的歌曲信息
function getCurrentSongInfo() {
  const name = document.querySelector(".aplayer-title")?.textContent;
  const artist = document.querySelector(".aplayer-author")?.textContent;
  if (!name) {
    console.debug("无播放信息");
    return null;
  }
  return {
    name,
    artist,
  };
}

function getAPlayerOption() {
  const scripts = document.querySelectorAll("script");
  const script = Array.from(scripts).find((script) =>
    /new APlayer/.test(script.textContent)
  );

  if (!script) {
    return null;
  }

  // 匹配 new APlayer 配置对象
  const id = script.textContent.match(/ById\(['"](.+)['"]\)/)?.[1];
  const theme = script.textContent.match(/theme:\s*['"]([^'"]+)/)?.[1];
  const cover = script.textContent.match(/pic:\s*['"]([^'"]+)/)?.[1];
  const url = script.textContent.match(/url:\s*['"]([^'"]+)/)?.[1];
  const gen = script.textContent.match(/generateParam\(['"](.+)['"]\)/)?.[1];
  const artist = script.textContent.match(/author:\s*['"]([^'"]+)/)?.[1];
  const name = script.textContent.match(/title:\s*['"]([^'"]+)/)?.[1];
  return {
    preload: "none",
    loop: "none",
    mutex: true,
    theme,
    listFolded: true,
    audio: {
      name,
      artist,
      container: document.getElementById(id),
      cover,
      url: url + generateParam(gen),
    },
  };
}

function removeOldAPlayerCSS() {
  const styles = document.querySelectorAll("style");
  const style = Array.from(styles).find((style) =>
    /\.aplayer-/.test(style.textContent)
  );
  if (style) {
    style.remove();
  }
}

window.addEventListener("load", () => {
  const songInfo = getCurrentSongInfo();
  const option = getAPlayerOption();
  if (songInfo && option) {
    chrome.runtime.sendMessage(
      {
        action: "fetchLyrics",
        songInfo: songInfo,
      },
      (response) => {
        option.audio.lrc = response.lrc.toString();
        initAPlayer({
          ...option,
          showlrc: 1,
          mutex: true,
        });
      }
    );
  }
});
