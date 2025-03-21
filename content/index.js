chrome.storage.local.get("enabled").then(({ enabled = true }) => {
  if (enabled) {
    const option = HiFiNiThread.getAPlayerOption();
    console.log(option);
    if (option) {
      chrome.runtime.sendMessage(
        {
          action: "fetchLyric",
          songInfo: {
            name: option.audio.name,
            artist: option.audio.artist,
          },
        },
        (res) => {
          if (res?.lrc) {
            option.audio.lrc = res.lrc.toString();
            HiFiNiThread.initAPlayer({
              ...option,
              showlrc: 1,
              mutex: true,
            });
          }
        }
      );
    }
  }
});
