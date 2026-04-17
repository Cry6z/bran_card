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
