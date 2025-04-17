/**
 * Photo Agent
 * Handles photo recommendations and management
 */
class PhotoAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'photo';
        this.data = [];
        this.initialized = false;
        this.groqService = window.groqService;
    }

    async loadData() {
        try {
            console.log('Loading data for PhotoAgent...');
            // Initialize empty data array
            this.data = [];
            this.initialized = true;
            console.log('PhotoAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for PhotoAgent:', error);
            throw error;
        }
    }

    async getRecommendations(preferences) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const prompt = `Based on the following preferences, recommend photo opportunities in Bruges:
                Interests: ${preferences.interests.join(', ')}
                Selected Places: ${preferences.selectedPlaces.join(', ')}`;

            const response = await this.groqService.generateStructuredResponse(prompt);
            return response;
        } catch (error) {
            console.error('Error getting photo recommendations:', error);
            throw error;
        }
    }

    async getPhotoSpots(location) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Implement photo spots retrieval logic here
            return [
                {
                    id: 'spot1',
                    name: 'Scenic Bridge View',
                    description: 'Perfect spot for canal photos',
                    location: {
                        lat: 51.2093,
                        lng: 3.2247
                    },
                    bestTime: 'Sunset',
                    tips: 'Wide-angle lens recommended'
                }
            ];
        } catch (error) {
            console.error('Error getting photo spots:', error);
            throw error;
        }
    }
}

// Initialize the photo agent
window.photoAgent = new PhotoAgent(); 