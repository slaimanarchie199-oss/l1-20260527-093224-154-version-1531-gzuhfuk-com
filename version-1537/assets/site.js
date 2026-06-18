(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
      });
    }

    setupHero();
    setupFilters();
  });

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');

    if (!slides.length) {
      return;
    }

    var index = 0;
    var timer = null;

    function activate(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        activate(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        activate(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        activate(index + 1);
        start();
      });
    }

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
    }

    activate(0);
    start();
  }

  function setupFilters() {
    var input = document.querySelector('[data-filter-input]');
    var year = document.querySelector('[data-filter-year]');
    var type = document.querySelector('[data-filter-type]');
    var category = document.querySelector('[data-filter-category]');
    var scope = document.querySelector('[data-filter-scope]');
    var empty = document.querySelector('[data-filter-empty]');

    if (!scope) {
      return;
    }

    var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .hot-item'));

    function value(node) {
      return node ? String(node.value || '').trim().toLowerCase() : '';
    }

    function matchText(item, q) {
      if (!q) {
        return true;
      }
      var haystack = [
        item.getAttribute('data-title'),
        item.getAttribute('data-year'),
        item.getAttribute('data-region'),
        item.getAttribute('data-type'),
        item.getAttribute('data-genre'),
        item.getAttribute('data-tags'),
        item.getAttribute('data-category')
      ].join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    }

    function apply() {
      var q = value(input);
      var y = value(year);
      var t = value(type);
      var c = value(category);
      var shown = 0;

      items.forEach(function (item) {
        var ok = matchText(item, q);
        ok = ok && (!y || String(item.getAttribute('data-year') || '').toLowerCase() === y);
        ok = ok && (!t || String(item.getAttribute('data-type') || '').toLowerCase().indexOf(t) !== -1);
        ok = ok && (!c || String(item.getAttribute('data-category') || '').toLowerCase() === c);
        item.style.display = ok ? '' : 'none';
        if (ok) {
          shown += 1;
        }
      });

      if (empty) {
        empty.hidden = shown !== 0;
      }
    }

    [input, year, type, category].forEach(function (node) {
      if (node) {
        node.addEventListener('input', apply);
        node.addEventListener('change', apply);
      }
    });

    apply();
  }
})();
