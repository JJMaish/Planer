class SelectionManager {
    constructor() {
        this.selections = {
            places: [],
            restaurants: [],
            tours: [],
            photos: [],
            events: []
        };
        this.loadSelections();
        this.initializeSelectors();
    }

    loadSelections() {
        const savedSelections = localStorage.getItem('tripSelections');
        if (savedSelections) {
            this.selections = JSON.parse(savedSelections);
        }
    }

    saveSelections() {
        localStorage.setItem('tripSelections', JSON.stringify(this.selections));
        
        // Dispatch a custom event to notify other components that selections have changed
        const event = new CustomEvent('selectionsChanged', {
            detail: { selections: this.selections }
        });
        window.dispatchEvent(event);
    }

    addSelection(id, category) {
        if (!this.selections[category].includes(id)) {
            this.selections[category].push(id);
            this.saveSelections();
        }
    }

    removeSelection(id, category) {
        const index = this.selections[category].indexOf(id);
        if (index > -1) {
            this.selections[category].splice(index, 1);
            this.saveSelections();
        }
    }

    getSelections() {
        return this.selections;
    }

    clearSelections() {
        this.selections = {
            places: [],
            restaurants: [],
            tours: [],
            photos: [],
            events: []
        };
        this.saveSelections();
    }

    isSelected(id, category) {
        return this.selections[category].includes(id);
    }
    
    // Initialize all selectors on the page
    initializeSelectors() {
        // Initialize place selectors
        const placeSelectors = document.querySelectorAll('.place-selector');
        placeSelectors.forEach(selector => {
            const id = selector.getAttribute('data-id');
            const category = 'places';
            
            // Set initial state
            if (this.isSelected(id, category)) {
                selector.checked = true;
            }
            
            // Add event listener
            selector.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.addSelection(id, category);
                } else {
                    this.removeSelection(id, category);
                }
            });
        });
        
        // Initialize restaurant selectors
        const restaurantSelectors = document.querySelectorAll('.restaurant-selector');
        restaurantSelectors.forEach(selector => {
            const id = selector.getAttribute('data-id');
            const category = 'restaurants';
            
            // Set initial state
            if (this.isSelected(id, category)) {
                selector.checked = true;
            }
            
            // Add event listener
            selector.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.addSelection(id, category);
                } else {
                    this.removeSelection(id, category);
                }
            });
        });
        
        // Initialize tour selectors
        const tourSelectors = document.querySelectorAll('.tour-selector');
        tourSelectors.forEach(selector => {
            const id = selector.getAttribute('data-id');
            const category = 'tours';
            
            // Set initial state
            if (this.isSelected(id, category)) {
                selector.checked = true;
            }
            
            // Add event listener
            selector.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.addSelection(id, category);
                } else {
                    this.removeSelection(id, category);
                }
            });
        });
        
        // Initialize photo selectors
        const photoSelectors = document.querySelectorAll('.photo-selector');
        photoSelectors.forEach(selector => {
            const id = selector.getAttribute('data-id');
            const category = 'photos';
            
            // Set initial state
            if (this.isSelected(id, category)) {
                selector.checked = true;
            }
            
            // Add event listener
            selector.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.addSelection(id, category);
                } else {
                    this.removeSelection(id, category);
                }
            });
        });
        
        // Initialize event selectors
        const eventSelectors = document.querySelectorAll('.event-selector');
        eventSelectors.forEach(selector => {
            const id = selector.getAttribute('data-id');
            const category = 'events';
            
            // Set initial state
            if (this.isSelected(id, category)) {
                selector.checked = true;
            }
            
            // Add event listener
            selector.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.addSelection(id, category);
                } else {
                    this.removeSelection(id, category);
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

// Initialize the selection manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.selectionManager = new SelectionManager();
}); 