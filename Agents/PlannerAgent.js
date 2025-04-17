import { BaseAgent } from './BaseAgent.js';
import { EventsAgent } from './EventsAgent.js';
import { NightlifeAgent } from './NightlifeAgent.js';
import { AttractionsAgent } from './AttractionsAgent.js';

export class PlannerAgent extends BaseAgent {
    constructor() {
        super();
        this.eventsAgent = new EventsAgent();
        this.nightlifeAgent = new NightlifeAgent();
        this.attractionsAgent = new AttractionsAgent();
    }

    async createItinerary(preferences) {
        try {
            // Get user selections
            const selections = window.selectionManager.getSelections();
            
            // Merge selections with preferences
            const enhancedPreferences = {
                ...preferences,
                selectedPlaces: selections.places,
                selectedRestaurants: selections.restaurants,
                selectedPhotos: selections.photos
            };

            // Generate optimized itinerary with selections
            const itinerary = await this.generateOptimizedItinerary(enhancedPreferences);
            
            return itinerary;
        } catch (error) {
            console.error('Error creating itinerary:', error);
            throw error;
        }
    }

    async generateOptimizedItinerary(preferences) {
        // Prioritize selected items in the itinerary
        const selectedPlaces = await this.fetchPlaceDetails(preferences.selectedPlaces);
        const selectedRestaurants = await this.fetchRestaurantDetails(preferences.selectedRestaurants);
        
        // Generate AI prompt with selections
        const prompt = `Create an optimized itinerary for Bruges including these specific selections:
            Selected Places: ${JSON.stringify(selectedPlaces)}
            Selected Restaurants: ${JSON.stringify(selectedRestaurants)}
            Other Preferences: ${JSON.stringify(preferences)}`;

        return await this.callGroq(prompt, "You are an expert travel planner for Bruges.");
    }

    async generatePDF(itinerary) {
        // Implement PDF generation logic
        // Could use libraries like pdfkit or jspdf
    }
} 