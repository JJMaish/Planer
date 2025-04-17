document.addEventListener('DOMContentLoaded', function() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const placesContainer = document.querySelector('.places-container');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Remove active class from all toggles
            viewToggles.forEach(t => t.classList.remove('active'));
            // Add active class to clicked toggle
            this.classList.add('active');
            
            // Update container class
            const view = this.dataset.view;
            placesContainer.className = `places-container ${view}-view`;

            // Optional: Animate cards on view change
            const cards = document.querySelectorAll('.place-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 300);
            });
        });
    });

    // Optional: Add smooth scroll when clicking on view toggles
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const placesSection = document.querySelector('.places-container');
            placesSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}); 