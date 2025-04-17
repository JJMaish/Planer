class BannerSlider {
    constructor() {
        this.slider = document.getElementById('bannerSlider');
        this.slides = Array.from(this.slider.querySelectorAll('.banner-slide'));
        this.controls = document.querySelector('.banner-controls');
        this.indicators = document.querySelector('.slide-indicators');
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isAnimating = false;
        this.autoPlayDelay = 5000;
        this.autoPlayTimeout = null;

        this.init();
    }

    init() {
        // Create indicators
        this.createIndicators();
        
        // Add navigation controls
        this.controls.querySelector('.prev-slide').addEventListener('click', () => this.prevSlide());
        this.controls.querySelector('.next-slide').addEventListener('click', () => this.nextSlide());
        
        // Add touch support
        this.addTouchSupport();
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    createIndicators() {
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(indicator);
        });
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Update indicators
        this.indicators.children[this.currentSlide].classList.remove('active');
        this.indicators.children[index].classList.add('active');
        
        // Update slides
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[index].classList.add('active');
        
        this.currentSlide = index;
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.slideCount);
    }

    prevSlide() {
        this.goToSlide((this.currentSlide - 1 + this.slideCount) % this.slideCount);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimeout = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayTimeout) {
            clearInterval(this.autoPlayTimeout);
            this.autoPlayTimeout = null;
        }
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.stopAutoPlay();
        }, { passive: true });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.startAutoPlay();
        }, { passive: true });
    }
}

// Initialize slider
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bannerSlider')) {
        new BannerSlider();
    }
}); 