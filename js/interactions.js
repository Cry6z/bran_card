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

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentQuote.length) {
        typeSpeed = 4000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

// --- Fitur Swipe/Drag pada Foto Profil ---
const profileCard = document.getElementById('profile-card');
let cardStartX = 0;
let isCardDragging = false;

if (profileCard) {
    profileCard.addEventListener('mousedown', (e) => {
        cardStartX = e.clientX;
        isCardDragging = true;
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
}

function handleCardPhysics(start, end, targetElem) {
    const swipeDistance = Math.abs(end - start);

    if (swipeDistance > 20) {
        profileCard.classList.toggle('flipped');
    } else if (targetElem.tagName === 'IMG') {
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
        if (previewSrc && previewSrc.trim() !== "") {
            previewImg.src = previewSrc;
            previewBox.style.left = (e.clientX + 15) + 'px';
            previewBox.style.top = (e.clientY + 15) + 'px';
            previewBox.classList.add('visible');
        }
    });

    link.addEventListener('mousemove', (e) => {
        if (previewBox.classList.contains('visible')) {
            previewBox.style.left = (e.clientX + 15) + 'px';
            previewBox.style.top = (e.clientY + 15) + 'px';
        }
    });

    link.addEventListener('mouseleave', () => {
        previewBox.classList.remove('visible');
        setTimeout(() => {
            if (!previewBox.classList.contains('visible')) {
                previewImg.src = '';
            }
        }, 200);
    });
});
