class SelectionManager {
    constructor() {
        this.selections = {
            places: new Set(),
            restaurants: new Set(),
            photos: new Set(),
            tours: new Set(),
            events: new Set()
        };
        this.loadSelections();
    }

    loadSelections() {
        try {
            const savedSelections = localStorage.getItem('tripSelections');
            if (savedSelections) {
                const parsed = JSON.parse(savedSelections);
                console.log('Loaded selections:', parsed);
                return parsed;
            }
        } catch (error) {
            console.error('Error loading selections:', error);
        }
        // Return default structure if no saved selections
        return {
            places: [],
            restaurants: [],
            tours: [],
            photos: [],
            events: []
        };
    }

    saveSelections() {
        try {
            localStorage.setItem('tripSelections', JSON.stringify(this.selections));
            console.log('Saved selections:', this.selections);
            // Notify all pages of the change
            this.notifyChange();
        } catch (error) {
            console.error('Error saving selections:', error);
        }
    }

    addSelection(category, id) {
        if (!this.selections[category]) {
            this.selections[category] = [];
        }

        // Get the original card
        const originalCard = document.querySelector(`[data-id="${id}"]`);
        if (!originalCard) {
            console.warn(`Original card not found for ID: ${id}`);
            return;
        }

        // Create item object with all necessary information
        const item = {
            id: id,
            title: originalCard.querySelector('h2')?.textContent || '',
            image: originalCard.querySelector('img')?.src || 'images/default-placeholder.jpg',
            rating: originalCard.querySelector('.rating span')?.textContent || '',
            type: originalCard.querySelector('.type')?.textContent || '',
            description: originalCard.querySelector('.description p')?.textContent || '',
            hours: originalCard.querySelector('.hours')?.textContent || '',
            price: originalCard.querySelector('.price')?.textContent || '',
            directions: originalCard.querySelector('.directions-btn')?.href || '',
            website: originalCard.querySelector('.website-btn')?.href || '',
            coordinates: originalCard.dataset.coordinates ? 
                JSON.parse(originalCard.dataset.coordinates) : null
        };

        // Check if item already exists
        const existingIndex = this.selections[category].findIndex(i => i.id === id);
        if (existingIndex === -1) {
            this.selections[category].push(item);
            this.saveSelections();
        }
    }

    removeSelection(category, id) {
        if (this.selections[category]) {
            const index = this.selections[category].findIndex(item => item.id === id);
            if (index > -1) {
                this.selections[category].splice(index, 1);
                this.saveSelections();
            }
        }
    }

    getSelections() {
        return this.selections;
    }

    isSelected(id, category) {
        return this.selections[category]?.some(item => item.id === id) || false;
    }

    clearAllSelections() {
        this.selections = {
            places: [],
            restaurants: [],
            tours: [],
            photos: [],
            events: []
        };
        this.saveSelections();
    }

    notifyChange() {
        // Dispatch both custom event and storage event
        const event = new CustomEvent('selectionsChanged', {
            detail: { selections: this.selections }
        });
        document.dispatchEvent(event);
        
        // Also trigger a storage event to sync across tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'tripSelections',
            newValue: JSON.stringify(this.selections)
        }));
    }

    initializeSelectors() {
        // Initialize all selectors with a delay to ensure DOM is loaded
        setTimeout(() => {
            // Initialize place selectors
            this.initializeCategorySelectors('.place-selector', 'places');
            
            // Initialize restaurant selectors
            this.initializeCategorySelectors('.restaurant-selector', 'restaurants');
            
            // Initialize tour selectors
            this.initializeCategorySelectors('.tour-selector', 'tours');
            
            // Initialize photo selectors
            this.initializeCategorySelectors('.photo-selector', 'photos');
            
            // Initialize event selectors
            this.initializeCategorySelectors('.event-selector', 'events');
        }, 100);
    }

    initializeCategorySelectors(selectorClass, category) {
        const selectors = document.querySelectorAll(selectorClass);
        selectors.forEach(selector => {
            const id = selector.getAttribute('data-id');
            if (!id) {
                console.warn(`Selector missing data-id attribute:`, selector);
                return;
            }
            
            // Set initial state
            if (this.isSelected(id, category)) {
                selector.checked = true;
                this.updateSelectorUI(selector, true);
            }
            
            // Add event listener
            selector.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.addSelection(category, id);
                } else {
                    this.removeSelection(category, id);
                }
                this.updateSelectorUI(selector, e.target.checked);
            });
        });
    }

    updateSelectorUI(selector, isChecked) {
        if (isChecked) {
            selector.style.backgroundColor = 'var(--primary-color)';
            selector.style.borderColor = 'var(--primary-color)';
        } else {
            selector.style.backgroundColor = 'var(--card-bg)';
            selector.style.borderColor = 'var(--primary-color)';
        }
    }

    updateCheckboxUI(checkbox) {
        try {
            const card = checkbox.closest('.place-card, .restaurant-card, .gallery-item, .tour-card, .event-card');
            if (card) {
                if (checkbox.checked) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            }

            // Update checkbox styling
            checkbox.style.width = '24px';
            checkbox.style.height = '24px';
            checkbox.style.borderRadius = '50%';
            checkbox.style.border = '2px solid var(--primary-color)';
            checkbox.style.transition = 'var(--transition)';
            
            if (checkbox.checked) {
                checkbox.style.backgroundColor = 'var(--primary-color)';
                checkbox.style.borderColor = 'var(--primary-color)';
                checkbox.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z\'/%3E%3C/svg%3E")';
                checkbox.style.backgroundSize = '16px';
                checkbox.style.backgroundPosition = 'center';
                checkbox.style.backgroundRepeat = 'no-repeat';
            } else {
                checkbox.style.backgroundColor = 'var(--card-bg)';
                checkbox.style.borderColor = 'var(--primary-color)';
                checkbox.style.backgroundImage = 'none';
            }
        } catch (error) {
            console.error('Error updating checkbox UI:', error);
        }
    }

    // Itinerary management methods
    saveItinerary(itinerary, name = 'My Bruges Itinerary') {
        try {
            // Get existing saved itineraries
            const savedItineraries = this.getSavedItineraries();
            
            // Create a new itinerary object with metadata
            const newItinerary = {
                id: Date.now().toString(), // Unique ID based on timestamp
                name: name,
                date: new Date().toISOString(),
                selections: { ...this.selections }, // Copy of current selections
                itinerary: itinerary
            };
            
            // Add the new itinerary to the list
            savedItineraries.push(newItinerary);
            
            // Save back to localStorage
            localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
            
            return newItinerary.id;
        } catch (error) {
            console.error('Error saving itinerary:', error);
            throw error;
        }
    }
    
    getSavedItineraries() {
        try {
            const savedItinerariesJson = localStorage.getItem('savedItineraries');
            return savedItinerariesJson ? JSON.parse(savedItinerariesJson) : [];
        } catch (error) {
            console.error('Error loading saved itineraries:', error);
            return [];
        }
    }
    
    getSavedItinerary(id) {
        try {
            const savedItineraries = this.getSavedItineraries();
            return savedItineraries.find(itinerary => itinerary.id === id);
        } catch (error) {
            console.error('Error getting saved itinerary:', error);
            return null;
        }
    }
    
    deleteSavedItinerary(id) {
        try {
            const savedItineraries = this.getSavedItineraries();
            const updatedItineraries = savedItineraries.filter(itinerary => itinerary.id !== id);
            localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
            return true;
        } catch (error) {
            console.error('Error deleting saved itinerary:', error);
            return false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.selectionManager) {
        window.selectionManager = new SelectionManager();
    }

    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.card');
            const id = card.dataset.id;
            const type = card.dataset.type || 'place'; // Default to place if not specified
            
            // Get all the details from the card
            const item = {
                id: id,
                type: type,
                title: card.querySelector('h2')?.textContent || '',
                image: card.querySelector('img')?.src || 'images/default-placeholder.jpg',
                rating: card.querySelector('.rating span')?.textContent || '',
                description: card.querySelector('.description p')?.textContent || '',
                hours: card.querySelector('.hours')?.textContent || '',
                price: card.querySelector('.price')?.textContent || '',
                directions: card.querySelector('.directions-btn')?.href || '',
                website: card.querySelector('.website-btn')?.href || '',
                coordinates: card.dataset.coordinates ? JSON.parse(card.dataset.coordinates) : null
            };

            // Get existing wishlist or create new one
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            // Check if item already exists
            const exists = wishlist.some(existing => existing.id === id && existing.type === type);
            
            if (!exists) {
                // Add new item
                wishlist.push(item);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                
                // Update button state
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-heart"></i> Saved';
                
                // Show success message
                showNotification('Item added to wishlist!');
            } else {
                // Remove item
                wishlist = wishlist.filter(item => !(item.id === id && item.type === type));
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                
                // Update button state
                button.classList.remove('active');
                button.innerHTML = '<i class="far fa-heart"></i> Save';
                
                // Show removal message
                showNotification('Item removed from wishlist');
            }
            
            // Update wishlist count in navigation
            updateWishlistCount();
        });
    });

    // Initialize wishlist buttons state
    function initializeWishlistButtons() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        wishlistButtons.forEach(button => {
            const card = button.closest('.card');
            const id = card.dataset.id;
            const type = card.dataset.type || 'place';
            
            const exists = wishlist.some(item => item.id === id && item.type === type);
            
            if (exists) {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-heart"></i> Saved';
            }
        });
    }

    // Update wishlist count in navigation
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const countElement = document.querySelector('.wishlist-count');
        
        if (countElement) {
            countElement.textContent = wishlist.length;
        }
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize
    initializeWishlistButtons();
    updateWishlistCount();
}); 