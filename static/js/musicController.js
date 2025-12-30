const MUSIC_KEY = "bg-music-state";

function playMusic(src, loop = true) {
    let audio = window.bgAudio;

    if (!audio) {
        audio = new Audio();
        window.bgAudio = audio;
    }

    audio.src = src;
    audio.loop = loop;

    const saved = JSON.parse(localStorage.getItem(MUSIC_KEY));
    if (saved && saved.src === src) {
        audio.currentTime = saved.time || 0;
    }

    audio.play().catch(() => {});
}

function saveMusicState() {
    if (window.bgAudio) {
        localStorage.setItem(MUSIC_KEY, JSON.stringify({
            src: window.bgAudio.src,
            time: window.bgAudio.currentTime
        }));
    }
}

window.addEventListener("beforeunload", saveMusicState);

function fadeOutMusic(duration = 2000, callback) {
    if (!window.bgAudio) return;
    const stepTime = 50; // ms
    const steps = duration / stepTime;
    const volumeStep = window.bgAudio.volume / steps;

    const fade = setInterval(() => {
        if (window.bgAudio.volume > volumeStep) {
            window.bgAudio.volume -= volumeStep;
        } else {
            window.bgAudio.volume = 0;
            window.bgAudio.pause();
            clearInterval(fade);
            if (callback) callback();
        }
    }, stepTime);
}
