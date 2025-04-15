class RestaurantAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'restaurant';
        this.basePrompt = `You are a local food expert specializing in Bruges, Belgium. 
        Your task is to recommend restaurants based on user preferences and selections.
        Consider factors like:
        - Cuisine type
        - Price range
        - Ambiance
        - Location
        - Opening hours
        - Reservation policy
        - Dietary options
        - Local specialties
        - Service quality
        - Reviews and ratings`;
    }

    async loadData() {
        try {
            console.log('Loading data for RestaurantAgent...');
            // Initialize with some default restaurants
            this.data = [
                {
                    id: 'huidenvettersplein',
                    name: 'Huidenvettersplein Restaurant',
                    description: 'Traditional Belgian cuisine in a historic setting',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2085, lng: 3.2260 },
                    cuisine: 'Belgian',
                    priceRange: '€€',
                    openingHours: '12:00-22:00',
                    rating: 4.5
                },
                {
                    id: 'de-vlissinghe',
                    name: 'De Vlissinghe',
                    description: 'Oldest pub in Bruges serving local beers and food',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2090, lng: 3.2255 },
                    cuisine: 'Belgian',
                    priceRange: '€',
                    openingHours: '11:00-23:00',
                    rating: 4.7
                },
                {
                    id: 'den-dyver',
                    name: 'Den Dyver',
                    description: 'Fine dining with beer pairing menu',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2080, lng: 3.2265 },
                    cuisine: 'Belgian',
                    priceRange: '€€€',
                    openingHours: '18:00-22:00',
                    rating: 4.8
                }
            ];
            this.initialized = true;
            console.log('RestaurantAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for RestaurantAgent:', error);
            throw error;
        }
    }

    async searchOpenStreetMap(query) {
        try {
            // Overpass API query for restaurants in Bruges
            const overpassQuery = `
                [out:json][timeout:25];
                area[name="Brugge"]->.searchArea;
                (
                    node["amenity"~"restaurant|cafe|bar|pub"]["name"~"${query}",i](area.searchArea);
                    way["amenity"~"restaurant|cafe|bar|pub"]["name"~"${query}",i](area.searchArea);
                    relation["amenity"~"restaurant|cafe|bar|pub"]["name"~"${query}",i](area.searchArea);
                );
                out body;
                >;
                out skel qt;
            `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: overpassQuery
            });

            if (!response.ok) {
                throw new Error('OpenStreetMap search failed');
            }

            const data = await response.json();
            return data.elements;
        } catch (error) {
            console.error('Error searching OpenStreetMap:', error);
            throw error;
        }
    }

    async getRestaurantDetails(osmId, osmType) {
        try {
            // Overpass API query for specific restaurant details
            const overpassQuery = `
                [out:json][timeout:25];
                ${osmType}(${osmId});
                out body;
                >;
                out skel qt;
            `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: overpassQuery
            });

            if (!response.ok) {
                throw new Error('Failed to get restaurant details');
            }

            const data = await response.json();
            return data.elements[0];
        } catch (error) {
            console.error('Error getting restaurant details:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('RestaurantAgent getting recommendations for:', selectedIds);
            
            // If no selections, return all restaurants
            if (!selectedIds || selectedIds.length === 0) {
                return this.data;
            }

            // For each selected ID, try to find it in our data or search OpenStreetMap
            const recommendations = [];
            for (const id of selectedIds) {
                // First check our local data
                const localRestaurant = this.data.find(restaurant => restaurant.id === id);
                if (localRestaurant) {
                    recommendations.push(localRestaurant);
                } else {
                    // If not found locally, try to search OpenStreetMap
                    try {
                        const searchResults = await this.searchOpenStreetMap(id);
                        if (searchResults && searchResults.length > 0) {
                            const restaurantDetails = await this.getRestaurantDetails(
                                searchResults[0].id,
                                searchResults[0].type
                            );
                            
                            recommendations.push({
                                id: id,
                                name: restaurantDetails.tags.name || id,
                                description: restaurantDetails.tags.description || restaurantDetails.tags.cuisine || 'Restaurant in Bruges',
                                image: 'images/default-placeholder.jpg',
                                location: {
                                    lat: restaurantDetails.lat || restaurantDetails.center.lat,
                                    lng: restaurantDetails.lon || restaurantDetails.center.lon
                                },
                                cuisine: restaurantDetails.tags.cuisine || 'Belgian',
                                priceRange: restaurantDetails.tags.price_range || '€€',
                                openingHours: restaurantDetails.tags.opening_hours || 'Not available',
                                rating: 4.5
                            });
                        }
                    } catch (error) {
                        console.error(`Error getting details for ${id}:`, error);
                    }
                }
            }
            
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