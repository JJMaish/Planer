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
            // Weather API Configuration
            this.env.weather = {
                apiKey: process.env.WEATHER_API_KEY
            };

            // Additional APIs
            this.env.ticketmaster = {
                apiKey: process.env.TICKETMASTER_API_KEY
            };

            this.env.restaurant = {
                apiKey: process.env.RESTAURANT_API_KEY
            };

            // Groq Configuration
            this.env.groq = {
                apiKey: process.env.GROQ_API_KEY,
                model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
                maxTokens: parseInt(process.env.GROQ_MAX_TOKENS) || 2000
            };

            this.validateConfig();
        } catch (error) {
            console.error('Error loading environment variables:', error);
            throw new Error('Failed to load configuration');
        }
    }

    validateConfig() {
        const requiredKeys = [
            'groq.apiKey',
            'weather.apiKey'
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