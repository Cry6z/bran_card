// --- Playlist Database (Single Playlist) ---
const playlist = [
    { title: "Late Night Drive", artist: "ADTurnUp", src: "music/latenightdrive.mp3", cover: "disk/latenightdrive.png" },
    { title: "Midnight Club", artist: "ADTurnUp", src: "music/midnightclub.mp3", cover: "disk/midnightclub.png" },
    { title: "9PM In LA", artist: "ADTurnUp", src: "music/9pmla.mp3", cover: "disk/9pmla.png" },
    { title: "stargirl", artist: "ADTurnUp", src: "music/stargirl.mp3", cover: "disk/stargirl.png" },
    { title: "IN THE DARKNESS", artist: "DXSTINY, HOOL", src: "music/inthedarkness.mp3", cover: "disk/inthedarkness.png" }
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

function updateProgress() {
    var audio = document.getElementById('bg-music');
    var progressBar = document.getElementById('progress-bar');
    var currentTimeEl = document.getElementById('current-time');

    if (audio.duration) {
        var progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
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
    progressBar.style.setProperty('--progress', `${percent}%`);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    var min = Math.floor(seconds / 60);
    var sec = Math.floor(seconds % 60);
    if (sec < 10) sec = '0' + sec;
    return min + ':' + sec;
}
