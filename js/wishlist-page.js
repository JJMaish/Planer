// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize selection manager if not already initialized
    if (!window.selectionManager) {
        window.selectionManager = new SelectionManager();
    }

    // Load wishlist items
    loadWishlistItems();

    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            const filter = this.dataset.filter;
            filterWishlist(filter);
        });
    });
});

function loadWishlistItems() {
    const container = document.querySelector('.wishlist-items');
    const selections = window.selectionManager.getSelections();
    
    if (Object.keys(selections).length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart-broken"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save places, restaurants, and events to see them here</p>
                <a href="restaurants.html" class="browse-btn">Browse Restaurants</a>
            </div>
        `;
        return;
    }

    let html = '';
    Object.entries(selections).forEach(([type, items]) => {
        items.forEach(item => {
            html += createWishlistCard(item, type);
        });
    });

    container.innerHTML = html;

    // Add remove button handlers
    document.querySelectorAll('.remove-wishlist-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const type = this.dataset.type;
            removeFromWishlist(id, type);
        });
    });
}

function createWishlistCard(item, type) {
    return `
        <div class="wishlist-card" data-type="${type}">
            <div class="wishlist-card-image">
                <img src="${item.image || 'images/default-placeholder.jpg'}" alt="${item.title}">
            </div>
            <div class="wishlist-card-content">
                <h3>${item.title}</h3>
                <p class="wishlist-card-type">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
                ${item.rating ? `
                    <div class="wishlist-card-rating">
                        <i class="fas fa-star"></i>
                        <span>${item.rating}</span>
                    </div>
                ` : ''}
                ${item.description ? `<p>${item.description}</p>` : ''}
                <div class="wishlist-card-actions">
                    <button class="remove-wishlist-item" data-id="${item.id}" data-type="${type}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    ${item.directions ? `
                        <a href="${item.directions}" class="directions-btn">
                            <i class="fas fa-directions"></i> Directions
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function removeFromWishlist(id, type) {
    window.selectionManager.removeSelection(id, type);
    loadWishlistItems();
    showNotification('Item removed from wishlist');
}

function filterWishlist(filter) {
    const cards = document.querySelectorAll('.wishlist-card');
    cards.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}