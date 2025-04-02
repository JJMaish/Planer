import BaseAgent from './BaseAgent.js';

class EventsAgent extends BaseAgent {
    constructor() {
        super();
        this.eventCache = new Map();
    }

    async getEvents(startDate, endDate) {
        try {
            // Search for current events using DeepSeek
            const query = `events in Bruges between ${startDate} and ${endDate}`;
            const searchResults = await this.searchWithDeepSeek(query, 'local');

            // Enhance results with AI processing
            const enhancedEvents = await this.enhanceEventsWithAI(searchResults.items);

            return enhancedEvents;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    async enhanceEventsWithAI(events) {
        const prompt = `Enhance these Bruges events with detailed descriptions:
            ${JSON.stringify(events, null, 2)}`;

        const enhancedData = await this.callOpenAI(prompt, 
            "You are an expert in Bruges events and culture.");

        return JSON.parse(enhancedData);
    }
}

export default EventsAgent; 