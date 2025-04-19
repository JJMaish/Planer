document.addEventListener('DOMContentLoaded', function() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const eventsContainer = document.querySelector('.events-container');

    // Set initial view based on active toggle
    const activeView = document.querySelector('.view-toggle.active').dataset.view;
    eventsContainer.className = `events-container ${activeView}-view`;

    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Remove active class from all toggles
            viewToggles.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked toggle
            this.classList.add('active');
            
            // Update container class
            const view = this.dataset.view;
            eventsContainer.className = `events-container ${view}-view`;

            // Add smooth transition for cards
            const cards = document.querySelectorAll('.event-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 300);
            });
        });
    });
}); 