import config from './config.js';

const AI_CONFIG = {
    // Groq API configuration
    groq: {
        apiKey: config.get('groq.apiKey'),
        model: config.get('groq.model'),
        maxTokens: config.get('groq.maxTokens')
    },
    
    // Scoring weights for different factors
    weights: {
        interestMatch: 0.35,
        weatherCompatibility: 0.20,
        timeEfficiency: 0.25,
        popularityScore: 0.20
    },

    // Time slot preferences
    timeSlots: {
        morning: { start: '09:00', end: '12:00' },
        afternoon: { start: '12:00', end: '17:00' },
        evening: { start: '17:00', end: '22:00' }
    }
};

export default AI_CONFIG; 