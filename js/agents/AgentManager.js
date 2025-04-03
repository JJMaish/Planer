class AgentManager {
    constructor() {
        this.agents = {
            place: null,
            restaurant: null,
            tour: null,
            photo: null,
            itinerary: null
        };
        this.initialized = false;
        this.initializationPromise = null;
    }

    async initializeAgents() {
        // If already initializing, return the existing promise
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        // If already initialized, return immediately
        if (this.initialized) {
            return Promise.resolve();
        }

        // Create a new initialization promise
        this.initializationPromise = (async () => {
            try {
                console.log('Initializing agents...');

                // Wait for all required global objects to be available
                await this.waitForDependencies();
                
                // Check if all required agent classes are available
                if (!window.PlaceAgent) {
                    throw new Error('PlaceAgent class not found');
                }
                if (!window.RestaurantAgent) {
                    throw new Error('RestaurantAgent class not found');
                }
                if (!window.TourAgent) {
                    throw new Error('TourAgent class not found');
                }
                if (!window.PhotoAgent) {
                    throw new Error('PhotoAgent class not found');
                }
                if (!window.ItineraryAgent) {
                    throw new Error('ItineraryAgent class not found');
                }
                
                // Initialize each agent
                this.agents.place = window.placeAgent || new PlaceAgent();
                this.agents.restaurant = window.restaurantAgent || new RestaurantAgent();
                this.agents.tour = window.tourAgent || new TourAgent();
                this.agents.photo = window.photoAgent || new PhotoAgent();
                this.agents.itinerary = window.itineraryAgent || new ItineraryAgent();
                
                // Load data for each agent
                await Promise.all([
                    this.agents.place.loadData(),
                    this.agents.restaurant.loadData(),
                    this.agents.tour.loadData(),
                    this.agents.photo.loadData()
                ]);
                
                this.initialized = true;
                console.log('All agents initialized successfully');
            } catch (error) {
                console.error('Error initializing agents:', error.message || error);
                console.error('Error stack:', error.stack);
                this.initializationPromise = null; // Reset the promise on error
                throw error;
            }
        })();

        return this.initializationPromise;
    }

    async waitForDependencies(timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            // Check if all required dependencies are available
            const missingDependencies = [];
            
            if (!window.PlaceAgent) missingDependencies.push('PlaceAgent');
            if (!window.RestaurantAgent) missingDependencies.push('RestaurantAgent');
            if (!window.TourAgent) missingDependencies.push('TourAgent');
            if (!window.PhotoAgent) missingDependencies.push('PhotoAgent');
            if (!window.ItineraryAgent) missingDependencies.push('ItineraryAgent');
            if (!window.selectionManager) missingDependencies.push('selectionManager');
            
            if (missingDependencies.length === 0) {
                return true;
            }
            
            // Wait a bit before checking again
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('Required dependencies not found within timeout period: ' + 
            (missingDependencies ? missingDependencies.join(', ') : 'unknown'));
    }

    async handleSelectionChange(selections) {
        try {
            console.log('AgentManager handling selection change:', selections);
            
            // Ensure agents are initialized
            if (!this.initialized) {
                await this.initializeAgents();
            }
            
            // Ensure selections is an object with the expected structure
            if (typeof selections === 'string') {
                // If a string is passed, assume it's a category and get selections from the selection manager
                const category = selections;
                const selectionManager = window.selectionManager;
                if (!selectionManager) {
                    throw new Error('Selection manager not found');
                }
                
                const allSelections = selectionManager.getSelections();
                selections = allSelections;
                console.log('Retrieved selections from selection manager:', selections);
            }
            
            // Ensure selections has the expected structure
            if (!selections || typeof selections !== 'object') {
                throw new Error('Invalid selections format');
            }
            
            // Initialize empty arrays for each category if they don't exist
            selections.places = selections.places || [];
            selections.restaurants = selections.restaurants || [];
            selections.tours = selections.tours || [];
            selections.photos = selections.photos || [];
            
            // Get recommendations from each agent
            const recommendations = {
                places: await this.agents.place.getRecommendations(selections.places),
                restaurants: await this.agents.restaurant.getRecommendations(selections.restaurants),
                tours: await this.agents.tour.getRecommendations(selections.tours),
                photos: await this.agents.photo.getRecommendations(selections.photos)
            };
            
            // Check if OpenAI service is available before generating itinerary
            if (!window.openAIService || !window.openAIService.isApiKeySet()) {
                console.warn('OpenAI service not available or API key not set. Using fallback itinerary generation.');
                // Use the fallback itinerary generation from tour-details.html
                const itinerary = await this.generateFallbackItinerary(selections, recommendations);
                return {
                    recommendations,
                    itinerary
                };
            }
            
            // Generate itinerary using the recommendations
            const itinerary = await this.agents.itinerary.handleSelectionChange(selections, recommendations);
            
            return {
                recommendations,
                itinerary
            };
        } catch (error) {
            console.error('Error in AgentManager.handleSelectionChange:', error);
            throw error;
        }
    }
    
    async generateFallbackItinerary(selections, recommendations) {
        try {
            console.log('Generating fallback itinerary');
            
            // Create a simple itinerary based on selections
            const days = [];
            
            // Group selections into days
            const allItems = [
                ...selections.places.map(id => ({ id, type: 'place' })),
                ...selections.restaurants.map(id => ({ id, type: 'restaurant' })),
                ...selections.tours.map(id => ({ id, type: 'tour' })),
                ...selections.photos.map(id => ({ id, type: 'photo' }))
            ];
            
            // Simple grouping - 5 items per day
            for (let i = 0; i < allItems.length; i += 5) {
                const dayItems = allItems.slice(i, i + 5);
                days.push({
                    day: days.length + 1,
                    date: new Date(Date.now() + days.length * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    items: dayItems.map(item => {
                        const itemData = this.getItemData(item.id, item.type, recommendations);
                        return {
                            time: "09:00",
                            duration: "1 hour",
                            type: item.type,
                            id: item.id,
                            name: itemData.name,
                            description: itemData.description,
                            location: itemData.location || { lat: 0, lng: 0 }
                        };
                    })
                });
            }
            
            return { days };
        } catch (error) {
            console.error('Error generating fallback itinerary:', error);
            return { days: [] };
        }
    }
    
    getItemData(id, type, recommendations) {
        // Try to find the item in recommendations
        const category = type + 's'; // places, restaurants, tours, photos
        if (recommendations[category]) {
            const item = recommendations[category].find(item => item.id === id);
            if (item) {
                return item;
            }
        }
        
        // Fallback to placeholder data
        return {
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`,
            description: `A ${type} in Bruges`,
            location: { lat: 51.2093, lng: 3.2247 }
        };
    }

    getAgent(type) {
        if (!this.initialized) {
            throw new Error('Agents not initialized');
        }
        return this.agents[type];
    }

    isInitialized() {
        return this.initialized;
    }
}

// Initialize the agent manager
window.agentManager = new AgentManager();

// Initialize agents after DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.agentManager.initializeAgents();
        console.log('Agent Manager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Agent Manager:', error);
    }
}); 