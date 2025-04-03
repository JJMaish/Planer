class SelectionManager {
    constructor() {
        this.selections = {
            places: [],
            restaurants: [],
            tours: [],
            photos: []
        };
        this.loadSelections();
    }

    loadSelections() {
        const savedSelections = localStorage.getItem('tripSelections');
        if (savedSelections) {
            this.selections = JSON.parse(savedSelections);
        }
    }

    saveSelections() {
        localStorage.setItem('tripSelections', JSON.stringify(this.selections));
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
            photos: []
        };
        this.saveSelections();
    }

    isSelected(id, category) {
        return this.selections[category].includes(id);
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

// Initialize the selection manager
window.selectionManager = new SelectionManager(); 