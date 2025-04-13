class WishListManager {
    constructor() {
        if (!window.selectionManager) {
            console.error('SelectionManager not found. Initializing...');
            window.selectionManager = new SelectionManager();
        }
        this.selectionManager = window.selectionManager;
        this.map = null;
        this.markers = [];
        this.initializeEventListeners();
        this.loadWishList();
    }

    initializeEventListeners() {
        try {
            // Clear all button
            const clearBtn = document.querySelector('.clear-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearAllSelections());
            }

            // Show on map button
            const showOnMapBtn = document.getElementById('showOnMapBtn');
            if (showOnMapBtn) {
                showOnMapBtn.addEventListener('click', () => this.showAllOnMap());
            }

            // Listen for selection changes
            window.addEventListener('selectionsChanged', () => {
                console.log('Selections changed, updating wish list...');
                this.loadWishList();
            });

            // Listen for storage events (for cross-tab synchronization)
            window.addEventListener('storage', (e) => {
                if (e.key === 'tripSelections') {
                    console.log('Storage changed, updating wish list...');
                    this.loadWishList();
                }
            });
        } catch (error) {
            console.error('Error initializing event listeners:', error);
        }
    }

    loadWishList() {
        try {
            const selections = this.selectionManager.getSelections();
            console.log('Loading wish list with selections:', selections);
            
            // Update each category
            ['places', 'restaurants', 'tours', 'events', 'photos'].forEach(category => {
                this.updateCategory(category, selections[category] || []);
            });
        } catch (error) {
            console.error('Error loading wish list:', error);
        }
    }

    updateCategory(category, items) {
        try {
            const categoryElement = document.querySelector(`.wish-list-category[data-category="${category}"]`);
            if (!categoryElement) {
                console.warn(`Category element not found for ${category}`);
                return;
            }

            const itemsContainer = categoryElement.querySelector('.category-items');
            const countElement = categoryElement.querySelector('.item-count');
            
            if (!itemsContainer || !countElement) {
                console.warn(`Required elements not found for ${category}`);
                return;
            }

            countElement.textContent = items.length;
            console.log(`Updating ${category} with ${items.length} items`);

            if (items.length === 0) {
                itemsContainer.innerHTML = this.getEmptyStateHTML(category);
                return;
            }

            const itemsHTML = items.map(itemId => {
                const itemData = this.getMockItemData(category, itemId);
                if (!itemData) {
                    console.warn(`No data found for ${category} item ${itemId}`);
                    return '';
                }

                return this.getItemHTML(category, itemId, itemData);
            }).join('');

            itemsContainer.innerHTML = itemsHTML;
        } catch (error) {
            console.error(`Error updating ${category}:`, error);
        }
    }

    getItemHTML(category, itemId, itemData) {
        // Ensure we have at least a title
        if (!itemData || !itemData.title) {
            console.warn(`Missing title for ${category} item ${itemId}`);
            return '';
        }

        // Build the HTML with only essential information
        let html = `
            <div class="wish-list-item" data-id="${itemId}">
                <div class="item-image">
                    <img src="${itemData.image || 'https://placehold.co/300x200/png?text=No+Image'}" 
                         alt="${itemData.title}"
                         onerror="this.src='https://placehold.co/300x200/png?text=Image+Not+Found'">
                </div>
                <div class="item-details">
                    <h3>${itemData.title}</h3>
                    ${itemData.location ? `
                        <p class="meta-info">
                            <i class="fas fa-map-marker-alt"></i> ${itemData.location}
                        </p>
                    ` : ''}
                    <div class="item-directions">
                        ${itemData.location ? `
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itemData.location + ' Bruges Belgium')}" 
                               target="_blank" class="maps-link">
                                <i class="fas fa-map-marked-alt"></i> Get Directions
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="remove-btn" onclick="window.wishListManager.removeItem('${category}', '${itemId}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        return html;
    }

    fetchItemDetails(category, id) {
        // This is a placeholder for actual data fetching
        // In a real implementation, you would fetch this data from an API or database
        // For now, we'll return mock data based on the category and ID
        
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const mockData = this.getMockItemData(category, id);
                resolve(mockData);
            }, 100);
        });
    }

    getMockItemData(category, id) {
        const mockData = {
            places: {
                'belfry': { id: 'belfry', title: 'Belfry Tower', description: 'Historic bell tower with panoramic views', image: 'https://placehold.co/300x200/png?text=Belfry+Tower', location: 'Markt Square', price: '€12' },
                'basilica': { id: 'basilica', title: 'Basilica of the Holy Blood', description: '12th-century basilica housing a relic of the Holy Blood', image: 'https://placehold.co/300x200/png?text=Basilica', location: 'Burg Square', price: '€2.50' },
                'minnewater': { id: 'minnewater', title: 'Minnewater Lake', description: 'Romantic lake known as the "Lake of Love"', image: 'https://placehold.co/300x200/png?text=Minnewater', location: 'Minnewater Park', price: 'Free' },
                'begijnhof': { id: 'begijnhof', title: 'Begijnhof', description: 'Historic beguinage with white houses and tranquil gardens', image: 'https://placehold.co/300x200/png?text=Begijnhof', location: 'Begijnhof', price: '€2' },
                'de-burg': { id: 'de-burg', title: 'De Burg', description: 'Historic square with the Town Hall and Basilica', image: 'https://placehold.co/300x200/png?text=De+Burg', location: 'Burg Square', price: 'Free' }
            },
            restaurants: {
                'de-karmeliet': { id: 'de-karmeliet', title: 'De Karmeliet', description: 'Michelin-starred restaurant serving Belgian cuisine', image: 'https://placehold.co/300x200/png?text=De+Karmeliet', location: 'Langestraat 19', price: '€€€' },
                'den-dyver': { id: 'den-dyver', title: 'Den Dyver', description: 'Beer restaurant with beer-paired dishes', image: 'https://placehold.co/300x200/png?text=Den+Dyver', location: 'Dijver 5', price: '€€' },
                'tom-pouce': { id: 'tom-pouce', title: 'Tom Pouce', description: 'Traditional Belgian restaurant', image: 'https://placehold.co/300x200/png?text=Tom+Pouce', location: 'Simon Stevinplein', price: '€€' },
                'de-bottelier': { id: 'de-bottelier', title: 'De Bottelier', description: 'Seafood restaurant with canal views', image: 'https://placehold.co/300x200/png?text=De+Bottelier', location: 'Huidenvettersplein', price: '€€' },
                'thats-toast': { id: 'thats-toast', title: "That's Toast", description: 'Cozy café serving delicious toasties and coffee', image: 'https://placehold.co/300x200/png?text=Thats+Toast', location: 'Langestraat 42', price: '€' }
            },
            tours: {
                'canal-tour': { id: 'canal-tour', title: 'Canal Boat Tour', description: 'Scenic boat tour through Bruges canals', image: 'https://placehold.co/300x200/png?text=Canal+Tour', location: 'Various departure points', price: '€10', duration: '30 min' },
                'chocolate-workshop': { id: 'chocolate-workshop', title: 'Chocolate Workshop', description: 'Learn to make Belgian chocolates', image: 'https://placehold.co/300x200/png?text=Chocolate+Workshop', location: 'Chocolate Line', price: '€35', duration: '2 hours' },
                'brewery-tour': { id: 'brewery-tour', title: 'Brewery Tour', description: 'Tour of De Halve Maan brewery with tasting', image: 'https://placehold.co/300x200/png?text=Brewery+Tour', location: 'De Halve Maan', price: '€12', duration: '45 min' },
                'huidenvettersplein': { id: 'huidenvettersplein', title: 'Huidenvettersplein', description: 'Historic square with restaurants and canal views', image: 'https://placehold.co/300x200/png?text=Huidenvettersplein', location: 'Huidenvettersplein', price: 'Free', duration: '1 hour' },
                'rozenhoedkaai': { id: 'rozenhoedkaai', title: 'Rozenhoedkaai', description: 'Most photographed spot in Bruges with canal views', image: 'https://placehold.co/300x200/png?text=Rozenhoedkaai', location: 'Rozenhoedkaai', price: 'Free', duration: '30 min' }
            },
            events: {
                'beer-festival': { id: 'beer-festival', title: 'Bruges Beer Festival', description: 'Annual beer festival with local breweries', image: 'https://placehold.co/300x200/png?text=Beer+Festival', location: 'Market Square', date: 'June 15-17, 2024', price: '€15' },
                'holy-blood': { id: 'holy-blood', title: 'Procession of the Holy Blood', description: 'Annual religious procession', image: 'https://placehold.co/300x200/png?text=Holy+Blood', location: 'City Center', date: 'Ascension Day', price: 'Free' },
                'christmas-market': { id: 'christmas-market', title: 'Bruges Christmas Market', description: 'Festive market with local crafts and food', image: 'https://placehold.co/300x200/png?text=Christmas+Market', location: 'Market Square', date: 'Nov 25 - Jan 6', price: 'Free' },
                'light-festival': { id: 'light-festival', title: 'Bruges Light Festival', description: 'Biennial light art festival', image: 'https://placehold.co/300x200/png?text=Light+Festival', location: 'Throughout Bruges', date: 'December 2024', price: 'Free' }
            },
            photos: {
                'belfort-view': { id: 'belfort-view', title: 'Belfort View', description: 'Historic city center', image: 'https://placehold.co/300x200/png?text=Belfort+View', photographer: 'John Doe', location: 'Market Square' },
                'canal-reflections': { id: 'canal-reflections', title: 'Canal Reflections', description: 'Historic buildings reflected in the canal water', image: 'https://placehold.co/300x200/png?text=Canal+Reflections', photographer: 'Jane Smith', location: 'Rozenhoedkaai' },
                'market-square': { id: 'market-square', title: 'Market Square', description: 'The heart of Bruges', image: 'https://placehold.co/300x200/png?text=Market+Square', photographer: 'Mike Johnson', location: 'Markt' }
            }
        };

        return mockData[category]?.[id] || null;
    }

    getEmptyStateHTML(category) {
        const categoryLinks = {
            places: 'places-to-visit.html',
            restaurants: 'restaurants.html',
            tours: 'tours.html',
            events: 'events.html',
            photos: 'gallery.html'
        };

        const categoryIcons = {
            places: 'fa-landmark',
            restaurants: 'fa-utensils',
            tours: 'fa-map-marked-alt',
            events: 'fa-calendar',
            photos: 'fa-images'
        };

        return `
            <div class="empty-state">
                <i class="fas ${categoryIcons[category]}"></i>
                <p>No ${category} added to your wish list yet.</p>
                <a href="${categoryLinks[category]}" class="browse-btn">Browse ${category}</a>
            </div>
        `;
    }

    getCategoryLink(category) {
        const links = {
            places: 'places-to-visit.html',
            restaurants: 'restaurants.html',
            tours: 'tours.html',
            events: 'events.html',
            photos: 'gallery.html'
        };
        return links[category] || '#';
    }

    removeItem(category, itemId) {
        this.selectionManager.removeSelection(itemId, category);
        this.loadWishList();
    }

    clearAllSelections() {
        if (confirm('Are you sure you want to clear all items from your wish list?')) {
            this.selectionManager.clearSelections();
            this.loadWishList();
        }
    }

    async showAllOnMap() {
        try {
            const mapContainer = document.getElementById('mapContainer');
            const mapCloseBtn = document.getElementById('mapCloseBtn');
            const mapElement = document.getElementById('map');
            
            // Show the map container
            mapContainer.style.display = 'block';

            // Clear existing map if it exists
            if (this.map) {
                this.map.remove();
                this.map = null;
            }

            // Clear existing markers
            this.markers.forEach(marker => marker.remove());
            this.markers = [];

            // Wait for the container to be visible
            await new Promise(resolve => setTimeout(resolve, 100));

            // Initialize new map
            this.map = L.map(mapElement, {
                zoomControl: true,
                attributionControl: true,
                preferCanvas: true,
                maxZoom: 18,
                minZoom: 10
            }).setView([51.2093, 3.2247], 14);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                detectRetina: true
            }).addTo(this.map);

            // Force a resize event
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);

            const selections = this.selectionManager.getSelections();
            const bounds = L.latLngBounds([]);

            // Process each category
            for (const [category, items] of Object.entries(selections)) {
                for (const itemId of items) {
                    const itemData = this.getMockItemData(category, itemId);
                    if (itemData && itemData.location) {
                        // Geocode the location using Nominatim
                        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(itemData.location + ', Bruges, Belgium')}`);
                        const data = await response.json();
                        
                        if (data && data[0]) {
                            const lat = parseFloat(data[0].lat);
                            const lng = parseFloat(data[0].lon);
                            const position = [lat, lng];
                            bounds.extend(position);

                            const marker = L.marker(position, {
                                icon: this.getMarkerIcon(category)
                            }).addTo(this.map);

                            marker.bindPopup(`
                                <div class="map-popup">
                                    <h3>${itemData.title}</h3>
                                    <p>${itemData.location}</p>
                                    <p>Category: ${category}</p>
                                </div>
                            `);

                            this.markers.push(marker);
                        }
                    }
                }
            }

            // Fit map to show all markers
            if (this.markers.length > 0) {
                this.map.fitBounds(bounds, { padding: [50, 50] });
            }

            // Add close button functionality
            mapCloseBtn.onclick = () => {
                mapContainer.style.display = 'none';
                if (this.map) {
                    this.map.remove();
                    this.map = null;
                }
            };
        } catch (error) {
            console.error('Error showing items on map:', error);
            const mapContainer = document.getElementById('mapContainer');
            if (mapContainer) {
                mapContainer.style.display = 'none';
            }
        }
    }

    getMarkerIcon(category) {
        const colors = {
            places: 'red',
            restaurants: 'green',
            tours: 'blue',
            events: 'yellow',
            photos: 'purple'
        };
        
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${colors[category] || 'red'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
    }
}

// Initialize the wish list manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (!window.selectionManager) {
            window.selectionManager = new SelectionManager();
        }
        window.wishListManager = new WishListManager();
        console.log('WishListManager initialized successfully');
    } catch (error) {
        console.error('Error initializing WishListManager:', error);
    }
}); 