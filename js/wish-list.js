class WishListManager {
    constructor() {
        this.selectionManager = new SelectionManager();
        this.initializeEventListeners();
        this.loadWishList();
    }

    initializeEventListeners() {
        // Clear all button
        const clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllSelections());
        }
    }

    loadWishList() {
        const selections = this.selectionManager.getSelections();
        this.updateCategory('places', selections.places);
        this.updateCategory('restaurants', selections.restaurants);
        this.updateCategory('tours', selections.tours);
        this.updateCategory('events', selections.events);
        this.updateCategory('photos', selections.photos);
    }

    updateCategory(category, items) {
        const categoryElement = document.querySelector(`.wish-list-category[data-category="${category}"]`);
        if (!categoryElement) return;

        const itemsContainer = categoryElement.querySelector('.category-items');
        const itemCount = categoryElement.querySelector('.item-count');
        
        if (!items || items.length === 0) {
            itemsContainer.innerHTML = this.getEmptyStateHTML(category);
            itemCount.textContent = '0';
            return;
        }

        itemCount.textContent = items.length;
        
        // Fetch item details for each ID
        const itemPromises = items.map(id => this.fetchItemDetails(category, id));
        
        Promise.all(itemPromises)
            .then(itemDetails => {
                itemsContainer.innerHTML = itemDetails
                    .filter(item => item) // Filter out any null items
                    .map(item => this.getItemHTML(category, item))
                    .join('');
                
                // Add event listeners to the new items
                this.initializeItemEventListeners(category);
            })
            .catch(error => {
                console.error(`Error loading ${category} items:`, error);
                itemsContainer.innerHTML = this.getEmptyStateHTML(category);
            });
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
        // Mock data for demonstration purposes
        // In a real implementation, this would come from your backend
        
        const mockData = {
            places: {
                'place1': { id: 'place1', title: 'Belfry of Bruges', description: 'Historic bell tower in the city center', image: 'images/places/belfry.jpg', location: 'Markt', price: '€12', directions: 'Located in the heart of Bruges, the Belfry is accessible via Markt square. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop.' },
                'place2': { id: 'place2', title: 'Basilica of the Holy Blood', description: '12th-century basilica', image: 'images/places/basilica.jpg', location: 'Burg Square', price: 'Free', directions: 'Located in Burg Square, a short walk from the Markt. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 2 minutes to Burg Square.' },
                'place3': { id: 'place3', title: 'Groeningemuseum', description: 'Art museum with Flemish paintings', image: 'images/places/groeninge.jpg', location: 'Dijver', price: '€12', directions: 'Located on Dijver street, near the Gruuthuse Museum. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 5 minutes to Dijver.' }
            },
            restaurants: {
                'rest1': { id: 'rest1', title: 'De Halve Maan Brewery', description: 'Traditional Belgian cuisine with brewery tour', image: 'images/restaurants/halve-maan.jpg', location: 'Walplein', price: '€€', directions: 'Located on Walplein square. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 10 minutes to Walplein.' },
                'rest2': { id: 'rest2', title: 'Gruuthuse Hof', description: 'Fine dining with local specialties', image: 'images/restaurants/gruuthuse.jpg', location: 'Muntplein', price: '€€€', directions: 'Located on Muntplein square. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 5 minutes to Muntplein.' },
                'rest3': { id: 'rest3', title: 'That\'s Toast', description: 'Modern café with creative toasts', image: 'images/restaurants/thats-toast.jpg', location: 'Langestraat', price: '€', directions: 'Located on Langestraat street. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 7 minutes to Langestraat.' }
            },
            tours: {
                'tour1': { id: 'tour1', title: 'Canal Boat Tour', description: 'Scenic boat tour through Bruges canals', image: 'images/tours/canal-tour.jpg', location: 'Various departure points', price: '€10', duration: '30 min', directions: 'Departure points include Rozenhoedkaai, Dijver, and Huidenvettersplein. The main departure point is Rozenhoedkaai, a 5-minute walk from the Markt.' },
                'tour2': { id: 'tour2', title: 'Chocolate Workshop', description: 'Learn to make Belgian chocolates', image: 'images/tours/chocolate-workshop.jpg', location: 'Chocolate Line', price: '€35', duration: '2 hours', directions: 'Located at Simon Stevinplein 19. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 3 minutes to Simon Stevinplein.' },
                'tour3': { id: 'tour3', title: 'Brewery Tour', description: 'Tour of De Halve Maan brewery with tasting', image: 'images/tours/brewery-tour.jpg', location: 'De Halve Maan', price: '€12', duration: '45 min', directions: 'Located at Walplein 26. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and walk 10 minutes to Walplein.' }
            },
            events: {
                'event1': { id: 'event1', title: 'Bruges Beer Festival', description: 'Annual beer festival with local breweries', image: 'images/events/beer-festival.jpg', location: 'Market Square', date: 'June 15-17, 2024', price: '€15', directions: 'Takes place in the Market Square. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop.' },
                'event2': { id: 'event2', title: 'Procession of the Holy Blood', description: 'Annual religious procession', image: 'images/events/holy-blood.jpg', location: 'City Center', date: 'Ascension Day', price: 'Free', directions: 'The procession starts at the Basilica of the Holy Blood in Burg Square and follows a route through the city center. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop.' },
                'event3': { id: 'event3', title: 'Bruges Christmas Market', description: 'Festive market with local crafts and food', image: 'images/events/christmas-market.jpg', location: 'Market Square', date: 'Nov 25 - Jan 6', price: 'Free', directions: 'Takes place in the Market Square and surrounding streets. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop.' }
            },
            photos: {
                'photo1': { id: 'photo1', title: 'Belfry at Sunset', description: 'The iconic Belfry tower against a colorful sky', image: 'images/photos/belfry-sunset.jpg', photographer: 'John Doe', location: 'Market Square', directions: 'Best viewing spot is from the corner of Markt and Breidelstraat, facing the Belfry.' },
                'photo2': { id: 'photo2', title: 'Canal Reflections', description: 'Historic buildings reflected in the canal water', image: 'images/photos/canal-reflections.jpg', photographer: 'Jane Smith', location: 'Rozenhoedkaai', directions: 'Located at Rozenhoedkaai, a 5-minute walk from the Markt. Best photographed in the morning or evening for optimal reflections.' },
                'photo3': { id: 'photo3', title: 'Medieval Streets', description: 'Narrow cobblestone streets in the historic center', image: 'images/photos/medieval-streets.jpg', photographer: 'Mike Johnson', location: 'Various', directions: 'Best spots include Stoofstraat, Groenerei, and Rozenhoedkaai. These streets are within a 10-minute walk from the Markt.' }
            }
        };
        
        // If the ID doesn't exist in our mock data, create a generic item
        if (!mockData[category] || !mockData[category][id]) {
            console.log(`Creating generic item for ${category} with ID ${id}`);
            return {
                id: id,
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Item ${id}`,
                description: `This is a selected ${category} item.`,
                image: `images/${category}/placeholder.jpg`,
                location: 'Bruges',
                directions: `This ${category} is located in Bruges. Take bus lines 1, 3, 4, 6, 11, 13, 14, or 16 to the Markt stop and follow the signs.`
            };
        }
        
        return mockData[category][id];
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

    getItemHTML(category, item) {
        if (!item) return '';
        
        // Ensure we have a title and location
        const title = item.title || `${category.charAt(0).toUpperCase() + category.slice(1)} Item ${item.id}`;
        const location = item.location || 'Bruges';
        
        // Create Google Maps link
        const mapsQuery = encodeURIComponent(`${title}, ${location}, Bruges, Belgium`);
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

        return `
            <div class="wish-list-item" data-id="${item.id}">
                <div class="item-details">
                    <h3 class="item-title">${title}</h3>
                    <a href="${mapsLink}" target="_blank" class="maps-link">
                        <i class="fas fa-map-marked-alt"></i> View on Google Maps
                    </a>
                </div>
                <div class="item-actions">
                    <button class="remove-btn" title="Remove from Wish List">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    initializeItemEventListeners(category) {
        const categoryElement = document.querySelector(`.wish-list-category[data-category="${category}"]`);
        if (!categoryElement) return;

        // Remove buttons
        categoryElement.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Make sure we get the closest wish-list-item even if the click was on the icon
                const item = e.target.closest('.wish-list-item');
                if (!item) return;
                
                const itemId = item.dataset.id;
                this.removeItem(category, itemId);
            });
        });

        // View buttons
        categoryElement.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Make sure we get the closest wish-list-item even if the click was on the icon
                const item = e.target.closest('.wish-list-item');
                if (!item) return;
                
                const itemId = item.dataset.id;
                this.viewItemDetails(category, itemId);
            });
        });
    }

    removeItem(category, itemId) {
        this.selectionManager.removeSelection(itemId, category);
        this.loadWishList();
    }

    viewItemDetails(category, itemId) {
        const categoryLinks = {
            places: 'places-to-visit.html',
            restaurants: 'restaurants.html',
            tours: 'tours.html',
            events: 'events.html',
            photos: 'gallery.html'
        };

        window.location.href = `${categoryLinks[category]}?id=${itemId}`;
    }

    clearAllSelections() {
        if (confirm('Are you sure you want to clear all items from your wish list?')) {
            this.selectionManager.clearSelections();
            this.loadWishList();
        }
    }
}

// Initialize the wish list manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WishListManager();
}); 