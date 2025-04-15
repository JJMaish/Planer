class EventAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'event';
        this.basePrompt = `You are a local event expert specializing in Bruges, Belgium. 
        Your task is to recommend events and activities based on user preferences and selections.
        Consider factors like:
        - Event type (festival, concert, exhibition, etc.)
        - Date and time
        - Location
        - Price range
        - Age restrictions
        - Accessibility
        - Language options
        - Special requirements
        - Reviews and ratings`;
    }

    async loadData() {
        try {
            console.log('Loading data for EventAgent...');
            this.data = [
                {
                    id: 'christmas-market',
                    name: 'Bruges Christmas Market',
                    description: 'Traditional Christmas market with local crafts and food',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2085, lng: 3.2260 },
                    date: 'December 1-31',
                    time: '10:00-22:00',
                    price: 'Free entry',
                    ageRestriction: 'All ages',
                    languages: ['English', 'Dutch', 'French'],
                    rating: 4.8
                },
                {
                    id: 'procession-holy-blood',
                    name: 'Procession of the Holy Blood',
                    description: 'Annual religious procession through the city center',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2090, lng: 3.2255 },
                    date: 'Ascension Day',
                    time: '14:30-17:00',
                    price: 'Free',
                    ageRestriction: 'All ages',
                    languages: ['English', 'Dutch'],
                    rating: 4.9
                },
                {
                    id: 'bruges-triennial',
                    name: 'Bruges Triennial',
                    description: 'Contemporary art and architecture exhibition',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                    location: { lat: 51.2080, lng: 3.2265 },
                    date: 'May 8 - September 24',
                    time: '10:00-18:00',
                    price: '€15',
                    ageRestriction: 'All ages',
                    languages: ['English', 'Dutch', 'French'],
                    rating: 4.7
                }
            ];
            this.initialized = true;
            console.log('EventAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for EventAgent:', error);
            throw error;
        }
    }
} 