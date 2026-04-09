let responseSelected = false; // Flag to prevent multiple clicks
let dashboardActive = false; // Zen Mode only allowed when this is true

function selectResponse(response) {
    if (responseSelected) return; // Prevent spamming
    responseSelected = true;

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
                                    var albumArt = document.getElementById('album-art');
                                    if (albumArt) albumArt.style.animationPlayState = 'running';
                                }
                                
                                // Enable Zen Mode after 1 second delay
                                setTimeout(() => {
                                    dashboardActive = true;
                                }, 1000);
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
    var controls = document.getElementById('bottom-right-controls');

    if (card.classList.contains('hidden')) {
        // Matikan Zen Mode (Kembali Normal)
        card.classList.remove('hidden');
        card.classList.add('loaded');
        musicPlayer.classList.remove('zen', 'music-player-zen-no-card');
        controls.classList.remove('zen');
    } else {
        // Aktifkan Zen Mode
        card.classList.remove('loaded');
        card.classList.add('hidden');
        musicPlayer.classList.add('zen');
        controls.classList.add('zen');
    }
}

// --- Fitur Typewriter Quotes ---
const quotes = [
    '"ingfokan mabar bareng"',
    '"aku nak mabar bareng"',
    '"hey kamu! ya, kamu keren!"',
    '"follow ig aku dawg"',
    '"when yh.... when when...."',
    '"stop jomok!"',
    '"skill issue"'
];

let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentQuote = quotes[quoteIndex];
    const quoteElements = document.querySelectorAll('.quote-text');
    if (quoteElements.length === 0) return;

    let textValue;
    if (isDeleting) {
        textValue = currentQuote.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textValue = currentQuote.substring(0, charIndex + 1);
        charIndex++;
    }

    quoteElements.forEach(el => {
        el.innerText = textValue;
    });

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

// --- MINI GAMES LOGIC ---

const gamesOverlay = document.getElementById('games-overlay');
const gamesBtn = document.getElementById('games-btn');

if (gamesBtn) {
    gamesBtn.onclick = openGames;
}

function openGames() {
    gamesOverlay.style.display = 'flex';
    setTimeout(() => gamesOverlay.classList.add('visible'), 10);
    resetTTT();
}

function closeGames() {
    gamesOverlay.classList.remove('visible');
    setTimeout(() => {
        gamesOverlay.style.display = 'none';
        stopSnake();
    }, 400);
}

function switchGame(gameId) {
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update content
    document.querySelectorAll('.game-content').forEach(content => content.classList.remove('active'));
    document.getElementById('game-' + gameId).classList.add('active');

    // Initialize game
    if (gameId === 'tictactoe') resetTTT();
    if (gameId === 'snake') resetSnake();
    if (gameId === 'chess') resetChess();

    if (gameId !== 'snake') stopSnake();
}

// --- TIC TAC TOE ---
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttActive = true;
let tttPlayer = 'X';
let tttDifficulty = 'easy';
let chessDifficulty = 'medium';

function toggleTTTDropdown() {
    document.getElementById('ttt-difficulty-container').classList.toggle('active');
    const chessCont = document.getElementById('chess-difficulty-container');
    if (chessCont) chessCont.classList.remove('active');
}

function changeTTTDifficulty(value, label) {
    tttDifficulty = value;
    document.getElementById('ttt-difficulty-label').innerText = label;
    document.getElementById('ttt-difficulty-container').classList.remove('active');
    resetTTT();
}

function toggleChessDropdown() {
    document.getElementById('chess-difficulty-container').classList.toggle('active');
    const tttCont = document.getElementById('ttt-difficulty-container');
    if (tttCont) tttCont.classList.remove('active');
}

function changeChessDifficulty(value, label) {
    chessDifficulty = value;
    document.getElementById('chess-difficulty-label').innerText = label;
    document.getElementById('chess-difficulty-container').classList.remove('active');
    resetChess();
}

// Close dropdowns when clicking outside
window.addEventListener('click', function (e) {
    const tttContainer = document.getElementById('ttt-difficulty-container');
    if (tttContainer && !tttContainer.contains(e.target)) {
        tttContainer.classList.remove('active');
    }
    const chessContainer = document.getElementById('chess-difficulty-container');
    if (chessContainer && !chessContainer.contains(e.target)) {
        chessContainer.classList.remove('active');
    }
});

function resetTTT() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttActive = true;
    tttPlayer = 'X';
    document.getElementById('ttt-status').innerText = "Your Turn";
    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach(cell => {
        cell.className = 'ttt-cell';
        cell.onclick = (e) => tttClick(parseInt(e.target.dataset.index));
    });
}

function tttClick(index) {
    if (!tttActive || tttBoard[index] !== '') return;

    makeMove(index, 'X');
    if (tttActive) {
        document.getElementById('ttt-status').innerText = "AI is thinking...";
        setTimeout(tttAI, 400);
    }
}

function makeMove(index, player) {
    tttBoard[index] = player;
    const cell = document.querySelector(`.ttt-cell[data-index="${index}"]`);
    cell.classList.add(player.toLowerCase() + '-marker');

    if (checkWin(tttBoard)) {
        document.getElementById('ttt-status').innerText = (player === 'X' ? "You win!" : "AI wins!");
        tttActive = false;
    } else if (tttBoard.every(c => c !== '')) {
        document.getElementById('ttt-status').innerText = "It's a draw!";
        tttActive = false;
    } else {
        tttPlayer = (player === 'X' ? 'O' : 'X');
        document.getElementById('ttt-status').innerText = (tttPlayer === 'X' ? "Your Turn" : "AI Turn");
    }
}

function tttAI() {
    if (!tttActive) return;
    let move;

    if (tttDifficulty === 'easy') {
        move = getRandomMove();
    } else if (tttDifficulty === 'medium') {
        move = getMediumMove();
    } else {
        move = getHardMove();
    }

    if (move !== undefined) makeMove(move, 'O');
}


function getRandomMove() {
    let available = tttBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
}

function getMediumMove() {
    // 1. Try to win
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            if (checkWin(tttBoard)) { tttBoard[i] = ''; return i; }
            tttBoard[i] = '';
        }
    }
    // 2. Try to block
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'X';
            if (checkWin(tttBoard)) { tttBoard[i] = ''; return i; }
            tttBoard[i] = '';
        }
    }
    return getRandomMove();
}

function getHardMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            let score = tttMinimax(tttBoard, 0, false);
            tttBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function checkWinPlayer(board, player) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(w => board[w[0]] === player && board[w[1]] === player && board[w[2]] === player);
}

function tttMinimax(board, depth, isMaximizing) {
    if (checkWinPlayer(board, 'O')) return 10 - depth;
    if (checkWinPlayer(board, 'X')) return depth - 10;
    if (board.every(c => c !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = tttMinimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = tttMinimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(board) {
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return wins.some(w => board[w[0]] && board[w[0]] === board[w[1]] && board[w[0]] === board[w[2]]);
}

// --- SNAKE ---
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
let food = {};
let score = 0;
let snakeDir;
let snakeTimer;

function resetSnake() {
    stopSnake();
    snake = [{ x: 9 * box, y: 10 * box }];
    food = {
        x: Math.floor(Math.random() * 14 + 1) * box,
        y: Math.floor(Math.random() * 14 + 1) * box
    };
    score = 0;
    snakeDir = null;
    document.getElementById('snake-score').innerText = "Score: 0";
    drawSnake();
}

function startSnake() {
    resetSnake();
    snakeDir = "RIGHT";
    if (snakeTimer) clearInterval(snakeTimer);
    snakeTimer = setInterval(updateSnake, 150);

    document.addEventListener('keydown', direction);

    // Swipe Controls
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    canvas.addEventListener('touchend', function (e) {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;

        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30 && snakeDir != "LEFT") snakeDir = "RIGHT";
            else if (dx < -30 && snakeDir != "RIGHT") snakeDir = "LEFT";
        } else {
            if (dy > 30 && snakeDir != "UP") snakeDir = "DOWN";
            else if (dy < -30 && snakeDir != "DOWN") snakeDir = "UP";
        }
    }, { passive: false });

    // Prevent scrolling when swiping on game
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });
}

function stopSnake() {
    if (snakeTimer) clearInterval(snakeTimer);
    document.removeEventListener('keydown', direction);
}

function direction(event) {
    const key = event.keyCode;
    const char = String.fromCharCode(key).toUpperCase();

    if ((key == 37 || char == 'A') && snakeDir != "RIGHT") snakeDir = "LEFT";
    else if ((key == 38 || char == 'W') && snakeDir != "DOWN") snakeDir = "UP";
    else if ((key == 39 || char == 'D') && snakeDir != "LEFT") snakeDir = "RIGHT";
    else if ((key == 40 || char == 'S') && snakeDir != "UP") snakeDir = "DOWN";
}

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#fff" : "rgba(255,255,255,0.5)";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff4444";
    ctx.fillRect(food.x, food.y, box, box);
}

function updateSnake() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeDir == "LEFT") snakeX -= box;
    if (snakeDir == "UP") snakeY -= box;
    if (snakeDir == "RIGHT") snakeX += box;
    if (snakeDir == "DOWN") snakeY += box;

    // Collision with food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        document.getElementById('snake-score').innerText = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 14 + 1) * box,
            y: Math.floor(Math.random() * 14 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over conditions
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(snakeTimer);
        document.getElementById('snake-score').innerText = "Game Over! Score: " + score;
        return;
    }

    snake.unshift(newHead);
    drawSnake();
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

// --- CHESS ---
let chessBoard = [];
let selectedSquare = null;
let chessTurn = 'white';
let chessGameActive = true;

const pieces = {
    'white': { 'p': '♙', 'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔' },
    'black': { 'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚' }
};

const pieceValues = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900 };

function resetChess() {
    chessBoard = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];
    chessTurn = 'white';
    selectedSquare = null;
    chessGameActive = true;
    renderChess();
}

function renderChess() {
    const boardEl = document.getElementById('chess-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    
    let whiteInCheck = isKingInCheck('w', chessBoard);
    let blackInCheck = isKingInCheck('b', chessBoard);
    
    if (chessGameActive) {
        let currentMoves = getAllMoves(chessTurn, chessBoard);
        if (currentMoves.length === 0) {
            chessGameActive = false;
            let inCheck = (chessTurn === 'white' && whiteInCheck) || (chessTurn === 'black' && blackInCheck);
            document.getElementById('chess-status').innerText = inCheck ? (chessTurn === 'white' ? "Checkmate! AI Wins!" : "Checkmate! You Win!") : "Stalemate!";
        } else {
            let inCheck = (chessTurn === 'white' && whiteInCheck) || (chessTurn === 'black' && blackInCheck);
            document.getElementById('chess-status').innerText = inCheck ? "CHECK! " + (chessTurn === 'white' ? "Your Turn" : "AI Turn") : (chessTurn === 'white' ? "Your Turn" : "AI Turn");
        }
    }

    const validMoves = selectedSquare ? getValidMoves(selectedSquare.r, selectedSquare.c) : [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;

            const isValidMove = validMoves.some(m => m.r === r && m.c === c);
            if (isValidMove) square.classList.add('valid-move');

            const piece = chessBoard[r][c];
            if (piece) {
                const pieceEl = document.createElement('span');
                pieceEl.className = 'chess-piece';
                pieceEl.innerText = pieces[piece[0] === 'w' ? 'white' : 'black'][piece[1]];
                
                if (piece === 'wk' && whiteInCheck) square.style.backgroundColor = 'rgba(255, 60, 60, 0.7)';
                if (piece === 'bk' && blackInCheck) square.style.backgroundColor = 'rgba(255, 60, 60, 0.7)';
                
                square.appendChild(pieceEl);
            }

            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                square.classList.add('selected');
            }

            square.onclick = () => chessClick(r, c);
            boardEl.appendChild(square);
        }
    }
}

function chessClick(r, c) {
    if (!chessGameActive || chessTurn !== 'white') return;

    const clickedPiece = chessBoard[r][c];
    const validMoves = selectedSquare ? getValidMoves(selectedSquare.r, selectedSquare.c) : [];
    const isValidMove = validMoves.some(m => m.r === r && m.c === c);

    if (isValidMove) {
        executeMove(selectedSquare.r, selectedSquare.c, r, c);
        selectedSquare = null;
        setTimeout(chessAI, 600);
    } else if (clickedPiece && clickedPiece[0] === 'w') {
        selectedSquare = { r, c };
    } else {
        selectedSquare = null;
    }
    renderChess();
}

function executeMove(fromR, fromC, toR, toC) {
    chessBoard[toR][toC] = chessBoard[fromR][fromC];
    chessBoard[fromR][fromC] = '';
    chessTurn = (chessTurn === 'white' ? 'black' : 'white');
}

function getLegalMoves(r, c, b = chessBoard) {
    const piece = b[r][c];
    if (!piece) return [];
    const type = piece[1];
    const color = piece[0];
    const moves = [];

    // Simplified directions
    const dirs = {
        'r': [[0, 1], [0, -1], [1, 0], [-1, 0]],
        'b': [[1, 1], [1, -1], [-1, 1], [-1, -1]],
        'q': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        'k': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        'n': [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]]
    };

    if (type === 'p') {
        const forward = (color === 'w' ? -1 : 1);
        if (r + forward >= 0 && r + forward < 8 && b[r + forward][c] === '') {
            moves.push({ r: r + forward, c: c });
            // Double move
            if ((color === 'w' && r === 6) || (color === 'b' && r === 1)) {
                if (b[r + forward][c] === '' && b[r + 2 * forward][c] === '') moves.push({ r: r + 2 * forward, c: c });
            }
        }
        // Captures
        [[forward, 1], [forward, -1]].forEach(d => {
            const nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                const target = b[nr][nc];
                if (target !== '' && target[0] !== color) moves.push({ r: nr, c: nc });
            }
        });
    } else if (dirs[type]) {
        const limit = (type === 'k' || type === 'n' ? 1 : 8);
        dirs[type].forEach(d => {
            for (let i = 1; i <= limit; i++) {
                const nr = r + d[0] * i, nc = c + d[1] * i;
                if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
                const target = b[nr][nc];
                if (target === '') {
                    moves.push({ r: nr, c: nc });
                } else {
                    if (target[0] !== color) moves.push({ r: nr, c: nc });
                    break;
                }
            }
        });
    }
    return moves;
}

function getValidMoves(r, c, b = chessBoard) {
    const moves = getLegalMoves(r, c, b);
    const validMoves = [];
    const color = b[r][c][0];
    for (let m of moves) {
        let tempBoard = copyBoard(b);
        tempBoard[m.r][m.c] = tempBoard[r][c];
        tempBoard[r][c] = '';
        if (!isKingInCheck(color, tempBoard)) validMoves.push(m);
    }
    return validMoves;
}

function isKingInCheck(color, b = chessBoard) {
    let kr = -1, kc = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c] === color + 'k') { kr = r; kc = c; break; }
        }
        if (kr !== -1) break;
    }
    if (kr === -1) return false;
    let opp = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c].startsWith(opp)) {
                let moves = getLegalMoves(r, c, b);
                if (moves.some(m => m.r === kr && m.c === kc)) return true;
            }
        }
    }
    return false;
}

function chessAI() {
    if (!chessGameActive || chessTurn !== 'black') return;

    let allMoves = getAllMoves('black', chessBoard);
    if (allMoves.length === 0) return;

    let bestMove = null;

    if (chessDifficulty === 'easy') {
        // Easy: Random move, but try to capture if possible
        let captures = allMoves.filter(m => chessBoard[m.to.r][m.to.c] !== '');
        if (captures.length > 0 && Math.random() > 0.5) {
            bestMove = captures[Math.floor(Math.random() * captures.length)];
        } else {
            bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        }
    } else if (chessDifficulty === 'medium') {
        // Medium: Minimax depth 2
        let bestScore = -Infinity;
        for (let m of allMoves) {
            let tempBoard = copyBoard(chessBoard);
            applyMove(tempBoard, m);
            let score = chessMinimax(tempBoard, 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }
    } else {
        // Hard: Minimax depth 3 with alpha-beta pruning
        let bestScore = -Infinity;
        // Sort moves to improve alpha-beta pruning efficiency
        allMoves.sort((a, b) => {
            let valA = chessBoard[a.to.r][a.to.c] ? pieceValues[chessBoard[a.to.r][a.to.c][1]] : 0;
            let valB = chessBoard[b.to.r][b.to.c] ? pieceValues[chessBoard[b.to.r][b.to.c][1]] : 0;
            return valB - valA;
        });

        for (let m of allMoves) {
            let tempBoard = copyBoard(chessBoard);
            applyMove(tempBoard, m);
            let score = chessMinimax(tempBoard, 2, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }
    }

    // Fallback if no move found (shouldn't happen unless checkmate)
    if (!bestMove && allMoves.length > 0) bestMove = allMoves[0];

    if (bestMove) {
        executeMove(bestMove.from.r, bestMove.from.c, bestMove.to.r, bestMove.to.c);
        renderChess(); // Re-render handles game over checks
    }
}

function chessMinimax(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0) return evaluateBoard(board);

    let moves = getAllMoves(isMaximizing ? 'black' : 'white', board);
    if (moves.length === 0) {
        // Evaluate checkmate vs stalemate
        let inCheck = isKingInCheck(isMaximizing ? 'b' : 'w', board);
        if (inCheck) {
            return isMaximizing ? -9000 - depth : 9000 + depth; // Prefer faster checkmates
        }
        return 0; // Stalemate
    }

    // Move sorting for alpha-beta efficiency (captures first)
    moves.sort((a, b) => {
        let valA = board[a.to.r][a.to.c] ? pieceValues[board[a.to.r][a.to.c][1]] : 0;
        let valB = board[b.to.r][b.to.c] ? pieceValues[board[b.to.r][b.to.c][1]] : 0;
        return valB - valA;
    });

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let m of moves) {
            let tempBoard = copyBoard(board);
            applyMove(tempBoard, m);
            let ev = chessMinimax(tempBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let m of moves) {
            let tempBoard = copyBoard(board);
            applyMove(tempBoard, m);
            let ev = chessMinimax(tempBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function getAllMoves(color, b) {
    let m = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c].startsWith(color[0])) { getValidMoves(r, c, b).forEach(l => m.push({ from: { r, c }, to: l })); }
        }
    }
    return m;
}

function copyBoard(b) { return b.map(row => [...row]); }
function applyMove(b, m) { b[m.to.r][m.to.c] = b[m.from.r][m.from.c]; b[m.from.r][m.from.c] = ''; }

// Positional bonuses (Piece-Square Tables)
// Simplified to encourage center control and pieces development
const pawnEvalBlack = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const knightEval = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
];

const centerBonus = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 10, 20, 20, 10, 0, -10],
    [-10, 0, 10, 20, 20, 10, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
];

function evaluateBoard(b) {
    let s = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let piece = b[r][c];
            if (piece) {
                let isBlack = piece[0] === 'b';
                let type = piece[1];

                // Material value
                let val = pieceValues[type];

                // Positional value
                if (type === 'p') {
                    // Reverse rows for white pawns
                    let rank = isBlack ? r : 7 - r;
                    val += pawnEvalBlack[rank][c];
                } else if (type === 'n') {
                    val += knightEval[r][c];
                } else {
                    val += centerBonus[r][c]; // Discourage pieces strictly on edge
                }

                s += (isBlack ? val : -val); // AI is black, we want positive score for black
            }
        }
    }
    return s;
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

        // Start a 1-second silent timer before showing the UI
        holdTriggerTimer = setTimeout(() => {
            if (isZenHolding) {
                // Now show the loading UI
                const isCurrentlyZen = document.getElementById('main-container').classList.contains('hidden');
                const textEl = zenIndicator.querySelector('.zen-text');
                if (textEl) {
                    textEl.innerText = isCurrentlyZen ? "ZEN: OFF" : "ZEN: ON";
                }
                
                zenIndicator.classList.add('active');

                // Start the 2-second completion timer
                zenTimer = setTimeout(() => {
                    if (isZenHolding) {
                        toggleZenMode();
                        cancelZenHold();
                        if (navigator.vibrate) navigator.vibrate(60); 
                    }
                }, 2000); // 2 Seconds of visual loading
            }
        }, 1000); // 1 Second of silent hold
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
