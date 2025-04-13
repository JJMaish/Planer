import { PlannerAgent } from '../Agents/PlannerAgent.js';
import { AttractionsAgent } from '../Agents/AttractionsAgent.js';
import { EventsAgent } from '../Agents/EventsAgent.js';
import { NightlifeAgent } from '../Agents/NightlifeAgent.js';
import { ChatAgent } from '../Agents/ChatAgent.js';

export class PlannerIntegration {
    constructor() {
        this.plannerAgent = new PlannerAgent();
        this.attractionsAgent = new AttractionsAgent();
        this.eventsAgent = new EventsAgent();
        this.nightlifeAgent = new NightlifeAgent();
        this.chatAgent = new ChatAgent();
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Save itinerary button
        const saveButton = document.getElementById('save-itinerary');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.generateItinerary());
        }

        // Date change listeners
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        if (startDate && endDate) {
            startDate.addEventListener('change', () => this.updateDateRange());
            endDate.addEventListener('change', () => this.updateDateRange());
        }
    }

    async generateItinerary() {
        try {
            const preferences = this.collectPreferences();
            const dateRange = this.getDateRange();
            
            if (!this.validateInputs(preferences, dateRange)) {
                return;
            }

            this.showLoadingState();

            // Gather all necessary data
            const [attractions, events, nightlife] = await Promise.all([
                this.attractionsAgent.getAttractions(preferences),
                this.eventsAgent.getEvents(dateRange.startDate, dateRange.endDate),
                this.nightlifeAgent.getNightlifeVenues(preferences)
            ]);

            // Generate the itinerary
            const itinerary = await this.plannerAgent.createItinerary({
                ...preferences,
                dateRange,
                attractions,
                events,
                nightlife
            });

            this.displayItinerary(itinerary);
        } catch (error) {
            console.error('Error generating itinerary:', error);
            this.showError('Failed to generate itinerary. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }

    collectPreferences() {
        return {
            interests: Array.from(document.querySelectorAll('.interest-option input:checked'))
                .map(input => input.value),
            budget: document.querySelector('.budget-option input:checked')?.value || 'moderate',
            tours: Array.from(document.querySelectorAll('.tour-option input:checked'))
                .map(input => input.value),
            selectedPlaces: window.selectionManager.places || [],
            selectedRestaurants: window.selectionManager.restaurants || [],
            selectedTours: window.selectionManager.tours || []
        };
    }

    getDateRange() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        return { startDate, endDate };
    }

    validateInputs(preferences, dateRange) {
        if (!dateRange.startDate || !dateRange.endDate) {
            this.showError('Please select both start and end dates.');
            return false;
        }

        if (preferences.interests.length === 0) {
            this.showError('Please select at least one interest.');
            return false;
        }

        return true;
    }

    displayItinerary(itinerary) {
        const container = document.getElementById('itinerary-days');
        container.innerHTML = ''; // Clear existing content

        itinerary.days.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = 'itinerary-day';
            dayElement.innerHTML = `
                <h4>Day ${index + 1}</h4>
                <div class="day-schedule">
                    ${this.formatDaySchedule(day)}
                </div>
            `;
            container.appendChild(dayElement);
        });

        // Add weather information if available
        if (itinerary.weather) {
            this.displayWeatherInfo(itinerary.weather);
        }
    }

    formatDaySchedule(day) {
        return `
            <div class="morning-activities">
                <h5><i class="fas fa-sun"></i> Morning</h5>
                ${this.formatActivities(day.morning)}
            </div>
            <div class="afternoon-activities">
                <h5><i class="fas fa-cloud-sun"></i> Afternoon</h5>
                ${this.formatActivities(day.afternoon)}
            </div>
            <div class="evening-activities">
                <h5><i class="fas fa-moon"></i> Evening</h5>
                ${this.formatActivities(day.evening)}
            </div>
        `;
    }

    formatActivities(activities) {
        if (!activities || activities.length === 0) {
            return '<p>No activities planned</p>';
        }

        return activities.map(activity => `
            <div class="activity-item">
                <i class="${this.getActivityIcon(activity.type)}"></i>
                <span>${activity.name}</span>
                ${activity.duration ? `<span class="duration">(${activity.duration})</span>` : ''}
                ${activity.notes ? `<p class="notes">${activity.notes}</p>` : ''}
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            attraction: 'fas fa-landmark',
            restaurant: 'fas fa-utensils',
            event: 'fas fa-calendar-alt',
            tour: 'fas fa-walking',
            nightlife: 'fas fa-glass-cheers',
            default: 'fas fa-map-marker-alt'
        };
        return icons[type] || icons.default;
    }

    displayWeatherInfo(weather) {
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-forecast';
        weatherContainer.innerHTML = `
            <h4><i class="fas fa-cloud-sun"></i> Weather Forecast</h4>
            <div class="weather-days">
                ${weather.map(day => `
                    <div class="weather-day">
                        <div class="date">${day.date}</div>
                        <i class="wi ${this.getWeatherIcon(day.condition)}"></i>
                        <div class="temp">${day.temperature}°C</div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('itinerary-days').prepend(weatherContainer);
    }

    getWeatherIcon(condition) {
        const icons = {
            clear: 'wi-day-sunny',
            cloudy: 'wi-cloudy',
            rain: 'wi-rain',
            snow: 'wi-snow',
            default: 'wi-day-cloudy'
        };
        return icons[condition] || icons.default;
    }

    showLoadingState() {
        const container = document.getElementById('itinerary-days');
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Generating your personalized itinerary...</p>
            </div>
        `;
    }

    hideLoadingState() {
        const loadingState = document.querySelector('.loading-state');
        if (loadingState) {
            loadingState.remove();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message animate__animated animate__shakeX';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        const container = document.getElementById('itinerary-days');
        container.prepend(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    updateDateRange() {
        // This method can be expanded to handle dynamic updates
        // when the date range changes
    }
}

// Initialize the planner integration when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.plannerIntegration = new PlannerIntegration();
}); 