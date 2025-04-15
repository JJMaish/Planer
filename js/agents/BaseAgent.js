/**
 * Base Agent Class
 * Provides common functionality for all agents
 */
class BaseAgent {
    constructor() {
        this.initialized = false;
        this.data = null;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            await this.loadData();
            this.initialized = true;
        } catch (error) {
            console.error(`Error initializing ${this.constructor.name}:`, error);
            throw error;
        }
    }

    async loadData() {
        // To be implemented by child classes
        throw new Error('loadData method must be implemented by child class');
    }

    isInitialized() {
        return this.initialized;
    }

    async getRecommendations(ids) {
        if (!this.initialized) {
            await this.initialize();
        }
        
        if (!this.data) {
            return [];
        }

        // Ensure data is an array
        const dataArray = Array.isArray(this.data) ? this.data : Object.values(this.data);
        
        // Handle both string IDs and object IDs
        return ids.map(id => {
            if (typeof id === 'object' && id.id) {
                return dataArray.find(item => item.id === id.id);
            }
            return dataArray.find(item => item.id === id);
        }).filter(Boolean);
    }

    async handleSelection(id, action) {
        try {
            console.log(`${this.constructor.name} handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error(`Error handling selection in ${this.constructor.name}:`, error);
            throw error;
        }
    }

    async updateRecommendations() {
        // To be implemented by child classes
        throw new Error('updateRecommendations must be implemented by child class');
    }

    // Utility methods
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI/180);
    }

    // Event dispatching
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Make it available globally
window.BaseAgent = BaseAgent; 