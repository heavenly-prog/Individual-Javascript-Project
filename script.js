
let appState = {
    cars: [],
    filteredCars: [],
    searchFilter: '',
    priceFilter: [0, 100000],
    sortFilter: '',
    currentPage: 'home',
    debounceTimer: null 
};

async function fetchCarsFromAPI() {
    const makesToFetch = ['Honda', 'Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Mazda', 'Volkswagen', 'Subaru', 'Kia', 'Ford'];
    let allVehicles = [];
    let vehicleId = 1;

    try {
        const fetchPromises = makesToFetch.map(make => 
            fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${make}?format=json`)
            .then(response => response.json())
        );

        const results = await Promise.all(fetchPromises);

        results.forEach((data) => {
            if (data.Results && data.Results.length > 0) {
                const modelData = data.Results[0]; 
                allVehicles.push({
                    id: vehicleId++,
                    variant: {
                        year: 2024, 
                        make_description: modelData.Make_Name,
                        family_description: modelData.Model_Name,
                        body_style: 'Vehicle', 
                        transmission_type: 'Automatic'
                    },
                    km: Math.floor(Math.random() * 30000),
                    price: 25000 + (vehicleId * 1500),
                    savings: 2000
                });
            }
        });
        return allVehicles;
    } catch (error) {
        console.error('NHTSA API Error:', error);
        return getMockCars(); 
    }
}

function getMockCars() {
    return [{ id: 1, variant: { year: 2023, make_description: 'Toyota', family_description: 'Camry', body_style: 'Sedan', transmission_type: 'Automatic' }, km: 15000, price: 28500, savings: 2000 }];
}

/**
 * Render Cars - Optimized to prevent Jitter
 */
function renderCars(cars) {
    const container = document.getElementById('cars-container');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;

    // 1. Lock current height to prevent the footer from jumping up
    const currentHeight = container.offsetHeight;
    if (currentHeight > 0) {
        container.style.minHeight = `${currentHeight}px`;
    }

    if (!cars.length) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // 2. Efficiently update HTML
    container.innerHTML = cars.map(car => `
        <div class="card-wrapper">
            <div class="card no-image-card">
                <div class="bot">
                    <div class="specs-grid">
                        <span class="car-info"><i class="fas fa-car"></i> ${car.variant.make_description} ${car.variant.family_description}</span>
                        <span class="car-info"><i class="fas fa-tachometer-alt"></i> ${formatNumber(car.km)} km</span>
                        <span class="car-info"><i class="fas fa-car-side"></i> ${car.variant.body_style}</span>
                        <span class="car-info"><i class="fas fa-cogs"></i> ${car.variant.transmission_type}</span>
                    </div>
                    <div class="price-section">
                        <h2 class="price">
                            <span class="prev">$${formatNumber(car.price + car.savings)}</span>
                            <span class="curr">$${formatNumber(car.price)}</span>
                        </h2>
                        <button class="view-details-btn" onclick="notImplemented()">View Specs</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // 3. Unlock height after a tiny delay so the transition feels natural
    setTimeout(() => {
        container.style.minHeight = "0px";
    }, 300);
}

/**
 * Filter Logic
 */
function filterCars() {
    let filtered = appState.cars;

    if (appState.searchFilter) {
        const search = appState.searchFilter.toLowerCase();
        filtered = filtered.filter(car => 
            `${car.variant.make_description} ${car.variant.family_description}`.toLowerCase().includes(search)
        );
    }

    filtered = filtered.filter(car => car.price <= appState.priceFilter[1]);

    if (appState.sortFilter === 'name-asc') {
        filtered.sort((a, b) => a.variant.make_description.localeCompare(b.variant.make_description));
    }

    appState.filteredCars = filtered;
    renderCars(filtered);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-AU').format(num);
}

/**
 * UI Actions - Fixed Slider Jitter
 */
function updatePrice(slider) {
    const price = parseInt(slider.value);
    appState.priceFilter[1] = price;
    
    const display = document.querySelector('.price-display');
    if (display) display.textContent = `$0 to $${formatNumber(price)}`;
    
    // DEBOUNCE: Clear previous timer if we are still sliding
    clearTimeout(appState.debounceTimer);
    
    // Only run the heavy filter function after 50ms of "silence" from the slider
    appState.debounceTimer = setTimeout(() => {
        filterCars();
    }, 50);
}

function handleSort(sortValue) {
    appState.sortFilter = sortValue;
    filterCars();
}

function showPage(pageId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const viewEl = document.getElementById(`${pageId}-view`);
    if (viewEl) viewEl.classList.add('active');
    appState.currentPage = pageId;
}

function notImplemented() {
    alert('Technical specifications for this NHTSA model are coming soon!');
}

document.addEventListener('DOMContentLoaded', async () => {
    const cars = await fetchCarsFromAPI();
    appState.cars = cars;
    appState.filteredCars = cars;
    renderCars(cars);
});