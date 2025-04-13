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

            // Listen for restaurant selection changes
            document.addEventListener('restaurantSelected', (e) => {
                console.log('Restaurant selection changed:', e.detail);
                this.updateCategory('restaurants', this.selectionManager.getSelections().restaurants || []);
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

                return this.getItemHTML(category, itemData);
            }).join('');

            itemsContainer.innerHTML = itemsHTML;
        } catch (error) {
            console.error(`Error updating ${category}:`, error);
        }
    }

    getItemHTML(category, item) {
        return `
            <div class="wish-list-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p class="description">${item.description}</p>
                    <p class="meta-info">
                        <i class="fas fa-map-marker-alt"></i> ${item.location}
                        ${item.price ? `<i class="fas fa-euro-sign"></i> ${item.price}` : ''}
                    </p>
                    <div class="item-directions">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.title + ' ' + item.location)}" 
                           class="maps-link" target="_blank">
                            <i class="fas fa-directions"></i> Get Directions
                        </a>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="remove-btn" data-category="${category}" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
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
        // Mock data for items
        const mockData = {
            places: {
                'market-square': { 
                    title: 'Market Square', 
                    description: 'Historic central square of Bruges', 
                    image: 'https://placehold.co/300x200/png?text=Market+Square', 
                    location: 'Markt', 
                    price: 'Free',
                    rating: '4.7 (13K)',
                    website: 'https://www.visitbruges.be/en/markt'
                },
                'de-burg': { 
                    title: 'De Burg', 
                    description: 'Historic square with the Town Hall and Basilica', 
                    image: 'https://placehold.co/300x200/png?text=De+Burg', 
                    location: 'Burg Square', 
                    price: 'Free',
                    rating: '4.6 (3.8K)',
                    website: 'https://www.visitbruges.be/hoogtepunten/burg'
                },
                'minnewater': { 
                    title: 'Minnewater Lake', 
                    description: 'Romantic lake known as the "Lake of Love"', 
                    image: 'https://placehold.co/300x200/png?text=Minnewater', 
                    location: 'Minnewater Park', 
                    price: 'Free',
                    rating: '4.8 (2.1K)'
                },
                'begijnhof': { 
                    title: 'Begijnhof', 
                    description: 'Historic beguinage with white houses and tranquil gardens', 
                    image: 'https://placehold.co/300x200/png?text=Begijnhof', 
                    location: 'Begijnhof', 
                    price: '€2',
                    rating: '4.7 (5.2K)',
                    website: 'https://www.visitbruges.be/en/begijnhof'
                },
                'belfort': {
                    title: 'Belfry Tower',
                    description: 'Historic bell tower with panoramic views',
                    image: 'https://placehold.co/300x200/png?text=Belfry+Tower',
                    location: 'Markt',
                    price: '€12',
                    rating: '4.6 (23K)',
                    website: 'https://www.museabrugge.be/bezoek-onze-musea/onze-musea-en-monumenten/belfort'
                },
                'basilica': {
                    title: 'Basilica of the Holy Blood',
                    description: '12th-century basilica housing a relic of the Holy Blood',
                    image: 'https://placehold.co/300x200/png?text=Basilica',
                    location: 'Burg Square',
                    price: '€2.50',
                    rating: '4.6 (4.7K)',
                    website: 'http://www.holyblood.com/'
                },
                'historium': {
                    title: 'Historium Bruges',
                    description: 'Interactive museum about medieval Bruges',
                    image: 'https://placehold.co/300x200/png?text=Historium',
                    location: 'Markt',
                    price: '€17',
                    rating: '4.3 (4.4K)',
                    website: 'https://www.historium.be/'
                },
                'groeninge-museum': {
                    title: 'Groeninge Museum',
                    description: 'Art museum with Flemish Primitive paintings',
                    image: 'https://placehold.co/300x200/png?text=Groeninge+Museum',
                    location: 'Dijver',
                    price: '€12',
                    rating: '4.5 (3.2K)',
                    website: 'https://www.museabrugge.be/groeningemuseum'
                },
                'church-of-our-lady': {
                    title: 'Church of Our Lady',
                    description: 'Gothic church with Michelangelo\'s Madonna and Child',
                    image: 'https://placehold.co/300x200/png?text=Church+of+Our+Lady',
                    location: 'Mariastraat',
                    price: '€6',
                    rating: '4.6 (9.9K)',
                    website: 'http://www.museabrugge.be/'
                },
                'rozenhoedkaai': {
                    title: 'Rosary Quay',
                    description: 'Most photographed spot in Bruges with canal views',
                    image: 'https://placehold.co/300x200/png?text=Rosary+Quay',
                    location: 'Rozenhoedkaai',
                    price: 'Free',
                    rating: '4.8 (1.8K)',
                    website: 'https://www.visitbruges.be/en/rozenhoedkaai'
                },
                'chocolate-museum': {
                    title: 'Choco-Story',
                    description: 'Museum about the history of chocolate',
                    image: 'https://placehold.co/300x200/png?text=Chocolate+Museum',
                    location: 'Wijnzakstraat',
                    price: '€11',
                    rating: '4.1 (8.1K)',
                    website: 'http://www.choco-story-brugge.be/'
                },
                'halve-maan': {
                    title: 'De Halve Maan',
                    description: 'Family brewery with guided tours',
                    image: 'https://placehold.co/300x200/png?text=De+Halve+Maan',
                    location: 'Walplein',
                    price: '€12',
                    rating: '4.6 (4K)',
                    website: 'http://www.halvemaan.be/'
                },
                'sint-salvator': {
                    title: 'Sint-Salvatorskathedraal',
                    description: 'Main church of Bruges with rich history',
                    image: 'https://placehold.co/300x200/png?text=Sint-Salvator',
                    location: 'Sint-Salvatorskerkhof',
                    price: 'Free',
                    rating: '4.6 (7.1K)',
                    website: 'https://www.sintsalvatorskathedraal.be/'
                },
                'boniface-bridge': {
                    title: 'Boniface Bridge',
                    description: 'Romantic bridge with canal views',
                    image: 'https://placehold.co/300x200/png?text=Boniface+Bridge',
                    location: 'Mariastraat',
                    price: 'Free',
                    rating: '4.7 (3.5K)',
                    website: 'https://www.visitbruges.be/en/bonifaciusbrug-bonifaciusbridge'
                },
                'city-hall': {
                    title: 'Bruges City Hall',
                    description: 'Gothic city hall with historic hall',
                    image: 'https://placehold.co/300x200/png?text=City+Hall',
                    location: 'Burg',
                    price: '€6',
                    rating: '4.6 (1.5K)',
                    website: 'http://www.museabrugge.be/'
                },
                'beer-experience': {
                    title: 'Bruges Beer Experience',
                    description: 'Interactive museum about Belgian beer',
                    image: 'https://placehold.co/300x200/png?text=Beer+Experience',
                    location: 'Breidelstraat',
                    price: '€15',
                    rating: '4.4 (5.2K)',
                    website: 'http://mybeerexperience.com/'
                },
                'sint-janshospitaal': {
                    title: 'Saint John\'s Hospital',
                    description: 'Medieval hospital with art collection',
                    image: 'https://placehold.co/300x200/png?text=Saint+Johns+Hospital',
                    location: 'Mariastraat',
                    price: '€12',
                    rating: '4.3 (2.1K)',
                    website: 'https://www.museabrugge.be/en/visit-our-museums/our-museums-and-monumenten/sint-janshospitaal'
                },
                'luc-vanlaere': {
                    title: 'Luc Vanlaere Harpist',
                    description: 'Concert hall with harp performances',
                    image: 'https://placehold.co/300x200/png?text=Luc+Vanlaere',
                    location: 'Katelijnestraat',
                    price: '€15',
                    rating: '5.0 (531)',
                    website: 'http://www.harpmuziek.be/'
                }
            },
            restaurants: {
                'de-karmeliet': { id: 'de-karmeliet', title: 'De Karmeliet', description: 'Michelin-starred restaurant serving Belgian cuisine', image: 'https://placehold.co/300x200/png?text=De+Karmeliet', location: 'Langestraat 19', price: '€€€' },
                'den-dyver': { id: 'den-dyver', title: 'Den Dyver', description: 'Beer restaurant with beer-paired dishes', image: 'https://placehold.co/300x200/png?text=Den+Dyver', location: 'Dijver 5', price: '€€' },
                'tom-pouce': { id: 'tom-pouce', title: 'Tom Pouce', description: 'Traditional Belgian restaurant', image: 'https://placehold.co/300x200/png?text=Tom+Pouce', location: 'Simon Stevinplein', price: '€€' },
                'de-bottelier': { id: 'de-bottelier', title: 'De Bottelier', description: 'Seafood restaurant with canal views', image: 'https://placehold.co/300x200/png?text=De+Bottelier', location: 'Huidenvettersplein', price: '€€' },
                'thats-toast': { id: 'thats-toast', title: "That's Toast", description: 'Cozy café serving delicious toasties and coffee', image: 'https://placehold.co/300x200/png?text=Thats+Toast', location: 'Langestraat 42', price: '€' },
                'de-gastro': { id: 'de-gastro', title: 'De Gastro', description: 'Modern Belgian cuisine with a creative twist', image: 'https://placehold.co/300x200/png?text=De+Gastro', location: 'Langestraat 15', price: '€€' }
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
        this.selectionManager.removeSelection(category, itemId);
        this.updateCategory(category, this.selectionManager.getSelections()[category] || []);
    }

    clearAllSelections() {
        if (confirm('Are you sure you want to clear all items from your wish list?')) {
            this.selectionManager.clearAllSelections();
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

            // Clear the map element and recreate it
            mapElement.innerHTML = '';
            const newMapElement = document.createElement('div');
            newMapElement.id = 'map';
            newMapElement.style.width = '100%';
            newMapElement.style.height = '100%';
            mapElement.appendChild(newMapElement);

            // Wait for the container to be visible
            await new Promise(resolve => setTimeout(resolve, 100));

            // Initialize new map centered on Bruges
            this.map = L.map(newMapElement, {
                zoomControl: true,
                attributionControl: true,
                preferCanvas: true,
                maxZoom: 18,
                minZoom: 10
            }).setView([51.2093, 3.2247], 14);
            
            // Add OpenStreetMap tiles with proper attribution
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                detectRetina: true
            }).addTo(this.map);

            // Force a resize event
            this.map.invalidateSize();

            const selections = this.selectionManager.getSelections();
            const bounds = L.latLngBounds([]);

            // Predefined coordinates for Bruges locations from OpenStreetMap data
            const locationCoordinates = {
                // Places
                'market-square': [51.2086, 3.2247],
                'de-burg': [51.2093, 3.2247],
                'minnewater': [51.2019, 3.2256],
                'begijnhof': [51.2028, 3.2214],
                'belfort': [51.2086, 3.2247],
                'basilica': [51.2093, 3.2247],
                'historium': [51.2086, 3.2247],
                'groeninge-museum': [51.2086, 3.2247],
                'church-of-our-lady': [51.2086, 3.2247],
                'rozenhoedkaai': [51.2078, 3.2256],
                'chocolate-museum': [51.2086, 3.2247],
                'halve-maan': [51.2019, 3.2256],
                'sint-salvator': [51.2086, 3.2247],
                'boniface-bridge': [51.2078, 3.2256],
                'city-hall': [51.2093, 3.2247],
                'beer-experience': [51.2086, 3.2247],
                'sint-janshospitaal': [51.2086, 3.2247],
                'luc-vanlaere': [51.2086, 3.2247],

                // Restaurants
                'de-karmeliet': [51.2102, 3.2251],
                'den-dyver': [51.2078, 3.2256],
                'tom-pouce': [51.2089, 3.2241],
                'de-bottelier': [51.2075, 3.2261],
                'thats-toast': [51.2091, 3.2239],
                'de-gastro': [51.2101, 3.2248],

                // Tours
                'canal-tour': [51.2078, 3.2256],
                'chocolate-workshop': [51.2086, 3.2247],
                'brewery-tour': [51.2019, 3.2256],
                'huidenvettersplein': [51.2075, 3.2261],

                // Events
                'beer-festival': [51.2086, 3.2247],
                'holy-blood': [51.2093, 3.2247],
                'christmas-market': [51.2086, 3.2247],
                'light-festival': [51.2086, 3.2247]
            };

            // Process each category
            for (const [category, items] of Object.entries(selections)) {
                for (const itemId of items) {
                    const itemData = this.getMockItemData(category, itemId);
                    if (itemData && itemData.location) {
                        const coordinates = locationCoordinates[itemId];
                        if (coordinates) {
                            const position = coordinates;
                            bounds.extend(position);

                            // Create custom icon based on category
                            const icon = L.divIcon({
                                className: 'custom-marker',
                                html: `<div class="marker-icon ${category}"></div>`,
                                iconSize: [30, 30],
                                iconAnchor: [15, 30]
                            });

                            const marker = L.marker(position, { icon }).addTo(this.map);

                            // Create popup content with rating if available
                            const rating = itemData.rating ? `<p>Rating: ${itemData.rating}</p>` : '';
                            const popupContent = `
                                <div class="map-popup">
                                    <h3>${itemData.title}</h3>
                                    <p>${itemData.location}</p>
                                    <p>Category: ${category}</p>
                                    ${rating}
                                    ${itemData.description ? `<p>${itemData.description}</p>` : ''}
                                    ${itemData.price ? `<p>Price: ${itemData.price}</p>` : ''}
                                    ${itemData.website ? `<p><a href="${itemData.website}" target="_blank">Visit Website</a></p>` : ''}
                                </div>
                            `;

                            marker.bindPopup(popupContent);
                            this.markers.push(marker);
                        }
                    }
                }
            }

            // Fit map to show all markers with padding
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
                // Clear the map element
                mapElement.innerHTML = '';
            };
        } catch (error) {
            console.error('Error showing items on map:', error);
            const mapContainer = document.getElementById('mapContainer');
            if (mapContainer) {
                mapContainer.style.display = 'none';
            }
            // Clear the map element
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.innerHTML = '';
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