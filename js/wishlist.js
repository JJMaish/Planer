// Wishlist functionality
class Wishlist {
    constructor() {
        this.items = [];
        this.loadFromLocalStorage();
        this.initializeEventListeners();
    }

    loadFromLocalStorage() {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            this.items = JSON.parse(savedWishlist);
            this.updateWishlistUI();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }

    initializeEventListeners() {
        // Listen for checkbox changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.wishlist) {
                const item = this.getItemFromCheckbox(e.target);
                if (e.target.checked) {
                    this.addItem(item);
                } else {
                    this.removeItem(item.id);
                }
            }
        });
    }

    getItemFromCheckbox(checkbox) {
        const card = checkbox.closest('.card');
        return {
            id: checkbox.value,
            type: checkbox.dataset.type,
            name: card.querySelector('.card-title').textContent,
            description: card.querySelector('.card-description')?.textContent || '',
            address: card.querySelector('.card-address')?.textContent || '',
            directions: card.querySelector('.card-directions')?.href || '',
            image: card.querySelector('.card-image img')?.src || ''
        };
    }

    addItem(item) {
        if (!this.items.some(i => i.id === item.id)) {
            this.items.push(item);
            this.saveToLocalStorage();
            this.updateWishlistUI();
            this.showNotification(`${item.name} added to wishlist`);
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.updateWishlistUI();
    }

    updateWishlistUI() {
        // Update wishlist count in navigation
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.items.length;
        }

        // Update checkboxes
        document.querySelectorAll('[data-wishlist]').forEach(checkbox => {
            checkbox.checked = this.items.some(item => item.id === checkbox.value);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wishlist = new Wishlist();
}); 