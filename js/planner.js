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

    // Initialize the planner with combined functionality
    const planner = new TripPlanner();

    // Duration button handlers
    document.querySelectorAll('.duration-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.duration-btn').forEach(btn => 
                btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Interest cards handler
    document.querySelectorAll('.interest-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
            this.classList.toggle('selected', this.querySelector('input').checked);
        });
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;

        try {
            const formData = getFormData();
            await generateItinerary(formData);
            
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

    // Action button handlers
    document.getElementById('editPlan')?.addEventListener('click', () => {
        document.getElementById('itineraryResult').style.display = 'none';
        document.querySelector('.planner-form-section').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('downloadPDF')?.addEventListener('click', () => {
        planner.generatePDF();
    });

    document.getElementById('shareBtn')?.addEventListener('click', () => {
        planner.shareItinerary();
    });

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 
            document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        );
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Helper functions
    function getFormData() {
        return {
            duration: document.querySelector('.duration-btn.active')?.dataset.days,
            interests: Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                .map(cb => cb.value),
            pace: document.querySelector('input[name="pace"]:checked')?.value,
            preferences: Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
                .map(cb => cb.value),
            specialRequests: document.querySelector('textarea[name="special_requests"]').value
        };
    }

    async function generateItinerary(formData) {
        // Here you would normally send the data to your backend
        // For now, we'll simulate the API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const itinerary = generateSampleItinerary(formData);
        displayItinerary(itinerary);
    }

    function generateSampleItinerary(formData) {
        // This is a placeholder function that generates a sample itinerary
        // In a real application, this would come from your backend
        return {
            title: `Your ${formData.duration}-Day Bruges Adventure`,
            days: Array.from({ length: parseInt(formData.duration) }, (_, i) => ({
                day: i + 1,
                activities: getSuggestedActivities(formData.interests, formData.pace)
            }))
        };
    }

    function getSuggestedActivities(interests, pace) {
        // This would be replaced with real data from your backend
        const activities = {
            history: ['Visit Belfort', 'Explore Burg Square', 'Tour Basilica of Holy Blood'],
            food: ['Belgian Beer Tasting', 'Chocolate Workshop', 'Local Restaurant Tour'],
            culture: ['Groeninge Museum', 'Concert at Concertgebouw', 'City Theater Visit']
        };

        const selectedActivities = interests.flatMap(interest => 
            activities[interest] || []).slice(0, pace === 'active' ? 4 : 3);

        return selectedActivities;
    }

    function displayItinerary(itinerary) {
        const container = document.getElementById('itineraryContent');
        if (!container) return;

        container.innerHTML = `
            <h2>${itinerary.title}</h2>
            ${itinerary.days.map(day => `
                <div class="day-section">
                    <h3>Day ${day.day}</h3>
                    <ul>
                        ${day.activities.map(activity => `
                            <li>${activity}</li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        `;

        document.getElementById('itineraryResult').style.display = 'block';
        document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
    }

    // Initialize date inputs with today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    document.getElementById('start-date').valueAsDate = today;
    document.getElementById('end-date').valueAsDate = tomorrow;

    // Sample attractions data - This should be populated from your places-to-visit.html and restaurants.html
    const attractions = [
        { 
            id: 1, 
            name: 'Belfort', 
            type: 'landmarks', 
            duration: '1.5 hours',
            rating: 4.6,
            description: 'Medieval bell tower with panoramic city views',
            openingHours: '9:30 - 17:00',
            price: 'Paid',
            location: 'Markt 7',
            imageUrl: 'Data/Places/belfort.jpg'
        },
        {
            id: 2,
            name: 'Market Square',
            type: 'landmarks',
            duration: '1 hour',
            rating: 4.7,
            description: 'Historic city center with medieval architecture',
            openingHours: '24/7',
            price: 'Free',
            location: 'Markt',
            imageUrl: 'Data/Places/market-square.jpg'
        },
        // Add all other places from places-to-visit.html
    ];

    const restaurants = [
        {
            id: 101,
            name: "That's Toast",
            type: 'restaurant',
            cuisine: 'Brunch',
            duration: '1 hour',
            rating: 4.5,
            priceRange: '€€',
            location: 'Dweersstraat 4',
            openingHours: '8:00 - 16:00',
            imageUrl: 'Data/Restaurants/thats-toast.jpg'
        },
        // Add all other restaurants from restaurants.html
    ];

    // Combine all attractions and restaurants
    const allPlaces = [...attractions, ...restaurants];

    // Populate attractions grid
    const attractionsGrid = document.getElementById('draggable-attractions');
    allPlaces.forEach(place => {
        const attractionElement = createAttractionElement(place);
        attractionsGrid.appendChild(attractionElement);
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterAttractions(filter);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-attractions');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterAttractions(document.querySelector('.filter-btn.active').dataset.filter, searchTerm);
    });

    // Date change handlers
    document.getElementById('start-date').addEventListener('change', updateItineraryDays);
    document.getElementById('end-date').addEventListener('change', updateItineraryDays);

    // Initial itinerary days setup
    updateItineraryDays();

    // Save itinerary handler
    document.getElementById('save-itinerary').addEventListener('click', saveItinerary);

    const agentSystem = new AgentSystem();
    
    // Generate Itinerary Button
    document.getElementById('generateItinerary').addEventListener('click', async () => {
        // Remove this event listener
    });

    // Need Help Button
    document.getElementById('getHelp').addEventListener('click', async () => {
        // Remove this event listener
    });
});

function createAttractionElement(place) {
    const div = document.createElement('div');
    div.className = 'attraction-item';
    div.setAttribute('draggable', true);
    div.dataset.type = place.type;
    div.innerHTML = `
        <div class="attraction-image">
            <img src="${place.imageUrl}" alt="${place.name}">
        </div>
        <div class="attraction-info">
            <h3>${place.name}</h3>
            <div class="rating">
                <i class="fas fa-star"></i>
                <span>${place.rating}</span>
            </div>
            <p class="duration"><i class="far fa-clock"></i> ${place.duration}</p>
            <p class="type">${place.type}</p>
        </div>
    `;
    return div;
}

function filterAttractions(filter, searchTerm = '') {
    const attractions = document.querySelectorAll('.attraction-item');
    attractions.forEach(attraction => {
        const matchesFilter = filter === 'all' || attraction.dataset.type === filter;
        const matchesSearch = attraction.textContent.toLowerCase().includes(searchTerm);
        attraction.style.display = matchesFilter && matchesSearch ? 'block' : 'none';
    });
}

function updateItineraryDays() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const daysContainer = document.getElementById('itinerary-days');
    daysContainer.innerHTML = '';

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayCard = createDayCard(currentDate);
        daysContainer.appendChild(dayCard);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function createDayCard(date) {
    const div = document.createElement('div');
    div.className = 'day-card';
    div.innerHTML = `
        <div class="day-header">
            <h3>Day ${formatDate(date)}</h3>
            <button class="clear-day">Clear</button>
        </div>
        <div class="day-items" data-date="${date.toISOString()}">
            <p class="empty-state">Drag attractions here</p>
        </div>
    `;
    return div;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });
}

function saveItinerary() {
    // Implement save functionality
    alert('Itinerary saved successfully!');
}

import { PlannerAgent } from '../agents/index.js';
import ChatAgent from '../agents/ChatAgent.js';

class TripPlanner {
    constructor() {
        this.plannerAgent = new PlannerAgent();
        this.currentStep = 1;
        this.formData = {
            dates: {},
            budget: '',
            interests: [],
            mobility: [],
            dietary: [],
            preferences: []
        };
        this.initializeEventListeners();
        this.initializeWeatherWidget();
        this.initializeMap();
        this.preferenceLearning = new PreferenceLearning();
        this.chatAgent = new ChatAgent();
        this.initializeChatWidget();
    }

    initializeEventListeners() {
        // Form navigation
        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Interest cards
        document.querySelectorAll('.interest-card').forEach(card => {
            card.addEventListener('click', (e) => this.toggleInterest(e));
        });

        // Budget options
        document.querySelectorAll('.budget-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectBudget(e));
        });

        // Form submission
        document.getElementById('tripPlannerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateItinerary();
        });

        // Date validation
        document.getElementById('start-date').addEventListener('change', () => this.validateDates());
        document.getElementById('end-date').addEventListener('change', () => this.validateDates());

        // Action buttons
        document.getElementById('editPlan')?.addEventListener('click', () => this.editPlan());
        document.getElementById('downloadPDF')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('shareBtn')?.addEventListener('click', () => this.shareItinerary());
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateFormDisplay();
        }
    }

    prevStep() {
        this.currentStep--;
        this.updateFormDisplay();
    }

    updateFormDisplay() {
        // Update form steps visibility
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');

        // Update progress bar
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    validateCurrentStep() {
        switch(this.currentStep) {
            case 1:
                return this.validateDates();
            case 2:
                return this.validateInterests();
            case 3:
                return this.validatePreferences();
            default:
                return true;
        }
    }

    validateDates() {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);

        if (startDate >= endDate) {
            this.showError('End date must be after start date');
            return false;
        }

        this.formData.dates = { startDate, endDate };
        return true;
    }

    validateInterests() {
        const selectedInterests = document.querySelectorAll('input[name="interests"]:checked');
        if (selectedInterests.length === 0) {
            this.showError('Please select at least one interest');
            return false;
        }
        return true;
    }

    validatePreferences() {
        const selectedMobility = document.querySelectorAll('input[name="mobility"]:checked');
        if (selectedMobility.length === 0) {
            this.showError('Please select at least one mobility option');
            return false;
        }
        return true;
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'error-alert';
        alert.textContent = message;
        
        const currentStep = document.querySelector('.form-step.active');
        currentStep.insertBefore(alert, currentStep.firstChild);

        setTimeout(() => alert.remove(), 3000);
    }

    async generateItinerary() {
        const loadingOverlay = this.showLoadingOverlay();
        
        try {
            const preferences = this.collectFormData();
            const { itinerary, pdf } = await this.plannerAgent.createItinerary(preferences);
            
            this.displayItinerary(itinerary);
            this.offerPDFDownload(pdf);
            
        } catch (error) {
            this.showError('Error generating itinerary. Please try again.');
            console.error('Itinerary generation error:', error);
        } finally {
            loadingOverlay.remove();
        }
    }

    showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loader"></div>
            <p>Generating your perfect itinerary...</p>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    displayItinerary(itinerary) {
        const timelineView = document.querySelector('.timeline-view');
        timelineView.innerHTML = itinerary.days.map(day => this.createDayHTML(day)).join('');
        
        // Update map
        this.updateMap(itinerary);
        
        // Update weather summary
        this.updateWeatherSummary();
    }

    createDayHTML(day) {
        return `
            <div class="day-card">
                <h3>${this.formatDate(day.date)}</h3>
                <div class="activities">
                    ${day.activities.map(activity => `
                        <div class="activity-item">
                            <div class="activity-time">${activity.time}</div>
                            <div class="activity-content">
                                <h4>${activity.activity}</h4>
                                <p>${activity.duration}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }

    updateMap(itinerary) {
        // Implement map update logic
    }

    updateWeatherSummary() {
        // Implement weather summary update logic
    }

    editPlan() {
        // Implement edit plan logic
    }

    downloadPDF() {
        // Implement download PDF logic
    }

    shareItinerary() {
        // Implement share itinerary logic
    }

    collectFormData() {
        // Implement form data collection logic
    }

    offerPDFDownload(pdf) {
        // Implement offer PDF download logic
    }

    initializeChatWidget() {
        const chatToggle = document.querySelector('.chat-toggle');
        const chatContainer = document.querySelector('.chat-container');
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.chat-input button');
        const minimizeButton = document.querySelector('.minimize-chat');

        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('hidden');
            chatToggle.style.display = 'none';
        });

        minimizeButton.addEventListener('click', () => {
            chatContainer.classList.add('hidden');
            chatToggle.style.display = 'flex';
        });

        const sendMessage = async () => {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message to chat
            this.addMessageToChat(message, 'user');
            chatInput.value = '';

            // Show typing indicator
            this.showTypingIndicator();

            // Get AI response
            const response = await this.chatAgent.processMessage(message);

            // Remove typing indicator and show response
            this.hideTypingIndicator();
            this.addMessageToChat(response, 'bot');
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    addMessageToChat(message, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>
            <div class="message-content">${message}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.querySelector('.chat-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing');
        if (typingIndicator) typingIndicator.remove();
    }
}

// Add the chat widget functionality
const chatToggle = document.querySelector('.chat-toggle');
chatToggle?.addEventListener('click', () => {
    // Implement chat widget toggle functionality
    alert('Chat functionality coming soon!');
});

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function displayItinerary(itinerary) {
    const container = document.getElementById('itineraryContent');
    
    let html = '<div class="itinerary-wrapper">';
    
    itinerary.days.forEach((day, index) => {
        html += `
            <div class="itinerary-day">
                <h3>Day ${index + 1}</h3>
                <div class="timeline">
                    ${day.activities.map(activity => `
                        <div class="timeline-item">
                            <div class="time">${activity.time}</div>
                            <div class="activity">
                                <h4>${activity.name}</h4>
                                <p>${activity.description}</p>
                                <div class="activity-meta">
                                    <span><i class="fas fa-clock"></i> ${activity.duration}</span>
                                    <span><i class="fas fa-map-marker-alt"></i> ${activity.location}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function displayHelp(help) {
    const container = document.querySelector('.help-content');
    
    container.innerHTML = `
        <div class="help-section">
            <h3>${help.answer.title}</h3>
            <p>${help.answer.content}</p>
            
            <h4>Suggestions</h4>
            <ul>
                ${help.suggestions.map(suggestion => `
                    <li>${suggestion}</li>
                `).join('')}
            </ul>
            
            <div class="related-topics">
                <h4>Related Topics</h4>
                ${help.relatedTopics.map(topic => `
                    <button class="topic-btn">${topic}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function showError(message) {
    // Implement error display
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the planner
    const planner = new PlannerPage();
    planner.initialize();

    // Add save button functionality
    const saveButton = document.getElementById('save-itinerary');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            planner.saveItinerary();
        });
    }
});

class PlannerPage {
    constructor() {
        this.selectionManager = window.selectionManager;
        this.startDate = null;
        this.endDate = null;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        try {
            // Initialize date inputs
            this.initializeDateInputs();
            
            // Load saved selections
            this.selectionManager.loadSelections();
            
            // Display selections
            this.displayAllSelections();

            // Initialize preferences handlers
            this.initializePreferences();

            // Add save button event listener
            const saveButton = document.getElementById('save-itinerary');
            if (saveButton) {
                saveButton.addEventListener('click', () => this.saveItinerary());
            }

            this.initialized = true;
        } catch (error) {
            console.error('Error initializing planner:', error);
            this.showNotification('Error initializing planner. Please refresh the page.', 'error');
        }
    }

    initializeDateInputs() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');

        if (startDateInput && endDateInput) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            startDateInput.min = today;
            endDateInput.min = today;

            // Add event listeners
            startDateInput.addEventListener('change', (e) => {
                this.startDate = e.target.value;
                endDateInput.min = e.target.value;
                this.updatePreferences();
            });

            endDateInput.addEventListener('change', (e) => {
                this.endDate = e.target.value;
                this.updatePreferences();
            });
        }
    }

    initializePreferences() {
        try {
            // Handle interest selections
            document.querySelectorAll('.interest-option input').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.updatePreferences());
            });

            // Handle preference selections
            document.querySelectorAll('.preference-group select').forEach(select => {
                select.addEventListener('change', () => this.updatePreferences());
            });

            // Handle tour selections
            document.querySelectorAll('.tour-option input').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.updatePreferences());
            });

            // Handle review filter selections
            document.querySelectorAll('.review-filter input').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.updatePreferences());
            });

            // Budget options handler
            document.querySelectorAll('.budget-option').forEach(option => {
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.addEventListener('change', () => {
                        document.querySelectorAll('.budget-option').forEach(opt => {
                            opt.classList.remove('active');
                        });
                        option.classList.add('active');
                        this.updatePreferences();
                    });
                }
            });

            // Load saved preferences
            const savedPreferences = localStorage.getItem('plannerPreferences');
            if (savedPreferences) {
                const preferences = JSON.parse(savedPreferences);
                this.applySavedPreferences(preferences);
            }
        } catch (error) {
            console.error('Error initializing preferences:', error);
            this.showNotification('Error loading preferences', 'error');
        }
    }

    applySavedPreferences(preferences) {
        try {
            // Apply interests
            preferences.interests?.forEach(interest => {
                const checkbox = document.querySelector(`input[name="interest"][value="${interest}"]`);
                if (checkbox) checkbox.checked = true;
            });

            // Apply pace
            if (preferences.pace) {
                const paceSelect = document.querySelector('select[name="pace"]');
                if (paceSelect) paceSelect.value = preferences.pace;
            }

            // Apply budget
            if (preferences.budget) {
                const budgetRadio = document.querySelector(`input[name="budget"][value="${preferences.budget}"]`);
                if (budgetRadio) {
                    budgetRadio.checked = true;
                    budgetRadio.closest('.budget-option').classList.add('active');
                }
            }

            // Apply accessibility
            if (preferences.accessibility) {
                const accessibilitySelect = document.querySelector('select[name="accessibility"]');
                if (accessibilitySelect) accessibilitySelect.value = preferences.accessibility;
            }

            // Apply tours
            preferences.tours?.boat?.forEach(tour => {
                const checkbox = document.querySelector(`input[name="boat-tour"][value="${tour}"]`);
                if (checkbox) checkbox.checked = true;
            });

            preferences.tours?.horse?.forEach(tour => {
                const checkbox = document.querySelector(`input[name="horse-tour"][value="${tour}"]`);
                if (checkbox) checkbox.checked = true;
            });

            // Apply reviews
            preferences.reviews?.forEach(review => {
                const checkbox = document.querySelector(`input[name="review"][value="${review}"]`);
                if (checkbox) checkbox.checked = true;
            });
        } catch (error) {
            console.error('Error applying saved preferences:', error);
        }
    }

    updatePreferences() {
        try {
            const preferences = {
                interests: Array.from(document.querySelectorAll('.interest-option input:checked')).map(cb => cb.value),
                pace: document.querySelector('select[name="pace"]')?.value || '',
                budget: document.querySelector('input[name="budget"]:checked')?.value || '',
                accessibility: document.querySelector('select[name="accessibility"]')?.value || '',
                tours: {
                    boat: Array.from(document.querySelectorAll('input[name="boat-tour"]:checked')).map(cb => cb.value),
                    horse: Array.from(document.querySelectorAll('input[name="horse-tour"]:checked')).map(cb => cb.value)
                },
                reviews: Array.from(document.querySelectorAll('.review-filter input:checked')).map(cb => cb.value)
            };

            localStorage.setItem('plannerPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    }

    saveItinerary() {
        try {
            // Validate dates
            if (!this.startDate || !this.endDate) {
                this.showNotification('Please select both start and end dates', 'error');
                return;
            }

            // Get all selections and preferences
            const itineraryData = {
                dates: {
                    start: this.startDate,
                    end: this.endDate
                },
                selections: this.selectionManager.getSelections(),
                preferences: JSON.parse(localStorage.getItem('plannerPreferences') || '{}')
            };

            // Save to localStorage
            localStorage.setItem('savedItinerary', JSON.stringify(itineraryData));

            // Show success message
            this.showNotification('Itinerary saved successfully!', 'success');

            // Update UI to reflect saved state
            this.updateSaveButtonState(true);
        } catch (error) {
            console.error('Error saving itinerary:', error);
            this.showNotification('Error saving itinerary', 'error');
        }
    }

    showNotification(message, type = 'info') {
        try {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(notification => notification.remove());

            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;

            // Add to document
            document.body.appendChild(notification);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    updateSaveButtonState(saved) {
        try {
            const saveButton = document.getElementById('save-itinerary');
            if (saveButton) {
                saveButton.innerHTML = saved ? 
                    '<i class="fas fa-check"></i> Itinerary Saved' : 
                    '<i class="fas fa-save"></i> Save Itinerary';
                
                if (saved) {
                    saveButton.classList.add('saved');
                    setTimeout(() => {
                        saveButton.classList.remove('saved');
                        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Itinerary';
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error updating save button state:', error);
        }
    }

    displayAllSelections() {
        try {
            const selections = this.selectionManager.getSelections();
            
            // Display places
            this.displaySelectionCategory('places', selections.places);
            
            // Display restaurants
            this.displaySelectionCategory('restaurants', selections.restaurants);
            
            // Display tours
            this.displaySelectionCategory('tours', selections.tours);
            
            // Display photos
            this.displaySelectionCategory('photos', selections.photos);
        } catch (error) {
            console.error('Error displaying selections:', error);
            this.showNotification('Error loading selections', 'error');
        }
    }

    displaySelectionCategory(category, items) {
        try {
            const container = document.querySelector(`#selected${category.charAt(0).toUpperCase() + category.slice(1)} .selection-items`);
            if (!container) return;

            if (!items || items.length === 0) {
                container.innerHTML = `<p class="no-selections">No ${category} selected yet</p>`;
                return;
            }

            container.innerHTML = items.map(item => `
                <div class="selection-item">
                    <span class="item-name">${item}</span>
                    <button class="remove-selection" data-id="${item}" data-type="${category}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Add event listeners for remove buttons
            container.querySelectorAll('.remove-selection').forEach(button => {
                button.addEventListener('click', (e) => {
                    const button = e.target.closest('button');
                    if (button) {
                        const id = button.dataset.id;
                        const type = button.dataset.type;
                        this.selectionManager.removeSelection(id, type.slice(0, -1)); // Remove 's' from type
                        this.displaySelectionCategory(type, this.selectionManager.getSelections()[type]);
                    }
                });
            });
        } catch (error) {
            console.error(`Error displaying ${category}:`, error);
        }
    }
} 