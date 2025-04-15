class TourAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'tour';
        this.basePrompt = `You are a local tour expert specializing in Bruges, Belgium. 
        Your task is to recommend tours and activities based on user preferences and selections.
        Consider factors like:
        - Tour type (walking, boat, bike, etc.)
        - Duration
        - Price range
        - Group size
        - Language options
        - Special themes
        - Local guides
        - Unique experiences
        - Accessibility
        - Reviews and ratings`;
    }

    async loadData() {
        try {
            console.log('Loading data for TourAgent...');
            // Initialize with some default tours
            this.data = [
                {
                    id: 'canal-tour',
                    name: 'Bruges Canal Tour',
                    description: 'Scenic boat tour through Bruges\' historic canals',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2085, lng: 3.2260 },
                    duration: '30 minutes',
                    price: '€12',
                    groupSize: '20 people',
                    languages: ['English', 'Dutch', 'French'],
                    rating: 4.8
                },
                {
                    id: 'chocolate-workshop',
                    name: 'Chocolate Workshop',
                    description: 'Hands-on chocolate making workshop with local chocolatier',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2090, lng: 3.2255 },
                    duration: '2 hours',
                    price: '€35',
                    groupSize: '12 people',
                    languages: ['English', 'Dutch'],
                    rating: 4.9
                },
                {
                    id: 'beer-tasting',
                    name: 'Belgian Beer Tasting',
                    description: 'Guided tasting of local Belgian beers with expert',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2080, lng: 3.2265 },
                    duration: '1.5 hours',
                    price: '€25',
                    groupSize: '15 people',
                    languages: ['English', 'Dutch'],
                    rating: 4.7
                }
            ];
            this.initialized = true;
            console.log('TourAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for TourAgent:', error);
            throw error;
        }
    }

    async searchOpenStreetMap(query) {
        try {
            // Overpass API query for tourist attractions and tours in Bruges
            const overpassQuery = `
                [out:json][timeout:25];
                area[name="Brugge"]->.searchArea;
                (
                    node["tourism"~"attraction|museum|gallery|viewpoint"]["name"~"${query}",i](area.searchArea);
                    way["tourism"~"attraction|museum|gallery|viewpoint"]["name"~"${query}",i](area.searchArea);
                    relation["tourism"~"attraction|museum|gallery|viewpoint"]["name"~"${query}",i](area.searchArea);
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

    async getTourDetails(osmId, osmType) {
        try {
            // Overpass API query for specific tour details
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
                throw new Error('Failed to get tour details');
            }

            const data = await response.json();
            return data.elements[0];
        } catch (error) {
            console.error('Error getting tour details:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('TourAgent getting recommendations for:', selectedIds);
            
            // If no selections, return all tours
            if (!selectedIds || selectedIds.length === 0) {
                return this.data;
            }

            // For each selected ID, try to find it in our data or search OpenStreetMap
            const recommendations = [];
            for (const id of selectedIds) {
                // First check our local data
                const localTour = this.data.find(tour => tour.id === id);
                if (localTour) {
                    recommendations.push(localTour);
                } else {
                    // If not found locally, try to search OpenStreetMap
                    try {
                        const searchResults = await this.searchOpenStreetMap(id);
                        if (searchResults && searchResults.length > 0) {
                            const tourDetails = await this.getTourDetails(
                                searchResults[0].id,
                                searchResults[0].type
                            );
                            
                            recommendations.push({
                                id: id,
                                name: tourDetails.tags.name || id,
                                description: tourDetails.tags.description || tourDetails.tags.tourism || 'Tourist attraction in Bruges',
                                image: 'images/default-placeholder.jpg',
                                location: {
                                    lat: tourDetails.lat || tourDetails.center.lat,
                                    lng: tourDetails.lon || tourDetails.center.lon
                                },
                                duration: 'Not specified',
                                price: tourDetails.tags.fee || 'Not available',
                                groupSize: 'Not specified',
                                languages: ['English'],
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
            console.error('Error getting recommendations in TourAgent:', error);
            throw error;
        }
    }

    async handleSelection(id, action) {
        try {
            console.log(`TourAgent handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error('Error handling selection in TourAgent:', error);
            throw error;
        }
    }
}

// Initialize the tour agent
window.tourAgent = new TourAgent(); 