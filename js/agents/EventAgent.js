/**
 * Event Agent
 * Handles event recommendations and information
 */
class EventAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'event';
        this.data = [];
        this.initialized = false;
        this.groqService = window.groqService;
    }

    async loadData() {
        try {
            console.log('Loading data for EventAgent...');
            // Initialize empty data array
            this.data = [];
            this.initialized = true;
            console.log('EventAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for EventAgent:', error);
            throw error;
        }
    }

    async getRecommendations(preferences) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const prompt = `Based on the following preferences, recommend events in Bruges:
                Interests: ${preferences.interests.join(', ')}
                Budget: ${preferences.budget}
                Selected Places: ${preferences.selectedPlaces.join(', ')}`;

            const response = await this.groqService.generateStructuredResponse(prompt);
            return response;
        } catch (error) {
            console.error('Error getting event recommendations:', error);
            throw error;
        }
    }
}

// Initialize the event agent
window.eventAgent = new EventAgent(); 