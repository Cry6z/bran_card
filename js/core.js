let responseSelected = false; // Flag to prevent multiple clicks
let dashboardActive = false; // Zen Mode only allowed when this is true

function selectResponse(response) {
    if (responseSelected) return; // Prevent spamming
    responseSelected = true;

    const responseScreen = document.getElementById('response-screen');

    // Fade out response screen
    responseScreen.style.opacity = '0';
    setTimeout(() => {
        responseScreen.style.display = 'none';
    }, 800);

    // Play voice response
    if (response === 'fine') {
        const goodVoices = ['good-voice-1', 'good-voice-2', 'good-voice-3'];
        const selectedGoodVoiceId = goodVoices[Math.floor(Math.random() * goodVoices.length)];
        const selectedGoodVoice = document.getElementById(selectedGoodVoiceId);

        if (selectedGoodVoice) {
            selectedGoodVoice.currentTime = 0;
            selectedGoodVoice.play().catch(e => console.log(e));
        }
    } else if (response === 'bad') {
        const badVoices = ['bad-voice-1', 'bad-voice-2', 'bad-voice-3'];
        const selectedBadVoiceId = badVoices[Math.floor(Math.random() * badVoices.length)];
        const selectedBadVoice = document.getElementById(selectedBadVoiceId);

        if (selectedBadVoice) {
            selectedBadVoice.currentTime = 0;
            selectedBadVoice.play().catch(e => console.log(e));
        }
    }

    // Continue to Dashboard sequence
    setTimeout(startDashboardSequence, 1200);
}

function triggerImpact() {
    var impactSound = document.getElementById('impact-sound');
    var flash = document.getElementById('flash-overlay');
    var container = document.getElementById('main-container');

    if (impactSound) {
        impactSound.currentTime = 0;
        impactSound.play().catch(e => console.log("Impact sound failed: ", e));
    }

    // Flash Effect
    if (flash) {
        flash.classList.add('active');
        setTimeout(() => flash.classList.remove('active'), 500);
    }

    // Shake Effect
    if (container) {
        container.classList.add('impact-shake');
        setTimeout(() => container.classList.remove('impact-shake'), 600);
    }
}

function enterSite() {
    var entryScreen = document.getElementById('entry-screen');
    var helloScreen = document.getElementById('hello-screen');

    // Play Hello Voice
    var helloVoice = document.getElementById('hello-voice');
    if (helloVoice) {
        helloVoice.currentTime = 0;
        helloVoice.play().catch(e => console.log(e));
    }

    entryScreen.style.opacity = '0';
    setTimeout(() => entryScreen.style.display = 'none', 400);

    helloScreen.style.display = 'flex';
    setTimeout(() => helloScreen.classList.add('visible'), 50);

    // Set Data for Now Playing Scene
    const currentSong = playlist[currentSongIndex];
    document.getElementById('np-disc').src = currentSong.cover;

    const npTitle = document.getElementById('np-title');
    const npArtist = document.getElementById('np-artist');
    npTitle.innerText = currentSong.title;
    npArtist.innerText = currentSong.artist;

    setTimeout(function () {
        helloScreen.classList.remove('visible');
        helloScreen.classList.add('fade-out');

        const readyVoice = document.getElementById('ready-voice-2');
        if (readyVoice) {
            readyVoice.currentTime = 0;
            readyVoice.play().catch(e => console.log("Voice failed to play: ", e));
        }

        setTimeout(() => {
            var responseScreen = document.getElementById('response-screen');
            responseScreen.style.display = 'flex';
            void responseScreen.offsetWidth;
            responseScreen.classList.add('visible');
        }, 800);
    }, 1100);
}

function startDashboardSequence() {
    var npScreen = document.getElementById('now-playing-screen');
    var container = document.getElementById('main-container');
    var musicPlayer = document.getElementById('music-player');
    var controls = document.getElementById('bottom-right-controls');
    var helloScreen = document.getElementById('hello-screen');
    var video = document.querySelector('.bg-video');

    npScreen.style.display = 'flex';
    void npScreen.offsetWidth;
    npScreen.classList.add('active');

    setTimeout(function () {
        setTimeout(function () {
            npScreen.classList.add('exit');

            setTimeout(function () {
                npScreen.style.display = 'none';

                var connectedScreen = document.getElementById('connected-screen');
                connectedScreen.style.display = 'flex';
                void connectedScreen.offsetWidth;
                connectedScreen.classList.add('visible');

                var dingSound = document.getElementById('ding-sound');
                if (dingSound) dingSound.play().catch(e => console.log(e));

                setTimeout(function () {
                    connectedScreen.style.opacity = '0';

                    setTimeout(function () {
                        connectedScreen.style.display = 'none';

                        var welcomeScreen = document.getElementById('welcome-screen');
                        welcomeScreen.style.display = 'flex';
                        void welcomeScreen.offsetWidth;
                        welcomeScreen.classList.add('visible');

                        var welcomeVoice = document.getElementById('welcome-voice');
                        if (welcomeVoice) {
                            welcomeVoice.currentTime = 0;
                            welcomeVoice.play().catch(e => console.log(e));
                        }

                        setTimeout(function () {
                            welcomeScreen.style.opacity = '0';

                            setTimeout(function () {
                                welcomeScreen.style.display = 'none';
                                helloScreen.style.display = 'none';

                                container.style.display = 'flex';
                                container.classList.add('loaded');

                                triggerImpact();

                                if (video) {
                                    video.style.opacity = '1';
                                    video.play();
                                }

                                musicPlayer.style.display = 'flex';
                                loadSong(currentSongIndex);

                                controls.style.display = 'flex';
                                controls.classList.add('visible');

                                setTimeout(typeWriter, 1200);

                                var audio = document.getElementById('bg-music');
                                if (audio) {
                                    audio.play().catch(e => console.log("Auto-play ditahan"));
                                    document.getElementById('play-icon').style.display = 'none';
                                    document.getElementById('pause-icon').style.display = 'block';
                                    var albumArt = document.getElementById('album-art');
                                    if (albumArt) albumArt.style.animationPlayState = 'running';
                                }
                                
                                setTimeout(() => {
                                    dashboardActive = true;
                                }, 1000);
                            }, 600);
                        }, 1200);
                    }, 400);
                }, 1200);
            }, 800);
        }, 800);
    }, 2500);
}

function toggleZenMode() {
    var card = document.getElementById('main-container');
    var musicPlayer = document.getElementById('music-player');
    var controls = document.getElementById('bottom-right-controls');

    if (card.classList.contains('hidden')) {
        card.classList.remove('hidden');
        card.classList.add('loaded');
        musicPlayer.classList.remove('zen', 'music-player-zen-no-card');
        controls.classList.remove('zen');
    } else {
        card.classList.remove('loaded');
        card.classList.add('hidden');
        musicPlayer.classList.add('zen');
        controls.classList.add('zen');
    }
}

// --- Interactive Zen Mode (Long Press 3s) ---
let holdTriggerTimer, zenTimer;
let isZenHolding = false;
const zenIndicator = document.getElementById('zen-hold-indicator');

function startZenHold(e) {
    if (!dashboardActive) return; 
    
    if (e.target.closest('a, button, .ttt-cell, canvas, .link-card, .music-player, .player-controls, .progress-container')) return;

    if (!isZenHolding) {
        isZenHolding = true;

        holdTriggerTimer = setTimeout(() => {
            if (isZenHolding) {
                const isCurrentlyZen = document.getElementById('main-container').classList.contains('hidden');
                const textEl = zenIndicator.querySelector('.zen-text');
                if (textEl) {
                    textEl.innerText = isCurrentlyZen ? "ZEN: OFF" : "ZEN: ON";
                }
                
                zenIndicator.classList.add('active');

                zenTimer = setTimeout(() => {
                    if (isZenHolding) {
                        toggleZenMode();
                        cancelZenHold();
                        if (navigator.vibrate) navigator.vibrate(60); 
                    }
                }, 2000);
            }
        }, 1000);
    }
}

function cancelZenHold() {
    clearTimeout(holdTriggerTimer);
    clearTimeout(zenTimer);
    isZenHolding = false;
    zenIndicator.classList.remove('active');
}

document.addEventListener('touchstart', startZenHold, { passive: true });
document.addEventListener('mousedown', startZenHold);

document.addEventListener('touchend', cancelZenHold);
document.addEventListener('mouseup', cancelZenHold);

document.addEventListener('touchmove', cancelZenHold, { passive: true });
document.addEventListener('mousemove', (e) => {
    if (isZenHolding && (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5)) {
        cancelZenHold();
    }
});

window.oncontextmenu = function(event) {
    if (isZenHolding) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
};
