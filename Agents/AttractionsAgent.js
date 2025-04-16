import { BaseAgent } from './BaseAgent.js';

export class AttractionsAgent extends BaseAgent {
    constructor() {
        super();
        this.attractions = new Map();
    }

    async getAttractions(preferences) {
        try {
            // Get basic attraction data
            const attractions = await this.fetchAttractions();

            // Enhance with real-time data
            const enhancedAttractions = await this.enhanceWithRealTimeData(attractions);

            // Categorize and sort based on preferences
            return this.categorizeAttractions(enhancedAttractions, preferences);
        } catch (error) {
            console.error('Error fetching attractions:', error);
            throw error;
        }
    }

    async fetchAttractions() {
        // Load from predefined data or external API
        const attractionsData = await this.loadPredefinedAttractions();
        return this.processAttractions(attractionsData);
    }

    async enhanceWithRealTimeData(attractions) {
        const enhanced = [];
        
        for (const attraction of attractions) {
            // Search for real-time information using Groq
            const searchResults = await this.searchInformation(
                `${attraction.name} Bruges current status, opening hours, and reviews`,
                'attraction'
            );

            enhanced.push({
                ...attraction,
                realTimeData: searchResults,
                images: searchResults.images || []
            });
        }

        return enhanced;
    }

    async enhanceAttractionsWithAI(attractions) {
        const prompt = `Create detailed descriptions for these Bruges attractions:
            ${JSON.stringify(attractions, null, 2)}`;

        const enhancedData = await this.callGroq(prompt,
            "You are an expert in Bruges tourism and history.");

        return JSON.parse(enhancedData);
    }
} 