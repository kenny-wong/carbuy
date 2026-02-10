document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const listingsContainer = document.getElementById('listings-container');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    const mileageRange = document.getElementById('mileage-range');
    const mileageDisplay = document.getElementById('mileage-display');
    const statsBar = document.getElementById('stats-bar');

    // New Filter Elements
    const modelFilter = document.getElementById('model-filter');
    const engineFilter = document.getElementById('engine-filter');
    const sortBy = document.getElementById('sort-by');
    const themeSelect = document.getElementById('theme-select');

    // Theme Logic
    const themes = ['original', 'xo', 'pochacco', 'kuromi', 'hello-kitty'];

    function initTheme() {
        let savedTheme = localStorage.getItem('carbuy-theme');

        if (!savedTheme) {
            // First time visit: Pick random theme
            const randomIndex = Math.floor(Math.random() * themes.length);
            savedTheme = themes[randomIndex];
            localStorage.setItem('carbuy-theme', savedTheme);
        }

        applyTheme(savedTheme);
    }

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        themeSelect.value = theme;
    }

    // Event Listener for Theme
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        applyTheme(selectedTheme);
        localStorage.setItem('carbuy-theme', selectedTheme);
    });

    // Initialize Theme immediately
    initTheme();

    let allCars = [];
    let filteredCars = [];

    // Initialize
    async function init() {
        try {
            const response = await fetch('./autotrader_data.json');
            if (!response.ok) throw new Error('Failed to load vehicle data');

            const rawData = await response.json();
            // Remove unavailable cars immediately
            allCars = rawData.filter(car => car.title !== "Unavailable" && car.price !== null);
            filteredCars = [...allCars];

            // Set max range values based on data
            const maxPrice = Math.max(...allCars.map(c => parsePrice(c.price)).filter(p => p > 0)) + 1000;
            const maxMileage = Math.max(...allCars.map(c => parseMileage(c.mileage)).filter(m => m > 0)) + 5000;

            priceRange.max = maxPrice;
            priceRange.value = maxPrice;
            priceDisplay.textContent = `£${maxPrice.toLocaleString()}`;

            mileageRange.max = maxMileage;
            mileageRange.value = maxMileage;
            mileageDisplay.textContent = `${maxMileage.toLocaleString()} miles`;

            populateDropdowns();
            applyFilters(); // Initial render with specific sort if needed

        } catch (error) {
            console.error('Error:', error);
            listingsContainer.innerHTML = `<p class="error-message">Error loading vehicle data. Please try again later.</p>`;
        }
    }

    // Populate Dropdowns
    function populateDropdowns() {
        // Extract unique Models
        // Assuming Title format is "Year Make Model" e.g. "2015 Nissan Juke"
        // We want "Nissan Juke" or just "Juke" if consistent.
        // Let's try to extract the Make + Model minus the year.
        const models = new Set();
        const engines = new Set();

        allCars.forEach(car => {
            // Model: Remove year (first 4 digits)
            const modelName = car.title.replace(/^\d{4}\s+/, '');
            models.add(modelName);

            // Engine: Just use the raw string, maybe trim
            if (car.engine_fuel) {
                engines.add(car.engine_fuel);
            }
        });

        // Sort and populate Model
        Array.from(models).sort().forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelFilter.appendChild(option);
        });

        // Sort and populate Engine
        Array.from(engines).sort().forEach(engine => {
            const option = document.createElement('option');
            option.value = engine;
            option.textContent = engine;
            engineFilter.appendChild(option);
        });
    }

    // Helper: Parse Price
    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^\d]/g, ''), 10);
    }

    // Helper: Parse Mileage
    function parseMileage(mileageStr) {
        if (!mileageStr) return 0;
        return parseInt(mileageStr.replace(/[^\d]/g, ''), 10);
    }

    // Render Cards
    function renderListings() {
        listingsContainer.innerHTML = '';

        if (filteredCars.length === 0) {
            listingsContainer.innerHTML = '<div class="no-results">No vehicles match your criteria.</div>';
            return;
        }

        filteredCars.forEach(car => {
            const image = car.image_url || 'https://via.placeholder.com/400x300?text=No+Image';

            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <span class="status-badge">Available</span>
                    <img src="${image}" alt="${car.title}" class="card-image" loading="lazy">
                </div>
                <div class="card-content">
                    <h2 class="card-title">${car.title}</h2>
                    <div class="card-price">${car.price}</div>
                    
                    <div class="specs-grid">
                        <div class="spec-item">
                            <i></i> <span>${car.mileage}</span>
                        </div>
                        <div class="spec-item">
                            <i></i> <span>${car.transmission}</span>
                        </div>
                        <div class="spec-item">
                            <i></i> <span>Available</span>
                        </div>
                         <div class="spec-item">
                            <i></i> <span>${car.engine_fuel}</span>
                        </div>
                    </div>
                    
                    <a href="${car.url}" target="_blank" rel="noopener noreferrer" class="btn-view">View Listing</a>
                </div>
            `;
            listingsContainer.appendChild(card);
        });
    }

    // Update Stats
    function updateStats() {
        const total = filteredCars.length;
        const avgPrice = total > 0
            ? Math.round(filteredCars.reduce((acc, c) => acc + parsePrice(c.price), 0) / total)
            : 0;

        statsBar.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${total}</span>
                <span class="stat-label">Vehicles</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">£${avgPrice.toLocaleString()}</span>
                <span class="stat-label">Avg. Price</span>
            </div>
        `;
    }

    // Filter & Sort Logic
    function applyFilters() {
        const maxPrice = parseInt(priceRange.value, 10);
        const maxMileage = parseInt(mileageRange.value, 10);
        const selectedModel = modelFilter.value;
        const selectedEngine = engineFilter.value;
        const sortValue = sortBy.value;

        // 1. Filter
        filteredCars = allCars.filter(car => {
            const price = parsePrice(car.price);
            const mileage = parseMileage(car.mileage);
            const modelName = car.title.replace(/^\d{4}\s+/, '');

            if (price > maxPrice) return false;
            if (mileage > maxMileage) return false;
            if (selectedModel && modelName !== selectedModel) return false;
            if (selectedEngine && car.engine_fuel !== selectedEngine) return false;

            return true;
        });

        // 2. Sort
        filteredCars.sort((a, b) => {
            const priceA = parsePrice(a.price);
            const priceB = parsePrice(b.price);
            const mileageA = parseMileage(a.mileage);
            const mileageB = parseMileage(b.mileage);
            const modelA = a.title.replace(/^\d{4}\s+/, '');
            const modelB = b.title.replace(/^\d{4}\s+/, '');

            switch (sortValue) {
                case 'price-asc': return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                case 'mileage-asc': return mileageA - mileageB;
                case 'mileage-desc': return mileageB - mileageA;
                case 'model-asc': return modelA.localeCompare(modelB);
                default: return 0;
            }
        });

        renderListings();
        updateStats();
    }

    // Event Listeners
    priceRange.addEventListener('input', (e) => {
        priceDisplay.textContent = `£${parseInt(e.target.value).toLocaleString()}`;
        applyFilters();
    });

    mileageRange.addEventListener('input', (e) => {
        mileageDisplay.textContent = `${parseInt(e.target.value).toLocaleString()} miles`;
        applyFilters();
    });

    modelFilter.addEventListener('change', applyFilters);
    engineFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);

    // Start App
    init();
});
