import config from './config.js';
import AI_CONFIG from './ai-config.js';

class AITripPlanner {
    constructor() {
        this.preferences = {};
        this.weatherData = {};
        this.attractionsData = {};
        this.mlService = new MLService();
        this.realTimeService = new RealTimeService();
    }

    async generateSmartItinerary(userPreferences) {
        try {
            // Get ML predictions for user preferences
            const predictedPreferences = await this.mlService.predictUserPreferences(userPreferences);
            
            // Combine user input with ML predictions
            const enhancedPreferences = this.combinePreferences(userPreferences, predictedPreferences);
            
            // Get real-time data
            const realTimeData = await this.realTimeService.getRealtimeUpdates();
            
            // Generate initial itinerary
            const itinerary = await this.processWithAI({
                preferences: enhancedPreferences,
                weather: realTimeData.weather,
                venues: realTimeData.venues,
                transport: realTimeData.transport,
                attractions: await this.getAttractionsData(),
                constraints: this.generateConstraints(enhancedPreferences)
            });

            return this.optimizeItinerary(itinerary);
        } catch (error) {
            console.error('Error in generateSmartItinerary:', error);
            throw error;
        }
    }

    async processWithAI(data) {
        try {
            // Prepare prompt for OpenAI
            const prompt = this.generateAIPrompt(data);
            
            // Get AI suggestions
            const aiResponse = await this.getAISuggestions(prompt);
            
            // Parse and structure AI response
            const structuredResponse = this.parseAIResponse(aiResponse);
            
            return {
                suggestedActivities: this.rankActivities(structuredResponse, data),
                timeSlots: this.optimizeTimeSlots(structuredResponse, data),
                alternativePlans: this.generateAlternatives(structuredResponse, data)
            };
        } catch (error) {
            console.error('Error in processWithAI:', error);
            throw error;
        }
    }

    generateAIPrompt(data) {
        return `Create an optimized itinerary for a visit to Bruges with the following parameters:
            - Duration: ${data.preferences.duration} days
            - Interests: ${data.preferences.interests.join(', ')}
            - Weather: ${JSON.stringify(data.weather)}
            - Mobility: ${data.preferences.mobility.join(', ')}
            - Budget: ${data.preferences.budget}
            - Special requirements: ${data.preferences.specialRequests}
            
            Consider:
            1. Opening hours and crowd levels
            2. Weather-appropriate activities
            3. Travel time between locations
            4. Meal times and restaurant availability
            5. Indoor/outdoor balance based on weather
            
            Format the response as a JSON object with:
            1. Daily schedules
            2. Alternative options
            3. Recommended sequence
            4. Break times`;
    }

    async getAISuggestions(prompt) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.get('openai.apiKey')}`
                },
                body: JSON.stringify({
                    model: config.get('openai.model'),
                    messages: [{
                        role: "system",
                        content: "You are an expert travel planner for Bruges."
                    }, {
                        role: "user",
                        content: prompt
                    }],
                    max_tokens: config.get('openai.maxTokens')
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error in getAISuggestions:', error);
            throw error;
        }
    }

    calculateActivityScore(activity, data) {
        const scores = {
            interestMatch: this.calculateInterestScore(activity, data.preferences),
            weatherCompatibility: this.calculateWeatherScore(activity, data.weather),
            timeEfficiency: this.calculateTimeScore(activity, data.constraints),
            popularityScore: this.calculatePopularityScore(activity)
        };

        return Object.entries(scores).reduce((total, [key, score]) => {
            return total + (score * AI_CONFIG.weights[key]);
        }, 0);
    }

    calculateInterestScore(activity, preferences) {
        let score = 0;
        preferences.interests.forEach(interest => {
            if (activity.tags.includes(interest)) {
                score += 1;
            }
        });
        return score / preferences.interests.length;
    }

    calculateWeatherScore(activity, weather) {
        const isOutdoor = activity.type === 'outdoor';
        const weatherScore = {
            'clear': isOutdoor ? 1 : 0.7,
            'cloudy': isOutdoor ? 0.8 : 0.8,
            'rain': isOutdoor ? 0.2 : 1,
            'snow': isOutdoor ? 0.3 : 1
        };
        return weatherScore[weather.condition] || 0.5;
    }

    optimizeTimeSlots(suggestions, data) {
        const slots = AI_CONFIG.timeSlots;
        const optimizedSchedule = {};
        
        Object.keys(slots).forEach(slot => {
            const slotActivities = suggestions.filter(activity => 
                this.isActivitySuitableForSlot(activity, slot, data)
            );
            
            optimizedSchedule[slot] = this.selectBestActivities(slotActivities, data);
        });
        
        return optimizedSchedule;
    }

    isActivitySuitableForSlot(activity, slot, data) {
        const slotTimes = AI_CONFIG.timeSlots[slot];
        const openingHours = activity.openingHours;
        
        return (
            this.isTimeWithinRange(openingHours.open, slotTimes.start, slotTimes.end) &&
            this.checkWeatherSuitability(activity, data.weather[slot]) &&
            this.checkCrowdLevels(activity, slot)
        );
    }

    generateAlternatives(suggestions, data) {
        return {
            weatherBackup: this.createWeatherAlternatives(suggestions, data),
            timeBackup: this.createTimeAlternatives(suggestions, data)
        };
    }
} 