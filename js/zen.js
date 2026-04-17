let dashboardActive = false;
let holdTriggerTimer, zenTimer;
let isZenHolding = false;
const zenIndicator = document.getElementById('zen-hold-indicator');

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

function startZenHold(e) {
    if (!dashboardActive) return; 
    
    // Ignore if clicking interactive elements
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

// Event Listeners for Zen Mode
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
