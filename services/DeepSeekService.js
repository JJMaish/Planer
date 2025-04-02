class DeepSeekService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.deepseek.com/v1';
    }

    async search(query, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    query,
                    ...options
                })
            });

            if (!response.ok) throw new Error('Search request failed');
            return await response.json();
        } catch (error) {
            console.error('DeepSeek search error:', error);
            throw error;
        }
    }

    async webSearch(query) {
        return this.search(query, { type: 'web' });
    }

    async localSearch(query, location = 'Bruges, Belgium') {
        return this.search(query, { 
            type: 'local',
            location 
        });
    }

    async imageSearch(query) {
        return this.search(query, { type: 'image' });
    }
}

export default DeepSeekService; 