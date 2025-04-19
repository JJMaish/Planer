document.addEventListener('DOMContentLoaded', function() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const restaurantsContainer = document.querySelector('.restaurants-container');
    const filterDropdown = document.querySelector('.filter-dropdown');
    const restaurantCards = document.querySelectorAll('.restaurant-card');

    // Set initial view based on active toggle
    const activeView = document.querySelector('.view-toggle.active').dataset.view;
    restaurantsContainer.className = `restaurants-container ${activeView}-view`;

    // Define mapping for categories that don't exactly match the types in the HTML
    const categoryMapping = {
        'cafe': ['café', 'coffee', 'cafe'],
        'wine': ['wine bar', 'cocktails'],
        'vegetarian': ['vegetarian', 'vegan'],
        'bakery': ['bakery'],
        'pub': ['pub', 'tavern', 'bar'],
        'american': ['american', 'usa', 'burger'],
        'asian': ['asian', 'chinese', 'thai', 'vietnamese', 'korean'],
        'mexican': ['mexican', 'taco', 'burrito'],
        'mediterranean': ['mediterranean', 'greek', 'turkish', 'lebanese'],
        'italian': ['italian', 'pasta', 'pizza'],
        'japanese': ['japanese', 'sushi', 'ramen'],
        'halal': ['halal', 'حلال'],
        'seafood': ['seafood', 'fish']
    };

    // Add data attributes to restaurant cards for more reliable filtering
    restaurantCards.forEach(card => {
        const typeElement = card.querySelector('.type');
        if (!typeElement) return;
        
        const typeText = typeElement.textContent.replace(/^\s*\S+\s*/, '').trim().toLowerCase();
        const descriptionElement = card.querySelector('.description p');
        const descriptionText = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
        const featuresElement = card.querySelector('.features');
        const featuresText = featuresElement ? featuresElement.textContent.toLowerCase() : '';
        
        // Add data-type attribute with the main type
        card.setAttribute('data-type', typeText);
        
        // Add classes for each possible category
        for (const [category, keywords] of Object.entries(categoryMapping)) {
            if (keywords.some(keyword => 
                typeText.includes(keyword) || 
                descriptionText.includes(keyword) || 
                featuresText.includes(keyword)
            )) {
                card.classList.add(`category-${category}`);
            }
        }
    });

    // Function to filter restaurants
    function filterRestaurants(category) {
        let visibleCount = 0;
        
        restaurantCards.forEach(card => {
            let shouldShow = category === 'all';
            
            // Check the data-type attribute for the main category
            if (!shouldShow && card.getAttribute('data-type').includes(category.toLowerCase())) {
                shouldShow = true;
            }
            
            // Check the category classes
            if (!shouldShow && card.classList.contains(`category-${category}`)) {
                shouldShow = true;
            }
            
            // If still not found, do a content-based check
            if (!shouldShow) {
                const typeElement = card.querySelector('.type');
                if (typeElement) {
                    const typeText = typeElement.textContent.replace(/^\s*\S+\s*/, '').trim().toLowerCase();
                    
                    // Direct match with the type
                    if (typeText.includes(category.toLowerCase())) {
                        shouldShow = true;
                    } 
                    // Check mapped categories against type
                    else if (categoryMapping[category] && 
                             categoryMapping[category].some(term => typeText.includes(term))) {
                        shouldShow = true;
                    }
                    
                    // Check description
                    if (!shouldShow) {
                        const descriptionElement = card.querySelector('.description p');
                        const descriptionText = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                        
                        if (categoryMapping[category] && 
                            categoryMapping[category].some(term => descriptionText.includes(term))) {
                            shouldShow = true;
                        }
                    }
                    
                    // Check features
                    if (!shouldShow) {
                        const featuresElement = card.querySelector('.features');
                        const featuresText = featuresElement ? featuresElement.textContent.toLowerCase() : '';
                        
                        if (categoryMapping[category] && 
                            categoryMapping[category].some(term => featuresText.includes(term))) {
                            shouldShow = true;
                        }
                    }
                }
            }
            
            if (shouldShow) {
                visibleCount++;
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 100);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show/hide no results message
        const noResultsMessage = document.getElementById('no-results');
        if (noResultsMessage) {
            if (visibleCount === 0) {
                noResultsMessage.style.display = 'flex';
            } else {
                noResultsMessage.style.display = 'none';
            }
        }
    }

    // Handle filter dropdown change
    filterDropdown.addEventListener('change', function() {
        const selectedCategory = this.value;
        filterRestaurants(selectedCategory);
        
        // Scroll to top of restaurant container with a slight delay
        setTimeout(() => {
            window.scrollTo({
                top: document.querySelector('.restaurants-container').offsetTop - 100,
                behavior: 'smooth'
            });
        }, 400);
    });

    // Apply initial filtering based on selected option
    const initialCategory = filterDropdown.value;
    filterRestaurants(initialCategory);

    // Handle view toggles
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Remove active class from all toggles
            viewToggles.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked toggle
            this.classList.add('active');
            
            // Update container class
            const view = this.dataset.view;
            restaurantsContainer.className = `restaurants-container ${view}-view`;

            // Add smooth transition for cards
            const cards = document.querySelectorAll('.restaurant-card:not([style*="display: none"])');
            cards.forEach(card => {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 300);
            });
        });
    });
}); 