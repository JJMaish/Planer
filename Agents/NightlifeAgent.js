import { BaseAgent } from './BaseAgent.js';

export class NightlifeAgent extends BaseAgent {
    constructor() {
        super();
        this.venues = new Map();
    }

    async getNightlifeVenues(preferences) {
        try {
            // Get real-time venue information
            const venues = await this.searchCurrentVenues();
            
            // Filter and rank based on preferences
            return this.rankVenues(venues, preferences);
        } catch (error) {
            console.error('Error fetching nightlife venues:', error);
            throw error;
        }
    }

    async searchCurrentVenues() {
        const queries = [
            'best restaurants Bruges current reviews',
            'bars and pubs Bruges open now',
            'nightclubs Bruges events tonight'
        ];

        const results = await Promise.all(
            queries.map(query => this.searchInformation(query, 'nightlife'))
        );

        return this.processVenueResults(results);
    }

    async fetchVenues() {
        // Could integrate with Google Places API or similar
        const venuesData = await this.loadPredefinedVenues();
        return this.enhanceVenuesWithAI(venuesData);
    }

    async enhanceVenuesWithAI(venues) {
        const prompt = `Enhance these Bruges nightlife venues with engaging descriptions:
            ${JSON.stringify(venues, null, 2)}`;

        const enhancedData = await this.callGroq(prompt,
            "You are an expert in Bruges nightlife and entertainment.");

        return JSON.parse(enhancedData);
    }
} 