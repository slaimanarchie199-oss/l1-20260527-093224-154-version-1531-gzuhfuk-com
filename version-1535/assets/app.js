(function () {
    var navButton = document.querySelector('.nav-toggle');
    var mainNav = document.querySelector('.main-nav');
    if (navButton && mainNav) {
        navButton.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var active = 0;
        var setHero = function (index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === active);
            });
        };
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                setHero(i);
            });
        });
        if (slides.length > 1) {
            setInterval(function () {
                setHero(active + 1);
            }, 5200);
        }
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var filterInput = document.querySelector('.page-filter');
    var sortSelect = document.querySelector('.sort-select');
    var scope = document.querySelector('.filter-scope');

    var normalize = function (value) {
        return (value || '').toString().toLowerCase().trim();
    };

    var filterCards = function () {
        if (!scope || !filterInput) return;
        var value = normalize(filterInput.value);
        var cards = Array.prototype.slice.call(scope.children);
        cards.forEach(function (card) {
            var text = normalize(card.textContent + ' ' + (card.dataset.title || '') + ' ' + (card.dataset.year || '') + ' ' + (card.dataset.genre || '') + ' ' + (card.dataset.region || ''));
            card.classList.toggle('filter-hidden', value && text.indexOf(value) === -1);
        });
    };

    var sortCards = function () {
        if (!scope || !sortSelect) return;
        var mode = sortSelect.value;
        var cards = Array.prototype.slice.call(scope.children);
        cards.sort(function (a, b) {
            if (mode === 'year-desc') return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
            if (mode === 'year-asc') return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
            if (mode === 'title') return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
            return 0;
        });
        cards.forEach(function (card) {
            scope.appendChild(card);
        });
    };

    if (filterInput) {
        if (query) filterInput.value = query;
        filterInput.addEventListener('input', filterCards);
        filterCards();
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortCards();
            filterCards();
        });
    }

    document.querySelectorAll('[data-player]').forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-mask');
        if (!video || !button) return;
        var start = function () {
            var url = video.getAttribute('data-video');
            if (!video.dataset.ready) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
                video.dataset.ready = '1';
            }
            player.classList.add('playing');
            var playResult = video.play();
            if (playResult && playResult.catch) {
                playResult.catch(function () {});
            }
        };
        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (!video.dataset.ready) start();
        });
    });
})();
