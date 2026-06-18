(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var header = document.querySelector("[data-header]");
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (header) {
      var onScroll = function () {
        if (window.scrollY > 18) {
          header.classList.add("is-scrolled");
        } else {
          header.classList.remove("is-scrolled");
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var active = 0;
      var show = function (index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === active);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === active);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
      if (slides.length > 1) {
        window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var input = filterRoot.querySelector("[data-filter-input]");
      var select = filterRoot.querySelector("[data-filter-select]");
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
      var empty = filterRoot.querySelector("[data-empty]");
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";
      if (input && q) {
        input.value = q;
      }
      var apply = function () {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var category = select ? select.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-title") + " " + card.getAttribute("data-meta")).toLowerCase();
          var meta = card.getAttribute("data-meta") || "";
          var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchCategory = !category || meta.indexOf(category) !== -1;
          var ok = matchKeyword && matchCategory;
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      };
      if (input) {
        input.addEventListener("input", apply);
      }
      if (select) {
        select.addEventListener("change", apply);
      }
      apply();
    }
  });
})();
