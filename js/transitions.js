let responseSelected = false;

function selectResponse(response) {
    if (responseSelected) return;
    responseSelected = true;

    const responseScreen = document.getElementById('response-screen');
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

    setTimeout(startDashboardSequence, 1200);
}

function enterSite() {
    var entryScreen = document.getElementById('entry-screen');
    var helloScreen = document.getElementById('hello-screen');

    var helloVoice = document.getElementById('hello-voice');
    if (helloVoice) {
        helloVoice.currentTime = 0;
        helloVoice.play().catch(e => console.log(e));
    }

    entryScreen.style.opacity = '0';
    setTimeout(() => entryScreen.style.display = 'none', 400);

    helloScreen.style.display = 'flex';
    setTimeout(() => helloScreen.classList.add('visible'), 50);

    // Sync Now Playing preview
    const currentSong = shuffledPlaylist[currentSongIndex];
    document.getElementById('np-disc').src = currentSong.cover;
    document.getElementById('np-title').innerText = currentSong.title;
    document.getElementById('np-artist').innerText = currentSong.artist;

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
                                    audio.play().catch(e => console.log("Auto-play blocked"));
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
