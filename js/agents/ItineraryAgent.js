class ItineraryAgent {
    constructor() {
        this.basePrompt = `As a travel planning expert for Bruges, create an optimized itinerary considering:
- Opening hours and best visiting times
- Distance between locations
- Typical visit duration
- Meal times for restaurants
- Weather conditions
- Seasonal factors`;
    }

    async createItinerary(selections) {
        const { places, restaurants, photos } = selections;
        
        // Format selections for the prompt
        const prompt = this.createPrompt(places, restaurants, photos);
        
        try {
            const response = await this.callAI(prompt);
            return this.formatItinerary(response);
        } catch (error) {
            console.error('Itinerary generation failed:', error);
            throw error;
        }
    }

    createPrompt(places, restaurants, photos) {
        return `${this.basePrompt}

Selected Places to Visit:
${places.join('\n')}

Selected Restaurants:
${restaurants.join('\n')}

Points of Interest from Photos:
${photos.join('\n')}

Please create a detailed day-by-day itinerary that:
1. Groups nearby attractions efficiently
2. Suggests optimal visiting times
3. Includes meal breaks at selected restaurants
4. Accounts for travel time between locations
5. Provides estimated duration for each activity`;
    }

    async callAI(prompt) {
        // Implement your AI call here (e.g., OpenAI API)
        // Return structured itinerary data
    }

    formatItinerary(aiResponse) {
        // Convert AI response to structured itinerary
        return {
            days: aiResponse.days,
            recommendations: aiResponse.recommendations,
            timing: aiResponse.timing
        };
    }
} 