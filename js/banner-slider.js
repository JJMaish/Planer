class BannerSlider {
    constructor() {
        this.slider = document.getElementById('bannerSlider');
        this.slides = this.slider.querySelectorAll('.banner-slide');
        this.prevButton = document.querySelector('.prev-slide');
        this.nextButton = document.querySelector('.next-slide');
        this.indicatorsContainer = document.querySelector('.slide-indicators');
        this.currentSlide = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        // Create indicators
        this.createIndicators();
        
        // Add event listeners
        this.prevButton.addEventListener('click', () => {
            if (!this.isAnimating) this.prevSlide();
        });
        this.nextButton.addEventListener('click', () => {
            if (!this.isAnimating) this.nextSlide();
        });
        
        // Start autoplay
        this.startAutoPlay();

        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

        // Add touch support
        this.addTouchSupport();

        // Show first slide
        this.goToSlide(0);
    }

    createIndicators() {
        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                if (!this.isAnimating) this.goToSlide(i);
            });
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
        
        // Update indicators
        this.updateIndicators();
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 800); // Match this with CSS transition duration
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => {
            if (!this.isAnimating) this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.stopAutoPlay();
        }, false);

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                if (!this.isAnimating) this.nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                if (!this.isAnimating) this.prevSlide();
            }
            this.startAutoPlay();
        }, false);
    }
}

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BannerSlider();
}); 