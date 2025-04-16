/**
 * Place Agent
 * Handles place recommendations and information
 */
class PlaceAgent extends BaseAgent {
    constructor() {
        super();
        this.places = [];
    }

    async initialize() {
        await super.initialize();
        await this.loadPlaces();
    }

    async loadPlaces() {
        try {
            const response = await fetch('/api/places');
            if (!response.ok) {
                throw new Error('Failed to load places');
            }
            this.places = await response.json();
        } catch (error) {
            console.error('Error loading places:', error);
            throw error;
        }
    }

    async getPlaceDetails(placeId) {
        try {
            const prompt = `Provide detailed information about ${placeId} in Bruges, including:
                - Historical significance
                - Key features
                - Visiting hours
                - Entry fees
                - Accessibility information
                - Nearby attractions
                Format the response in JSON with the following structure:
                {
                    "name": "Place name",
                    "description": "Detailed description",
                    "history": "Historical information",
                    "features": ["Key features"],
                    "visitingHours": "Opening hours",
                    "entryFee": "Entry fee information",
                    "accessibility": "Accessibility details",
                    "nearbyAttractions": ["Nearby places"]
                }`;

            const systemPrompt = `You are a knowledgeable tour guide for Bruges, Belgium.
                Provide accurate, detailed information about the requested location.
                Include practical information for visitors and interesting historical facts.`;

            return await this.generateStructuredResponse(prompt, systemPrompt);
        } catch (error) {
            console.error('Error getting place details:', error);
            throw new Error('Failed to get place details. Please try again.');
        }
    }

    async getAudioGuide(placeId) {
        try {
            const prompt = `Create an engaging audio guide script for ${placeId} in Bruges.
                The script should be:
                - Informative but conversational
                - 2-3 minutes in length
                - Include interesting facts and stories
                - End with a call to explore more
                Format the response in JSON with the following structure:
                {
                    "script": "The audio guide script",
                    "duration": "Estimated duration",
                    "keyPoints": ["Main points covered"]
                }`;

            const systemPrompt = `You are a professional audio tour guide for Bruges.
                Create engaging, informative scripts that bring the location to life.
                Use a conversational tone and include interesting anecdotes.`;

            return await this.generateStructuredResponse(prompt, systemPrompt);
        } catch (error) {
            console.error('Error generating audio guide:', error);
            throw new Error('Failed to generate audio guide. Please try again.');
        }
    }

    async getNearbyPlaces(placeId, filter = 'all') {
        try {
            const prompt = `List nearby attractions to ${placeId} in Bruges, filtered by ${filter}.
                Include:
                - Distance from current location
                - Brief description
                - Estimated visit duration
                - Entry requirements
                Format the response in JSON with the following structure:
                {
                    "nearbyPlaces": [
                        {
                            "name": "Place name",
                            "distance": "Distance from current location",
                            "description": "Brief description",
                            "duration": "Estimated visit duration",
                            "entry": "Entry requirements"
                        }
                    ]
                }`;

            const systemPrompt = `You are a local guide in Bruges helping visitors discover nearby attractions.
                Provide accurate information about nearby places based on the specified filter.
                Include practical details to help visitors plan their visit.`;

            return await this.generateStructuredResponse(prompt, systemPrompt);
        } catch (error) {
            console.error('Error getting nearby places:', error);
            throw new Error('Failed to get nearby places. Please try again.');
        }
    }
}

// Register the agent
if (window.agentManager) {
    window.agentManager.registerAgent('place', new PlaceAgent());
} 