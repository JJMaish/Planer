document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Initialize selection manager if not already defined
    if (typeof selectionManager === 'undefined') {
        console.warn('Selection manager not defined, creating a new instance');
        window.selectionManager = new SelectionManager('tripSelections');
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.filter;
            
            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const placeCards = document.querySelectorAll('.place-card');
            
            if (category === 'all') {
                placeCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                placeCards.forEach(card => {
                    if (card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    // View toggle functionality
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const placesContainer = document.querySelector('.places-container');
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            placesContainer.classList.remove('list-view');
            placesContainer.classList.add('grid-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });
        
        listViewBtn.addEventListener('click', function() {
            placesContainer.classList.remove('grid-view');
            placesContainer.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

    // Selection functionality
    const placeSelectors = document.querySelectorAll('.place-selector');
    
    // Initialize selections from storage
    placeSelectors.forEach(checkbox => {
        const placeId = checkbox.dataset.id;
        try {
            if (selectionManager.isSelected('place', placeId)) {
                checkbox.checked = true;
                checkbox.closest('.place-card').classList.add('selected');
            }
        } catch (error) {
            console.error('Error initializing place selection:', error);
        }
    });
    
    // Add change event listeners
    placeSelectors.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const placeId = this.dataset.id;
            const placeType = this.dataset.type;
            const placeCard = this.closest('.place-card');
            
            if (this.checked) {
                // Add to selection
                try {
                    selectionManager.addSelection(placeType, placeId);
                    placeCard.classList.add('selected');
                    
                    // Dispatch custom event for wishlist
                    const event = new CustomEvent('placeSelected', {
                        detail: { id: placeId, type: placeType, selected: true }
                    });
                    document.dispatchEvent(event);
                } catch (error) {
                    console.error('Error adding place selection:', error);
                }
            } else {
                // Remove from selection
                try {
                    selectionManager.removeSelection(placeType, placeId);
                    placeCard.classList.remove('selected');
                    
                    // Dispatch custom event for wishlist
                    const event = new CustomEvent('placeSelected', {
                        detail: { id: placeId, type: placeType, selected: false }
                    });
                    document.dispatchEvent(event);
                } catch (error) {
                    console.error('Error removing place selection:', error);
                }
            }
        });
    });
}); 