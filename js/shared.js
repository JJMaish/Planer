// Wishlist data structure
const wishlist = {
    items: [],
    
    // Initialize from localStorage
    init() {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            this.items = JSON.parse(saved);
        }
        this.updateBadge();
    },
    
    // Add an item to the wishlist
    addItem(item) {
        if (!this.items.some(i => i.id === item.id && i.type === item.type)) {
            this.items.push(item);
            this.save();
            this.updateBadge();
            return true;
        }
        return false;
    },
    
    // Remove an item from the wishlist
    removeItem(id, type) {
        const index = this.items.findIndex(i => i.id === id && i.type === type);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.save();
            this.updateBadge();
            return true;
        }
        return false;
    },
    
    // Check if item is in wishlist
    hasItem(id, type) {
        return this.items.some(i => i.id === id && i.type === type);
    },
    
    // Save to localStorage
    save() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    },
    
    // Update wishlist badge count
    updateBadge() {
        const badge = document.querySelector('.wishlist-count');
        if (badge) {
            badge.textContent = this.items.length;
            badge.style.display = this.items.length ? 'inline-block' : 'none';
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    wishlist.init();
}); 