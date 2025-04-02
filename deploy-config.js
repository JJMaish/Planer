const deployConfig = {
    apiEndpoint: process.env.API_ENDPOINT || 'https://your-api-domain.com',
    imageBasePath: process.env.IMAGE_BASE_PATH || '/Data',
    analyticsId: process.env.ANALYTICS_ID,
    aiPlannerEndpoint: process.env.AI_PLANNER_ENDPOINT
};

// Export for use in other files
export default deployConfig; 