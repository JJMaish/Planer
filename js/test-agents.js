// Test script for Bruges Trip Planner agents
console.log('Starting agent tests...');

// Import agents
import AIPlannerAgent from './Agents/AIPlannerAgent.js';
import PreferenceLearningAgent from './Agents/PreferenceLearningAgent.js';
import SmartSchedulerAgent from './Agents/SmartSchedulerAgent.js';

async function waitForAgents() {
    // Wait for agents to be initialized
    let attempts = 0;
    const maxAttempts = 20; // Increased from 10 to 20
    
    while (attempts < maxAttempts) {
        const agentManager = window.agentManager;
        if (agentManager) {
            try {
                // Try to initialize agents if not already initialized
                if (!agentManager.isInitialized()) {
                    await agentManager.initializeAgents();
                }
                
                // Check if all agents are available
                if (agentManager.agents.place && 
                    agentManager.agents.restaurant && 
                    agentManager.agents.tour && 
                    agentManager.agents.photo && 
                    agentManager.agents.itinerary) {
                    console.log('All agents are initialized');
                    return true;
                }
            } catch (error) {
                console.warn(`Attempt ${attempts + 1}: Failed to initialize agents:`, error.message || error);
                if (error.stack) {
                    console.warn('Error stack:', error.stack);
                }
            }
        } else {
            console.warn(`Attempt ${attempts + 1}: Agent manager not found`);
        }
        
        console.log(`Waiting for agents to initialize (attempt ${attempts + 1}/${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Increased from 500ms to 1000ms
        attempts++;
    }
    
    throw new Error('Agents failed to initialize within the timeout period');
}

async function runTests() {
    try {
        // Check if OpenAI service is available
        if (!window.openAIService) {
            console.warn('OpenAI service not found. Tests will run with fallback functionality.');
        } else if (!window.openAIService.isApiKeySet()) {
            console.warn('OpenAI API key not set. Tests will run with fallback functionality.');
        }
        
        // Test Selection Manager
        console.log('\nTesting Selection Manager...');
        const selectionManager = window.selectionManager;
        if (!selectionManager) {
            throw new Error('Selection Manager not initialized');
        }
        
        selectionManager.clearSelections(); // Start fresh
        
        // Test adding selections
        selectionManager.addSelection('market-square', 'places');
        selectionManager.addSelection('de-halve-maan', 'restaurants');
        selectionManager.addSelection('canal-tour', 'tours');
        selectionManager.addSelection('market-square', 'photos');
        
        console.log('Current selections:', selectionManager.getSelections());
        
        // Test Agent Manager
        console.log('\nTesting Agent Manager...');
        const agentManager = window.agentManager;
        if (!agentManager) {
            throw new Error('Agent Manager not initialized');
        }
        
        // Wait for agents to initialize
        console.log('Waiting for agents to initialize...');
        await waitForAgents();
        
        // Test agent initialization
        console.log('Agents initialized:', agentManager.agents);
        
        // Verify each agent is initialized
        for (const [type, agent] of Object.entries(agentManager.agents)) {
            if (!agent) {
                throw new Error(`${type} agent not initialized`);
            }
            console.log(`${type} agent initialized successfully`);
        }
        
        // Test selection change handling
        console.log('\nTesting selection change handling...');
        const selections = selectionManager.getSelections();
        const result = await agentManager.handleSelectionChange(selections);
        console.log('Selection change result:', result);
        
        // Test individual agents
        console.log('\nTesting individual agents...');
        
        // Test Place Agent
        console.log('\nTesting Place Agent...');
        const placeAgent = agentManager.agents.place;
        const placeRecommendations = await placeAgent.getRecommendations(selections.places);
        console.log('Place recommendations:', placeRecommendations);
        
        // Test Restaurant Agent
        console.log('\nTesting Restaurant Agent...');
        const restaurantAgent = agentManager.agents.restaurant;
        const restaurantRecommendations = await restaurantAgent.getRecommendations(selections.restaurants);
        console.log('Restaurant recommendations:', restaurantRecommendations);
        
        // Test Tour Agent
        console.log('\nTesting Tour Agent...');
        const tourAgent = agentManager.agents.tour;
        const tourRecommendations = await tourAgent.getRecommendations(selections.tours);
        console.log('Tour recommendations:', tourRecommendations);
        
        // Test Photo Agent
        console.log('\nTesting Photo Agent...');
        const photoAgent = agentManager.agents.photo;
        const photoRecommendations = await photoAgent.getRecommendations(selections.photos);
        console.log('Photo recommendations:', photoRecommendations);
        
        // Test Itinerary Agent
        console.log('\nTesting Itinerary Agent...');
        const itineraryAgent = agentManager.agents.itinerary;
        const itineraryResult = await itineraryAgent.handleSelectionChange(selections, result.recommendations);
        console.log('Itinerary result:', itineraryResult);
        
        // Test AI Planner Agent
        console.log('\nTesting AI Planner Agent...');
        const aiPlannerAgent = new AIPlannerAgent();
        const planResult = await aiPlannerAgent.generatePlan(selections);
        console.log('AI Planner result:', planResult);
        
        // Test Preference Learning Agent
        console.log('\nTesting Preference Learning Agent...');
        const preferenceLearningAgent = new PreferenceLearningAgent();
        const preferencesResult = await preferenceLearningAgent.learnFromUserChoices('test-user', selections);
        console.log('Preference Learning result:', preferencesResult);
        
        // Test Smart Scheduler Agent
        console.log('\nTesting Smart Scheduler Agent...');
        const smartSchedulerAgent = new SmartSchedulerAgent(aiPlannerAgent);
        const scheduleResult = await smartSchedulerAgent.createOptimizedSchedule({
            startDate: new Date(),
            duration: 3,
            preferences: selections
        });
        console.log('Smart Scheduler result:', scheduleResult);
        
        console.log('\nAll tests completed successfully!');
        
    } catch (error) {
        console.error('Test failed:', error.message || error);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

// Run tests when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait longer for all scripts to load and initialize
    setTimeout(runTests, 2000); // Increased from 1000ms to 2000ms
}); 