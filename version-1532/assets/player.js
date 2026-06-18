import { H as Hls } from './hls.js';

function initPlayer(box) {
    const video = box.querySelector('video');
    const overlay = box.querySelector('[data-play-overlay]');
    const source = box.dataset.videoSrc;
    let initialized = false;

    function start() {
        if (!video || !source) {
            return;
        }
        if (!initialized) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (Hls && Hls.isSupported()) {
                const hls = new Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            initialized = true;
        }
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        video.controls = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                video.controls = true;
            });
        }
    }

    if (overlay) {
        overlay.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
        if (!initialized || video.paused) {
            start();
        }
    });
}

document.querySelectorAll('[data-player]').forEach(initPlayer);
