import { BaseAgent } from './BaseAgent.js';

export class ChatAgent extends BaseAgent {
    constructor() {
        super();
        this.context = [];
    }

    async processMessage(message) {
        try {
            // Search for relevant information
            const searchResults = await this.searchInformation(
                `${message} Bruges tourism`,
                'tourism'
            );

            // Add context to the AI prompt
            const enhancedPrompt = this.enhancePromptWithSearchResults(
                message, 
                searchResults
            );

            // Generate response
            const response = await this.generateResponse(enhancedPrompt);

            return response;
        } catch (error) {
            console.error('Error processing message:', error);
            return "I'm sorry, I'm having trouble processing your request. Please try again.";
        }
    }

    async generateResponse(prompt) {
        const systemMessage = `You are a helpful travel assistant for Bruges, Belgium. 
            You have extensive knowledge about:
            - Tourist attractions
            - Local events
            - Restaurants and bars
            - Transportation
            - Cultural customs
            - Weather considerations
            Provide concise, practical advice and always be friendly.`;

        return await this.callGroq(prompt, systemMessage);
    }

    enhancePromptWithSearchResults(message, searchResults) {
        return `
            User Question: ${message}
            
            Relevant Information:
            ${searchResults.items.map(item => 
                `- ${item.title}: ${item.description}`
            ).join('\n')}
            
            Please provide a helpful response based on this information.
        `;
    }

    clearContext() {
        this.context = [];
    }
} 