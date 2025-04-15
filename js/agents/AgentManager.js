class AgentManager {
    constructor() {
        this.agents = new Map();
        this.initialized = false;
    }

    async initializeAgents() {
        if (this.initialized) return;

        try {
            console.log('Initializing agents...');
            
            // Initialize GroqService if not already initialized
            if (!window.groqService) {
                window.groqService = new GroqService();
            }
            
            // Set the API key from .env
            window.groqService.setApiKey('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');
            
            // Wait for all required dependencies to be available
            await this.waitForDependencies(['BaseAgent', 'GroqService']);

            // Initialize each agent type
            const agentTypes = ['place', 'restaurant', 'tour', 'photo', 'itinerary'];
            
            for (const type of agentTypes) {
                const agent = window[`${type}Agent`];
                if (agent) {
                    await agent.initialize();
                    this.agents.set(type, agent);
                    console.log(`${type} agent initialized successfully`);
                } else {
                    console.warn(`${type} agent not found`);
                }
            }

            this.initialized = true;
            console.log('All agents initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Agent Manager:', error);
            throw error;
        }
    }

    async waitForDependencies(dependencies) {
        const maxAttempts = 50;
        const checkInterval = 100; // ms

        for (let i = 0; i < maxAttempts; i++) {
            const missingDependencies = dependencies.filter(dep => {
                if (dep === 'GroqService') {
                    return !window.groqService || !window.groqService.isApiKeySet();
                }
                return !window[dep];
            });
            
            if (missingDependencies.length === 0) {
                return;
            }

            if (i === maxAttempts - 1) {
                throw new Error(`Missing required dependencies: ${missingDependencies.join(', ')}`);
            }

            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }
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
                places: await this.agents.get('place').getRecommendations(selections.places),
                restaurants: await this.agents.get('restaurant').getRecommendations(selections.restaurants),
                tours: await this.agents.get('tour').getRecommendations(selections.tours),
                photos: await this.agents.get('photo').getRecommendations(selections.photos)
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
            const itinerary = await this.agents.get('itinerary').handleSelectionChange(selections, recommendations);
            
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
        return this.agents.get(type);
    }

    isInitialized() {
        return this.initialized;
    }
}

// Make it available globally
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