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
    const leaderboardList = document.getElementById('leaderboard-list');

    // Login Elements
    const loginModal = document.getElementById('login-modal');
    const userSelect = document.getElementById('user-select');
    const secretInputContainer = document.getElementById('secret-input-container');
    const userSecret = document.getElementById('user-secret');
    const btnLogin = document.getElementById('btn-login');
    const loginError = document.getElementById('login-error');

    // Member Config
    const familyMembers = {
        'Kenny': { secret: 'XO', theme: 'xo' },
        'Gubie': { secret: 'Pochacco', theme: 'pochacco' },
        'Hayley': { secret: 'Kuromi', theme: 'kuromi' },
        'Chloe': { secret: 'Hello Kitty', theme: 'hello-kitty' }
    };

    // Theme Logic
    const themes = ['original', 'xo', 'pochacco', 'kuromi', 'hello-kitty'];

    function initTheme() {
        let savedTheme = localStorage.getItem('carbuy-theme');
        const currentUser = localStorage.getItem('carbuy-user');

        if (currentUser && familyMembers[currentUser]) {
            savedTheme = familyMembers[currentUser].theme;
            loginModal.classList.remove('active');
        } else if (!savedTheme) {
            // First time visit: Show login modal
            loginModal.classList.add('active');
            // Pick random theme as a background while logging in
            const randomIndex = Math.floor(Math.random() * themes.length);
            savedTheme = themes[randomIndex];
            localStorage.setItem('carbuy-theme', savedTheme);
        } else if (!currentUser) {
            // No user, show login
            loginModal.classList.add('active');
        }

        applyTheme(savedTheme || 'original');
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

    // Login Event Listeners
    userSelect.addEventListener('change', () => {
        secretInputContainer.style.display = 'block';
        loginError.style.display = 'none';
        userSecret.value = '';
        userSecret.focus();
    });

    async function handleLogin() {
        const selectedUser = userSelect.value;
        const enteredSecret = userSecret.value.trim();

        if (!selectedUser || !familyMembers[selectedUser]) return;

        // case-insensitive secret check
        if (enteredSecret.toLowerCase() === familyMembers[selectedUser].secret.toLowerCase()) {
            const selectedTheme = familyMembers[selectedUser].theme;

            // 1. Store in LocalStorage
            localStorage.setItem('carbuy-user', selectedUser);
            localStorage.setItem('carbuy-theme', selectedTheme);

            // 2. Apply theme
            applyTheme(selectedTheme);

            // 3. Log Audit to DB
            try {
                await fetch('/api/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_name: selectedUser,
                        selected_theme: selectedTheme
                    })
                });
            } catch (err) {
                console.error('Audit failed:', err);
            }

            // 4. Close Modal
            loginModal.classList.remove('active');
        } else {
            loginError.style.display = 'block';
        }
    }

    btnLogin.addEventListener('click', handleLogin);
    userSecret.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    let allCars = [];
    let filteredCars = [];
    let allVotes = [];

    async function fetchVotes() {
        try {
            const response = await fetch('/api/votes');
            if (response.ok) {
                allVotes = await response.json();
                renderLeaderboard();
                renderListings();
            }
        } catch (error) {
            console.error('Failed to fetch votes:', error);
        }
    }

    async function toggleVote(car_url) {
        const currentUser = localStorage.getItem('carbuy-user');
        if (!currentUser) {
            loginModal.classList.add('active');
            return;
        }

        try {
            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ car_url, user_name: currentUser })
            });
            if (response.ok) {
                await fetchVotes(); // Refresh votes
            }
        } catch (error) {
            console.error('Vote toggle failed:', error);
        }
    }

    function renderLeaderboard() {
        const voteCounts = {};
        allVotes.forEach(v => {
            voteCounts[v.car_url] = (voteCounts[v.car_url] || 0) + 1;
        });

        // Map counts back to car details
        const rankedCars = Object.keys(voteCounts).map(url => {
            const car = allCars.find(c => c.url === url);
            return {
                url,
                count: voteCounts[url],
                title: car ? car.title : 'Unknown Car',
                voters: allVotes.filter(v => v.car_url === url).map(v => v.user_name)
            };
        }).sort((a, b) => b.count - a.count).slice(0, 10);

        if (rankedCars.length === 0) {
            leaderboardList.innerHTML = '<p class="empty">No votes yet</p>';
            return;
        }

        leaderboardList.innerHTML = rankedCars.map((car, index) => `
            <div class="leaderboard-item">
                <span class="rank">#${index + 1}</span>
                <div class="lb-car-info">
                    <span class="lb-car-title">${car.title}</span>
                    <div class="lb-voters">
                        ${car.voters.map(v => `<div class="voter-bubble ${v.toLowerCase()}" title="${v}">${v[0]}</div>`).join('')}
                    </div>
                </div>
                <div class="lb-count"><strong>${car.count}</strong></div>
            </div>
        `).join('');
    }

    // Initialize
    async function init() {
        let rawData;
        try {
            // Try fetching from Vercel API
            const response = await fetch('/api/cars');
            if (!response.ok) throw new Error('API unavailable');
            rawData = await response.json();
        } catch (error) {
            console.warn('API failed, falling back to local JSON:', error);
            // Fallback to local JSON
            const response = await fetch('./car_data.json');
            if (!response.ok) throw new Error('Failed to load vehicle data');
            rawData = await response.json();
        }
        // Remove unavailable cars immediately
        try {
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
            await fetchVotes();
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
            const carVotes = allVotes.filter(v => v.car_url === car.url);
            const currentUser = localStorage.getItem('carbuy-user');
            const hasVoted = carVotes.some(v => v.user_name === currentUser);

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
                    
                    <div class="card-actions">
                        <button class="btn-vote ${hasVoted ? 'active' : ''}" data-url="${car.url}">
                            <i class="vote-icon">♥</i> ${hasVoted ? 'Voted' : 'Vote'}
                        </button>
                        <div class="card-voters">
                            ${carVotes.map(v => `<div class="voter-bubble ${v.user_name.toLowerCase()}" title="${v.user_name}">${v.user_name[0]}</div>`).join('')}
                        </div>
                    </div>

                    <a href="${car.url}" target="_blank" rel="noopener noreferrer" class="btn-view" style="margin-top: 1rem;">View Listing</a>
                </div>
            `;

            // Add listener to vote button
            card.querySelector('.btn-vote').addEventListener('click', (e) => {
                e.preventDefault();
                toggleVote(car.url);
            });

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
