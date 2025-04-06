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
                    
                    // Check if the card matches the selected category
                    const matches = {
                        'traditional': () => cuisineType.includes('flemish') || description.includes('traditional') || description.includes('flemish'),
                        'waffles': () => cuisineType.includes('dessert') || description.includes('waffle') || description.includes('dessert'),
                        'chocolate': () => cuisineType.includes('chocolate') || description.includes('chocolate') || description.includes('sweet'),
                        'beer': () => cuisineType.includes('brewery') || description.includes('beer') || description.includes('brewery'),
                        'fine': () => cuisineType.includes('fine dining') || description.includes('fine dining') || description.includes('gourmet'),
                        'casual': () => cuisineType.includes('bistro') || description.includes('casual') || description.includes('bistro'),
                        'street': () => cuisineType.includes('street food') || description.includes('street food') || description.includes('food truck'),
                        'vegetarian': () => cuisineType.includes('vegetarian') || description.includes('vegetarian') || description.includes('vegan'),
                        'pizza': () => cuisineType.includes('pizza') || description.includes('pizza') || description.includes('italian')
                    };

                    if (matches[category] && matches[category]()) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
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