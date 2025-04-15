/**
 * Place Agent
 * Handles recommendations for places to visit in Bruges
 */
class PlaceAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'place';
        this.basePrompt = `You are a local expert specializing in Bruges, Belgium. 
        Your task is to recommend places to visit based on user preferences and selections.
        Consider factors like:
        - Historical significance
        - Cultural importance
        - Tourist popularity
        - Accessibility
        - Opening hours
        - Admission fees
        - Guided tours
        - Photography opportunities
        - Seasonal events
        - Nearby amenities`;
    }

    async loadData() {
        try {
            console.log('Loading data for PlaceAgent...');
            // Initialize with some default places
            this.data = [
                {
                    id: 'belfort',
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
                    id: 'de-burg',
                    name: 'Burg Square',
                    description: 'Historic square with beautiful architecture',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2095, lng: 3.2250 },
                    visitDuration: 45,
                    recommendedVisitTime: '10:30',
                    openingHours: 'Always open',
                    admissionFee: 'Free',
                    rating: 4.6
                },
                {
                    id: 'holy-blood',
                    name: 'Basilica of the Holy Blood',
                    description: '12th-century basilica housing a relic of the Holy Blood',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2085, lng: 3.2260 },
                    visitDuration: 45,
                    recommendedVisitTime: '10:30',
                    openingHours: '09:30-12:30, 14:00-17:30',
                    admissionFee: '€5',
                    rating: 4.6
                }
            ];
            this.initialized = true;
            console.log('PlaceAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for PlaceAgent:', error);
            throw error;
        }
    }

    async searchOpenStreetMap(query) {
        try {
            // Overpass API query for places in Bruges
            const overpassQuery = `
                [out:json][timeout:25];
                area[name="Brugge"]->.searchArea;
                (
                    node["name"~"${query}",i](area.searchArea);
                    way["name"~"${query}",i](area.searchArea);
                    relation["name"~"${query}",i](area.searchArea);
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

    async getPlaceDetails(osmId, osmType) {
        try {
            // Overpass API query for specific place details
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
                throw new Error('Failed to get place details');
            }

            const data = await response.json();
            return data.elements[0];
        } catch (error) {
            console.error('Error getting place details:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('PlaceAgent getting recommendations for:', selectedIds);
            
            // If no selections, return all places
            if (!selectedIds || selectedIds.length === 0) {
                return this.data;
            }

            // For each selected ID, try to find it in our data or search OpenStreetMap
            const recommendations = [];
            for (const id of selectedIds) {
                // First check our local data
                const localPlace = this.data.find(place => place.id === id);
                if (localPlace) {
                    recommendations.push(localPlace);
                } else {
                    // If not found locally, try to search OpenStreetMap
                    try {
                        const searchResults = await this.searchOpenStreetMap(id);
                        if (searchResults && searchResults.length > 0) {
                            const placeDetails = await this.getPlaceDetails(
                                searchResults[0].id,
                                searchResults[0].type
                            );
                            
                            recommendations.push({
                                id: id,
                                name: placeDetails.tags.name || id,
                                description: placeDetails.tags.description || placeDetails.tags.historic || 'Historic place in Bruges',
                                image: 'images/default-placeholder.jpg',
                                location: {
                                    lat: placeDetails.lat || placeDetails.center.lat,
                                    lng: placeDetails.lon || placeDetails.center.lon
                                },
                                visitDuration: 60,
                                recommendedVisitTime: '10:00',
                                openingHours: placeDetails.tags.opening_hours || 'Not available',
                                admissionFee: placeDetails.tags.fee || 'Not available',
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