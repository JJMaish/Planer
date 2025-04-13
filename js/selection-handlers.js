document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize selection handlers
        initializeSelectionHandlers();
        // Load any saved selections
        loadSavedSelections();
        console.log('Selection handlers initialized successfully');
    } catch (error) {
        console.error('Error initializing selection handlers:', error);
    }
});

function initializeSelectionHandlers() {
    try {
        // Handle all selection checkboxes
        document.querySelectorAll('.place-selector, .restaurant-selector, .photo-selector, .tour-selector, .event-selector')
            .forEach(checkbox => {
                const id = checkbox.dataset.id;
                const type = checkbox.dataset.type;
                
                if (!id || !type) {
                    console.warn('Checkbox missing required data attributes:', checkbox);
                    return;
                }

                // Set initial state
                if (window.selectionManager.isSelected(id, type)) {
                    checkbox.checked = true;
                }
                
                // Add event listener
                checkbox.addEventListener('change', function() {
                    try {
                        if (this.checked) {
                            window.selectionManager.addSelection(id, type);
                        } else {
                            window.selectionManager.removeSelection(id, type);
                        }
                        
                        // Update visual feedback
                        updateSelectionUI(this);
                        updateSelectionSummary();
                    } catch (error) {
                        console.error('Error handling checkbox change:', error);
                    }
                });
            });
    } catch (error) {
        console.error('Error initializing selection handlers:', error);
    }
}

function updateSelectionUI(checkbox) {
    try {
        const card = checkbox.closest('.place-card, .restaurant-card, .gallery-item, .tour-card, .event-card');
        if (card) {
            if (checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        }
    } catch (error) {
        console.error('Error updating selection UI:', error);
    }
}

function loadSavedSelections() {
    try {
        const saved = localStorage.getItem('tripSelections');
        if (saved) {
            const selections = JSON.parse(saved);
            
            // Restore checkboxes
            Object.entries(selections).forEach(([type, ids]) => {
                ids.forEach(id => {
                    const checkbox = document.querySelector(
                        `input[data-type="${type}"][data-id="${id}"]`
                    );
                    if (checkbox) {
                        checkbox.checked = true;
                        updateSelectionUI(checkbox);
                    }
                });
            });
            
            updateSelectionSummary();
        }
    } catch (error) {
        console.error('Error loading saved selections:', error);
    }
}

function updateSelectionSummary() {
    try {
        const selections = window.selectionManager.getSelections();
        const summary = document.getElementById('selectionSummary');
        
        if (summary) {
            const counts = {
                places: selections.places.length,
                restaurants: selections.restaurants.length,
                photos: selections.photos.length,
                tours: selections.tours.length,
                events: selections.events.length
            };

            // Update individual counts
            Object.entries(counts).forEach(([category, count]) => {
                const element = document.querySelector(`.${category}-count`);
                if (element) {
                    element.textContent = count;
                }
            });

            // Update total count
            const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
            const totalElement = document.querySelector('.total-count');
            if (totalElement) {
                totalElement.textContent = totalCount;
            }
        }
    } catch (error) {
        console.error('Error updating selection summary:', error);
    }
} 