(function () {
  const header = document.getElementById("siteHeader");
  const searchToggle = document.querySelector("[data-search-toggle]");
  const searchPanel = document.querySelector("[data-search-panel]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  function setHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", function () {
      searchPanel.classList.toggle("is-open");
      const input = searchPanel.querySelector("input");
      if (searchPanel.classList.contains("is-open") && input) {
        input.focus();
      }
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      menuToggle.textContent = mobileNav.classList.contains("is-open") ? "×" : "☰";
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("is-active", current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle("is-active", current === index);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const target = Number(dot.getAttribute("data-hero-dot"));
        showSlide(target);
        startTimer();
      });
    });

    startTimer();
  }

  const scopes = Array.from(document.querySelectorAll("[data-filter-scope]"));
  if (scopes.length) {
    const textInput = document.querySelector("[data-local-filter]");
    const yearSelect = document.querySelector("[data-year-filter]");
    const categorySelect = document.querySelector("[data-category-filter]");
    const querySync = document.querySelector("[data-query-sync]");

    if (querySync) {
      const params = new URLSearchParams(window.location.search);
      const value = params.get("q") || "";
      querySync.value = value;
    }

    function applyFilter() {
      const keyword = textInput ? textInput.value.trim().toLowerCase() : "";
      const year = yearSelect ? yearSelect.value : "";
      const category = categorySelect ? categorySelect.value : "";
      scopes.forEach(function (scope) {
        const cards = Array.from(scope.querySelectorAll(".movie-card"));
        cards.forEach(function (card) {
          const text = (card.getAttribute("data-filter") || "").toLowerCase();
          const cardYear = card.getAttribute("data-year") || "";
          const cardCategory = card.getAttribute("data-category") || "";
          const visible = (!keyword || text.indexOf(keyword) !== -1) && (!year || cardYear === year) && (!category || cardCategory === category);
          card.classList.toggle("is-filtered-out", !visible);
        });
      });
    }

    [textInput, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  }
})();
