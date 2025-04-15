class WishListManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.selectionManager = window.selectionManager;
        this.locations = new Map(); // Store all locations with their details
        
        this.init();
    }

    init() {
        this.initMap();
        this.initEventListeners();
        this.loadWishList();
    }

    initMap() {
        // Initialize map centered on Bruges
        this.map = L.map('wish-list-map').setView([51.2093, 3.2247], 14);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    initEventListeners() {
        // Show/hide map button
        const showMapBtn = document.getElementById('show-map-btn');
        if (showMapBtn) {
            showMapBtn.addEventListener('click', () => {
                const mapSection = document.getElementById('map-section');
                mapSection.classList.toggle('visible');
            });
        }

        // Clear all button
        const clearAllBtn = document.getElementById('clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                this.selectionManager.clearAll();
                this.loadWishList();
            });
        }
    }

    loadWishList() {
        if (!this.selectionManager) return;

        const selections = this.selectionManager.getSelections();
        this.locations.clear(); // Clear existing locations
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        // Process each category
        Object.entries(selections).forEach(([category, items]) => {
            if (category === 'photos') return; // Skip photos as they don't have locations

            items.forEach(item => {
                this.fetchItemDetails(category, item)
                    .then(details => {
                        if (details && details.location) {
                            // Store location details
                            this.locations.set(item, {
                                category,
                                title: details.title,
                                location: details.location,
                                coordinates: details.coordinates,
                                description: details.description,
                                type: details.type,
                                hours: details.hours,
                                price: details.price,
                                website: details.website
                            });

                            // Add marker to map
                            if (details.coordinates) {
                                const marker = L.marker(details.coordinates)
                                    .bindPopup(`
                                        <h3>${details.title}</h3>
                                        <p>${details.type}</p>
                                        <p>${details.location}</p>
                                        ${details.description ? `<p>${details.description}</p>` : ''}
                                        ${details.hours ? `<p>${details.hours}</p>` : ''}
                                        ${details.price ? `<p>${details.price}</p>` : ''}
                                        ${details.website ? `<a href="${details.website}" target="_blank">Website</a>` : ''}
                                    `);
                                marker.addTo(this.map);
                                this.markers.push(marker);
                            }
                        }
                    });
            });
        });
    }

    fetchItemDetails(category, itemId) {
        return new Promise((resolve) => {
            // Try to find the original card in the DOM
            const originalCard = document.querySelector(`[data-id="${itemId}"]`);
            if (originalCard) {
                const details = {
                    title: originalCard.querySelector('h2')?.textContent || '',
                    type: originalCard.querySelector('.cuisine-type')?.textContent || '',
                    location: originalCard.querySelector('.address')?.textContent || '',
                    description: originalCard.querySelector('.description p')?.textContent || '',
                    hours: originalCard.querySelector('.hours')?.textContent || '',
                    price: originalCard.querySelector('.price-range')?.textContent || '',
                    website: originalCard.querySelector('.directions-btn')?.href || ''
                };
                resolve(details);
            } else {
                // If original card not found, use mock data
                resolve(this.getMockItemData(category, itemId));
            }
        });
    }

    getMockItemData(category, id) {
        // Mock data for testing
        const mockData = {
            places: {
                'belfort': {
                    title: 'Belfort',
                    type: 'Historic Tower',
                    location: 'Markt 7',
                    description: 'Medieval bell tower in the historic center of Bruges',
                    coordinates: [51.2081, 3.2247]
                },
                'de-burg': {
                    title: 'De Burg',
                    type: 'Historic Square',
                    location: 'Burg Square',
                    description: 'Historic square in the heart of Bruges',
                    coordinates: [51.2093, 3.2247]
                }
            },
            restaurants: {
                'thats-toast': {
                    title: "That's Toast",
                    type: 'Restaurant',
                    location: 'Philipstockstraat 25',
                    description: 'Modern toast restaurant with creative toppings',
                    coordinates: [51.2085, 3.2250]
                },
                'de-gastro': {
                    title: 'De Gastro',
                    type: 'Restaurant',
                    location: 'Langestraat 15',
                    description: 'Traditional Belgian cuisine',
                    coordinates: [51.2100, 3.2255]
                }
            },
            tours: {
                'huidenvettersplein': {
                    title: 'Huidenvettersplein',
                    type: 'Historic Square',
                    location: 'Huidenvettersplein',
                    description: 'Charming square with historic buildings',
                    coordinates: [51.2075, 3.2240]
                },
                'rozenhoedkaai': {
                    title: 'Rozenhoedkaai',
                    type: 'Scenic View',
                    location: 'Rozenhoedkaai',
                    description: 'Most photographed spot in Bruges',
                    coordinates: [51.2070, 3.2235]
                }
            }
        };

        return mockData[category]?.[id] || null;
    }

    // Get all locations with their details
    getAllLocations() {
        return Array.from(this.locations.entries()).map(([id, details]) => ({
            id,
            ...details
        }));
    }
}
