class Config {
    constructor() {
        this.env = {
            production: process.env.NODE_ENV === 'production',
            apiUrl: process.env.API_URL || 'http://localhost:3000',
            apiKey: process.env.API_KEY,
            weather: {
                apiKey: process.env.WEATHER_API_KEY,
                endpoint: process.env.WEATHER_API_ENDPOINT
            }
        };
        this.loadEnvironmentVariables();
    }

    loadEnvironmentVariables() {
        try {
            // OpenAI Configuration
            this.env.openai = {
                apiKey: process.env.OPENAI_API_KEY,
                model: process.env.OPENAI_MODEL || 'gpt-4',
                maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000
            };

            // Weather API Configuration
            this.env.weather = {
                apiKey: process.env.WEATHER_API_KEY
            };

            // Google Maps Configuration
            this.env.googleMaps = {
                apiKey: process.env.GOOGLE_MAPS_API_KEY
            };

            // Additional APIs
            this.env.ticketmaster = {
                apiKey: process.env.TICKETMASTER_API_KEY
            };

            this.env.restaurant = {
                apiKey: process.env.RESTAURANT_API_KEY
            };

            // DeepSeek Configuration
            this.env.deepseek = {
                apiKey: process.env.DEEPSEEK_API_KEY,
                maxResults: 10,
                language: 'en'
            };

            this.validateConfig();
        } catch (error) {
            console.error('Error loading environment variables:', error);
            throw new Error('Failed to load configuration');
        }
    }

    validateConfig() {
        const requiredKeys = [
            'openai.apiKey',
            'weather.apiKey',
            'googleMaps.apiKey'
        ];

        for (const key of requiredKeys) {
            const value = key.split('.').reduce((obj, k) => obj?.[k], this.env);
            if (!value) {
                throw new Error(`Missing required configuration: ${key}`);
            }
        }
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.env);
    }
}

// Create a singleton instance
const config = new Config();
export default config; 