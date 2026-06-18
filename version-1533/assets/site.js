(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function setupHeader() {
    var searchToggle = document.querySelector('[data-search-toggle]');
    var searchPanel = document.querySelector('[data-search-panel]');
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (searchToggle && searchPanel) {
      searchToggle.addEventListener('click', function () {
        searchPanel.classList.toggle('is-open');
        var input = searchPanel.querySelector('input');
        if (searchPanel.classList.contains('is-open') && input) {
          input.focus();
        }
      });
    }

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('is-open');
      });
    }
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function setupFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
    forms.forEach(function (form) {
      var scopeSelector = form.getAttribute('data-filter-form');
      var scope = document.querySelector(scopeSelector);
      if (!scope) {
        return;
      }

      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var keyword = form.querySelector('[name="keyword"]');
      var year = form.querySelector('[name="year"]');
      var type = form.querySelector('[name="type"]');
      var reset = form.querySelector('[data-reset-filter]');

      function apply() {
        var q = keyword ? keyword.value.trim().toLowerCase() : '';
        var y = year ? year.value : '';
        var t = type ? type.value : '';

        cards.forEach(function (card) {
          var text = [card.dataset.title, card.dataset.region, card.dataset.tags].join(' ').toLowerCase();
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (y && card.dataset.year !== y) {
            ok = false;
          }
          if (t && card.dataset.type !== t) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
        });
      }

      form.addEventListener('input', apply);
      form.addEventListener('change', apply);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });

      if (reset) {
        reset.addEventListener('click', function () {
          form.reset();
          apply();
        });
      }

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && keyword) {
        keyword.value = q;
      }
      apply();
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (box) {
      var video = box.querySelector('video');
      var play = box.querySelector('[data-play]');
      var message = box.querySelector('[data-player-message]');
      var stream = box.getAttribute('data-stream');
      var loaded = false;
      var hls = null;

      function setMessage(text) {
        if (message) {
          message.textContent = text || '';
        }
      }

      function load() {
        if (loaded || !video || !stream) {
          return;
        }
        loaded = true;

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage('');
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setMessage('播放暂时不可用');
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else {
          setMessage('浏览器暂不支持该视频格式');
        }
      }

      function toggle() {
        load();
        if (!video) {
          return;
        }
        if (video.paused) {
          var promise = video.play();
          if (promise && promise.catch) {
            promise.catch(function () {
              setMessage('点击视频区域继续播放');
            });
          }
        } else {
          video.pause();
        }
      }

      if (play) {
        play.addEventListener('click', toggle);
      }
      if (video) {
        video.addEventListener('click', toggle);
        video.addEventListener('play', function () {
          box.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
          box.classList.remove('is-playing');
        });
      }

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setupHeader();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
