/**
 * Groq Service
 * Handles communication with Groq's API
 */
export class GroqService {
    constructor() {
        this.apiKey = localStorage.getItem('groq_api_key') || '';
        this.model = 'mixtral-8x7b-32768'; // Groq's Mixtral model
        this.baseUrl = 'https://api.groq.com/v1/chat/completions';
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('groq_api_key', apiKey);
    }

    isApiKeySet() {
        return !!this.apiKey;
    }

    async makeRequest(messages, maxTokens = 1000, temperature = 0.7) {
        if (!this.isApiKeySet()) {
            throw new Error('Groq API key is not set. Please set it in the settings.');
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
                throw new Error(`Groq API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error making request to Groq API:', error);
            throw error;
        }
    }

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
            console.error('Error generating response from Groq API:', error);
            throw error;
        }
    }

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
                throw new Error('Failed to parse JSON response from Groq API');
            }
        }
        
        return response;
    }
}

// Initialize the Groq service
window.groqService = new GroqService(); 