/**
 * Fetch cars from NHTSA API with multiple brands
 */
async function fetchCarsFromAPI() {
    try {
        // Array of different car makes to fetch (12 brands = 3 per row)
        const makes = ['Honda', 'Toyota', 'Lexus', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Mazda', 'Volkswagen', 'Subaru', 'Kia'];
        
        // Car brand images
        const brandImages = {
            'Honda': [
                'https://images.hgmsites.net/lrg/2023-honda-accord-ex-cvt-angular-front-exterior-view_100882615_l.jpg',
            ],
            'Toyota': [
                'https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/424c4638-42f2-4577-a2a8-7a8ed7755791/f454dd80-0f64-4da5-bc07-09e7101844b4.png'
            ],
            'Lexus': [
                'https://motoraty-media.s3.us-west-2.amazonaws.com/newcars/listing/8398/2021-lexus-gs-350-f-sport-%D9%84%D9%83%D8%B2%D8%B3-gs-350-1601349030.7803.jpg'
            ],
            'BMW': [
                'https://carsales.pxcrush.net/car/spec/S000CQPR.jpg?pxc_method=GravityFill&width=480&height=320&watermark=1210676080'
            ],
            'Mercedes-Benz': [
                'https://mystrongad.com/MOF_MercedesBenzofFredricksburg/Interactive/C-Class/2022/2022-Mercedes-Benz-C-Class-White.png'
            ],
            'Audi': [
                'https://images.hgmsites.net/lrg/2021-audi-tt-45-tfsi-quattro-angular-front-exterior-view_100818935_l.jpg'
            ],
            'Nissan': [
                'https://img.autobytel.com/chrome/colormatched_01/white/640/cc_2023nic13_01_640/cc_2023nic130003_01_640_gag.jpg'
            ],
            'Hyundai': [
                'https://platform.cstatic-images.com/in/v2/stock_photos/3b21a801-38f2-4b10-aa2c-ce1543d46f9f/a0a34a3b-e34c-4e5d-993c-f89c60d93e7a.png'
            ],
            'Mazda': [
                'https://vexstockimages.fastly.carvana.io/stockimages/2025_MAZDA_CX-50_2.5%20S%20PREFERRED%20SPORT%20UTILITY%204D_BLACK_stock_1_desktop.png?v=1769786934.602'
            ],
            'Volkswagen': [
                'https://mir-s3-cdn-cf.behance.net/project_modules/1400/3e248a104651427.5f6812b831be7.jpg'
            ],
            'Subaru': [
                'https://di-sitebuilder-assets.dealerinspire.com/Subaru/modelLandingPages/Legacy/2022/trim-legacy-base-min.png'
            ],
            'Kia': [
                'https://www.edmunds.com/assets/m/kia/rio/2021/oem/2021_kia_rio_sedan_s_fq_oem_1_600.jpg'
            ]
        };
        
        let allVehicles = [];
        let vehicleId = 1;
        
        // Fetch data for each make
        for (const make of makes) {
            try {
                const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${make}?format=json`);
                const data = await response.json();
                
                if (data.Results && data.Results.length > 0) {
                    // Get first model from each make
                    const model = data.Results[0];
                    const images = brandImages[make] || ['https://via.placeholder.com/400x300?text=Car+Image'];
                    
                    allVehicles.push({
                        id: vehicleId++,
                        variant: {
                            year: 2023 - (allVehicles.length % 3),
                            make_description: make,
                            family_description: model.Model_Name,
                            body_style: 'Sedan',
                            transmission_type: allVehicles.length % 2 === 0 ? 'Automatic' : 'Manual'
                        },
                        km: 5000 + (allVehicles.length * 4000),
                        price: 25000 + (allVehicles.length * 6000),
                        savings: 2000 + (allVehicles.length * 500),
                        photos: [{ 
                            medium_thumb: images[0] || images[0]
                        }]
                    });
                }
            } catch (err) {
                console.error(`Error fetching ${make}:`, err);
            }
        }
        
        // Return up to 12 vehicles (3 per row)
        return allVehicles.slice(0, 12).length > 0 ? allVehicles.slice(0, 12) : getMockCars();
        
    } catch (error) {
        console.error('Error fetching from NHTSA API:', error);
    }
    
    // Fallback to mock data if API fails
    return getMockCars();
}

/**
 * Get mock car data (fallback)
 */
function getMockCars() {
    return [
        {
            id: 1,
            variant: {
                year: 2023,
                make_description: 'Toyota',
                family_description: 'Camry',
                body_style: 'Sedan',
                transmission_type: 'Automatic'
            },
            km: 15000,
            price: 28500,
            savings: 2000,
            photos: [{ medium_thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8' }]
        },
        {
            id: 2,
            variant: {
                year: 2022,
                make_description: 'Honda',
                family_description: 'Accord',
                body_style: 'Sedan',
                transmission_type: 'CVT'
            },
            km: 25000,
            price: 26800,
            savings: 1800,
            photos: [{ medium_thumb: 'https://images.hgmsites.net/lrg/2023-honda-accord-ex-cvt-angular-front-exterior-view_100882615_l.jpg' }]
        },
        {
            id: 3,
            variant: {
                year: 2023,
                make_description: 'BMW',
                family_description: '3 Series',
                body_style: 'Sedan',
                transmission_type: 'Automatic'
            },
            km: 8000,
            price: 42000,
            savings: 5000,
            photos: [{ medium_thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0' }]
        },
        {
            id: 4,
            variant: {
                year: 2023,
                make_description: 'Mercedes',
                family_description: 'C-Class',
                body_style: 'Sedan',
                transmission_type: 'Automatic'
            },
            km: 12000,
            price: 45900,
            savings: 6200,
            photos: [{ medium_thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnA1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1A1' }]
        },
        {
            id: 5,
            variant: {
                year: 2022,
                make_description: 'Audi',
                family_description: 'A4',
                body_style: 'Sedan',
                transmission_type: 'Automatic'
            },
            km: 18000,
            price: 39500,
            savings: 4500,
            photos: [{ medium_thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoB2B2B2B2B2B2B2B2B2B2B2B2B2B2B2B2B2' }]
        },
        {
            id: 6,
            variant: {
                year: 2023,
                make_description: 'Tesla',
                family_description: 'Model 3',
                body_style: 'Sedan',
                transmission_type: 'Automatic'
            },
            km: 5000,
            price: 55000,
            savings: 7000,
            photos: [{ medium_thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpC3C3C3C3C3C3C3C3C3C3C3C3C3C3C3C3C3' }]
        }
    ];
}

// State management
let appState = {
    cars: [],
    filteredCars: [],
    searchFilter: '',
    priceFilter: [0, 100000],
    sortFilter: '',
    currentPage: 'home'
};

/**
 * Show/hide pages
 */
function showPage(pageId) {
    event.preventDefault();
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    
    // Show requested view
    const viewEl = document.getElementById(`${pageId}-view`);
    if (viewEl) {
        viewEl.classList.add('active');
    }

    // Update navbar styling
    const navbar = document.getElementById('mainHeader');
    if (pageId === 'browse') {
        navbar.classList.add('dark');
        if (!appState.cars.length) {
            // Fetch cars on first browse page load
            fetchCarsFromAPI().then(cars => {
                appState.cars = cars;
                appState.filteredCars = cars;
                renderCars(cars);
            });
        }
    } else {
        navbar.classList.remove('dark');
    }

    appState.currentPage = pageId;
}

/**
 * Mobile menu toggle
 */
function showMenu() {
    const menu = document.querySelector('.showMenu');
    const closeBtn = document.querySelector('.close-btn');
    const bentoMenu = document.querySelector('.bento-menu');
    
    menu.classList.add('active');
    closeBtn.style.display = 'block';
    bentoMenu.style.display = 'none';
}

function hideMenu() {
    const menu = document.querySelector('.showMenu');
    const closeBtn = document.querySelector('.close-btn');
    const bentoMenu = document.querySelector('.bento-menu');
    
    menu.classList.remove('active');
    setTimeout(() => {
        closeBtn.style.display = 'none';
        bentoMenu.style.display = 'flex';
    }, 700);
}

/**
 * Search functionality
 */
function executeSearch() {
    const searchInput = document.getElementById('mainSearch');
    const query = searchInput.value.trim();

    if (!query) return;

    const btn = document.getElementById('searchBtn');
    const bar = document.getElementById('loadingBar');

    // Trigger loading
    btn.classList.add('is-loading');
    bar.classList.add('active');

    // Simulate API call
    setTimeout(() => {
        appState.searchFilter = query;
        filterCars();
        document.getElementById('query-display').textContent = `"${query}"`;
        showPage('browse');
        
        // Reset button
        btn.classList.remove('is-loading');
        bar.classList.remove('active');
    }, 1500);
}

/**
 * Handle browse page search
 */
function handleBrowseSearch(event) {
    if (event.key === 'Enter') {
        filterBySearch();
    }
}

function filterBySearch() {
    const searchInput = document.getElementById('browseSearch');
    const query = searchInput.value.trim();
    appState.searchFilter = query;
    filterCars();
    document.getElementById('query-display').textContent = query ? `"${query}"` : '';
}

/**
 * Price filter
 */
function updatePrice(slider) {
    const price = parseInt(slider.value);
    appState.priceFilter[1] = price;
    
    const displayEl = document.querySelector('.price-display');
    displayEl.textContent = `$0 to $${formatNumber(price)}`;
    
    filterCars();
}

/**
 * Handle sort dropdown changes
 */
function handleSort(sortValue) {
    appState.sortFilter = sortValue;
    filterCars();
}

/**
 * Sort cars based on sort filter
 */
function sortCars(cars) {
    if (!appState.sortFilter) {
        return cars; // Return in default order
    }

    const sorted = [...cars]; // Create a copy to avoid mutating original

    switch(appState.sortFilter) {
        case 'name-asc':
            // A to Z by make and model
            sorted.sort((a, b) => {
                const nameA = `${a.variant.make_description} ${a.variant.family_description}`.toUpperCase();
                const nameB = `${b.variant.make_description} ${b.variant.family_description}`.toUpperCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-desc':
            // Z to A by make and model
            sorted.sort((a, b) => {
                const nameA = `${a.variant.make_description} ${a.variant.family_description}`.toUpperCase();
                const nameB = `${b.variant.make_description} ${b.variant.family_description}`.toUpperCase();
                return nameB.localeCompare(nameA);
            });
            break;
        case 'year-desc':
            // Newest to oldest
            sorted.sort((a, b) => b.variant.year - a.variant.year);
            break;
        case 'year-asc':
            // Oldest to newest
            sorted.sort((a, b) => a.variant.year - b.variant.year);
            break;
    }

    return sorted;
}

/**
 * Filter cars based on search and price
 */
function filterCars() {
    let filtered = appState.cars;

    // Filter by search term
    if (appState.searchFilter) {
        const search = appState.searchFilter.toLowerCase();
        filtered = filtered.filter(car => {
            const fullName = `${car.variant.year} ${car.variant.make_description} ${car.variant.family_description}`.toLowerCase();
            return fullName.includes(search);
        });
    }

    // Filter by price
    filtered = filtered.filter(car => car.price <= appState.priceFilter[1]);

    // Apply sorting
    filtered = sortCars(filtered);

    appState.filteredCars = filtered;
    renderCars(filtered);
}

/**
 * Render cars to the DOM
 */
function renderCars(cars) {
    const container = document.getElementById('cars-container');
    const emptyState = document.getElementById('empty-state');

    if (!cars.length) {
        container.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = cars.map(car => `
        <div class="card-wrapper">
            <div class="card">
                <div class="top">
                    <img src="${car.photos[0].medium_thumb}" 
                         alt="${car.variant.make_description} ${car.variant.family_description}"
                         onerror="this.style.backgroundColor='#e0e0e0'; this.style.color='#999'; this.textContent='Image unavailable';"
                         style="object-fit: cover; width: 100%; height: 100%;">
                    <div class="view-car" onclick="notImplemented()">
                        <span>More info</span>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
                <div class="bot">
                    <div class="title">${car.variant.year} ${car.variant.make_description} ${car.variant.family_description}</div>
                    <span class="car-info">
                        <i class="fas fa-tachometer-alt"></i>
                        ${formatNumber(car.km)} km
                    </span>
                    <span class="car-info">
                        <i class="fas fa-car-side"></i>
                        ${car.variant.body_style}
                    </span>
                    <span class="car-info">
                        <i class="fas fa-cogs"></i>
                        ${car.variant.transmission_type}
                    </span>
                    <div class="price-section">
                        <h2 class="price">
                            <span class="prev">$${formatNumber(car.price + car.savings)}</span>
                            <span class="curr">$${formatNumber(car.price)}</span>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Reset filters
 */
function resetFilters() {
    appState.searchFilter = '';
    appState.priceFilter = [0, 100000];
    appState.sortFilter = '';
    
    document.getElementById('browseSearch').value = '';
    document.querySelector('.price-slider').value = 100000;
    document.querySelector('.price-display').textContent = '$0 to $100,000';
    document.getElementById('query-display').textContent = '';
    document.getElementById('sortDropdown').value = '';
    
    appState.filteredCars = appState.cars;
    renderCars(appState.cars);
}

/**
 * Utility function to format numbers with commas
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-AU').format(num);
}

/**
 * Not implemented alert
 */
function notImplemented() {
    alert('This feature has not been implemented yet.');
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with mock data and fetch from API in background
    fetchCarsFromAPI().then(cars => {
        appState.cars = cars;
        appState.filteredCars = cars;
        renderCars(cars);
    });
    
    // Prevent default link behavior
    document.querySelectorAll('.link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href === '#') {
                e.preventDefault();
            }
        });
    });

    // Mobile menu close on link click
    document.querySelectorAll('.showMenu .link').forEach(link => {
        link.addEventListener('click', hideMenu);
    });
});


