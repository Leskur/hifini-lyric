function searchKeyword(keyword) {
  return fetch(
    `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${keyword}&page=1&pagesize=1&showtype=1`
  )
    .then((res) => res.json())
    .then((res) => res?.data?.info?.[0]);
}

function searchHash(hash) {
  return fetch(
    `https://krcs.kugou.com/search?ver=1&man=yes&client=mobi&keyword=&duration=&hash=${hash}&album_audio_id=`
  )
    .then((res) => res.json())
    .then((res) => res?.candidates?.[0]);
}

function searchLyric(candidate) {
  return fetch(
    `https://lyrics.kugou.com/download?ver=1&client=pc&id=${candidate.id}&accesskey=${candidate.accesskey}&fmt=lrc&charset=utf8`
  )
    .then((res) => res.json())
    .then((res) => {
      const bytes = Uint8Array.from(atob(res.content), (c) => c.charCodeAt(0));
      const decodeed = new TextDecoder("utf-8").decode(bytes);
      return decodeed;
    });
}

async function fetchLyric(songInfo) {
  try {
    const song = await searchKeyword(`${songInfo.name} ${songInfo.artist}`);
    const candidate = await searchHash(song.hash);
    const lyric = await searchLyric(candidate);
    return lyric;
  } catch (e) {
    return null;
  }
}

export default {
  fetchLyric,
};
