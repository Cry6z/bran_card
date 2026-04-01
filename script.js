function selectResponse(response) {
            const responseScreen = document.getElementById('response-screen');
            const fineVoice = document.getElementById('fine-voice');

            // Fade out response screen
            responseScreen.style.opacity = '0';
            setTimeout(() => {
                responseScreen.style.display = 'none';
            }, 800);

            // Play voice response
            if (response === 'fine') {
                // Pilih salah satu dari 3 suara "good" secara acak
                const goodVoices = ['good-voice-1', 'good-voice-2', 'good-voice-3'];
                const selectedGoodVoiceId = goodVoices[Math.floor(Math.random() * goodVoices.length)];
                const selectedGoodVoice = document.getElementById(selectedGoodVoiceId);

                if (selectedGoodVoice) {
                    selectedGoodVoice.currentTime = 0;
                    selectedGoodVoice.play().catch(e => console.log(e));
                }
            } else if (response === 'bad') {
                // Pilih salah satu dari 3 suara "bad" secara acak
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

        function toggleZoom(src) {
            var lightbox = document.getElementById('lightbox');
            var lightboxImg = document.getElementById('lightbox-img');

            if (typeof src === 'string') {
                lightboxImg.src = src;
                lightbox.classList.add('active');
            } else {
                lightbox.classList.remove('active');
            }
        }

        // --- Playlist Database (Single Playlist) ---
        const playlist = [
            { title: "Late Night Drive", artist: "ADTurnUp", src: "music/latenightdrive.mp3", cover: "disk/latenightdrive.png" },
            { title: "Midnight Club", artist: "ADTurnUp", src: "music/midnightclub.mp3", cover: "disk/midnightclub.png" },
            { title: "9PM In LA", artist: "ADTurnUp", src: "music/9pmla.mp3", cover: "disk/9pmla.png" },
            { title: "stargirl", artist: "ADTurnUp", src: "music/stargirl.mp3", cover: "disk/stargirl.png" }
        ];

        let currentSongIndex = Math.floor(Math.random() * playlist.length);

        function loadSong(index) {
            var audio = document.getElementById('bg-music');
            var albumArt = document.getElementById('album-art');
            var songTitleContainer = document.querySelector('.song-title');
            var songTitleSpan = songTitleContainer.querySelector('span');

            const title = playlist[index].title;

            // Metadata Update
            songTitleSpan.innerText = title;
            document.querySelector('.song-artist').innerText = playlist[index].artist;
            albumArt.src = playlist[index].cover;

            // Reset Marquee
            songTitleContainer.classList.remove('marquee');
            songTitleSpan.innerHTML = title;

            // Kita tunggu sejenak agar browser memproses perubahan teks sebelum dihitung lebarnya
            setTimeout(() => {
                const textWidth = songTitleSpan.offsetWidth;
                const containerWidth = songTitleContainer.offsetWidth;

                if (textWidth > containerWidth) {
                    const pixelsPerSecond = 22; // Pelan (sesuai request)
                    const overflow = textWidth - containerWidth;
                    const scrollDuration = textWidth / pixelsPerSecond;

                    // Karena scrolling berlangsung di persentase 15% - 75% (total 60% dari durasi)
                    const totalDuration = scrollDuration / 0.6;

                    // Simpan variabel jarak geser tepat di ujung teks (untuk stop di "slowed")
                    songTitleSpan.style.setProperty('--scroll-distance', `-${overflow + 2}px`);
                    songTitleContainer.style.setProperty('--marquee-duration', `${totalDuration}s`);
                    songTitleContainer.classList.add('marquee');
                }
            }, 50);

            var isPlaying = !audio.paused && audio.currentTime > 0;
            audio.src = playlist[index].src;

            if (isPlaying) {
                audio.play();
            }
        }


        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(currentSongIndex);

            var audio = document.getElementById('bg-music');
            var isPlaying = document.getElementById('pause-icon').style.display === 'block';
            if (isPlaying) audio.play();
        }

        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(currentSongIndex);

            var audio = document.getElementById('bg-music');
            var isPlaying = document.getElementById('pause-icon').style.display === 'block';
            if (isPlaying) audio.play();
        }

        function enterSite() {
            var entryScreen = document.getElementById('entry-screen');
            var helloScreen = document.getElementById('hello-screen');
            var npScreen = document.getElementById('now-playing-screen');
            var container = document.getElementById('main-container');
            var musicPlayer = document.getElementById('music-player');
            var controls = document.getElementById('bottom-right-controls');

            // Play Hello Voice
            var helloVoice = document.getElementById('hello-voice');
            if (helloVoice) {
                helloVoice.currentTime = 0;
                helloVoice.play().catch(e => console.log(e));
            }

            // Start Hello Sequence (No Impact Sound Effect as requested earlier)
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

            // Video akan diputar nanti saat dashboard muncul agar transisi tetap hitam
            var video = document.querySelector('.bg-video');

            // 1. Durasi Hello Screen (Singkat & Elegan)
            setTimeout(function () {
                helloScreen.classList.remove('visible');
                helloScreen.classList.add('fade-out');
                
                // Play Ready Voice (Interaktif "How Are You Today?")
                const readyVoice = document.getElementById('ready-voice-2');
                
                if (readyVoice) {
                    readyVoice.currentTime = 0;
                    readyVoice.play().catch(e => console.log("Voice failed to play: ", e));
                }

                // Tampilkan opsi jawaban (Interaktif)
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

            // 3. Play Now Playing Scene (Bar Filling)
            npScreen.style.display = 'flex';
            void npScreen.offsetWidth;
            npScreen.classList.add('active');

            // 4. Setelah 2.5 detik (Bar Penuh), Berhenti Sejenak Sebelum Pindah ke Scene "you're connected"
            setTimeout(function () {
                // Tahan sejenak bar yang sudah penuh agar terlihat tuntas (800ms)
                setTimeout(function () {
                    // Animasi Keluar untuk Scene Loading
                    npScreen.classList.add('exit');

                    setTimeout(function () {
                        npScreen.style.display = 'none';

                        var connectedScreen = document.getElementById('connected-screen');
                        connectedScreen.style.display = 'flex';
                        void connectedScreen.offsetWidth;
                        connectedScreen.classList.add('visible');

                        // PLAY DING SOUND SAAT TERHUBUNG
                        var dingSound = document.getElementById('ding-sound');
                        if (dingSound) dingSound.play().catch(e => console.log(e));

                        // 5. Setelah 1.2 detik (Scene Connected Selesai), Pindah ke Scene "welcome!"
                        setTimeout(function () {
                            connectedScreen.style.opacity = '0';

                            setTimeout(function () {
                                connectedScreen.style.display = 'none';

                                var welcomeScreen = document.getElementById('welcome-screen');
                                welcomeScreen.style.display = 'flex';
                                void welcomeScreen.offsetWidth;
                                welcomeScreen.classList.add('visible');

                                // Play Welcome Voice
                                var welcomeVoice = document.getElementById('welcome-voice');
                                if (welcomeVoice) {
                                    welcomeVoice.currentTime = 0;
                                    welcomeVoice.play().catch(e => console.log(e));
                                }

                                // 6. Akhirnya masuk Dashboard dari scene "welcome!"
                                setTimeout(function () {
                                    welcomeScreen.style.opacity = '0';

                                    setTimeout(function () {
                                        welcomeScreen.style.display = 'none';
                                        helloScreen.style.display = 'none';

                                // DASHBOARD LOADING
                                container.style.display = 'flex';
                                container.classList.add('loaded');
                                
                                // TRIGGER IMPACT EFFECT
                                triggerImpact();

                                // REVEAL & PLAY VIDEO SEKARANG
                                if (video) {
                                    video.style.opacity = '1';
                                    video.play();
                                }

                                musicPlayer.style.display = 'flex';
                                loadSong(currentSongIndex);

                                controls.style.display = 'flex';
                                controls.classList.add('visible');

                                setTimeout(typeWriter, 1200);

                                // MULAILAH MUSIK UTAMA
                                var audio = document.getElementById('bg-music');
                                if (audio) {
                                    audio.play().catch(e => console.log("Auto-play ditahan"));
                                    document.getElementById('play-icon').style.display = 'none';
                                    document.getElementById('pause-icon').style.display = 'block';
                                    document.getElementById('album-art').style.animationPlayState = 'running';
                                }
                            }, 600); // Waktu memudar scene welcome
                                }, 1200); // Tahan scene welcome selama 1.2 detik
                            }, 400); // Jeda transisi antar scene confirmation
                        }, 1200); // Tahan scene connected selama 1.2 detik
                    }, 800); // Waktu yang diberikan untuk animasi keluar npScreen (800ms sync dengan CSS)
                }, 800); // Pause tambahan (800ms) setelah bar 100%
            }, 2500); // 2.5 detik untuk loading bar
        }


        function togglePlay() {
            var audio = document.getElementById('bg-music');
            var playIcon = document.getElementById('play-icon');
            var pauseIcon = document.getElementById('pause-icon');
            var albumArt = document.getElementById('album-art');

            if (!audio.src || audio.src === window.location.href) {
                loadSong(currentSongIndex);
            }

            if (audio.paused) {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                albumArt.style.animationPlayState = 'running';
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                albumArt.style.animationPlayState = 'paused';
            }
        }

        // --- Fitur Progress Bar Spotify Style ---
        function updateProgress() {
            var audio = document.getElementById('bg-music');
            var progressBar = document.getElementById('progress-bar');
            var currentTimeEl = document.getElementById('current-time');

            if (audio.duration) {
                var progress = (audio.currentTime / audio.duration) * 100;
                progressBar.value = progress;
                // Update fill warna bar progres
                progressBar.style.setProperty('--progress', `${progress}%`);
                currentTimeEl.innerText = formatTime(audio.currentTime);
            }
        }

        function setMetadata() {
            var audio = document.getElementById('bg-music');
            var totalTimeEl = document.getElementById('total-time');
            var progressBar = document.getElementById('progress-bar');
            totalTimeEl.innerText = formatTime(audio.duration);
            progressBar.value = 0;
            progressBar.style.setProperty('--progress', `0%`);
            document.getElementById('current-time').innerText = "0:00";
        }

        function seekAudio() {
            var audio = document.getElementById('bg-music');
            var progressBar = document.getElementById('progress-bar');
            var percent = progressBar.value;
            var seekTime = (percent / 100) * audio.duration;
            audio.currentTime = seekTime;
            // Update fill saat drag manual
            progressBar.style.setProperty('--progress', `${percent}%`);
        }

        function formatTime(seconds) {
            if (isNaN(seconds)) return "0:00";
            var min = Math.floor(seconds / 60);
            var sec = Math.floor(seconds % 60);
            if (sec < 10) sec = '0' + sec;
            return min + ':' + sec;
        }

        function toggleZenMode() {
            var card = document.getElementById('main-container');
            var musicPlayer = document.getElementById('music-player');
            var eyeOpen = document.getElementById('eye-open');
            var eyeClosed = document.getElementById('eye-closed');

            if (card.classList.contains('hidden')) {
                // Matikan Zen Mode (Kembali Normal)
                card.classList.remove('hidden');
                card.classList.add('loaded');
                musicPlayer.classList.remove('zen');
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            } else {
                // Aktifkan Zen Mode
                card.classList.remove('loaded');
                card.classList.add('hidden');
                musicPlayer.classList.add('zen');
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            }
        }

        // --- Fitur Typewriter Quotes ---
        const quotes = [
            '"ingfokan mabar bareng"',
            '"strxdale or tourvillone?"',
            '"hey kamu! ya, kamu keren!"',
            '"aku suka.... eskrim"',
            '"when yh...."',
            '"skill issue btw"'
        ];

        let quoteIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentQuote = quotes[quoteIndex];
            const quoteEl = document.getElementById('quote-text');
            if (!quoteEl) return;

            if (isDeleting) {
                quoteEl.innerText = currentQuote.substring(0, charIndex - 1);
                charIndex--;
            } else {
                quoteEl.innerText = currentQuote.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 30 : 60; // Kecepatan ketikan natural

            if (!isDeleting && charIndex === currentQuote.length) {
                typeSpeed = 4000; // Pause selama 4 detik setelah selesai baca
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                quoteIndex = (quoteIndex + 1) % quotes.length;
                typeSpeed = 500; // Jeda sejenak sebelum ngetik quote baru
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // --- Fitur Swipe/Drag pada Foto Profil ---
        const profileCard = document.getElementById('profile-card');
        let cardStartX = 0;
        let isCardDragging = false;

        profileCard.addEventListener('mousedown', (e) => {
            cardStartX = e.clientX;
            isCardDragging = true;
            // Prevent default drag agar gambar tidak terseret secara native
            e.preventDefault();
        });

        profileCard.addEventListener('mouseup', (e) => {
            if (!isCardDragging) return;
            isCardDragging = false;
            let cardEndX = e.clientX;
            handleCardPhysics(cardStartX, cardEndX, e.target);
        });

        profileCard.addEventListener('touchstart', (e) => {
            cardStartX = e.changedTouches[0].screenX;
            isCardDragging = true;
        });

        profileCard.addEventListener('touchend', (e) => {
            if (!isCardDragging) return;
            isCardDragging = false;
            let cardEndX = e.changedTouches[0].screenX;
            handleCardPhysics(cardStartX, cardEndX, e.target);
        });

        function handleCardPhysics(start, end, targetElem) {
            const swipeDistance = Math.abs(end - start);

            // Jika digeser lebih dari 20px -> MUTER
            if (swipeDistance > 20) {
                profileCard.classList.toggle('flipped');
            }
            // Jika cuma ditekan singkat (klik biasa) -> BUKA LIGHTBOX
            else if (targetElem.tagName === 'IMG') {
                toggleZoom(targetElem.src);
            }
        }

        // --- Fitur Foreshadow (Gambar Preview saat Link di-Hover) ---
        const previewBox = document.getElementById('link-preview');
        const previewImg = document.getElementById('preview-img');
        const linksElems = document.querySelectorAll('.link-card');

        linksElems.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const previewSrc = link.getAttribute('data-preview');
                // Hanya munculkan jika data-preview memiliki file diatur
                if (previewSrc && previewSrc.trim() !== "") {
                    previewImg.src = previewSrc;
                    // INISIALISASI POSISI SEGERA agar kotak tidak terjebak di luar layar
                    previewBox.style.left = (e.clientX + 15) + 'px';
                    previewBox.style.top = (e.clientY + 15) + 'px';
                    previewBox.classList.add('visible');
                }
            });

            link.addEventListener('mousemove', (e) => {
                if (previewBox.classList.contains('visible')) {
                    // Geser kotak preview selalu 15px menghindari tumpukan kursor
                    previewBox.style.left = (e.clientX + 15) + 'px';
                    previewBox.style.top = (e.clientY + 15) + 'px';
                }
            });

            link.addEventListener('mouseleave', () => {
                previewBox.classList.remove('visible');
                // Sembunyikan gambar sesaat setelah transisi memudar (200ms)
                setTimeout(() => {
                    if (!previewBox.classList.contains('visible')) {
                        previewImg.src = '';
                    }
                }, 200);
            });
        });