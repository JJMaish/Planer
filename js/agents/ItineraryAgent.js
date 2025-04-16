class ItineraryAgent extends BaseAgent {
    constructor() {
        super();
    }

    async processPreferences() {
        const interests = Array.from(document.querySelectorAll('input[name="interest"]:checked')).map(input => input.value);
        const budget = document.querySelector('input[name="budget"]:checked')?.value;
        const boatTour = document.querySelector('input[name="boat-tour"]:checked')?.value === 'yes';
        const horseTour = document.querySelector('input[name="horse-tour"]:checked')?.value === 'yes';

        if (!interests.length) {
            throw new Error('Please select at least one interest');
        }

        if (!budget) {
            throw new Error('Please select a budget range');
        }

        return {
            interests,
            budget,
            boatTour,
            horseTour
        };
    }

    async generatePlan(preferences) {
        try {
            const prompt = `Generate a detailed itinerary based on the following preferences:
                Interests: ${preferences.interests.join(', ')}
                Budget: ${preferences.budget}
                Include Boat Tour: ${preferences.boatTour}
                Include Horse Tour: ${preferences.horseTour}

                Please provide a structured itinerary with:
                - Daily activities
                - Estimated costs
                - Time allocations
                - Travel recommendations
                Format the response in JSON with the following structure:
                {
                    "days": [
                        {
                            "dayNumber": 1,
                            "activities": [
                                {
                                    "time": "9:00 AM",
                                    "activity": "Activity description",
                                    "location": "Location name",
                                    "cost": "Estimated cost",
                                    "duration": "2 hours"
                                }
                            ]
                        }
                    ],
                    "totalCost": "Total estimated cost",
                    "recommendations": ["Additional recommendations"]
                }`;

            const systemPrompt = `You are a travel planning assistant that creates detailed, personalized itineraries.
                Consider the user's interests, budget constraints, and specific tour preferences.
                Ensure all costs are realistic and within the specified budget range.
                Include a mix of activities that match the stated interests.`;

            return await this.generateStructuredResponse(prompt, systemPrompt);
        } catch (error) {
            console.error('Error generating itinerary:', error);
            throw new Error('Failed to generate itinerary. Please try again.');
        }
    }

    async updatePlanDisplay(plan) {
        const container = document.getElementById('itinerary-display');
        if (!container) return;

        let html = '<div class="itinerary-content">';
        
        // Add total cost and recommendations
        html += `<div class="itinerary-summary">
            <h3>Total Estimated Cost: ${plan.totalCost}</h3>
            <div class="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                    ${plan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>`;

        // Add daily activities
        plan.days.forEach(day => {
            html += `
                <div class="day-section" data-aos="fade-up">
                    <h3>Day ${day.dayNumber}</h3>
                    <div class="activities">
                        ${day.activities.map(activity => `
                            <div class="activity-card" data-aos="fade-right">
                                <div class="activity-time">${activity.time}</div>
                                <div class="activity-details">
                                    <h4>${activity.activity}</h4>
                                    <p><i class="fas fa-map-marker-alt"></i> ${activity.location}</p>
                                    <p><i class="fas fa-clock"></i> ${activity.duration}</p>
                                    <p><i class="fas fa-dollar-sign"></i> ${activity.cost}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        // Initialize AOS animations
        if (window.AOS) {
            window.AOS.refresh();
        }
    }

    // Implement required BaseAgent methods
    async processUserInput(input) {
        const preferences = await this.processPreferences();
        const plan = await this.generatePlan(preferences);
        await this.updatePlanDisplay(plan);
        return plan;
    }

    async getRecommendations(preferences) {
        return await this.generatePlan(preferences);
    }
}

// Register the agent
if (window.agentManager) {
    window.agentManager.registerAgent('itinerary', new ItineraryAgent());
} 