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

// Preload images
function preloadImages() {
    for (let i = 1; i <= 8; i++) {
        const day = new Image();
        day.src = `images-optimized/day/day-image${i}.webp`;
        const night = new Image();
        night.src = `images-optimized/night/night-image${i}.webp`;
    }
}

// Inject cards
function initGrid() {
    products.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="image-container">
                <img src="images-optimized/day/day-image${p.id}.webp" class="product-image image-day" alt="${p.title} Day">
                <img src="images-optimized/night/night-image${p.id}.webp" class="product-image image-night" alt="${p.title} Night">
            </div>
            <div class="card-content">
                <h3 class="product-title">${p.title}</h3>
                <div class="price-container">
                    <span class="price-current">₹${p.price.toLocaleString()}</span>
                    <span class="price-original">₹${p.originalPrice.toLocaleString()}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function showOverlayText(text, duration) {
    overlayText.textContent = text;
    overlayText.classList.add('visible');
    await new Promise(r => setTimeout(r, duration));
    overlayText.classList.remove('visible');
    await new Promise(r => setTimeout(r, 150));
}

async function animateCards(startIndex, count, delay, mode) {
    const cards = document.querySelectorAll('.product-card');
    for (let i = 0; i < count; i++) {
        const index = startIndex + i;
        if (cards[index]) {
            const card = cards[index];
            setTimeout(() => {
                if (mode === 'night') {
                    card.classList.add('is-night');
                } else {
                    card.classList.remove('is-night');
                }
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 400);
            }, i * delay);
        }
    }
}

async function handleThemeToggle() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    isNight = !isNight;
    
    if (isNight) {
        overlay.classList.add('active');
        body.classList.remove('day-mode');
        body.classList.add('night-mode');

        // Sync: Row 1 (0-3) during text 1
        const text1 = showOverlayText("Switching to Night Mode…", 900);
        animateCards(0, 4, 120, 'night');
        await text1;

        // Row 2 (4-7) during text 2
        const text2 = showOverlayText("See how each light comes alive", 900);
        animateCards(4, 4, 120, 'night');
        await text2;

        await showOverlayText("Real lighting. Real ambience.", 900);
        
        overlay.classList.remove('active');
        isTransitioning = false;
    } else {
        overlay.classList.add('active');
        body.classList.remove('night-mode');
        body.classList.add('day-mode');

        const text1 = showOverlayText("Back to Daylight", 1000);
        animateCards(0, 8, 60, 'day'); 
        await text1;

        overlay.classList.remove('active');
        isTransitioning = false;
    }
}

themeToggle.addEventListener('click', handleThemeToggle);

// Init
preloadImages();
initGrid();
