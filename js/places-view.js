document.addEventListener('DOMContentLoaded', function() {
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const placesContainer = document.querySelector('.places-container');
    const placeFilter = document.getElementById('place-filter');
    const placeCards = document.querySelectorAll('.place-card');

    // Define mapping for categories that don't exactly match the data-category attribute
    const categoryMapping = {
        'landmark': ['landmark', 'historical landmark', 'historical site'],
        'church': ['church', 'cathedral', 'basilica', 'chapel'],
        'museum': ['museum', 'gallery', 'exhibition'],
        'park': ['park', 'garden', 'nature'],
        'shopping': ['shopping', 'market', 'store']
    };

    // Add data attributes to place cards for more reliable filtering
    placeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const typeElement = card.querySelector('.type');
        if (!typeElement) return;
        
        const typeText = typeElement.textContent.replace(/^\s*\S+\s*/, '').trim().toLowerCase();
        const descriptionElement = card.querySelector('.description p');
        const descriptionText = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
        
        // Add data-type attribute with the main type
        card.setAttribute('data-type', typeText);
        
        // Add classes for each possible category
        for (const [categoryKey, keywords] of Object.entries(categoryMapping)) {
            if (keywords.some(keyword => 
                typeText.includes(keyword) || 
                descriptionText.includes(keyword) || 
                category === categoryKey
            )) {
                card.classList.add(`category-${categoryKey}`);
            }
        }
    });

    // Function to filter places
    function filterPlaces(category) {
        let visibleCount = 0;
        
        placeCards.forEach(card => {
            let shouldShow = category === 'all';
            
            // Check the data-category attribute
            if (!shouldShow && card.getAttribute('data-category') === category) {
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
    placeFilter.addEventListener('change', function() {
        const selectedCategory = this.value;
        filterPlaces(selectedCategory);
        
        // Scroll to top of places container with a slight delay
        setTimeout(() => {
            window.scrollTo({
                top: document.querySelector('.places-container').offsetTop - 100,
                behavior: 'smooth'
            });
        }, 400);
    });

    // Apply initial filtering based on selected option
    const initialCategory = placeFilter.value;
    filterPlaces(initialCategory);

    // Handle view toggles
    gridViewBtn.addEventListener('click', function() {
        listViewBtn.classList.remove('active');
        this.classList.add('active');
        placesContainer.className = 'places-container grid-view';

        // Add smooth transition for cards
        const cards = document.querySelectorAll('.place-card:not([style*="display: none"])');
        cards.forEach(card => {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 300);
        });
    });

    listViewBtn.addEventListener('click', function() {
        gridViewBtn.classList.remove('active');
        this.classList.add('active');
        placesContainer.className = 'places-container list-view';

        // Add smooth transition for cards
        const cards = document.querySelectorAll('.place-card:not([style*="display: none"])');
        cards.forEach(card => {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 300);
        });
    });
}); 