class VirtualTourGuide {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.places = [];
        this.currentPosition = null;
        this.audioEnabled = true;
        this.speechSynthesis = window.speechSynthesis;
        this.watchId = null;
        
        this.initializeMap();
        this.setupEventListeners();
        this.generatePlan();
    }

    async initializeMap() {
        try {
            const position = await this.getCurrentPosition();
            this.currentPosition = position;

            const mapOptions = {
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                zoom: 15,
                styles: this.getMapStyles()
            };

            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            this.addUserMarker(position);
            this.startLocationTracking();
            this.searchNearbyPlaces();
        } catch (error) {
            console.error('Error initializing map:', error);
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
        const types = ['museum', 'church', 'tourist_attraction', 'historic_site'];

        for (const type of types) {
            try {
                const response = await fetch(`/api/places/nearby?lat=${this.currentPosition.coords.latitude}&lng=${this.currentPosition.coords.longitude}&type=${type}`);
                const data = await response.json();
                
                if (data.results) {
                    this.places = [...this.places, ...data.results];
                    this.displayPlaces(data.results);
                }
            } catch (error) {
                console.error(`Error searching for ${type}:`, error);
            }
        }
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
        
        const photo = place.photos ? place.photos[0].getUrl() : 'placeholder-image.jpg';
        
        card.innerHTML = `
            <img src="${photo}" alt="${place.name}">
            <div class="place-info">
                <h3>${place.name}</h3>
                <div class="place-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${place.vicinity}</span>
                    <span><i class="fas fa-star"></i> ${place.rating || 'N/A'}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => this.showPlaceDetails(place));
        return card;
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
}

// Initialize the tour guide when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VirtualTourGuide();
}); 