(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    var toggle = $('[data-menu-toggle]');
    var nav = $('[data-site-nav]');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var slides = $all('[data-hero-slide]');
    var dots = $all('[data-hero-dot]');
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    function applyCardFilter() {
        var queryInput = $('[data-card-search]');
        var regionSelect = $('[data-region-filter]');
        var yearSelect = $('[data-year-filter]');
        var query = queryInput ? queryInput.value.trim().toLowerCase() : '';
        var region = regionSelect ? regionSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';

        $all('[data-movie-card]').forEach(function (card) {
            var haystack = [
                card.dataset.title || '',
                card.dataset.region || '',
                card.dataset.year || '',
                card.dataset.genre || ''
            ].join(' ').toLowerCase();
            var ok = true;
            if (query && haystack.indexOf(query) === -1) {
                ok = false;
            }
            if (region && (card.dataset.region || '').indexOf(region) === -1) {
                ok = false;
            }
            if (year && (card.dataset.year || '') !== year) {
                ok = false;
            }
            card.classList.toggle('hidden-by-filter', !ok);
        });
    }

    ['input', 'change'].forEach(function (eventName) {
        $all('[data-card-search], [data-region-filter], [data-year-filter]').forEach(function (el) {
            el.addEventListener(eventName, applyCardFilter);
        });
    });

    var globalInput = $('#globalSearchInput');
    var globalResults = $('#globalSearchResults');

    function normalizePath(path) {
        var isNested = window.location.pathname.indexOf('/movies/') !== -1 || window.location.pathname.indexOf('/category/') !== -1;
        return isNested ? '../' + path : './' + path;
    }

    function renderSearchResults() {
        if (!globalInput || !globalResults || !window.SITE_SEARCH_DATA) {
            return;
        }
        var query = globalInput.value.trim().toLowerCase();
        if (!query) {
            globalResults.classList.remove('is-open');
            globalResults.innerHTML = '';
            return;
        }
        var results = window.SITE_SEARCH_DATA.filter(function (item) {
            return [item.title, item.year, item.region, item.genre, item.category].join(' ').toLowerCase().indexOf(query) !== -1;
        }).slice(0, 18);

        if (!results.length) {
            globalResults.innerHTML = '<div class="search-result-item"><div><strong>没有找到匹配影片</strong><span>换一个片名、年份或类型试试</span></div></div>';
            globalResults.classList.add('is-open');
            return;
        }

        globalResults.innerHTML = results.map(function (item) {
            var movieHref = normalizePath('movies/' + item.file);
            var coverHref = normalizePath(item.cover);
            return '<a class="search-result-item" href="' + movieHref + '">' +
                '<img src="' + coverHref + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
                '<div><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.category + '</span></div>' +
                '</a>';
        }).join('');
        globalResults.classList.add('is-open');
    }

    if (globalInput && globalResults) {
        globalInput.addEventListener('input', renderSearchResults);
        document.addEventListener('click', function (event) {
            if (!globalResults.contains(event.target) && event.target !== globalInput) {
                globalResults.classList.remove('is-open');
            }
        });
    }
})();
