/**
 * Utility functions for the planner application
 */

function showError(message) {
    const mainContent = document.querySelector('.planner-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        `;
    }
}

function initializeMap() {
    window.plannerIntegration = new PlannerIntegration();
    window.mapManager = new MapManager();
}

function setupEventListeners() {
    // Initialize agents
    const placeAgent = window.agentManager.getAgent('place');
    const restaurantAgent = window.agentManager.getAgent('restaurant');
    const tourAgent = window.agentManager.getAgent('tour');
    const photoAgent = window.agentManager.getAgent('photo');
    const itineraryAgent = window.agentManager.getAgent('itinerary');

    // Store agents in window for access
    window.agents = {
        place: placeAgent,
        restaurant: restaurantAgent,
        tour: tourAgent,
        photo: photoAgent,
        itinerary: itineraryAgent
    };

    // Add event listener for save button
    const saveButton = document.getElementById('save-itinerary');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            try {
                const preferences = await window.agentManager.getAgent('itinerary').processPreferences();
                const plan = await window.agentManager.getAgent('itinerary').generatePlan(preferences);
                await window.agentManager.getAgent('itinerary').updatePlanDisplay(plan);
            } catch (error) {
                console.error('Error saving itinerary:', error);
                showError('Failed to save itinerary. Please try again.');
            }
        });
    }

    // Add hover effects
    const buttons = document.querySelectorAll('button, .btn, .save-btn');
    buttons.forEach(button => {
        button.classList.add('animate__animated', 'animate__pulse');
    });

    const selectionItems = document.querySelectorAll('.selection-item');
    selectionItems.forEach(item => {
        item.classList.add('animate__animated', 'animate__fadeIn');
    });

    const preferenceOptions = document.querySelectorAll('.interest-option, .budget-option, .tour-option');
    preferenceOptions.forEach(option => {
        option.classList.add('animate__animated', 'animate__fadeIn');
    });

    // Add event listeners for preference changes
    const preferenceInputs = document.querySelectorAll('input[name="interest"], input[name="budget"], input[name="boat-tour"], input[name="horse-tour"]');
    preferenceInputs.forEach(input => {
        input.addEventListener('change', async () => {
            const preferences = await window.agentManager.getAgent('itinerary').processPreferences();
            const plan = await window.agentManager.getAgent('itinerary').generatePlan(preferences);
            await window.agentManager.getAgent('itinerary').updatePlanDisplay(plan);
        });
    });

    // Initialize selection manager
    window.selectionManager = {
        places: [],
        restaurants: [],
        tours: [],
        photos: [],
        events: []
    };

    // Initialize selection displays
    updateSelectionDisplays();
} 