class PreferenceLearning {
    constructor() {
        this.userHistory = new Map();
        this.similarityThreshold = 0.7;
    }

    async learnFromUserChoices(userId, choices) {
        const userProfile = await this.getUserProfile(userId);
        const updatedPreferences = this.updatePreferences(userProfile, choices);
        await this.saveUserPreferences(userId, updatedPreferences);
        return updatedPreferences;
    }

    calculatePreferenceSimilarity(profile1, profile2) {
        const interests1 = new Set(profile1.interests);
        const interests2 = new Set(profile2.interests);
        
        const intersection = new Set([...interests1].filter(x => interests2.has(x)));
        const union = new Set([...interests1, ...interests2]);
        
        return intersection.size / union.size;
    }

    findSimilarUsers(userProfile) {
        return Array.from(this.userHistory.entries())
            .filter(([id, profile]) => 
                this.calculatePreferenceSimilarity(userProfile, profile) > this.similarityThreshold
            )
            .map(([id, profile]) => profile);
    }

    generateRecommendations(userProfile, similarUsers) {
        const recommendations = new Map();
        
        similarUsers.forEach(user => {
            user.likedPlaces.forEach(place => {
                if (!userProfile.visitedPlaces.includes(place)) {
                    recommendations.set(place, (recommendations.get(place) || 0) + 1);
                }
            });
        });
        
        return Array.from(recommendations.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([place]) => place);
    }
} 