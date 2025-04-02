import DeepSeekService from '../services/DeepSeekService.js';
import config from '../js/config.js';

class BaseAgent {
    constructor() {
        this.config = config;
        this.deepseek = new DeepSeekService(this.config.get('deepseek.apiKey'));
    }

    async fetchWithRetry(url, options, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }

    async callOpenAI(prompt, systemMessage = "") {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.get('openai.apiKey')}`
                },
                body: JSON.stringify({
                    model: this.config.get('openai.model'),
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: this.config.get('openai.maxTokens')
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    async searchWithDeepSeek(query, type = 'web') {
        try {
            switch(type) {
                case 'web':
                    return await this.deepseek.webSearch(query);
                case 'local':
                    return await this.deepseek.localSearch(query);
                case 'image':
                    return await this.deepseek.imageSearch(query);
                default:
                    throw new Error('Invalid search type');
            }
        } catch (error) {
            console.error('DeepSeek search error:', error);
            throw error;
        }
    }
}

export default BaseAgent; 