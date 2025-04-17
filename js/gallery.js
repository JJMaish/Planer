class GalleryManager {
    constructor() {
        try {
            this.gallery = document.getElementById('galleryGrid');
            this.lightbox = document.getElementById('lightbox');
            this.currentIndex = 0;
            this.images = [];
            
            if (!this.gallery) {
                console.error('Gallery container not found');
                return;
            }

            if (!this.lightbox) {
                console.error('Lightbox container not found');
                return;
            }
            
            // Initialize selection manager if not exists
            if (!window.selectionManager) {
                window.selectionManager = {
                    places: [],
                    restaurants: [],
                    tours: [],
                    photos: [],
                    events: [],
                    addSelection: function(category, id) {
                        if (!this[category]) this[category] = [];
                        if (!this[category].includes(id)) {
                            this[category].push(id);
                            this.saveSelections();
                            this.notifyChange();
                        }
                    },
                    removeSelection: function(category, id) {
                        if (this[category]) {
                            const index = this[category].indexOf(id);
                            if (index > -1) {
                                this[category].splice(index, 1);
                                this.saveSelections();
                                this.notifyChange();
                            }
                        }
                    },
                    getSelections: function() {
                        return {
                            places: this.places || [],
                            restaurants: this.restaurants || [],
                            tours: this.tours || [],
                            photos: this.photos || [],
                            events: this.events || []
                        };
                    },
                    saveSelections: function() {
                        localStorage.setItem('tripSelections', JSON.stringify(this.getSelections()));
                    },
                    notifyChange: function() {
                        const event = new CustomEvent('selectionsChanged');
                        document.dispatchEvent(event);
                    }
                };
            }
            
            this.initializeGallery();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing GalleryManager:', error);
        }
    }

    initializeGallery() {
        try {
            // Gallery data
            this.images = [
                {
                    id: 'banner1',
                    src: 'bannerSlides/banner1.jpg',
                    title: 'Belgian Waffles',
                    location: 'Local Cafe',
                    description: 'Fresh Belgian waffles with strawberries and cream',
                    category: 'food'
                },
                {
                    id: 'banner2',
                    src: 'bannerSlides/banner2.jpg',
                    title: 'Aerial View of Bruges',
                    location: 'City Center',
                    description: 'Panoramic view of medieval Bruges with its iconic bell towers and red-tiled roofs',
                    category: 'architecture'
                },
                {
                    id: 'banner3',
                    src: 'bannerSlides/banner3.jpg',
                    title: 'Belfry Tower',
                    location: 'Market Square',
                    description: 'The iconic medieval bell tower, standing 83 meters tall',
                    category: 'landmarks'
                },
                {
                    id: 'banner4',
                    src: 'bannerSlides/banner4.jpg',
                    title: 'Canal Tour Boats',
                    location: 'Bruges Canals',
                    description: 'Traditional boat tours through the Venice of the North',
                    category: 'culture'
                },
                {
                    id: 'banner5',
                    src: 'bannerSlides/banner5.jpg',
                    title: 'Belgian Chocolates',
                    location: 'Old Town',
                    description: 'Famous Belgian chocolate displays in a traditional shop',
                    category: 'food'
                },
                {
                    id: 'banner6',
                    src: 'bannerSlides/banner6.jpg',
                    title: 'Grote Markt',
                    location: 'City Center',
                    description: 'Historic market square surrounded by medieval buildings',
                    category: 'landmarks'
                },
                {
                    id: 'banner7',
                    src: 'bannerSlides/banner7.jpg',
                    title: 'Minnewater Lake',
                    location: 'Minnewater Park',
                    description: 'The Lake of Love, a romantic spot in Bruges',
                    category: 'nature'
                },
                {
                    id: 'banner8',
                    src: 'bannerSlides/banner8.jpg',
                    title: 'Church of Our Lady',
                    location: 'Church Square',
                    description: 'Gothic church with the second tallest brick tower in the world',
                    category: 'architecture'
                },
                {
                    id: 'banner9',
                    src: 'bannerSlides/banner9.jpg',
                    title: 'Begijnhof',
                    location: 'Ten Wijngaerde',
                    description: 'Historic complex home to Benedictine nuns',
                    category: 'culture'
                },
                {
                    id: 'banner10',
                    src: 'bannerSlides/banner10.jpg',
                    title: 'Canal Houses',
                    location: 'Historic Center',
                    description: 'Traditional houses along the picturesque canals',
                    category: 'architecture'
                },
                {
                    id: 'banner11',
                    src: 'bannerSlides/banner11.jpg',
                    title: 'Belgian Beer Tasting',
                    location: 'Local Brewery',
                    description: 'Traditional Belgian beer selection',
                    category: 'food'
                },
                {
                    id: 'banner12',
                    src: 'bannerSlides/banner12.jpg',
                    title: 'Rozenhoedkaai',
                    location: 'Canal Junction',
                    description: 'Most photographed spot in Bruges',
                    category: 'landmarks'
                }
            ];

            this.renderGallery();
            this.initializeAOS();
        } catch (error) {
            console.error('Error initializing gallery:', error);
        }
    }

    renderGallery() {
        try {
            if (!this.gallery) {
                console.error('Gallery container not found');
                return;
            }

            this.gallery.innerHTML = '';
            this.images.forEach((image, index) => {
                const item = this.createGalleryItem(image, index);
                if (item) {
                    this.gallery.appendChild(item);
                }
            });
        } catch (error) {
            console.error('Error rendering gallery:', error);
        }
    }

    createGalleryItem(image, index) {
        try {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-category', image.category);
            item.setAttribute('data-aos', 'fade-up');
            
            item.innerHTML = `
                <div class="selection-control">
                    <input type="checkbox" 
                           class="photo-selector" 
                           data-id="${image.id}" 
                           data-type="photos"
                           id="photo-${image.id}">
                    <label for="photo-${image.id}" class="selection-label">
                        <i class="fas fa-check"></i>
                    </label>
                </div>
                <img src="${image.src}" alt="${image.title}" loading="lazy">
                <div class="gallery-item-info">
                    <h3>${image.title}</h3>
                    <p>${image.location}</p>
                </div>
            `;

            // Add click event for lightbox
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.selection-control')) {
                    this.openLightbox(index);
                }
            });

            return item;
        } catch (error) {
            console.error('Error creating gallery item:', error);
            return null;
        }
    }

    setupEventListeners() {
        try {
            // Filter dropdown
            const filterDropdown = document.querySelector('.filter-dropdown');
            if (filterDropdown) {
                filterDropdown.addEventListener('change', (e) => {
                    this.filterGallery(e.target.value);
                });
            }

            // View toggle buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const view = e.currentTarget.dataset.view;
                    this.toggleView(view);
                });
            });

            // Lightbox controls
            const closeBtn = this.lightbox.querySelector('.lightbox-close');
            const prevBtn = this.lightbox.querySelector('.lightbox-prev');
            const nextBtn = this.lightbox.querySelector('.lightbox-next');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
            if (prevBtn) prevBtn.addEventListener('click', () => this.prevImage());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.lightbox.classList.contains('active')) {
                    switch(e.key) {
                        case 'Escape':
                            this.closeLightbox();
                            break;
                        case 'ArrowLeft':
                            this.prevImage();
                            break;
                        case 'ArrowRight':
                            this.nextImage();
                            break;
                    }
                }
            });
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    filterGallery(category) {
        try {
            const items = this.gallery.querySelectorAll('.gallery-item');
            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error filtering gallery:', error);
        }
    }

    toggleView(view) {
        try {
            this.gallery.className = `gallery-grid ${view}`;
        } catch (error) {
            console.error('Error toggling view:', error);
        }
    }

    openLightbox(index) {
        try {
            this.currentIndex = index;
            this.updateLightboxContent();
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Error opening lightbox:', error);
        }
    }

    closeLightbox() {
        try {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
        } catch (error) {
            console.error('Error closing lightbox:', error);
        }
    }

    updateLightboxContent() {
        try {
            const image = this.images[this.currentIndex];
            const content = this.lightbox.querySelector('.lightbox-content');
            if (content && image) {
                content.innerHTML = `
                    <img src="${image.src}" alt="${image.title}">
                    <div class="image-info">
                        <h3>${image.title}</h3>
                        <p class="location">${image.location}</p>
                        <p class="description">${image.description}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error updating lightbox content:', error);
        }
    }

    prevImage() {
        try {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.updateLightboxContent();
        } catch (error) {
            console.error('Error showing previous image:', error);
        }
    }

    nextImage() {
        try {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.updateLightboxContent();
        } catch (error) {
            console.error('Error showing next image:', error);
        }
    }

    initializeAOS() {
        try {
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    offset: 100,
                    once: true
                });
            } else {
                console.warn('AOS library not loaded');
            }
        } catch (error) {
            console.error('Error initializing AOS:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryManager = new GalleryManager();
}); 