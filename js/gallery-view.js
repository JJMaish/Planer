function resizeAllGridItems() {
    const gridItems = document.querySelectorAll('.gallery-item');
    const grid = document.querySelector('.gallery-grid.masonry');
    if (!grid) return;

    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const rowHeight = 10; // Same as grid-auto-rows

    gridItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;

        // Wait for image to load
        if (!img.complete) {
            img.onload = () => calculateRowSpan(item, img, rowHeight, rowGap);
        } else {
            calculateRowSpan(item, img, rowHeight, rowGap);
        }
    });
}

function calculateRowSpan(item, img, rowHeight, rowGap) {
    const contentHeight = img.height + item.querySelector('.gallery-item-info').offsetHeight;
    const rowSpan = Math.ceil((contentHeight + rowGap) / rowHeight);
    item.style.setProperty('--row-span', rowSpan);
}

// Handle view toggle
document.addEventListener('DOMContentLoaded', () => {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const galleryGrid = document.querySelector('.gallery-grid');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Remove active class from all toggles
            viewToggles.forEach(t => t.classList.remove('active'));
            // Add active class to clicked toggle
            toggle.classList.add('active');
            
            // Update grid view
            const view = toggle.dataset.view;
            galleryGrid.className = 'gallery-grid';
            
            if (view === 'grid') {
                galleryGrid.classList.add('grid-view');
            } else if (view === 'masonry') {
                galleryGrid.classList.add('masonry');
                // Small delay to ensure images are loaded
                setTimeout(resizeAllGridItems, 100);
            }
        });
    });

    // Set initial view
    const activeToggle = document.querySelector('.view-toggle.active');
    if (activeToggle) {
        const initialView = activeToggle.dataset.view;
        galleryGrid.classList.add(initialView === 'grid' ? 'grid-view' : 'masonry');
        
        if (initialView === 'masonry') {
            // Wait for images to load
            window.addEventListener('load', () => {
                setTimeout(resizeAllGridItems, 100);
            });
        }
    }
});

// Handle window resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (document.querySelector('.gallery-grid.masonry')) {
            resizeAllGridItems();
        }
    }, 250);
}); 