/**
 * Photo Agent
 * Handles recommendations for photo opportunities in Bruges
 */
class PhotoAgent extends BaseAgent {
    constructor() {
        super('photo');
        this.basePrompt = `You are a photography expert specializing in Bruges, Belgium. 
        Your task is to recommend photo opportunities based on user preferences and selections.
        Consider factors like:
        - Lighting conditions
        - Best time of day
        - Seasonal variations
        - Crowd levels
        - Unique perspectives
        - Historical significance
        - Architectural details
        - Natural beauty
        - Urban scenes
        - Local life`;
    }

    async loadData() {
        try {
            console.log('Loading data for PhotoAgent...');
            // In a real application, this would load data from an API or database
            // For now, we'll use placeholder data
            this.data = [
                {
                    id: 'market-square',
                    name: 'Market Square',
                    description: 'Historic square with beautiful architecture',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2093, lng: 3.2247 },
                    bestTime: 'Early morning or sunset',
                    tips: 'Capture the reflections in the puddles after rain',
                    rating: 4.8
                },
                {
                    id: 'canals',
                    name: 'Bruges Canals',
                    description: 'Scenic canals with medieval buildings',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2095, lng: 3.2250 },
                    bestTime: 'Golden hour',
                    tips: 'Use a tripod for long exposures',
                    rating: 4.9
                },
                {
                    id: 'belfry',
                    name: 'Belfry of Bruges',
                    description: 'Iconic medieval bell tower',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2093, lng: 3.2247 },
                    bestTime: 'Blue hour',
                    tips: 'Capture the tower against the night sky',
                    rating: 4.7
                },
                {
                    id: 'begijnhof',
                    name: 'Begijnhof',
                    description: 'Peaceful courtyard with white houses',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2085, lng: 3.2260 },
                    bestTime: 'Morning',
                    tips: 'Visit during spring for blooming flowers',
                    rating: 4.6
                }
            ];
            this.initialized = true;
            console.log('PhotoAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for PhotoAgent:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('PhotoAgent getting recommendations for:', selectedIds);
            
            // Ensure selectedIds is an array
            if (!selectedIds) {
                selectedIds = [];
            } else if (typeof selectedIds === 'string') {
                selectedIds = [selectedIds];
            } else if (!Array.isArray(selectedIds)) {
                console.warn('Invalid selectedIds format, using empty array');
                selectedIds = [];
            }
            
            // If no selections, return all photo spots
            if (selectedIds.length === 0) {
                console.log('No selections, returning all photo spots');
                return this.data;
            }
            
            // Filter photo spots based on selections
            const recommendations = this.data.filter(photo => 
                selectedIds.includes(photo.id)
            );
            
            console.log('Photo recommendations:', recommendations);
            return recommendations;
        } catch (error) {
            console.error('Error getting recommendations in PhotoAgent:', error);
            throw error;
        }
    }

    async handleSelection(id, action) {
        try {
            console.log(`PhotoAgent handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error('Error handling selection in PhotoAgent:', error);
            throw error;
        }
    }
}

// Initialize the photo agent
window.photoAgent = new PhotoAgent(); 