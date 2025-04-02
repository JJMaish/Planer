class SelectionManager {
    constructor() {
        this.selectedPlaces = new Set();
        this.selectedRestaurants = new Set();
        this.selectedPhotos = new Set();
        this.planUpdateTimeout = null;
    }

    addSelection(id, type) {
        switch(type) {
            case 'place':
                this.selectedPlaces.add(id);
                break;
            case 'restaurant':
                this.selectedRestaurants.add(id);
                break;
            case 'photo':
                this.selectedPhotos.add(id);
                break;
        }
        this.updatePlannerData();
        this.scheduleAIUpdate();
    }

    removeSelection(id, type) {
        switch(type) {
            case 'place':
                this.selectedPlaces.delete(id);
                break;
            case 'restaurant':
                this.selectedRestaurants.delete(id);
                break;
            case 'photo':
                this.selectedPhotos.delete(id);
                break;
        }
        this.updatePlannerData();
        this.scheduleAIUpdate();
    }

    getSelections() {
        return {
            places: Array.from(this.selectedPlaces),
            restaurants: Array.from(this.selectedRestaurants),
            photos: Array.from(this.selectedPhotos)
        };
    }

    updatePlannerData() {
        // Store selections in localStorage
        localStorage.setItem('plannerSelections', JSON.stringify(this.getSelections()));
        
        // Update the UI
        this.updateSelectionSummary();
    }

    scheduleAIUpdate() {
        // Debounce AI updates to prevent too many requests
        if (this.planUpdateTimeout) {
            clearTimeout(this.planUpdateTimeout);
        }

        this.planUpdateTimeout = setTimeout(() => {
            this.updateAIPlan();
        }, 1000); // Wait 1 second after last change
    }

    async updateAIPlan() {
        try {
            const selections = this.getSelections();
            if (window.aiPlanner) {
                const plan = await window.aiPlanner.generatePlan(selections);
                this.updatePlanDisplay(plan);
            }
        } catch (error) {
            console.error('Error updating AI plan:', error);
        }
    }

    updatePlanDisplay(plan) {
        const summaryEl = document.getElementById('selectionSummary');
        if (!summaryEl) return;

        // Update the plan preview in the summary
        const planPreview = document.createElement('div');
        planPreview.className = 'plan-preview';
        planPreview.innerHTML = `
            <h4>AI Generated Plan</h4>
            <p>${plan.summary || 'Plan will be generated based on your selections'}</p>
        `;

        // Replace existing plan preview or append new one
        const existingPreview = summaryEl.querySelector('.plan-preview');
        if (existingPreview) {
            existingPreview.replaceWith(planPreview);
        } else {
            summaryEl.appendChild(planPreview);
        }
    }
}

// Create global instance
window.selectionManager = new SelectionManager(); 