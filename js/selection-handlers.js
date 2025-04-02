document.addEventListener('DOMContentLoaded', () => {
    // Initialize selection handlers
    initializeSelectionHandlers();
    // Load any saved selections
    loadSavedSelections();
});

function initializeSelectionHandlers() {
    // Handle all selection checkboxes
    document.querySelectorAll('.place-selector, .restaurant-selector, .photo-selector')
        .forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const id = this.dataset.id;
                const type = this.dataset.type;
                
                if (this.checked) {
                    window.selectionManager.addSelection(id, type);
                } else {
                    window.selectionManager.removeSelection(id, type);
                }
                
                // Update visual feedback
                updateSelectionUI(this);
            });
        });
}

function updateSelectionUI(checkbox) {
    const card = checkbox.closest('.place-card, .restaurant-card, .gallery-item');
    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
    updateSelectionSummary();
}

function loadSavedSelections() {
    const saved = localStorage.getItem('plannerSelections');
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
    }
}

// Add this function to update the selection summary
function updateSelectionSummary() {
    const selections = window.selectionManager.getSelections();
    const summary = document.getElementById('selectionSummary');
    
    if (summary) {
        document.querySelector('.places-count').textContent = selections.places.length;
        document.querySelector('.restaurants-count').textContent = selections.restaurants.length;
        document.querySelector('.photos-count').textContent = selections.photos.length;
        document.querySelector('.total-count').textContent = 
            selections.places.length + 
            selections.restaurants.length + 
            selections.photos.length;
    }
} 