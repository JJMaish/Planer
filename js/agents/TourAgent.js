class TourAgent {
    constructor() {
        this.type = 'tour';
        this.data = [];
        this.initialized = false;
        this.basePrompt = `You are a tour guide expert specializing in Bruges, Belgium. 
        Your task is to recommend tours based on user preferences and selections.
        Consider factors like:
        - Tour duration
        - Difficulty level
        - Language availability
        - Group size
        - Price
        - Departure times
        - Accessibility
        - Special interests
        - Seasonal availability
        - Booking requirements`;
    }

    async loadData() {
        try {
            console.log('Loading data for TourAgent...');
            // In a real application, this would load data from an API or database
            // For now, we'll use placeholder data
            this.data = [
                {
                    id: 'tour1',
                    name: 'Bruges Canal Boat Tour',
                    description: 'Scenic boat tour through the historic canals of Bruges',
                    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
                    location: { lat: 51.2090, lng: 3.2250 },
                    duration: 30,
                    price: '€10',
                    departureTimes: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
                    languages: ['English', 'Dutch', 'French', 'German'],
                    rating: 4.8
                },
                {
                    id: 'tour2',
                    name: 'Bruges Beer Tasting Tour',
                    description: 'Sample Belgian beers and learn about brewing traditions',
                    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
                    location: { lat: 51.2095, lng: 3.2245 },
                    duration: 120,
                    price: '€35',
                    departureTimes: ['14:00', '16:00', '18:00'],
                    languages: ['English', 'Dutch'],
                    rating: 4.7
                },
                {
                    id: 'tour3',
                    name: 'Bruges Chocolate Workshop',
                    description: 'Learn to make Belgian chocolates with a master chocolatier',
                    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
                    location: { lat: 51.2085, lng: 3.2255 },
                    duration: 90,
                    price: '€45',
                    departureTimes: ['10:00', '14:00'],
                    languages: ['English', 'Dutch', 'French'],
                    rating: 4.9
                }
            ];
            this.initialized = true;
            console.log('TourAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for TourAgent:', error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log('TourAgent getting recommendations for:', selectedIds);
            
            // Ensure selectedIds is an array
            if (!selectedIds) {
                selectedIds = [];
            } else if (typeof selectedIds === 'string') {
                selectedIds = [selectedIds];
            } else if (!Array.isArray(selectedIds)) {
                console.warn('Invalid selectedIds format, using empty array');
                selectedIds = [];
            }
            
            // If no selections, return all tours
            if (selectedIds.length === 0) {
                console.log('No selections, returning all tours');
                return this.data;
            }
            
            // Filter tours based on selections
            const recommendations = this.data.filter(tour => 
                selectedIds.includes(tour.id)
            );
            
            console.log('Tour recommendations:', recommendations);
            return recommendations;
        } catch (error) {
            console.error('Error getting recommendations in TourAgent:', error);
            throw error;
        }
    }

    async handleSelection(id, action) {
        try {
            console.log(`TourAgent handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error('Error handling selection in TourAgent:', error);
            throw error;
        }
    }
}

// Initialize the tour agent
window.tourAgent = new TourAgent(); 