class AgentSystem {
    constructor() {
        this.itineraryAgent = new ItineraryAgent();
        this.helpAgent = new HelpAgent();
        this.selectionManager = window.selectionManager;
    }

    async generateSmartItinerary() {
        try {
            const selections = this.selectionManager.getSelections();
            const itinerary = await this.itineraryAgent.createItinerary(selections);
            return itinerary;
        } catch (error) {
            console.error('Error generating itinerary:', error);
            throw error;
        }
    }

    async getHelp(query) {
        try {
            return await this.helpAgent.provideHelp(query);
        } catch (error) {
            console.error('Error getting help:', error);
            throw error;
        }
    }
} 