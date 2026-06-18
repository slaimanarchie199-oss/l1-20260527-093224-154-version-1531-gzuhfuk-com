(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.mobile-toggle');

  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var index = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }
  }

  var filterList = document.querySelector('.filter-list');
  if (filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card, .rank-item'));
    var keywordInput = document.getElementById('keywordInput');
    var regionFilter = document.getElementById('regionFilter');
    var yearFilter = document.getElementById('yearFilter');
    var categoryFilter = document.getElementById('categoryFilter');
    var params = new URLSearchParams(window.location.search);
    var startQuery = params.get('q') || '';

    function uniqueValues(name) {
      var values = cards.map(function (card) {
        return card.getAttribute(name) || '';
      }).filter(Boolean);
      return Array.from(new Set(values)).sort(function (a, b) {
        if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
          return Number(b) - Number(a);
        }
        return a.localeCompare(b, 'zh-Hans-CN');
      });
    }

    function fillSelect(select, attr) {
      if (!select) {
        return;
      }
      uniqueValues(attr).forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    }

    fillSelect(regionFilter, 'data-region');
    fillSelect(yearFilter, 'data-year');

    if (keywordInput && startQuery) {
      keywordInput.value = startQuery;
    }

    function applyFilter() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var region = regionFilter ? regionFilter.value : '';
      var year = yearFilter ? yearFilter.value : '';
      var category = categoryFilter ? categoryFilter.value : '';

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchRegion = !region || card.getAttribute('data-region') === region;
        var matchYear = !year || card.getAttribute('data-year') === year;
        var matchCategory = !category || card.getAttribute('data-category') === category;
        card.classList.toggle('is-hidden', !(matchKeyword && matchRegion && matchYear && matchCategory));
      });
    }

    [keywordInput, regionFilter, yearFilter, categoryFilter].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilter);
        element.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();

function initMoviePlayer(videoId, coverId, source) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var loaded = false;
  var instance = null;

  if (!video || !cover || !source) {
    return;
  }

  function loadSource() {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      instance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      instance.loadSource(source);
      instance.attachMedia(video);
    } else {
      video.src = source;
    }

    video.controls = true;
    loaded = true;
  }

  function playVideo() {
    loadSource();
    cover.classList.add('is-hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        video.controls = true;
      });
    }
  }

  cover.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener('play', function () {
    cover.classList.add('is-hidden');
  });
  window.addEventListener('pagehide', function () {
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy();
    }
  });
}
