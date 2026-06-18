(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      menuButton.textContent = mobileNav.classList.contains('open') ? '×' : '☰';
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
    if (slides.length > 1) {
      setInterval(() => show(current + 1), 5200);
    }
  }

  const globalSearch = document.querySelector('[data-global-search]');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = encodeURIComponent(globalSearch.value.trim());
        window.location.href = query ? `./list.html?q=${query}` : './list.html';
      }
    });
  }

  const filterScope = document.querySelector('.filter-scope');
  if (filterScope) {
    const cards = Array.from(filterScope.querySelectorAll('.movie-card'));
    const search = document.querySelector('[data-movie-search]');
    const year = document.querySelector('[data-year-filter]');
    const type = document.querySelector('[data-type-filter]');
    const params = new URLSearchParams(window.location.search);

    if (search && params.get('q')) {
      search.value = params.get('q');
    }

    const applyFilters = () => {
      const q = search ? search.value.trim().toLowerCase() : '';
      const y = year ? year.value : '';
      const t = type ? type.value : '';

      cards.forEach((card) => {
        const haystack = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.year
        ].join(' ').toLowerCase();
        const matchSearch = !q || haystack.includes(q);
        const matchYear = !y || card.dataset.year === y;
        const matchType = !t || (card.dataset.type || '').includes(t);
        card.style.display = matchSearch && matchYear && matchType ? '' : 'none';
      });
    };

    [search, year, type].forEach((control) => {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
