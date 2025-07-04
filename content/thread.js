class TestAPlayer {}

const HiFiNiThread = {
  generateParam: function (data) {
    if (!data) return "";
    var key = "95wwwHiFiNicom27";
    var outText = "";
    for (var i = 0, j = 0; i < data.length; i++, j++) {
      if (j == key.length) j = 0;
      outText += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(j));
    }
    return this.base32Encode(outText);
  },
  base32Encode: function (str) {
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
  },
  getAPlayerOption: function () {
    const scripts = document.querySelectorAll("script");
    const script = Array.from(scripts).find((script) =>
      /new APlayer/.test(script.textContent)
    );

    if (!script) {
      return null;
    }

    try {
      // 匹配 new APlayer 配置对象
      const id = script.textContent.match(/ById\(['"](.+)['"]\)/)?.[1];
      const theme = script.textContent.match(/theme:\s*['"]([^'"]+)/)?.[1];
      const cover = script.textContent.match(/pic:\s*['"]([^'"]+)/)?.[1];
      const url = script.textContent.match(/url:\s*['"]([^'"]+)/)?.[1];
      const gen = script.textContent.match(
        /generateParam\(['"](.+)['"]\)/
      )?.[1];
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
          url: url + this.generateParam(gen),
        },
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  removeOldAPlayerCSS: function () {
    const styles = document.querySelectorAll("style");
    const style = Array.from(styles).find((style) =>
      /\.aplayer-/.test(style.textContent)
    );
    if (style) {
      style.remove();
    }
  },
  initAPlayer: function (option) {
    if (option) {
      this.removeOldAPlayerCSS();
      const ap = new APlayer(option);
      ap.on("error", () => {
        ap.pause();
        ap.container.querySelector(".aplayer-author").innerText += " 播放失败";
        ap.options.audio[0].artist += " 播放失败 ╥﹏╥";
      });
      ap.on("play", () => {
        document.querySelectorAll('a').forEach(a => {
          a.setAttribute("target", "_blank")
        })
      })
    }
  },
};
