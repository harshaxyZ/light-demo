const products = [
    { id: 1, title: "Lumina Grand Chandelier", price: 68999, originalPrice: 84990 },
    { id: 2, title: "Aura Crystal Pendant", price: 34500, originalPrice: 42000 },
    { id: 3, title: "Eclipse Modern Ring", price: 52999, originalPrice: 65000 },
    { id: 4, title: "Vortex Spiral Light", price: 74900, originalPrice: 89900 },
    { id: 5, title: "Stellar Glass Orb", price: 28500, originalPrice: 35990 },
    { id: 6, title: "Nebula Wave Fixture", price: 47999, originalPrice: 58000 },
    { id: 7, title: "Zenith Minimalist Bar", price: 21500, originalPrice: 26900 },
    { id: 8, title: "Oracle Dome Chandelier", price: 59999, originalPrice: 72500 }
];

const grid = document.getElementById('product-grid');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const overlay = document.getElementById('transition-overlay');
const overlayText = document.getElementById('overlay-text');

let isNight = false;
let isTransitioning = false;
let allImagesLoaded = false;

// Preload ALL 16 images and resolve when fully decoded
function preloadImages() {
    const promises = [];
    for (let i = 1; i <= 8; i++) {
        const dayImg = new Image();
        dayImg.src = `images-optimized/day/day-image${i}.webp`;
        promises.push(dayImg.decode ? dayImg.decode().catch(() => {}) : Promise.resolve());

        const nightImg = new Image();
        nightImg.src = `images-optimized/night/night-image${i}.webp`;
        promises.push(nightImg.decode ? nightImg.decode().catch(() => {}) : Promise.resolve());
    }
    return Promise.all(promises).then(() => { allImagesLoaded = true; });
}

// Build DOM once
function initGrid() {
    const fragment = document.createDocumentFragment();
    products.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="image-container">
                <img src="images-optimized/day/day-image${p.id}.webp" class="product-image image-day" alt="${p.title} - Day View" loading="eager" decoding="async">
                <img src="images-optimized/night/night-image${p.id}.webp" class="product-image image-night" alt="${p.title} - Night View" loading="eager" decoding="async">
            </div>
            <div class="card-content">
                <h3 class="product-title">${p.title}</h3>
                <div class="price-container">
                    <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
                    <span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });
    grid.appendChild(fragment);
}

// Use requestAnimationFrame for buttery scheduling
function raf() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showOverlayText(text, duration) {
    overlayText.textContent = text;
    await raf();
    overlayText.classList.add('visible');
    await wait(duration);
    overlayText.classList.remove('visible');
    await wait(120);
}

function switchCard(card, mode) {
    // Toggle image crossfade class
    if (mode === 'night') {
        card.classList.add('is-night');
    } else {
        card.classList.remove('is-night');
    }
    // Trigger scale pulse animation (pure CSS, no inline styles)
    card.classList.remove('switching');
    // Force reflow to restart animation (single read — negligible cost for 1 element)
    void card.offsetWidth;
    card.classList.add('switching');
}

async function handleThemeToggle() {
    if (isTransitioning) return;
    isTransitioning = true;

    const cards = document.querySelectorAll('.product-card');
    isNight = !isNight;

    if (isNight) {
        // --- NIGHT MODE ---
        overlay.classList.add('active');
        body.classList.add('night-mode');

        // Text 1 + Row 1 cards (staggered 100ms apart)
        const t1 = showOverlayText("Switching to Night Mode…", 800);
        for (let i = 0; i < 4; i++) {
            setTimeout(() => switchCard(cards[i], 'night'), i * 100);
        }
        await t1;

        // Text 2 + Row 2 cards
        const t2 = showOverlayText("See how each light comes alive", 800);
        for (let i = 4; i < 8; i++) {
            setTimeout(() => switchCard(cards[i], 'night'), (i - 4) * 100);
        }
        await t2;

        // Text 3 — pure reveal moment
        await showOverlayText("Real lighting. Real ambience.", 800);

        overlay.classList.remove('active');
        isTransitioning = false;

    } else {
        // --- DAY MODE (faster reverse) ---
        overlay.classList.add('active');
        body.classList.remove('night-mode');

        const t1 = showOverlayText("Back to Daylight", 900);
        // All 8 cards rapid fire
        for (let i = 0; i < 8; i++) {
            setTimeout(() => switchCard(cards[i], 'day'), i * 50);
        }
        await t1;

        overlay.classList.remove('active');
        isTransitioning = false;
    }
}

themeToggle.addEventListener('click', handleThemeToggle);

// Init — preload then render
preloadImages();
initGrid();
