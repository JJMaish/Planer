document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // View toggle functionality
    const viewToggles = document.querySelectorAll('.view-toggle');
    const restaurantsContainer = document.querySelector('.restaurants-container');
    
    if (viewToggles.length > 0 && restaurantsContainer) {
        viewToggles.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Update active state of toggle buttons
                viewToggles.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update container class
                restaurantsContainer.classList.remove('grid-view', 'list-view');
                restaurantsContainer.classList.add(`${view}-view`);
            });
        });
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    if (filterButtons.length > 0 && restaurantCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                restaurantCards.forEach(card => {
                    if (category === 'all') {
                        card.style.display = 'block';
                        return;
                    }

                    const cuisineType = card.querySelector('.cuisine-type').textContent.toLowerCase();
                    const description = card.querySelector('.description').textContent.toLowerCase();
                    
                    if (cuisineType.includes(category) || description.includes(category)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Selection handling
    const restaurantSelectors = document.querySelectorAll('.restaurant-selector');
    
    if (restaurantSelectors.length > 0) {
        restaurantSelectors.forEach(selector => {
            selector.addEventListener('change', function() {
                const restaurantId = this.getAttribute('data-id');
                const restaurantType = this.getAttribute('data-type');
                const isSelected = this.checked;
                
                // Update selection in the selection manager
                if (window.selectionManager) {
                    if (isSelected) {
                        window.selectionManager.addSelection(restaurantType, restaurantId);
                    } else {
                        window.selectionManager.removeSelection(restaurantType, restaurantId);
                    }

                    // Dispatch event to notify wish list
                    const event = new CustomEvent('restaurantSelected', {
                        detail: {
                            id: restaurantId,
                            selected: isSelected
                        }
                    });
                    document.dispatchEvent(event);
                }
                
                // Update UI feedback
                const label = this.nextElementSibling;
                if (isSelected) {
                    label.style.background = 'var(--primary-color)';
                    label.querySelector('i').style.opacity = '1';
                    label.querySelector('i').style.color = 'white';
                } else {
                    label.style.background = 'rgba(255, 255, 255, 0.9)';
                    label.querySelector('i').style.opacity = '0';
                }
            });
        });
    }

    // Initialize selections from storage
    if (window.selectionManager) {
        const selections = window.selectionManager.getSelections();
        const restaurantSelections = selections.restaurants || [];
        
        restaurantSelections.forEach(restaurantId => {
            const selector = document.querySelector(`.restaurant-selector[data-id="${restaurantId}"]`);
            if (selector) {
                selector.checked = true;
                const label = selector.nextElementSibling;
                label.style.background = 'var(--primary-color)';
                label.querySelector('i').style.opacity = '1';
                label.querySelector('i').style.color = 'white';
            }
        });
    }

    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
}); 