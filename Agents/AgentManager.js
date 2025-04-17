/**
 * Agent Manager
 * Manages and coordinates all agents in the system
 */
class AgentManager {
    constructor() {
        this.agents = new Map();
        this.initialized = false;
    }

    async initializeAgents() {
        try {
            // Initialize all required agents
            await this.registerAgent('place', new PlaceAgent());
            await this.registerAgent('restaurant', new RestaurantAgent());
            await this.registerAgent('tour', new TourAgent());
            await this.registerAgent('photo', new PhotoAgent());
            await this.registerAgent('itinerary', new ItineraryAgent());

            this.initialized = true;
            console.log('All agents initialized successfully');
        } catch (error) {
            console.error('Error initializing agents:', error);
            throw error;
        }
    }

    async registerAgent(type, agent) {
        try {
            if (this.agents.has(type)) {
                console.warn(`Agent of type ${type} already exists. Overwriting...`);
            }

            await agent.initialize();
            this.agents.set(type, agent);
            console.log(`Agent ${type} registered successfully`);
        } catch (error) {
            console.error(`Error registering agent ${type}:`, error);
            throw error;
        }
    }

    getAgent(type) {
        if (!this.agents.has(type)) {
            throw new Error(`Agent of type ${type} not found`);
        }
        return this.agents.get(type);
    }

    async processUserInput(input) {
        if (!this.initialized) {
            throw new Error('AgentManager not initialized');
        }

        const results = new Map();
        const errors = [];

        for (const [type, agent] of this.agents) {
            try {
                const result = await agent.processUserInput(input);
                results.set(type, result);
            } catch (error) {
                console.error(`Error processing input in ${type} agent:`, error);
                errors.push({ type, error: error.message });
            }
        }

        return {
            success: errors.length === 0,
            results: Object.fromEntries(results),
            errors: errors
        };
    }

    async getRecommendations(preferences) {
        if (!this.initialized) {
            throw new Error('AgentManager not initialized');
        }

        const recommendations = new Map();
        const errors = [];

        for (const [type, agent] of this.agents) {
            try {
                const result = await agent.getRecommendations(preferences);
                recommendations.set(type, result);
            } catch (error) {
                console.error(`Error getting recommendations from ${type} agent:`, error);
                errors.push({ type, error: error.message });
            }
        }

        return {
            success: errors.length === 0,
            recommendations: Object.fromEntries(recommendations),
            errors: errors
        };
    }

    async updatePreferences(preferences) {
        if (!this.initialized) {
            throw new Error('AgentManager not initialized');
        }

        const updates = new Map();
        const errors = [];

        for (const [type, agent] of this.agents) {
            try {
                if (typeof agent.updatePreferences === 'function') {
                    const result = await agent.updatePreferences(preferences);
                    updates.set(type, result);
                }
            } catch (error) {
                console.error(`Error updating preferences in ${type} agent:`, error);
                errors.push({ type, error: error.message });
            }
        }

        return {
            success: errors.length === 0,
            updates: Object.fromEntries(updates),
            errors: errors
        };
    }

    async handleError(error) {
        console.error('AgentManager error:', error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred in AgentManager'
        };
    }
}

export { AgentManager }; 