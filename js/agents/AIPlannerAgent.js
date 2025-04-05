class AIPlannerAgent {
    constructor() {
        this.baseUrl = '/api/planner'; // Update with your actual API endpoint
    }

    async generatePlan(selections) {
        try {
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selections)
            });

            if (!response.ok) {
                throw new Error('Failed to generate plan');
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating plan:', error);
            throw error;
        }
    }
}

// Export the agent
export default AIPlannerAgent; 