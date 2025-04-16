/**
 * Itinerary Agent
 * Handles generation of day-by-day itineraries based on user selections
 */
class ItineraryAgent extends BaseAgent {
    constructor() {
        super();
        this.type = 'itinerary';
        this.data = [];
        this.initialized = false;
        this.groqService = window.groqService;
        this.basePrompt = `You are a travel planning expert specializing in Bruges, Belgium. 
        Your task is to create personalized day-by-day itineraries based on user selections.
        Consider factors like:
        - Opening hours
        - Travel time between locations
        - Meal times
        - Tour schedules
        - Walking distances
        - Rest periods
        - Weather conditions
        - Special events
        - Local customs
        - Tourist crowds`;
        
        this.systemPrompt = `You are an expert travel planner for Bruges, Belgium. Your task is to create detailed, 
        well-structured day-by-day itineraries that optimize the visitor's experience. Consider all practical aspects 
        like opening hours, meal times, walking distances, and local context. Format your response as a JSON object 
        with the following structure:
        {
            "days": [
                {
                    "day": 1,
                    "date": "YYYY-MM-DD",
                    "items": [
                        {
                            "time": "HH:MM",
                            "duration": "X hours",
                            "type": "place|restaurant|tour|photo",
                            "id": "item_id",
                            "name": "Item name",
                            "description": "Brief description",
                            "location": {
                                "lat": latitude,
                                "lng": longitude
                            }
                        }
                    ]
                }
            ]
        }`;
    }

    async loadData() {
        try {
            console.log('Loading data for ItineraryAgent...');
            // Initialize empty data array
            this.data = [];
            this.initialized = true;
            console.log('ItineraryAgent data loaded successfully');
        } catch (error) {
            console.error('Error loading data for ItineraryAgent:', error);
            throw error;
        }
    }

    async handleSelectionChange(selections, recommendations) {
        try {
            console.log('Handling selection change in ItineraryAgent:', { selections, recommendations });
            
            // Check if Groq service is available
            if (!this.groqService) {
                console.warn('Groq service not found. Using fallback itinerary generation.');
                return this.generateFallbackItinerary(selections, recommendations);
            }
            
            const preferences = await this.processPreferences();
            const itinerary = await this.generatePlan(preferences);
            return itinerary;
        } catch (error) {
            console.error('Error in handleSelectionChange:', error.message || error);
            console.error('Error stack:', error.stack);
            // Fall back to simple itinerary generation
            return this.generateFallbackItinerary(selections, recommendations);
        }
    }

    async processPreferences() {
        try {
            const preferences = {
                interests: Array.from(document.querySelectorAll('.interest-option input:checked'))
                    .map(input => input.value),
                budget: document.querySelector('.budget-option input:checked')?.value || 'moderate',
                tours: Array.from(document.querySelectorAll('.tour-option input:checked'))
                    .map(input => input.value),
                selectedPlaces: window.selectionManager?.places || [],
                selectedRestaurants: window.selectionManager?.restaurants || [],
                selectedTours: window.selectionManager?.tours || []
            };

            // Validate preferences
            if (preferences.interests.length === 0) {
                throw new Error('Please select at least one interest.');
            }

            return preferences;
        } catch (error) {
            console.error('Error processing preferences:', error);
            throw error;
        }
    }

    async generatePlan(preferences) {
        try {
            if (!this.groqService) {
                throw new Error('Groq service not initialized');
            }

            const prompt = this.createPrompt(preferences);
            const response = await this.groqService.generateResponse(prompt);
            
            // Parse the response into an itinerary
            const itinerary = this.parseResponse(response);
            return itinerary;
        } catch (error) {
            console.error('Error generating plan:', error);
            throw error;
        }
    }

    createPrompt(preferences) {
        return `Create a detailed day-by-day itinerary for a trip to Bruges based on the following preferences:
        Interests: ${preferences.interests.join(', ')}
        Budget: ${preferences.budget}
        Selected Places: ${preferences.selectedPlaces.join(', ')}
        Selected Restaurants: ${preferences.selectedRestaurants.join(', ')}
        Selected Tours: ${preferences.selectedTours.join(', ')}
        
        Format the response as a JSON object with the following structure:
        {
            "days": [
                {
                    "day": 1,
                    "items": [
                        {
                            "time": "HH:MM",
                            "duration": "X hours",
                            "type": "place|restaurant|tour",
                            "name": "Item name",
                            "description": "Brief description"
                        }
                    ]
                }
            ]
        }`;
    }

    parseResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('Error parsing response:', error);
            // Return a fallback itinerary
            return {
                days: [{
                    day: 1,
                    items: [{
                        time: "09:00",
                        duration: "1 hour",
                        type: "place",
                        name: "Bruges City Center",
                        description: "Explore the historic city center"
                    }]
                }]
            };
        }
    }

    async updatePlanDisplay(plan) {
        try {
            const itineraryContainer = document.getElementById('itinerary-days');
            if (!itineraryContainer) {
                throw new Error('Itinerary container not found');
            }

            // Clear existing content
            itineraryContainer.innerHTML = '';

            // Add each day to the container
            plan.days.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'itinerary-day';
                dayElement.innerHTML = `
                    <h4>Day ${day.day}</h4>
                    <div class="day-schedule">
                        ${day.items.map(item => `
                            <div class="activity-item">
                                <i class="fas fa-${this.getActivityIcon(item.type)}"></i>
                                <div class="activity-details">
                                    <div class="activity-time">${item.time} (${item.duration})</div>
                                    <div class="activity-name">${item.name}</div>
                                    <div class="activity-description">${item.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                itineraryContainer.appendChild(dayElement);
            });
        } catch (error) {
            console.error('Error updating plan display:', error);
            throw error;
        }
    }

    getActivityIcon(type) {
        switch (type) {
            case 'place':
                return 'landmark';
            case 'restaurant':
                return 'utensils';
            case 'tour':
                return 'map-marked-alt';
            default:
                return 'calendar';
        }
    }

    generateFallbackItinerary(selections, recommendations) {
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

    optimizeDayRoute(items) {
        if (!items || items.length === 0) {
            return [];
        }

        // Check if all items have valid location data
        const hasValidLocations = items.every(item => 
            item.location && 
            typeof item.location.lat === 'number' && 
            typeof item.location.lng === 'number'
        );

        if (!hasValidLocations) {
            console.warn('Some items are missing valid location data. Returning original order.');
            return items;
        }

        try {
            // Start with the first item
            const optimizedRoute = [items[0]];
            const remainingItems = [...items.slice(1)];

            // Find the nearest unvisited item until all items are visited
            while (remainingItems.length > 0) {
                const lastItem = optimizedRoute[optimizedRoute.length - 1];
                let nearestIndex = 0;
                let minDistance = Infinity;

                for (let i = 0; i < remainingItems.length; i++) {
                    const distance = this.calculateDistance(
                        lastItem.location.lat,
                        lastItem.location.lng,
                        remainingItems[i].location.lat,
                        remainingItems[i].location.lng
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestIndex = i;
                    }
                }

                optimizedRoute.push(remainingItems[nearestIndex]);
                remainingItems.splice(nearestIndex, 1);
            }

            return optimizedRoute;
        } catch (error) {
            console.error('Error optimizing route:', error);
            return items; // Return original order if optimization fails
        }
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI/180);
    }

    calculateTravelTime(distance) {
        // Average walking speed is about 5 km/h
        const walkingSpeed = 5;
        const hours = distance / walkingSpeed;
        return Math.ceil(hours * 60); // Convert to minutes
    }

    async getRecommendations(items) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            // Generate a 3-day itinerary
            const itinerary = [
                {
                    title: 'Day 1: Historic Center',
                    items: items.slice(0, 4).map((item, index) => ({
                        time: `${9 + index}:00`,
                        name: item.name || `Activity ${index + 1}`,
                        description: item.description || 'Explore this location',
                        directions: item.directions || '#'
                    }))
                },
                {
                    title: 'Day 2: Cultural Experience',
                    items: items.slice(4, 8).map((item, index) => ({
                        time: `${9 + index}:00`,
                        name: item.name || `Activity ${index + 5}`,
                        description: item.description || 'Explore this location',
                        directions: item.directions || '#'
                    }))
                },
                {
                    title: 'Day 3: Local Flavors',
                    items: items.slice(8).map((item, index) => ({
                        time: `${9 + index}:00`,
                        name: item.name || `Activity ${index + 9}`,
                        description: item.description || 'Explore this location',
                        directions: item.directions || '#'
                    }))
                }
            ];

            return itinerary;
        } catch (error) {
            console.error('Error generating itinerary:', error);
            throw error;
        }
    }
}

// Initialize the itinerary agent
window.itineraryAgent = new ItineraryAgent(); 