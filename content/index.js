(async () => {
  const { enabled = true } = await chrome.storage.local.get("enabled");

  if (!enabled) {
    return;
  }

  const option = HiFiNiThread.getAPlayerOption();
  if (!option) {
    return;
  }
  const lrc = await chrome.runtime.sendMessage({
    action: "fetchLyric",
    songInfo: {
      name: option.audio.name,
      artist: option.audio.artist,
    },
  });
  if (!lrc) return;

  option.audio.lrc = lrc.toString();
  HiFiNiThread.initAPlayer({
    ...option,
    showlrc: 1,
    mutex: true,
  });
  HiFiNiThread.insertPlayButton(option);
})();
