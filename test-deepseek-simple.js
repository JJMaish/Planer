import DeepSeekService from './services/DeepSeekService.js';

const deepseek = new DeepSeekService('sk-6f35d6d511054eb69c91258067480f88');

// Simple test query
deepseek.webSearch('Bruges Belgium')
    .then(result => {
        console.log('DeepSeek API Test Success:');
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
        console.error('DeepSeek API Test Failed:', error);
    }); 