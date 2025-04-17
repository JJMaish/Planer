document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.wishlist-items');
    
    async function loadWishlistItems() {
        if (!container) return;

        // Get the data from localStorage
        const tripSelections = JSON.parse(localStorage.getItem('tripSelections')) || {
            places: [],
            restaurants: [],
            tours: [],
            photos: [],
            events: []
        };

        console.log('Loaded selections:', tripSelections);

        let itemsHTML = '';

        // For each category
        for (const [category, items] of Object.entries(tripSelections)) {
            if (items.length > 0) {
                itemsHTML += `
                    <div class="wishlist-category">
                        <h2 class="category-title">
                            <i class="fas ${getCategoryIcon(category)}"></i>
                            ${category.charAt(0).toUpperCase() + category.slice(1)}
                            <span class="item-count">(${items.length})</span>
                        </h2>
                        <div class="category-items">
                `;

                // Add each item in the category
                for (const item of items) {
                    if (item && typeof item === 'object') {
                        // Get additional details from the agent
                        let details = item;
                        if (window.agentManager && window.agentManager.isInitialized()) {
                            try {
                                const agent = window.agentManager.getAgent(category.slice(0, -1));
                                if (agent) {
                                    const recommendations = await agent.getRecommendations([item.id]);
                                    if (recommendations && recommendations.length > 0) {
                                        details = { ...item, ...recommendations[0] };
                                    }
                                }
                            } catch (error) {
                                console.error(`Error getting details for ${item.id}:`, error);
                            }
                        }

                        itemsHTML += `
                            <div class="wishlist-item ${category.slice(0, -1)}-card" data-id="${details.id}">
                                <div class="card-image">
                                    <img src="${details.image || 'images/default-placeholder.jpg'}" alt="${details.title || ''}">
                                </div>
                                <div class="card-content">
                                    <h2>${details.title || ''}</h2>
                                    ${details.rating ? `<div class="rating"><i class="fas fa-star"></i> <span>${details.rating}</span></div>` : ''}
                                    ${details.description ? `<div class="description"><p>${details.description}</p></div>` : ''}
                                    <div class="card-actions">
                                        ${details.directions ? `<a href="${details.directions}" class="action-btn directions" target="_blank"><i class="fas fa-directions"></i> Directions</a>` : ''}
                                        ${details.website ? `<a href="${details.website}" class="action-btn website" target="_blank"><i class="fas fa-globe"></i> Website</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }

                itemsHTML += `
                        </div>
                    </div>
                `;
            }
        }

        if (itemsHTML === '') {
            container.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart"></i>
                    <h2>Your wishlist is empty</h2>
                    <p>Start adding places, restaurants, and activities to your wishlist!</p>
                </div>
            `;
        } else {
            container.innerHTML = itemsHTML;
        }
    }

    function getCategoryIcon(category) {
        const icons = {
            places: 'fa-landmark',
            restaurants: 'fa-utensils',
            tours: 'fa-ship',
            events: 'fa-calendar',
            photos: 'fa-images'
        };
        return icons[category] || 'fa-question';
    }

    // Initial load
    loadWishlistItems();

    // Listen for changes in selections
    document.addEventListener('selectionsChanged', () => {
        loadWishlistItems();
    });
}); 