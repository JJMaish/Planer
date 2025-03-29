class VirtualTourGuide {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.places = [];
        this.currentPosition = null;
        this.audioEnabled = true;
        this.speechSynthesis = window.speechSynthesis;
        this.watchId = null;
        this.defaultLocation = { lat: 51.2093, lng: 3.2247 }; // Bruges coordinates
        
        this.initializeMap();
        this.initializeCalendar();
        this.setupEventListeners();
        this.setupFilters();
    }

    async initializeMap() {
        try {
            // Check if Google Maps is loaded
            if (typeof google === 'undefined') {
                throw new Error('Google Maps SDK failed to load');
            }

            const mapOptions = {
                center: this.defaultLocation,
                zoom: 15,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: true,
                styles: this.getMapStyles()
            };

            // Create map instance
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            
            // Try to get user location
            try {
                const position = await this.getCurrentPosition();
                this.currentPosition = position;
                this.addUserMarker(position);
            } catch (locationError) {
                console.warn('Could not get user location:', locationError);
                // Use default location for Bruges
                this.currentPosition = {
                    coords: this.defaultLocation
                };
            }

            this.startLocationTracking();
            await this.searchNearbyPlaces();

        } catch (error) {
            console.error('Map initialization error:', error);
            this.handleMapError();
            // Use fallback map if available
            this.showFallbackMap();
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }

    addUserMarker(position) {
        if (this.userMarker) {
            this.userMarker.setMap(null);
        }

        this.userMarker = new google.maps.Marker({
            position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });
    }

    startLocationTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = position;
                this.updateUserLocation(position);
                this.checkNearbyPlaces();
            },
            (error) => console.error('Error tracking location:', error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    async searchNearbyPlaces() {
        const placesList = document.getElementById('placesList');
        placesList.classList.add('loading');

        const brugesAttractions = [
            {
                name: "Belfry Tower",
                location: { lat: 51.2088, lng: 3.2246 },
                type: "landmarks",
                image: "images/attractions/belfry.jpg",
                description: "Medieval bell tower with panoramic views of the city",
                openNow: true,
                nextTour: "Every 30 minutes",
                info: "UNESCO World Heritage site"
            },
            {
                name: "Church of Our Lady",
                location: { lat: 51.2046, lng: 3.2252 },
                type: "churches",
                image: "images/attractions/church-our-lady.jpg",
                description: "Gothic church with Michelangelo's Madonna and Child",
                openNow: true,
                nextTour: "Self-guided tours available",
                info: "Houses valuable art collections"
            },
            {
                name: "Groeningemuseum",
                location: { lat: 51.2049, lng: 3.2248 },
                type: "museums",
                image: "images/attractions/groeninge.jpg",
                description: "Fine arts museum with Flemish primitives",
                openNow: true,
                nextTour: "Guided tours daily",
                info: "Features works by Jan van Eyck"
            },
            {
                name: "Basilica of the Holy Blood",
                location: { lat: 51.2089, lng: 3.2274 },
                type: "churches",
                image: "images/attractions/holy-blood.jpg",
                description: "Romanesque and Gothic chapel housing sacred relics",
                openNow: true,
                nextTour: "Visit during service times",
                info: "Famous for its Holy Blood relic"
            }
        ];

        brugesAttractions.forEach(place => {
            const marker = new google.maps.Marker({
                position: place.location,
                map: this.map,
                title: place.name,
                icon: {
                    url: `images/icons/${place.type}.png`,
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            const placeCard = this.createPlaceCard(place);
            placesList.appendChild(placeCard);

            marker.addListener('click', () => {
                this.showPlaceDetails(place);
            });
        });

        placesList.classList.remove('loading');
    }

    async getPlaceDetails(placeId) {
        try {
            const response = await fetch(`/api/places/details?placeId=${placeId}`);
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    }

    displayPlaces(places) {
        const placesList = document.getElementById('placesList');
        
        places.forEach(place => {
            const placeCard = this.createPlaceCard(place);
            placesList.appendChild(placeCard);
        });
    }

    createPlaceCard(place) {
        const card = document.createElement('div');
        card.className = 'place-card';
        
        card.innerHTML = `
            <div class="place-icon">
                <i class="fas fa-${this.getIconForType(place.type)}"></i>
            </div>
            <div class="place-details">
                <h3>${place.name}</h3>
                <div class="place-meta">
                    <span><i class="fas fa-clock"></i> ${place.openNow ? 'Open Now' : 'Closed'}</span>
                    <span><i class="fas fa-info-circle"></i> ${place.info}</span>
                </div>
                <div class="place-schedule">
                    <div class="schedule-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${place.nextTour}</span>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => this.showPlaceDetails(place));
        return card;
    }

    getIconForType(type) {
        const icons = {
            landmarks: 'landmark',
            churches: 'church',
            museums: 'museum',
            restaurants: 'utensils',
            attractions: 'star'
        };
        return icons[type] || 'map-marker-alt';
    }

    async showPlaceDetails(place) {
        const detailsPanel = document.getElementById('placeDetails');
        const service = new google.maps.places.PlacesService(this.map);

        try {
            const details = await this.getPlaceDetails(place.place_id);
            this.displayPlaceDetails(details);
            detailsPanel.style.display = 'block';
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    }

    displayPlaceDetails(place) {
        const content = document.querySelector('.details-content');
        const photo = place.photos ? place.photos[0].getUrl() : 'placeholder-image.jpg';

        content.innerHTML = `
            <img src="${photo}" alt="${place.name}">
            <h2>${place.name}</h2>
            <div class="details-meta">
                <p><i class="fas fa-map-marker-alt"></i> ${place.formatted_address}</p>
                ${place.formatted_phone_number ? `<p><i class="fas fa-phone"></i> ${place.formatted_phone_number}</p>` : ''}
                ${place.website ? `<p><i class="fas fa-globe"></i> <a href="${place.website}" target="_blank">Visit Website</a></p>` : ''}
            </div>
            <div class="details-description">
                ${this.getOpeningHoursHTML(place.opening_hours)}
            </div>
        `;

        if (this.audioEnabled) {
            this.speakPlaceDescription(place);
        }
    }

    getOpeningHoursHTML(hours) {
        if (!hours || !hours.weekday_text) return '';

        return `
            <h3>Opening Hours</h3>
            <ul class="opening-hours">
                ${hours.weekday_text.map(day => `<li>${day}</li>`).join('')}
            </ul>
        `;
    }

    speakPlaceDescription(place) {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }

        const description = `You are near ${place.name}. ${place.formatted_address}`;
        const utterance = new SpeechSynthesisUtterance(description);
        this.speechSynthesis.speak(utterance);
    }

    setupEventListeners() {
        document.getElementById('centerLocation').addEventListener('click', () => {
            if (this.currentPosition) {
                this.map.panTo({
                    lat: this.currentPosition.coords.latitude,
                    lng: this.currentPosition.coords.longitude
                });
            }
        });

        document.getElementById('toggleAudio').addEventListener('click', (e) => {
            this.audioEnabled = !this.audioEnabled;
            e.currentTarget.querySelector('i').className = 
                this.audioEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        });

        document.querySelector('.back-btn').addEventListener('click', () => {
            document.getElementById('placeDetails').style.display = 'none';
            if (this.speechSynthesis.speaking) {
                this.speechSynthesis.cancel();
            }
        });
    }

    getMapStyles() {
        return [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ];
    }

    async generatePlan() {
        const form = document.getElementById('planForm');
        const planResult = document.getElementById('planResult');
        const planContent = planResult.querySelector('.plan-content');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const duration = document.getElementById('duration').value;
            const interests = Array.from(document.querySelectorAll('.interests-checkboxes input:checked'))
                .map(checkbox => checkbox.value);
            const preferences = document.getElementById('preferences').value;

            try {
                const response = await fetch('/api/generate-plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        duration,
                        interests,
                        preferences
                    })
                });

                const data = await response.json();
                
                if (data.itinerary) {
                    planContent.innerHTML = marked(data.itinerary); // Using marked.js for markdown rendering
                    form.style.display = 'none';
                    planResult.style.display = 'block';
                }
            } catch (error) {
                console.error('Error generating plan:', error);
                alert('Failed to generate travel plan. Please try again.');
            }
        });

        // Back button handler
        document.querySelector('.back-to-form').addEventListener('click', () => {
            planResult.style.display = 'none';
            form.style.display = 'block';
        });
    }

    initializeCalendar() {
        const today = new Date();
        const calendar = document.createElement('div');
        calendar.className = 'calendar-widget';
        
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <h3>${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}</h3>
            <div class="calendar-nav">
                <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
                <button class="next-month"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        // Add day names
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day day-name';
            dayEl.textContent = day;
            grid.appendChild(dayEl);
        });

        // Add calendar days
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        for (let i = 0; i < firstDay.getDay(); i++) {
            grid.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = i;
            if (i === today.getDate()) {
                dayEl.classList.add('active');
            }
            grid.appendChild(dayEl);
        }

        calendar.appendChild(header);
        calendar.appendChild(grid);
        
        // Add calendar to the page
        const infoPanel = document.querySelector('.info-panel');
        infoPanel.insertBefore(calendar, infoPanel.firstChild);
    }

    handleMapError() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div class="map-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Map Loading Error</h3>
                <p>The map couldn't be loaded. This might be due to:</p>
                <ul style="text-align: left; margin-top: 10px;">
                    <li>Missing or invalid API key</li>
                    <li>No internet connection</li>
                    <li>Ad blocker interference</li>
                </ul>
                <button onclick="location.reload()" class="retry-btn" style="margin-top: 15px;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                this.filterPlaces(filter);
            });
        });
    }

    filterPlaces(filter) {
        const cards = document.querySelectorAll('.place-card');
        cards.forEach(card => {
            const place = this.places.find(p => p.name === card.querySelector('h3').textContent);
            if (filter === 'all' || place.type === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showFallbackMap() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div class="fallback-map">
                <img src="images/static-map.jpg" alt="Static map of Bruges">
                <div class="fallback-overlay">
                    <p>Development Mode: Using static map</p>
                </div>
            </div>
        `;
    }
}

// Initialize the tour guide when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualTourGuide();
}); 