/**
 * Base Agent class that all other agents should extend
 * Handles common functionality like Groq service initialization
 */
class BaseAgent {
    constructor() {
        if (!window.groqService) {
            throw new Error('GroqService must be initialized before creating agents');
        }
        this.groqService = window.groqService;
    }

    async initialize() {
        // Check if Groq API key is set
        if (!this.groqService.isApiKeySet()) {
            throw new Error('Groq API key is not set. Please check your .env file.');
        }
    }

    async processUserInput(input) {
        throw new Error('processUserInput must be implemented by child class');
    }

    async getRecommendations(preferences) {
        throw new Error('getRecommendations must be implemented by child class');
    }

    async updatePreferences(preferences) {
        // Optional method - child classes can override if needed
        return true;
    }

    protected async generateResponse(prompt, systemPrompt = '') {
        try {
            return await this.groqService.generateResponse(prompt, systemPrompt);
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response. Please try again.');
        }
    }

    protected async generateStructuredResponse(prompt, systemPrompt = '', format = 'json') {
        try {
            return await this.groqService.generateStructuredResponse(prompt, systemPrompt, format);
        } catch (error) {
            console.error('Error generating structured response:', error);
            throw new Error('Failed to generate structured response. Please try again.');
        }
    }
}

export { BaseAgent }; 