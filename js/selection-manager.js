class SelectionManager {
    constructor() {
        this.selections = {
            places: [],
            restaurants: [],
            events: [],
            tours: [],
            photos: []
        };
        this.loadFromStorage();
        this.initializeEventListeners();
    }

    loadFromStorage() {
        try {
            const savedSelections = localStorage.getItem('tripSelections');
            if (savedSelections) {
                this.selections = JSON.parse(savedSelections);
            }
        } catch (error) {
            console.error('Error loading selections:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('tripSelections', JSON.stringify(this.selections));
            this.updateWishlistCount();
        } catch (error) {
            console.error('Error saving selections:', error);
        }
    }

    initializeEventListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('.place-selector, .restaurant-selector, .event-selector')) {
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                const isSelected = e.target.checked;

                if (isSelected) {
                    this.addSelection(id, type);
                } else {
                    this.removeSelection(id, type);
                }
            }
        });
    }

    addSelection(id, type) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (!card) return;

        const item = {
            id: id,
            title: card.querySelector('h2, h3')?.textContent || '',
            image: card.querySelector('img')?.src || '',
            rating: card.querySelector('.rating span')?.textContent || '',
            description: card.querySelector('.description p')?.textContent || '',
            directions: card.querySelector('.directions-btn')?.href || ''
        };

        if (!this.selections[type].some(i => i.id === id)) {
            this.selections[type].push(item);
            this.saveToStorage();
            this.updateUI(id, type, true);
            this.dispatchSelectionEvent(id, type, true);
        }
    }

    removeSelection(id, type) {
        this.selections[type] = this.selections[type].filter(item => item.id !== id);
        this.saveToStorage();
        this.updateUI(id, type, false);
        this.dispatchSelectionEvent(id, type, false);
    }

    updateUI(id, type, isSelected) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            card.classList.toggle('selected', isSelected);
        }

        const checkbox = document.querySelector(`[data-id="${id}"][data-type="${type}"]`);
        if (checkbox) {
            checkbox.checked = isSelected;
        }

        this.updateWishlistCount();
    }

    updateWishlistCount() {
        const totalSelections = Object.values(this.selections).flat().length;
        const wishlistCounts = document.querySelectorAll('.wishlist-count');
        wishlistCounts.forEach(count => {
            count.textContent = totalSelections;
        });
    }

    dispatchSelectionEvent(id, type, isSelected) {
        const event = new CustomEvent('selectionChanged', {
            detail: { id, type, isSelected }
        });
        document.dispatchEvent(event);
    }

    getSelections() {
        return this.selections;
    }

    isSelected(id, type) {
        return this.selections[type]?.some(item => item.id === id) || false;
    }

    initializeSelectors() {
        Object.entries(this.selections).forEach(([type, items]) => {
            items.forEach(item => {
                const checkbox = document.querySelector(`[data-id="${item.id}"][data-type="${type}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    const card = document.querySelector(`[data-id="${item.id}"]`);
                    if (card) {
                        card.classList.add('selected');
                    }
                }
            });
        });
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
    window.selectionManager = new SelectionManager();
    window.selectionManager.initializeSelectors();
    window.selectionManager.updateWishlistCount();
}); 