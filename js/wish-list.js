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
                'belfort': { id: 'belfort', title: 'Belfort', description: 'The Belfry of Bruges is a medieval bell tower in the city center', image: 'Data/Places/belfort.jpg', location: 'Markt', price: '€12' },
                'de-burg': { id: 'de-burg', title: 'De Burg', description: 'The Burg Square is one of Bruges\' most important historical sites', image: 'Data/Places/de-burg.jpg', location: 'Burg Square', price: 'Free' },
                'market-square': { id: 'market-square', title: 'Market Square', description: 'The Markt of Bruges is the historic city center and main square', image: 'Data/Places/market-square.jpg', location: 'Markt', price: 'Free' }
            },
            restaurants: {
                'thats-toast': { id: 'thats-toast', title: 'That\'s Toast', description: 'A cozy brunch spot known for their artisanal toasts and fresh ingredients', image: 'Data/Restaurants/thats-toast.jpg', location: 'Dweersstraat 4', price: '€€' },
                'de-gastro': { id: 'de-gastro', title: 'De Gastro', description: 'Traditional Belgian cuisine with a modern twist', image: 'Data/Restaurants/de-gastro.jpg', location: 'Braambergstraat 6', price: '€€€' },
                'gruuthuse-hof': { id: 'gruuthuse-hof', title: 'Gruuthuse Hof', description: 'Fine dining restaurant serving local specialties', image: 'Data/Restaurants/gruuthuse-hof.jpg', location: 'Muntplein', price: '€€€' }
            },
            tours: {
                'canal-tour': { id: 'canal-tour', title: 'Canal Boat Tour', description: 'Scenic boat tour through Bruges canals', image: 'Data/Tours/canal-tour.jpg', location: 'Various departure points', price: '€10', duration: '30 min' },
                'chocolate-workshop': { id: 'chocolate-workshop', title: 'Chocolate Workshop', description: 'Learn to make Belgian chocolates', image: 'Data/Tours/chocolate-workshop.jpg', location: 'Chocolate Line', price: '€35', duration: '2 hours' },
                'brewery-tour': { id: 'brewery-tour', title: 'Brewery Tour', description: 'Tour of De Halve Maan brewery with tasting', image: 'Data/Tours/brewery-tour.jpg', location: 'De Halve Maan', price: '€12', duration: '45 min' }
            },
            events: {
                'beer-festival': { id: 'beer-festival', title: 'Bruges Beer Festival', description: 'Annual beer festival with local breweries', image: 'Data/Events/beer-festival.jpg', location: 'Market Square', date: 'June 15-17, 2024', price: '€15' },
                'holy-blood': { id: 'holy-blood', title: 'Procession of the Holy Blood', description: 'Annual religious procession', image: 'Data/Events/holy-blood.jpg', location: 'City Center', date: 'Ascension Day', price: 'Free' },
                'christmas-market': { id: 'christmas-market', title: 'Bruges Christmas Market', description: 'Festive market with local crafts and food', image: 'Data/Events/christmas-market.jpg', location: 'Market Square', date: 'Nov 25 - Jan 6', price: 'Free' }
            },
            photos: {
                'belfort-view': { id: 'belfort-view', title: 'Belfort View', description: 'Historic city center', image: 'Data/Gallery/belfort-view.jpg', photographer: 'John Doe', location: 'Market Square' },
                'canal-reflections': { id: 'canal-reflections', title: 'Canal Reflections', description: 'Historic buildings reflected in the canal water', image: 'Data/Gallery/canal-reflections.jpg', photographer: 'Jane Smith', location: 'Rozenhoedkaai' },
                'market-square': { id: 'market-square', title: 'Market Square', description: 'The heart of Bruges', image: 'Data/Gallery/market-square.jpg', photographer: 'Mike Johnson', location: 'Markt' }
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