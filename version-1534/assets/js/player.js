(function () {
  window.initMoviePlayer = function (streamUrl) {
    const box = document.getElementById("playerBox");
    const video = document.getElementById("movieVideo");
    const overlay = document.getElementById("playerOverlay");
    const playToggle = document.getElementById("playToggle");
    const muteToggle = document.getElementById("muteToggle");
    const fullToggle = document.getElementById("fullToggle");
    const errorBox = document.getElementById("playerError");
    let prepared = false;
    let hls = null;

    if (!box || !video || !overlay) {
      return;
    }

    function showError() {
      if (errorBox) {
        errorBox.textContent = "播放暂不可用，请稍后重试";
        errorBox.classList.add("is-visible");
      }
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              showError();
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else {
        showError();
      }
    }

    function playVideo() {
      prepare();
      overlay.classList.add("is-hidden");
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    function togglePlay() {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    overlay.addEventListener("click", playVideo);
    video.addEventListener("click", togglePlay);

    if (playToggle) {
      playToggle.addEventListener("click", togglePlay);
    }

    if (muteToggle) {
      muteToggle.addEventListener("click", function () {
        video.muted = !video.muted;
        muteToggle.textContent = video.muted ? "🔈" : "🔇";
      });
    }

    if (fullToggle) {
      fullToggle.addEventListener("click", function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (box.requestFullscreen) {
          box.requestFullscreen();
        }
      });
    }

    video.addEventListener("play", function () {
      box.classList.add("is-playing");
      overlay.classList.add("is-hidden");
      if (playToggle) {
        playToggle.textContent = "Ⅱ";
      }
    });

    video.addEventListener("pause", function () {
      box.classList.remove("is-playing");
      if (playToggle) {
        playToggle.textContent = "▶";
      }
    });

    video.addEventListener("error", showError);
  };
})();
