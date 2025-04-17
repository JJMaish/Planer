document.addEventListener('DOMContentLoaded', function() {
    const eventsContainer = document.querySelector('.events-container');
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    console.log('Events view script loaded');
    console.log('Container:', eventsContainer);
    console.log('View toggles:', viewToggles);
    
    // Set initial view based on localStorage or default to grid
    const currentView = localStorage.getItem('eventsView') || 'grid';
    console.log('Current view:', currentView);
    setView(currentView);
    
    // Add click event listeners to view toggle buttons
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const viewType = toggle.getAttribute('data-view');
            console.log('Toggle clicked:', viewType);
            setView(viewType);
        });
    });
    
    function setView(viewType) {
        console.log('Setting view to:', viewType);
        
        // Update button states
        viewToggles.forEach(toggle => {
            const isActive = toggle.getAttribute('data-view') === viewType;
            toggle.classList.toggle('active', isActive);
            console.log('Toggle button:', toggle.getAttribute('data-view'), 'active:', isActive);
        });
        
        // Update container class
        eventsContainer.classList.remove('grid-view', 'list-view');
        eventsContainer.classList.add(`${viewType}-view`);
        console.log('Container classes:', eventsContainer.classList.toString());
        
        // Save preference to localStorage
        localStorage.setItem('eventsView', viewType);
    }
}); 