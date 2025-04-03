/**
 * Place Agent
 * Handles recommendations for places to visit in Bruges
 */
class PlaceAgent extends BaseAgent {
    constructor() {
        super('place');
        this.basePrompt = `You are a travel expert specializing in Bruges, Belgium. 
        Your task is to recommend places to visit based on user preferences and selections.
        Consider factors like:
        - Historical significance
        - Architectural beauty
        - Cultural importance
        - Tourist popularity
        - Accessibility
        - Opening hours
        - Admission fees
        - Best time to visit
        - Photo opportunities
        - Nearby attractions`;
    }

    async loadData() {
        try {
            console.log('Loading data for PlaceAgent...');
            // In a real application, this would load data from an API or database
            // For now, we'll use placeholder data
            this.data = [
                {
                    id: 'market-square',
                    name: 'Market Square',
                    description: 'Historic square in the heart of Bruges',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2093, lng: 3.2247 },
                    visitDuration: 60,
                    recommendedVisitTime: '09:00',
                    openingHours: 'Always open',
                    admissionFee: 'Free',
                    rating: 4.8
                },
                {
                    id: 'belfry',
                    name: 'Belfry of Bruges',
                    description: 'Medieval bell tower in the historic center of Bruges',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2093, lng: 3.2247 },
                    visitDuration: 60,
                    recommendedVisitTime: '09:00',
                    openingHours: '09:30-17:00',
                    admissionFee: '€12',
                    rating: 4.8
                },
                {
                    id: 'basilica',
                    name: 'Basilica of the Holy Blood',
                    description: '12th-century basilica housing a relic of the Holy Blood',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2095, lng: 3.2250 },
                    visitDuration: 45,
                    recommendedVisitTime: '10:30',
                    openingHours: '09:30-12:30, 14:00-17:30',
                    admissionFee: '€5',
                    rating: 4.6
                },
                {
                    id: 'groeningemuseum',
                    name: 'Groeningemuseum',
                    description: 'Art museum with Flemish Primitives and modern art',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2085, lng: 3.2260 },
                    visitDuration: 90,
                    recommendedVisitTime: '14:00',
                    openingHours: '09:30-17:00',
                    admissionFee: '€12',
                    rating: 4.7
                }
            ];
            this.initialized = true;
            console.log('PlaceAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for PlaceAgent:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('PlaceAgent getting recommendations for:', selectedIds);
            
            // Ensure selectedIds is an array
            if (!selectedIds) {
                selectedIds = [];
            } else if (typeof selectedIds === 'string') {
                selectedIds = [selectedIds];
            } else if (!Array.isArray(selectedIds)) {
                console.warn('Invalid selectedIds format, using empty array');
                selectedIds = [];
            }
            
            // If no selections, return all places
            if (selectedIds.length === 0) {
                console.log('No selections, returning all places');
                return this.data;
            }
            
            // Filter places based on selections
            const recommendations = this.data.filter(place => 
                selectedIds.includes(place.id)
            );
            
            console.log('Place recommendations:', recommendations);
            return recommendations;
        } catch (error) {
            console.error('Error getting recommendations in PlaceAgent:', error);
            throw error;
        }
    }

    async handleSelection(id, action) {
        try {
            console.log(`PlaceAgent handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error('Error handling selection in PlaceAgent:', error);
            throw error;
        }
    }
}

// Initialize the place agent
window.placeAgent = new PlaceAgent(); 