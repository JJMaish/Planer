document.addEventListener('DOMContentLoaded', function() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const restaurantsContainer = document.querySelector('.restaurants-container');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Remove active class from all toggles
            viewToggles.forEach(t => t.classList.remove('active'));
            // Add active class to clicked toggle
            this.classList.add('active');
            
            // Update container class
            const view = this.dataset.view;
            restaurantsContainer.className = `restaurants-container ${view}-view`;
        });
    });
}); 