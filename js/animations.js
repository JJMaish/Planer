document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Hero Banner Slider
    const bannerSlider = {
        slides: [
            {
                image: 'images/bruges-1.jpg',
                title: 'Historic Bruges',
                description: 'Medieval charm meets modern culture'
            },
            // Add more slides
        ],
        currentSlide: 0,
        init() {
            this.container = document.querySelector('.banner-slider');
            this.createSlides();
            this.startSlideshow();
        },
        createSlides() {
            this.slides.forEach((slide, index) => {
                const slideEl = document.createElement('div');
                slideEl.className = `banner-slide ${index === 0 ? 'active' : ''}`;
                slideEl.style.backgroundImage = `url(${slide.image})`;
                this.container.appendChild(slideEl);
            });
        },
        startSlideshow() {
            setInterval(() => this.nextSlide(), 5000);
        },
        nextSlide() {
            const slides = document.querySelectorAll('.banner-slide');
            slides[this.currentSlide].classList.remove('active');
            this.currentSlide = (this.currentSlide + 1) % slides.length;
            slides[this.currentSlide].classList.add('active');
        }
    };

    // Scroll Animations
    gsap.from('.section-header', {
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1
    });

    // Event Cards Animation
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6
        });
    });

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.setAttribute(
            'data-theme',
            document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        );
    });

    // Initialize components
    bannerSlider.init();
}); 