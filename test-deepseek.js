import DeepSeekService from './services/DeepSeekService.js';

async function testDeepSeek() {
    // Initialize DeepSeek service with your API key
    const deepseek = new DeepSeekService('sk-6f35d6d511054eb69c91258067480f88');

    console.log('Testing DeepSeek API...');

    try {
        // Test web search
        console.log('\nTesting Web Search:');
        const webResult = await deepseek.webSearch('Bruges top tourist attractions');
        console.log('Web Search Result:', webResult);

        // Test local search
        console.log('\nTesting Local Search:');
        const localResult = await deepseek.localSearch('restaurants in Bruges');
        console.log('Local Search Result:', localResult);

        // Test image search
        console.log('\nTesting Image Search:');
        const imageResult = await deepseek.imageSearch('Bruges Belfort');
        console.log('Image Search Result:', imageResult);

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testDeepSeek(); 