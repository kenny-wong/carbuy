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
    const userDisplay = document.getElementById('user-display');
    const userIcon = document.getElementById('user-icon');
    const userNameTag = document.getElementById('user-name-tag');
    const presenceList = document.getElementById('presence-list');

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
        updateUserDisplay(currentUser);
    }

    function getUserIcon(userName) {
        if (userName && familyMembers[userName]) {
            const theme = familyMembers[userName].theme;
            return `images/icons/${theme}.png`;
        }
        return '';
    }

    function updateUserDisplay(user) {
        if (user && familyMembers[user]) {
            userDisplay.style.display = 'flex';
            userNameTag.textContent = user;

            const iconWrapper = userIcon.parentElement;
            const iconPath = getUserIcon(user);

            // Reset wrapper
            iconWrapper.className = 'user-icon-wrapper ' + familyMembers[user].theme;
            iconWrapper.textContent = '';
            iconWrapper.appendChild(userIcon);

            userIcon.style.display = 'none';
            userIcon.src = iconPath;

            userIcon.onerror = function () {
                this.style.display = 'none';
                iconWrapper.textContent = user[0];
            };

            userIcon.onload = function () {
                this.style.display = 'block';
                iconWrapper.textContent = '';
                iconWrapper.appendChild(this);
            };
        } else {
            userDisplay.style.display = 'none';
        }
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

            // 4. Update Header
            updateUserDisplay(selectedUser);

            // 5. Start Presence Heartbeat immediately
            sendHeartbeat();

            // 6. Close Modal
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

    // Mock Data Helpers
    function getMockVotes(cars) {
        const mockVotes = [];
        // Ensure at least 10 cars have votes
        const carsToVote = cars.slice(0, 15);

        carsToVote.forEach((car, i) => {
            // Max 4 votes per car
            const voteCount = Math.min(4, Math.max(1, 5 - Math.floor(i / 3)));
            const availableUsers = Object.keys(familyMembers);

            for (let j = 0; j < voteCount; j++) {
                mockVotes.push({
                    car_url: car.url,
                    user_name: availableUsers[j % availableUsers.length]
                });
            }
        });
        return mockVotes;
    }

    async function fetchVotes() {
        try {
            const response = await fetch('/api/votes');
            if (response.ok) {
                const realVotes = await response.json();
                allVotes = realVotes;
            }
        } catch (error) {
            console.warn('Failed to fetch votes, using mock logic');
        }

        // --- MOCK INJECTION START ---
        // Always add mock votes if list is empty or for demo
        if (allVotes.length === 0 && allCars.length > 0) {
            allVotes = getMockVotes(allCars);
        }
        // --- MOCK INJECTION END ---

        renderLeaderboard();
        renderListings();
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
            let lbDisplayTitle = 'Unknown Car';
            if (car) {
                // Format: "2014 Honda Jazz (Price)"
                const yearMatch = car.title.match(/^\d{4}/);
                const year = yearMatch ? yearMatch[0] : '';
                const withoutYear = car.title.replace(/^\d{4}\s+/, '');
                const parts = withoutYear.split(' ');
                const brandModel = parts.slice(0, 2).join(' ');
                lbDisplayTitle = `${year} ${brandModel} (${car.price})`;
            }
            return {
                url,
                count: voteCounts[url],
                title: lbDisplayTitle,
                voters: allVotes.filter(v => v.car_url === url).map(v => v.user_name)
            };
        }).sort((a, b) => b.count - a.count).slice(0, 10);

        if (rankedCars.length === 0) {
            leaderboardList.innerHTML = '<p class="empty">No votes yet</p>';
            return;
        }

        leaderboardList.innerHTML = rankedCars.map((car, index) => {
            const carId = 'car-' + car.url.split('/').pop().split('?')[0];
            return `
            <div class="leaderboard-item" data-target-id="${carId}" style="cursor: pointer;">
                <span class="rank">#${index + 1}</span>
                <div class="lb-car-info">
                    <span class="lb-car-title">${car.title}</span>
                    <div class="lb-voters">
                        ${car.voters.map(v => {
                const icon = getUserIcon(v);
                return `<div class="voter-bubble ${familyMembers[v]?.theme}" title="${v}">
                                ${icon ? `<img src="${icon}" alt="${v}" class="voter-img" onerror="this.style.display='none'; this.parentElement.textContent='${v[0]}'">` : v[0]}
                            </div>`;
            }).join('')}
                    </div>
                </div>
                <div class="lb-count"><strong>${car.count}</strong></div>
            </div>
        `}).join('');

        // Attach click handlers for leaderboard highlight effect
        leaderboardList.querySelectorAll('.leaderboard-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-target-id');
                highlightCar(targetId);
            });
        });
    }

    // --- Highlight Car Effect ---
    function highlightCar(carId) {
        const card = document.getElementById(carId);
        if (!card) return;

        // Scroll into view
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove any existing highlight first
        card.classList.remove('car-highlight');
        // Force reflow so re-adding the class restarts the animation
        void card.offsetWidth;

        // Add highlight class
        card.classList.add('car-highlight');

        // Remove after animation completes (3s)
        setTimeout(() => {
            card.classList.remove('car-highlight');
        }, 3000);
    }

    // --- Presence System ---
    async function sendHeartbeat() {
        const currentUser = localStorage.getItem('carbuy-user');
        if (!currentUser) return;

        try {
            await fetch('/api/presence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: currentUser })
            });
        } catch (error) {
            console.error('Heartbeat failed:', error);
        }
    }

    async function fetchPresence() {
        try {
            const response = await fetch('/api/presence');
            if (response.ok) {
                const presenceData = await response.json();
                renderPresence(presenceData);
                return;
            }
        } catch (error) {
            console.warn('Failed to fetch presence');
        }
        // Fallback or Mock
        renderPresence([]);
    }

    function renderPresence(users) {
        // --- MOCK INJECTION START ---
        // Verify if we have users, if not (local dev), inject mocks
        let displayUsers = [...users];
        if (displayUsers.length === 0) {
            displayUsers = [
                { user_name: 'Gubie' },
                { user_name: 'Chloe' }
            ];
        }
        // --- MOCK INJECTION END ---

        if (!presenceList) return;

        if (displayUsers.length === 0) {
            presenceList.innerHTML = '<p class="empty">No one online</p>';
            return;
        }

        presenceList.innerHTML = `<span class="online-label">🟢 Online:</span>` + displayUsers.map(u => {
            const icon = getUserIcon(u.user_name);
            return `
                <div class="online-user">
                    <div class="voter-bubble ${familyMembers[u.user_name]?.theme || ''}" style="width: 24px; height: 24px; font-size: 0.6rem;">
                        ${icon ? `<img src="${icon}" alt="${u.user_name}" class="voter-img">` : u.user_name[0]}
                    </div>
                    <span>${u.user_name}</span>
                </div>
            `;
        }).join('');
    }

    // Start Presence Cycles
    setInterval(sendHeartbeat, 60000); // 60s heartbeat
    setInterval(fetchPresence, 30000); // 30s refresh

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
        // Keep available and sold cars
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

            populateModels();
            populateEngines();
            await fetchVotes();

            // Set default sort to Date Newest
            if (!sortBy.value) sortBy.value = 'date-desc';

            applyFilters(); // Initial render with specific sort if needed

        } catch (error) {
            console.error('Error:', error);
            listingsContainer.innerHTML = `<p class="error-message">Error loading vehicle data. Please try again later.</p>`;
        }
    }

    // Populate Dropdowns
    function populateModels() {
        const models = new Set();
        allCars.forEach(car => {
            const withoutYear = car.title.replace(/^\d{4}\s+/, '');
            const parts = withoutYear.split(' ');
            const shortTitle = parts.slice(0, 2).join(' ');
            models.add(shortTitle);
        });

        modelFilter.innerHTML = '<option value="">All Models</option>';
        Array.from(models).sort().forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelFilter.appendChild(option);
        });
    }

    function populateEngines(selectedModel = "") {
        const engines = new Set();
        allCars.forEach(car => {
            const withoutYear = car.title.replace(/^\d{4}\s+/, '');
            const parts = withoutYear.split(' ');
            const shortTitle = parts.slice(0, 2).join(' ');

            if (!selectedModel || shortTitle === selectedModel) {
                if (car.engine_fuel) {
                    engines.add(car.engine_fuel);
                }
            }
        });

        engineFilter.innerHTML = '<option value="">All Engines</option>';
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

            // New Badge & Date Logic
            const createdDate = car.created_at ? new Date(car.created_at) : null;
            let isNew = false;
            let relativeDate = "";

            if (createdDate && car.status !== 'SOLD') {
                const diffTime = Math.abs(Date.now() - createdDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                isNew = diffDays <= 3;
                if (diffDays === 0) relativeDate = 'today';
                else if (diffDays === 1) relativeDate = '1d ago';
                else relativeDate = `${diffDays}d ago`;
            }

            // Generate unique ID for scrolling
            // Using last segment of URL as ID
            const carId = 'car-' + car.url.split('/').pop().split('?')[0];

            // Shorten main title: "2014 Honda Jazz 1.4 i-VTEC..." -> "Honda Jazz"
            const withoutYear = car.title.replace(/^\d{4}\s+/, '');
            const parts = withoutYear.split(' ');
            const shortTitle = parts.slice(0, 2).join(' ');

            const card = document.createElement('article');
            card.className = `card ${car.status === 'SOLD' ? 'is-sold' : ''}`;
            card.id = carId; // Set unique ID
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <span class="status-badge ${car.status === 'SOLD' ? 'sold' : ''}">${car.status || 'Available'}</span>
                    ${isNew ? `<span class="status-badge new">New: ${relativeDate}</span>` : ''}
                    <img src="${image}" alt="${car.title}" class="card-image" loading="lazy">
                    <div class="card-voters-overlay">
                        ${carVotes.map(v => {
                const icon = getUserIcon(v.user_name);
                return `<div class="voter-bubble ${familyMembers[v.user_name]?.theme}" title="${v.user_name}">
                                ${icon ? `<img src="${icon}" alt="${v.user_name}" class="voter-img" onerror="this.style.display='none'; this.parentElement.textContent='${v.user_name[0]}'">` : v.user_name[0]}
                            </div>`;
            }).join('')}
                    </div>
                </div>
                <div class="card-content">
                    <h2 class="card-title">${shortTitle}</h2>
                    <p class="card-description">${car.title}</p>
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
                        <button class="btn-vote ${hasVoted ? 'active' : ''}" data-url="${car.url}" ${car.status === 'SOLD' ? 'disabled' : ''}>
                            <i class="vote-icon">♥</i> ${hasVoted ? 'Voted' : 'Vote'}
                        </button>
                    </div>

                    <a href="${car.url}" target="_blank" rel="noopener noreferrer" class="btn-view" style="margin-top: 1rem;">View Listing</a>
                </div>
            `;

            // Add listener to vote button if not sold
            const voteBtn = card.querySelector('.btn-vote');
            if (car.status !== 'SOLD') {
                voteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleVote(car.url);
                });
            }

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

            // Shorten for filtering: "2014 Honda Jazz..." -> "Honda Jazz"
            const withoutYear = car.title.replace(/^\d{4}\s+/, '');
            const parts = withoutYear.split(' ');
            const shortTitle = parts.slice(0, 2).join(' ');

            if (price > maxPrice) return false;
            if (mileage > maxMileage) return false;
            if (selectedModel && shortTitle !== selectedModel) return false;
            if (selectedEngine && car.engine_fuel !== selectedEngine) return false;

            return true;
        });

        // 2. Sort
        filteredCars.sort((a, b) => {
            const priceA = parsePrice(a.price);
            const priceB = parsePrice(b.price);
            const mileageA = parseMileage(a.mileage);
            const mileageB = parseMileage(b.mileage);

            const shortA = a.title.replace(/^\d{4}\s+/, '').split(' ').slice(0, 2).join(' ');
            const shortB = b.title.replace(/^\d{4}\s+/, '').split(' ').slice(0, 2).join(' ');

            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

            switch (sortValue) {
                case 'price-asc': return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                case 'mileage-asc': return mileageA - mileageB;
                case 'mileage-desc': return mileageB - mileageA;
                case 'model-asc': return shortA.localeCompare(shortB);
                case 'date-asc': return dateA - dateB;
                case 'date-desc': return dateB - dateA;
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

    modelFilter.addEventListener('change', () => {
        engineFilter.value = "";
        populateEngines(modelFilter.value);
        applyFilters();
    });
    engineFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);

    // Start App
    init();

    // Initial presence fetch and heartbeat if logged in
    fetchPresence();
    if (localStorage.getItem('carbuy-user')) {
        sendHeartbeat();
    }
});
