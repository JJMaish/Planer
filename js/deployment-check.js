document.addEventListener('DOMContentLoaded', () => {
    checkDeploymentStatus();
});

async function checkDeploymentStatus() {
    try {
        // Check if images are loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
                img.src = 'Data/placeholder.jpg';
            };
        });

        // Check API connectivity
        if (window.aiPlanner) {
            await window.aiPlanner.generatePlan({ test: true });
        }

        // Check localStorage
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            console.error('localStorage not available');
        }

        // Check navigation links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            fetch(link.href, { method: 'HEAD' })
                .catch(error => {
                    console.error(`Failed to verify link: ${link.href}`);
                });
        });

    } catch (error) {
        console.error('Deployment check failed:', error);
    }
} 