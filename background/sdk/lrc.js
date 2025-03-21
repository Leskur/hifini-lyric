async function fetchLyric(songInfo) {
  return fetch(
    `https://api.lrc.cx/lyrics?title=${songInfo.name}&artist=${songInfo.artist}`
  ).then((res) => res.text());
}

export default {
  fetchLyric,
};
