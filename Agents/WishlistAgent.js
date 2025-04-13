import { BaseAgent } from './BaseAgent.js';

export class WishlistAgent extends BaseAgent {
    constructor() {
        super('wishlist');
    }

    async processPreferences() {
        const interests = this.getSelectedInterests();
        const budget = this.getSelectedBudget();
        const tours = this.getSelectedTours();

        return {
            interests,
            budget,
            tours
        };
    }

    getSelectedInterests() {
        const interestCheckboxes = document.querySelectorAll('input[name="interest"]:checked');
        return Array.from(interestCheckboxes).map(cb => cb.value);
    }

    getSelectedBudget() {
        const budgetRadio = document.querySelector('input[name="budget"]:checked');
        return budgetRadio ? budgetRadio.value : 'moderate';
    }

    getSelectedTours() {
        const tourCheckboxes = document.querySelectorAll('input[name="boat-tour"], input[name="horse-tour"]:checked');
        return Array.from(tourCheckboxes).map(cb => ({
            type: cb.name,
            location: cb.value
        }));
    }

    async generatePlan(preferences) {
        const { interests, budget, tours } = preferences;
        
        // Create a plan based on preferences
        const plan = {
            morning: [],
            afternoon: [],
            evening: [],
            tours: []
        };

        // Add tours to the plan
        if (tours.length > 0) {
            tours.forEach(tour => {
                if (tour.type === 'boat-tour') {
                    plan.tours.push({
                        type: 'Canal Tour',
                        location: 'Huidenvettersplein',
                        time: '10:00 AM',
                        duration: '30 minutes'
                    });
                } else if (tour.type === 'horse-tour') {
                    plan.tours.push({
                        type: 'Carriage Tour',
                        location: 'Markt Square',
                        time: '11:00 AM',
                        duration: '45 minutes'
                    });
                }
            });
        }

        // Add activities based on interests
        if (interests.includes('history')) {
            plan.morning.push({
                type: 'Landmark',
                name: 'Belfry Tower',
                location: 'Markt Square',
                time: '9:00 AM',
                duration: '1 hour'
            });
        }

        if (interests.includes('culture')) {
            plan.afternoon.push({
                type: 'Museum',
                name: 'Groeninge Museum',
                location: 'Dijver 12',
                time: '2:00 PM',
                duration: '2 hours'
            });
        }

        if (interests.includes('food')) {
            plan.evening.push({
                type: 'Restaurant',
                name: 'De Halve Maan Brewery',
                location: 'Walplein 26',
                time: '7:00 PM',
                duration: '2 hours'
            });
        }

        return plan;
    }

    async updatePlanDisplay(plan) {
        const itineraryDays = document.getElementById('itinerary-days');
        if (!itineraryDays) return;

        let html = '<div class="itinerary-day">';
        
        // Add morning activities
        if (plan.morning.length > 0) {
            html += '<div class="itinerary-time-slot morning">';
            html += '<h4><i class="fas fa-sun"></i> Morning</h4>';
            plan.morning.forEach(activity => {
                html += this.createActivityCard(activity);
            });
            html += '</div>';
        }

        // Add afternoon activities
        if (plan.afternoon.length > 0) {
            html += '<div class="itinerary-time-slot afternoon">';
            html += '<h4><i class="fas fa-cloud-sun"></i> Afternoon</h4>';
            plan.afternoon.forEach(activity => {
                html += this.createActivityCard(activity);
            });
            html += '</div>';
        }

        // Add evening activities
        if (plan.evening.length > 0) {
            html += '<div class="itinerary-time-slot evening">';
            html += '<h4><i class="fas fa-moon"></i> Evening</h4>';
            plan.evening.forEach(activity => {
                html += this.createActivityCard(activity);
            });
            html += '</div>';
        }

        // Add tours
        if (plan.tours.length > 0) {
            html += '<div class="itinerary-time-slot tours">';
            html += '<h4><i class="fas fa-map-marked-alt"></i> Tours</h4>';
            plan.tours.forEach(tour => {
                html += this.createActivityCard(tour);
            });
            html += '</div>';
        }

        html += '</div>';
        itineraryDays.innerHTML = html;
    }

    createActivityCard(activity) {
        return `
            <div class="activity-card">
                <div class="activity-header">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                    <h5>${activity.name}</h5>
                </div>
                <div class="activity-details">
                    <p><i class="fas fa-map-marker-alt"></i> ${activity.location}</p>
                    <p><i class="fas fa-clock"></i> ${activity.time} (${activity.duration})</p>
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            'Landmark': 'landmark',
            'Museum': 'university',
            'Restaurant': 'utensils',
            'Canal Tour': 'ship',
            'Carriage Tour': 'horse'
        };
        return icons[type] || 'map-marker-alt';
    }
} 