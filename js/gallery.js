class GalleryManager {
    constructor() {
        this.gallery = document.getElementById('galleryGrid');
        this.lightbox = document.getElementById('lightbox');
        this.currentIndex = 0;
        this.images = [];
        
        this.initializeGallery();
        this.setupEventListeners();
    }

    initializeGallery() {
        // Gallery data
        this.images = [
            {
                src: 'bannerSlides/banner2.jpg',
                title: 'Aerial View of Bruges',
                location: 'City Center',
                description: 'Panoramic view of medieval Bruges with its iconic bell towers and red-tiled roofs',
                category: 'architecture'
            },
            {
                src: 'bannerSlides/banner3.jpg',
                title: 'Belfry Tower',
                location: 'Market Square',
                description: 'The iconic medieval bell tower, standing 83 meters tall',
                category: 'landmarks'
            },
            {
                src: 'bannerSlides/banner4.jpg',
                title: 'Canal Tour Boats',
                location: 'Bruges Canals',
                description: 'Traditional boat tours through the Venice of the North',
                category: 'culture'
            },
            {
                src: 'bannerSlides/banner5.jpg',
                title: 'Belgian Chocolates',
                location: 'Old Town',
                description: 'Famous Belgian chocolate displays in a traditional shop',
                category: 'food'
            },
            {
                src: 'bannerSlides/banner6.jpg',
                title: 'Grote Markt',
                location: 'City Center',
                description: 'Historic market square surrounded by medieval buildings',
                category: 'landmarks'
            },
            {
                src: 'bannerSlides/banner7.jpg',
                title: 'Minnewater Lake',
                location: 'Lake of Love',
                description: 'Peaceful lake known as the Lake of Love with swans',
                category: 'nature'
            },
            {
                src: 'bannerSlides/banner8.jpg',
                title: 'Church of Our Lady',
                location: 'Church Square',
                description: 'Gothic church with the second tallest brick tower in the world',
                category: 'architecture'
            },
            {
                src: 'bannerSlides/banner1.jpg',
                title: 'Belgian Waffles',
                location: 'Local Cafe',
                description: 'Fresh Belgian waffles with strawberries and cream',
                category: 'food'
            },
            {
                src: 'bannerSlides/banner9.jpg',
                title: 'Begijnhof',
                location: 'Ten Wijngaerde',
                description: 'Historic complex home to Benedictine nuns',
                category: 'culture'
            },
            {
                src: 'bannerSlides/banner10.jpg',
                title: 'Canal Houses',
                location: 'Historic Center',
                description: 'Traditional houses along the picturesque canals',
                category: 'architecture'
            },
            {
                src: 'bannerSlides/banner11.jpg',
                title: 'Belgian Beer Tasting',
                location: 'Local Brewery',
                description: 'Traditional Belgian beer selection',
                category: 'food'
            },
            {
                src: 'bannerSlides/banner12.jpg',
                title: 'Rozenhoedkaai',
                location: 'Canal Junction',
                description: 'Most photographed spot in Bruges',
                category: 'landmarks'
            },
            {
                src: 'bannerSlides/k.jpg',
                title: 'Historic Windmills',
                location: 'Kruisvest',
                description: 'Traditional windmills along the city ramparts',
                category: 'culture'
            },
            {
                src: 'images/PhotoGallery/city-park.jpg',
                title: 'City Park',
                location: 'Queen Astrid Park',
                description: 'Beautiful park with seasonal flowers and fountains',
                category: 'nature'
            },
            {
                src: 'images/PhotoGallery/basilica.jpg',
                title: 'Basilica of the Holy Blood',
                location: 'Burg Square',
                description: 'Romanesque and Gothic chapel housing a sacred relic',
                category: 'landmarks'
            }
        ];

        this.renderGallery();
        this.initializeAOS();
    }

    renderGallery() {
        this.gallery.innerHTML = '';
        this.images.forEach((image, index) => {
            const item = this.createGalleryItem(image, index);
            this.gallery.appendChild(item);
        });
    }

    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', image.category);
        item.setAttribute('data-aos', 'fade-up');
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="item-overlay" data-category="${image.category}">
                <h3>${image.title}</h3>
                <p>${image.location}</p>
            </div>
        `;

        item.addEventListener('click', () => this.openLightbox(index));
        return item;
    }

    setupEventListeners() {
        // Filter dropdown
        const filterDropdown = document.querySelector('.filter-dropdown');
        if (filterDropdown) {
            filterDropdown.addEventListener('change', (e) => {
                this.filterGallery(e.target.value);
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                this.toggleView(e.target.closest('.view-btn').dataset.view);
            });
        });

        // Lightbox controls
        document.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox-prev').addEventListener('click', () => this.prevImage());
        document.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
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
        });
    }

    filterGallery(category) {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    toggleView(view) {
        this.gallery.className = `gallery-grid ${view}`;
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateLightboxContent() {
        const image = this.images[this.currentIndex];
        const content = this.lightbox.querySelector('.lightbox-content');
        content.innerHTML = `
            <img src="${image.src}" alt="${image.title}">
            <div class="image-info">
                <h3>${image.title}</h3>
                <p class="location">${image.location}</p>
                <p class="description">${image.description}</p>
            </div>
        `;
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxContent();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxContent();
    }

    initializeAOS() {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true
        });
    }
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
}); 