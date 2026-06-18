(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var shell = document.querySelector('[data-video-url]');
    if (!shell) {
      return;
    }

    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var state = shell.querySelector('[data-video-state]');
    var source = shell.getAttribute('data-video-url');
    var loaded = false;
    var hls = null;

    function setState(text, visible) {
      if (!state) {
        return;
      }
      state.textContent = text || '';
      state.hidden = !visible;
    }

    function hideButton() {
      if (button) {
        button.classList.add('is-hidden');
      }
    }

    function load() {
      if (!video || !source) {
        setState('视频暂时无法加载', true);
        return Promise.reject(new Error('missing video element or source'));
      }

      if (loaded) {
        return video.play();
      }

      loaded = true;
      setState('视频加载中', true);

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setState('', false);
          video.play().catch(function () {
            setState('点击播放器继续播放', true);
          });
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setState('视频加载失败，请刷新重试', true);
          }
        });
        return Promise.resolve();
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setState('', false);
          video.play().catch(function () {
            setState('点击播放器继续播放', true);
          });
        }, { once: true });
        return Promise.resolve();
      }

      setState('当前浏览器不支持该视频播放', true);
      return Promise.reject(new Error('unsupported hls'));
    }

    function start() {
      hideButton();
      load().catch(function () {
        setState('视频加载失败，请刷新重试', true);
      });
    }

    if (button) {
      button.addEventListener('click', start);
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }
      if (!loaded && (!button || !button.contains(event.target))) {
        start();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
