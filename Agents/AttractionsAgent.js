import BaseAgent from './BaseAgent.js';

class AttractionsAgent extends BaseAgent {
    constructor() {
        super();
        this.attractions = new Map();
    }

    async getAttractions(preferences) {
        try {
            // Get basic attraction data
            const attractions = await this.fetchAttractions();

            // Enhance with real-time data from DeepSeek
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
            // Search for real-time information
            const query = `${attraction.name} Bruges current status opening hours reviews`;
            const searchResults = await this.searchWithDeepSeek(query, 'local');

            // Get images
            const imageResults = await this.searchWithDeepSeek(
                `${attraction.name} Bruges photos`, 'image'
            );

            enhanced.push({
                ...attraction,
                realTimeData: searchResults.items[0],
                images: imageResults.items.slice(0, 5)
            });
        }

        return enhanced;
    }

    async enhanceAttractionsWithAI(attractions) {
        const prompt = `Create detailed descriptions for these Bruges attractions:
            ${JSON.stringify(attractions, null, 2)}`;

        const enhancedData = await this.callOpenAI(prompt,
            "You are an expert in Bruges tourism and history.");

        return JSON.parse(enhancedData);
    }
}

export default AttractionsAgent; 