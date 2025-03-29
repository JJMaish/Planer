document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn.querySelector('i');
    let isMenuOpen = false;

    // Prevent scroll when menu is open
    function toggleBodyScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : '';
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('active', isMenuOpen);
        menuIcon.classList.toggle('fa-bars', !isMenuOpen);
        menuIcon.classList.toggle('fa-times', isMenuOpen);
        toggleBodyScroll(isMenuOpen);

        // Add smooth animation
        if (isMenuOpen) {
            navLinks.style.display = 'block';
            requestAnimationFrame(() => {
                navLinks.style.opacity = '1';
                navLinks.style.transform = 'translateY(0)';
            });
        } else {
            navLinks.style.opacity = '0';
            navLinks.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 300);
        }
    }

    // Improved touch handling
    mobileMenuBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        toggleMenu();
    }, { passive: false });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !e.target.closest('.main-header')) {
            toggleMenu();
        }
    });

    // Improved link handling
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) {
                e.preventDefault();
                const href = link.getAttribute('href');
                toggleMenu();
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        if (isMenuOpen) {
            toggleMenu();
        }
    });

    // Add index for animation delay
    navLinks.querySelectorAll('li').forEach((li, index) => {
        li.style.setProperty('--i', index + 1);
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && isMenuOpen) {
                toggleMenu();
            }
        }, 250);
    });
}); 