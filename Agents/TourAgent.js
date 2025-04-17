import { BaseAgent } from './BaseAgent.js';

/**
 * TourAgent class for handling tour-related operations
 * Extends BaseAgent for common functionality
 */
export class TourAgent extends BaseAgent {
    constructor() {
        super();
        this.name = 'TourAgent';
    }

    /**
     * Initialize the tour agent
     */
    async initialize() {
        try {
            await super.initialize();
            console.log(`${this.name} initialized successfully`);
        } catch (error) {
            console.error(`Error initializing ${this.name}:`, error);
            throw error;
        }
    }

    /**
     * Generate tour information
     * @param {string} query - The tour query
     * @returns {Promise<Object>} - Tour information
     */
    async generateTourInfo(query) {
        try {
            const systemPrompt = `You are a knowledgeable tour guide for Bruges, Belgium. 
                Provide detailed information about tours, including:
                - Tour types and durations
                - Key attractions covered
                - Historical context
                - Practical information
                - Booking details
                - Special features or highlights`;

            const response = await this.generateResponse(query, systemPrompt);
            return this.parseTourResponse(response);
        } catch (error) {
            console.error('Error generating tour info:', error);
            throw error;
        }
    }

    /**
     * Parse the tour response into a structured format
     * @param {string} response - The raw response from the AI
     * @returns {Object} - Structured tour information
     */
    parseTourResponse(response) {
        try {
            // Basic parsing - can be enhanced based on specific needs
            return {
                description: response,
                highlights: this.extractHighlights(response),
                practicalInfo: this.extractPracticalInfo(response)
            };
        } catch (error) {
            console.error('Error parsing tour response:', error);
            return {
                description: response,
                highlights: [],
                practicalInfo: {}
            };
        }
    }

    /**
     * Extract highlights from the response
     * @param {string} response - The raw response
     * @returns {Array<string>} - List of highlights
     */
    extractHighlights(response) {
        // Simple extraction - can be enhanced
        return response.split('\n')
            .filter(line => line.includes('*') || line.includes('-'))
            .map(line => line.replace(/[*\-]/, '').trim());
    }

    /**
     * Extract practical information from the response
     * @param {string} response - The raw response
     * @returns {Object} - Practical information
     */
    extractPracticalInfo(response) {
        const info = {
            duration: this.extractDuration(response),
            price: this.extractPrice(response),
            meetingPoint: this.extractMeetingPoint(response)
        };
        return info;
    }

    /**
     * Extract duration from the response
     * @param {string} response - The raw response
     * @returns {string} - Duration information
     */
    extractDuration(response) {
        const durationMatch = response.match(/(\d+\s*(hour|hr|h|minute|min|m)s?)/i);
        return durationMatch ? durationMatch[0] : 'Duration not specified';
    }

    /**
     * Extract price from the response
     * @param {string} response - The raw response
     * @returns {string} - Price information
     */
    extractPrice(response) {
        const priceMatch = response.match(/(€|EUR|euro)\s*\d+(\.\d{2})?/i);
        return priceMatch ? priceMatch[0] : 'Price not specified';
    }

    /**
     * Extract meeting point from the response
     * @param {string} response - The raw response
     * @returns {string} - Meeting point information
     */
    extractMeetingPoint(response) {
        const meetingMatch = response.match(/meet(ing)?\s*point:?\s*([^.]+)/i);
        return meetingMatch ? meetingMatch[2].trim() : 'Meeting point not specified';
    }
} 