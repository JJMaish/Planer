class RestaurantAgent {
    constructor() {
        this.type = 'restaurant';
        this.data = [];
        this.initialized = false;
        this.basePrompt = `You are a food and dining expert specializing in Bruges, Belgium. 
        Your task is to recommend restaurants based on user preferences and selections.
        Consider factors like:
        - Cuisine type
        - Price range
        - Ambiance
        - Location
        - Opening hours
        - Reservations
        - Dietary restrictions
        - Local specialties
        - Tourist-friendly options
        - Seasonal availability`;
    }

    async loadData() {
        try {
            console.log('Loading data for RestaurantAgent...');
            // In a real application, this would load data from an API or database
            // For now, we'll use placeholder data
            this.data = [
                {
                    id: 'restaurant1',
                    name: 'De Halve Maan Brewery',
                    description: 'Historic brewery with restaurant serving Belgian cuisine',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                    location: { lat: 51.2090, lng: 3.2255 },
                    cuisine: 'Belgian',
                    priceRange: '€€',
                    openingHours: '11:00-22:00',
                    rating: 4.7
                },
                {
                    id: 'restaurant2',
                    name: 'Gruuthuse Hof',
                    description: 'Traditional Flemish restaurant in historic setting',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                    location: { lat: 51.2080, lng: 3.2265 },
                    cuisine: 'Flemish',
                    priceRange: '€€€',
                    openingHours: '12:00-22:00',
                    rating: 4.5
                },
                {
                    id: 'restaurant3',
                    name: 'Poules Moules',
                    description: 'Specialized in mussels and seafood',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                    location: { lat: 51.2095, lng: 3.2240 },
                    cuisine: 'Seafood',
                    priceRange: '€€',
                    openingHours: '11:30-22:30',
                    rating: 4.6
                }
            ];
            this.initialized = true;
            console.log('RestaurantAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for RestaurantAgent:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('RestaurantAgent getting recommendations for:', selectedIds);
            
            // Ensure selectedIds is an array
            if (!selectedIds) {
                selectedIds = [];
            } else if (typeof selectedIds === 'string') {
                selectedIds = [selectedIds];
            } else if (!Array.isArray(selectedIds)) {
                console.warn('Invalid selectedIds format, using empty array');
                selectedIds = [];
            }
            
            // If no selections, return all restaurants
            if (selectedIds.length === 0) {
                console.log('No selections, returning all restaurants');
                return this.data;
            }
            
            // Filter restaurants based on selections
            const recommendations = this.data.filter(restaurant => 
                selectedIds.includes(restaurant.id)
            );
            
            console.log('Restaurant recommendations:', recommendations);
            return recommendations;
        } catch (error) {
            console.error('Error getting recommendations in RestaurantAgent:', error);
            throw error;
        }
    }

    async handleSelection(id, action) {
        try {
            console.log(`RestaurantAgent handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error('Error handling selection in RestaurantAgent:', error);
            throw error;
        }
    }
}

// Initialize the restaurant agent
window.restaurantAgent = new RestaurantAgent(); 