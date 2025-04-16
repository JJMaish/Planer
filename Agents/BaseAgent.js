import config from '../js/config.js';

export class BaseAgent {
    constructor() {
        this.config = config;
    }

    async callGroq(prompt, systemMessage = "") {
        try {
            const response = await fetch('https://api.groq.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.get('groq.apiKey')}`
                },
                body: JSON.stringify({
                    model: this.config.get('groq.model'),
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: this.config.get('groq.maxTokens')
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Groq API error:', error);
            throw error;
        }
    }

    async searchInformation(query, type = 'general') {
        const prompt = `Search for information about: ${query}
            Context: This is for a travel planning application in Bruges, Belgium.
            Type: ${type}
            Please provide structured, relevant information.`;

        const response = await this.callGroq(prompt, 
            "You are a knowledgeable search assistant for Bruges tourism information.");
        
        return JSON.parse(response);
    }
} 