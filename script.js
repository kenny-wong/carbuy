document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const listingsContainer = document.getElementById('listings-container');
    const availableFilter = document.getElementById('available-only');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    const mileageRange = document.getElementById('mileage-range');
    const mileageDisplay = document.getElementById('mileage-display');
    const statsBar = document.getElementById('stats-bar');

    let allCars = [];
    let filteredCars = [];

    // Initialize
    async function init() {
        try {
            const response = await fetch('./autotrader_data.json');
            if (!response.ok) throw new Error('Failed to load vehicle data');
            
            allCars = await response.json();
            filteredCars = [...allCars];
            
            // Set max range values based on data
            const maxPrice = Math.max(...allCars.map(c => parsePrice(c.price)).filter(p => p > 0)) + 1000;
            const maxMileage = Math.max(...allCars.map(c => parseMileage(c.mileage)).filter(m => m > 0)) + 5000;

            priceRange.max = maxPrice;
            priceRange.value = maxPrice; // Default to max
            priceDisplay.textContent = `Max: £${maxPrice.toLocaleString()}`;

            mileageRange.max = maxMileage;
            mileageRange.value = maxMileage; // Default to max
            mileageDisplay.textContent = `Max: ${maxMileage.toLocaleString()} miles`;

            renderListings();
            updateStats();

        } catch (error) {
            console.error('Error:', error);
            listingsContainer.innerHTML = `<p class="error-message">Error loading vehicle data. Please try again later.</p>`;
        }
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
            const isAvailable = car.price !== null && car.title !== "Unavailable";
            const price = isAvailable ? car.price : "Sold";
            const statusClass = isAvailable ? "status-available" : "status-sold";
            const statusText = isAvailable ? "Available" : "Sold";
            const image = car.image_url || 'https://via.placeholder.com/400x300?text=No+Image';

            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <img src="${image}" alt="${car.title}" class="card-image" loading="lazy">
                </div>
                <div class="card-content">
                    <h2 class="card-title">${car.title}</h2>
                    <div class="card-price">${price}</div>
                    
                    ${isAvailable ? `
                    <div class="specs-grid">
                        <div class="spec-item">
                            <i class="icon-mileage"></i> <span>${car.mileage}</span>
                        </div>
                        <div class="spec-item">
                            <i class="icon-transmission"></i> <span>${car.transmission}</span>
                        </div>
                        <div class="spec-item">
                            <i class="icon-fuel"></i> <span>${car.engine_fuel}</span>
                        </div>
                    </div>
                    
                    <a href="${car.url}" target="_blank" rel="noopener noreferrer" class="btn-view">View on AutoTrader</a>
                    ` : `
                    <p class="sold-text">This vehicle is no longer available.</p>
                    <a href="${car.url}" target="_blank" rel="noopener noreferrer" class="btn-view disabled">View Listing</a>
                    `}
                </div>
            `;
            listingsContainer.appendChild(card);
        });
    }

    // Update Stats
    function updateStats() {
        const total = filteredCars.length;
        const available = filteredCars.filter(c => c.price !== null && c.title !== "Unavailable").length;
        const avgPrice = available > 0 
            ? Math.round(filteredCars.reduce((acc, c) => acc + parsePrice(c.price), 0) / available) 
            : 0;

        statsBar.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${total}</span>
                <span class="stat-label">Total Vehicles</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${available}</span>
                <span class="stat-label">Available</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">£${avgPrice.toLocaleString()}</span>
                <span class="stat-label">Avg. Price</span>
            </div>
        `;
    }

    // Filter Logic
    function applyFilters() {
        const maxPrice = parseInt(priceRange.value, 10);
        const maxMileage = parseInt(mileageRange.value, 10);
        const onlyAvailable = availableFilter.checked;

        filteredCars = allCars.filter(car => {
            const price = parsePrice(car.price);
            const mileage = parseMileage(car.mileage);
            const isAvailable = car.price !== null && car.title !== "Unavailable";

            if (onlyAvailable && !isAvailable) return false;
            if (isAvailable && price > maxPrice) return false;
            if (isAvailable && mileage > maxMileage) return false;

            return true;
        });

        renderListings();
        updateStats();
    }

    // Event Listeners
    availableFilter.addEventListener('change', applyFilters);
    
    priceRange.addEventListener('input', (e) => {
        priceDisplay.textContent = `Max: £${parseInt(e.target.value).toLocaleString()}`;
        applyFilters();
    });

    mileageRange.addEventListener('input', (e) => {
        mileageDisplay.textContent = `Max: ${parseInt(e.target.value).toLocaleString()} miles`;
        applyFilters();
    });

    // Start App
    init();
});
