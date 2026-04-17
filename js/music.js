// --- Playlist Database (Single Playlist) ---
const playlist = [
    { title: "Late Night Drive", artist: "ADTurnUp", src: "music/latenightdrive.mp3", cover: "disk/latenightdrive.png" },
    { title: "Midnight Club", artist: "ADTurnUp", src: "music/midnightclub.mp3", cover: "disk/midnightclub.png" },
    { title: "9PM In LA", artist: "ADTurnUp", src: "music/9pmla.mp3", cover: "disk/9pmla.png" },
    { title: "stargirl", artist: "ADTurnUp", src: "music/stargirl.mp3", cover: "disk/stargirl.png" },
    { title: "IN THE DARKNESS", artist: "DXSTINY, HOOL", src: "music/Inthedarkness.mp3", cover: "disk/inthedarkness.png" }
];

// Shuffle the playlist on each load for variety
let shuffledPlaylist = [...playlist].sort(() => Math.random() - 0.5);
let currentSongIndex = 0;

function loadSong(index) {
    const audio = document.getElementById('bg-music');
    const albumArt = document.getElementById('album-art');
    const songTitleContainer = document.querySelector('.song-title');
    const songTitleSpan = songTitleContainer.querySelector('span');
    const artistNameEl = document.querySelector('.song-artist');

    const song = shuffledPlaylist[index];

    // Update UI
    songTitleSpan.innerText = song.title;
    artistNameEl.innerText = song.artist;
    albumArt.src = song.cover;

    // Reset Marquee for long titles
    songTitleContainer.classList.remove('marquee');
    songTitleSpan.innerHTML = song.title;

    setTimeout(() => {
        const textWidth = songTitleSpan.offsetWidth;
        const containerWidth = songTitleContainer.offsetWidth;

        if (textWidth > containerWidth) {
            const pixelsPerSecond = 22;
            const overflow = textWidth - containerWidth;
            const scrollDuration = textWidth / pixelsPerSecond;
            const totalDuration = scrollDuration / 0.6;

            songTitleSpan.style.setProperty('--scroll-distance', `-${overflow + 2}px`);
            songTitleContainer.style.setProperty('--marquee-duration', `${totalDuration}s`);
            songTitleContainer.classList.add('marquee');
        }
    }, 50);

    // Update source and preserve playing state
    const isPlaying = !audio.paused && audio.currentTime > 0;
    audio.src = song.src;

    if (isPlaying) {
        audio.play().catch(e => console.log("Playback failed:", e));
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % shuffledPlaylist.length;
    loadSong(currentSongIndex);

    const audio = document.getElementById('bg-music');
    const isPlaying = document.getElementById('pause-icon').style.display === 'block';
    if (isPlaying) audio.play().catch(e => console.log(e));
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
    loadSong(currentSongIndex);

    const audio = document.getElementById('bg-music');
    const isPlaying = document.getElementById('pause-icon').style.display === 'block';
    if (isPlaying) audio.play().catch(e => console.log(e));
}

function togglePlay() {
    const audio = document.getElementById('bg-music');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const albumArt = document.getElementById('album-art');

    if (!audio.src || audio.src === window.location.href) {
        loadSong(currentSongIndex);
    }

    if (audio.paused) {
        audio.play().catch(e => console.log("Can't play audio:", e));
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

function updateProgress() {
    const audio = document.getElementById('bg-music');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');

    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        progressBar.style.setProperty('--progress', `${progress}%`);
        currentTimeEl.innerText = formatTime(audio.currentTime);
    }
}

function setMetadata() {
    const audio = document.getElementById('bg-music');
    const totalTimeEl = document.getElementById('total-time');
    const progressBar = document.getElementById('progress-bar');
    
    totalTimeEl.innerText = formatTime(audio.duration);
    progressBar.value = 0;
    progressBar.style.setProperty('--progress', `0%`);
    document.getElementById('current-time').innerText = "0:00";
}

function seekAudio() {
    const audio = document.getElementById('bg-music');
    const progressBar = document.getElementById('progress-bar');
    const percent = progressBar.value;
    const seekTime = (percent / 100) * audio.duration;
    
    audio.currentTime = seekTime;
    progressBar.style.setProperty('--progress', `${percent}%`);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

