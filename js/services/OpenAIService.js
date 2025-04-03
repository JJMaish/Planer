/**
 * OpenAI Service
 * Handles communication with OpenAI's API using GPT-3.5-turbo model
 */
class OpenAIService {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.model = 'gpt-3.5-turbo';
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    }

    /**
     * Set the OpenAI API key
     * @param {string} apiKey - The OpenAI API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('openai_api_key', apiKey);
    }

    /**
     * Check if the API key is set
     * @returns {boolean} - Whether the API key is set
     */
    isApiKeySet() {
        return !!this.apiKey;
    }

    /**
     * Make a request to the OpenAI API
     * @param {Array} messages - The messages to send to the API
     * @param {number} maxTokens - The maximum number of tokens to generate
     * @param {number} temperature - The temperature to use for generation
     * @returns {Promise<Object>} - The API response
     */
    async makeRequest(messages, maxTokens = 1000, temperature = 0.7) {
        if (!this.isApiKeySet()) {
            throw new Error('OpenAI API key is not set. Please set it in the settings.');
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: maxTokens,
                    temperature: temperature
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error making request to OpenAI API:', error);
            throw error;
        }
    }

    /**
     * Generate a response from the OpenAI API
     * @param {string} prompt - The prompt to send to the API
     * @param {string} systemPrompt - The system prompt to send to the API
     * @param {number} maxTokens - The maximum number of tokens to generate
     * @param {number} temperature - The temperature to use for generation
     * @returns {Promise<string>} - The generated response
     */
    async generateResponse(prompt, systemPrompt = '', maxTokens = 1000, temperature = 0.7) {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }
        
        messages.push({
            role: 'user',
            content: prompt
        });

        try {
            const response = await this.makeRequest(messages, maxTokens, temperature);
            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating response from OpenAI API:', error);
            throw error;
        }
    }

    /**
     * Generate a structured response from the OpenAI API
     * @param {string} prompt - The prompt to send to the API
     * @param {string} systemPrompt - The system prompt to send to the API
     * @param {string} format - The format to use for the response (json, markdown, etc.)
     * @param {number} maxTokens - The maximum number of tokens to generate
     * @param {number} temperature - The temperature to use for generation
     * @returns {Promise<Object>} - The generated response
     */
    async generateStructuredResponse(prompt, systemPrompt = '', format = 'json', maxTokens = 1000, temperature = 0.7) {
        let formattedSystemPrompt = systemPrompt;
        
        if (format === 'json') {
            formattedSystemPrompt += '\n\nPlease provide your response in valid JSON format.';
        } else if (format === 'markdown') {
            formattedSystemPrompt += '\n\nPlease provide your response in Markdown format.';
        }

        const response = await this.generateResponse(prompt, formattedSystemPrompt, maxTokens, temperature);
        
        if (format === 'json') {
            try {
                return JSON.parse(response);
            } catch (error) {
                console.error('Error parsing JSON response:', error);
                throw new Error('Failed to parse JSON response from OpenAI API');
            }
        }
        
        return response;
    }
}

// Initialize the OpenAI service
window.openAIService = new OpenAIService(); 