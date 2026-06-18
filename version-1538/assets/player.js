(() => {
  const players = document.querySelectorAll('.video-player');

  players.forEach((player) => {
    const video = player.querySelector('.video-el');
    const button = player.querySelector('.play-button');
    const source = player.dataset.videoSrc;
    let prepared = false;

    const prepare = () => {
      if (prepared || !video || !source) {
        return;
      }
      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    };

    const play = () => {
      prepare();
      const request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(() => {});
      }
      player.classList.add('playing');
    };

    if (button) {
      button.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', () => player.classList.add('playing'));
      video.addEventListener('pause', () => player.classList.remove('playing'));
    }
  });
})();
