/**
 * Base Agent Class
 * Provides common functionality for all agents
 */
class BaseAgent {
    constructor(type) {
        this.type = type;
        this.data = [];
        this.initialized = false;
        this.recommendations = new Map();
    }

    async initialize() {
        // Load initial data
        await this.loadData();
    }

    async loadData() {
        try {
            console.log(`Loading data for ${this.type}Agent...`);
            // In a real application, this would load data from an API or database
            // For now, we'll use placeholder data
            this.data = [];
            this.initialized = true;
            console.log(`${this.type}Agent data loaded successfully`);
        } catch (error) {
            console.error(`Error loading data for ${this.type}Agent:`, error);
            throw error;
        }
    }

    async handleSelection(id, action) {
        try {
            console.log(`${this.type}Agent handling selection: ${id}, ${action}`);
            // In a real application, this would update the agent's state based on the selection
            // For now, we'll just log the action
            return true;
        } catch (error) {
            console.error(`Error handling selection in ${this.type}Agent:`, error);
            throw error;
        }
    }

    async getRecommendations(selectedIds) {
        try {
            console.log(`${this.type}Agent getting recommendations for:`, selectedIds);
            
            // Ensure selectedIds is an array
            if (!selectedIds) {
                selectedIds = [];
            } else if (typeof selectedIds === 'string') {
                selectedIds = [selectedIds];
            } else if (!Array.isArray(selectedIds)) {
                console.warn('Invalid selectedIds format, using empty array');
                selectedIds = [];
            }
            
            // If no selections, return all items
            if (selectedIds.length === 0) {
                console.log('No selections, returning all items');
                return this.data;
            }
            
            // Filter items based on selections
            const recommendations = this.data.filter(item => 
                selectedIds.includes(item.id)
            );
            
            console.log(`${this.type} recommendations:`, recommendations);
            return recommendations;
        } catch (error) {
            console.error(`Error getting recommendations in ${this.type}Agent:`, error);
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