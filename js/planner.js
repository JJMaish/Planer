document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init();

    const form = document.getElementById('tripPlannerForm');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress');
    const stepIndicators = document.querySelectorAll('.step');
    let currentStep = 0;

    // Function to scroll to form
    window.scrollToForm = function() {
        document.getElementById('plannerForm').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };

    // Update progress bar
    function updateProgress() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update step indicators
        stepIndicators.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Show step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
        currentStep = stepIndex;
        updateProgress();
    }

    // Next button handler
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            }
        });
    });

    // Previous button handler
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;

        try {
            // Here you would normally send the data to your backend
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            // Show results section
            document.getElementById('results').style.display = 'block';
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error generating plan:', error);
            alert('Sorry, there was an error generating your plan. Please try again.');
        } finally {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate My Plan';
            generateBtn.disabled = false;
        }
    });

    // Interest cards handler
    document.querySelectorAll('.interest-card').forEach(card => {
        card.addEventListener('click', () => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        });
    });
});

class BrugesPlanner {
    constructor() {
        this.form = document.getElementById('tripPlannerForm');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Duration buttons
        document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Form submission
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.generateItinerary();
        });

        // Action buttons
        document.getElementById('editPlan').addEventListener('click', () => {
            document.getElementById('itineraryResult').style.display = 'none';
            this.form.parentElement.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('downloadPDF').addEventListener('click', () => {
            this.downloadPDF();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareItinerary();
        });
    }

    async generateItinerary() {
        const formData = this.getFormData();
        const generateBtn = this.form.querySelector('.generate-btn');
        
        try {
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            generateBtn.disabled = true;

            const response = await fetch('/api/generate-itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.itinerary) {
                this.displayItinerary(data.itinerary);
                document.getElementById('itineraryResult').style.display = 'block';
                document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error generating itinerary:', error);
            alert('Failed to generate itinerary. Please try again.');
        } finally {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate My Itinerary';
            generateBtn.disabled = false;
        }
    }

    getFormData() {
        const activeDay = document.querySelector('.duration-btn.active');
        const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(cb => cb.value);
        const pace = document.querySelector('input[name="pace"]:checked')?.value;
        const preferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
            .map(cb => cb.value);
        const specialRequests = document.querySelector('textarea[name="special_requests"]').value;

        return {
            duration: activeDay ? parseInt(activeDay.dataset.days) : 1,
            interests,
            pace,
            preferences,
            specialRequests
        };
    }

    displayItinerary(itinerary) {
        const container = document.getElementById('itineraryContent');
        container.innerHTML = this.formatItinerary(itinerary);
    }

    formatItinerary(itinerary) {
        // Format the itinerary with proper HTML structure
        // This will be implemented based on the AI response structure
    }

    async downloadPDF() {
        // Implement PDF generation and download
    }

    async shareItinerary() {
        // Implement sharing functionality
    }
}

// Initialize the planner when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BrugesPlanner();
}); 