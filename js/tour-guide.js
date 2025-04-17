// Initialize map
let map;
let currentMarker;
let audioGuide = null;

function initializeTourGuide() {
    // Initialize map
    map = L.map('map').setView([51.2093, 3.2247], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add event listeners
    document.getElementById('centerLocation').addEventListener('click', centerMap);
    document.getElementById('toggleAudio').addEventListener('click', toggleAudioGuide);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterPlaces(btn.dataset.filter));
    });

    // Load places
    loadPlaces();
}

async function loadPlaces() {
    try {
        const places = await window.placeAgent.places;
        const placesList = document.getElementById('placesList');
        
        places.forEach(place => {
            const placeElement = createPlaceElement(place);
            placesList.appendChild(placeElement);
        });
    } catch (error) {
        console.error('Error loading places:', error);
        showError('Failed to load places. Please try again.');
    }
}

function createPlaceElement(place) {
    const div = document.createElement('div');
    div.className = 'place-item';
    div.innerHTML = `
        <div class="place-header">
            <h3>${place.name}</h3>
            <button class="details-btn" data-id="${place.id}">
                <i class="fas fa-info-circle"></i>
            </button>
        </div>
        <p class="place-description">${place.description}</p>
        <div class="place-meta">
            <span class="place-type">${place.type}</span>
            <span class="place-distance">${place.distance}</span>
        </div>
    `;

    // Add click handler for details
    div.querySelector('.details-btn').addEventListener('click', () => showPlaceDetails(place.id));
    
    return div;
}

async function showPlaceDetails(placeId) {
    try {
        const details = await window.placeAgent.getPlaceDetails(placeId);
        const audioGuide = await window.placeAgent.getAudioGuide(placeId);
        const nearbyPlaces = await window.placeAgent.getNearbyPlaces(placeId);

        const detailsContainer = document.getElementById('placeDetails');
        detailsContainer.style.display = 'block';
        detailsContainer.querySelector('.details-content').innerHTML = `
            <h2>${details.name}</h2>
            <div class="place-info">
                <p class="description">${details.description}</p>
                <div class="history">${details.history}</div>
                <div class="features">
                    <h3>Key Features</h3>
                    <ul>
                        ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="practical-info">
                    <h3>Practical Information</h3>
                    <p><strong>Visiting Hours:</strong> ${details.visitingHours}</p>
                    <p><strong>Entry Fee:</strong> ${details.entryFee}</p>
                    <p><strong>Accessibility:</strong> ${details.accessibility}</p>
                </div>
                <div class="audio-guide">
                    <h3>Audio Guide</h3>
                    <p>${audioGuide.script}</p>
                    <p><strong>Duration:</strong> ${audioGuide.duration}</p>
                </div>
                <div class="nearby-places">
                    <h3>Nearby Attractions</h3>
                    <ul>
                        ${nearbyPlaces.nearbyPlaces.map(place => `
                            <li>
                                <strong>${place.name}</strong> (${place.distance})
                                <p>${place.description}</p>
                                <p>Duration: ${place.duration}</p>
                                <p>Entry: ${place.entry}</p>
                            </li>
class VirtualTourGuide {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentLocation = null;
        this.audioEnabled = false;
        this.places = [
            {
                id: 'belfry',
                name: 'Belfry of Bruges',
                type: 'landmarks',
                lat: 51.2084,
                lng: 3.2257,
                description: 'The Belfry of Bruges is a medieval bell tower in the center of Bruges. It is one of the city\'s most prominent symbols.',
                audio: 'audio/belfry.mp3'
            },
            {
                id: 'basilica',
                name: 'Basilica of the Holy Blood',
                type: 'churches',
                lat: 51.2086,
                lng: 3.2267,
                description: 'The Basilica of the Holy Blood is a Roman Catholic basilica in Bruges. It houses a venerated relic of the Holy Blood.',
                audio: 'audio/basilica.mp3'
            },
            {
                id: 'groeninge',
                name: 'Groeninge Museum',
                type: 'museums',
                lat: 51.2069,
                lng: 3.2264,
                description: 'The Groeninge Museum is a municipal museum in Bruges, Belgium, built on the site of the medieval Eekhout Abbey.',
                audio: 'audio/groeninge.mp3'
            }
        ];

        this.initializeMap();
        this.setupEventListeners();
        this.renderPlaces();
    }

    initializeMap() {
        // Initialize the map centered on Bruges
        this.map = L.map('map').setView([51.2093, 3.2247], 14);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add current location button functionality
        document.getElementById('centerLocation').addEventListener('click', () => {
            if (this.currentLocation) {
                this.map.setView(this.currentLocation, 16);
            } else {
                this.getCurrentLocation();
            }
        });
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = [position.coords.latitude, position.coords.longitude];
                    this.map.setView(this.currentLocation, 16);
                    
                    // Add current location marker
                    L.marker(this.currentLocation, {
                        icon: L.divIcon({
                            className: 'current-location-marker',
                            html: '<i class="fas fa-location-dot"></i>',
                            iconSize: [30, 30]
                        })
                    }).addTo(this.map);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    setupEventListeners() {
        // Audio toggle
        document.getElementById('toggleAudio').addEventListener('click', () => {
            this.audioEnabled = !this.audioEnabled;
            const icon = document.querySelector('#toggleAudio i');
            icon.className = this.audioEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterPlaces(btn.dataset.filter);
            });
        });
    }

    renderPlaces() {
        const placesList = document.getElementById('placesList');
        placesList.innerHTML = '';

        this.places.forEach(place => {
            // Create list item
            const listItem = document.createElement('div');
            listItem.className = 'place-item';
            listItem.dataset.id = place.id;
            listItem.innerHTML = `
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <button class="view-details-btn" data-id="${place.id}">View Details</button>
            `;

            // Add marker to map
            const marker = L.marker([place.lat, place.lng], {
                icon: L.divIcon({
                    className: `place-marker ${place.type}`,
                    html: `<i class="fas fa-${this.getIconForType(place.type)}"></i>`,
                    iconSize: [30, 30]
                })
            }).addTo(this.map);

            marker.bindPopup(`
                <div class="marker-popup">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    ${this.audioEnabled ? `<button class="audio-btn" data-audio="${place.audio}">
                        <i class="fas fa-volume-up"></i> Listen
                    </button>` : ''}
                </div>
            `);

            this.markers.push(marker);

            // Add click event to list item
            listItem.addEventListener('click', () => {
                this.showPlaceDetails(place);
                this.map.setView([place.lat, place.lng], 16);
            });

            placesList.appendChild(listItem);
        });
    }

    getIconForType(type) {
        const icons = {
            landmarks: 'landmark',
            museums: 'university',
            churches: 'church'
        };
        return icons[type] || 'map-marker-alt';
    }

    filterPlaces(filter) {
        this.markers.forEach(marker => {
            const place = this.places.find(p => 
                p.lat === marker.getLatLng().lat && 
                p.lng === marker.getLatLng().lng
            );
            
            if (filter === 'all' || place.type === filter) {
                marker.addTo(this.map);
            } else {
                marker.remove();
            }
        });

        // Update list view
        const places = document.querySelectorAll('.place-item');
        places.forEach(place => {
            const placeData = this.places.find(p => p.id === place.dataset.id);
            if (filter === 'all' || placeData.type === filter) {
                place.style.display = 'block';
            } else {
                place.style.display = 'none';
            }
        });
    }

    showPlaceDetails(place) {
        const detailsContainer = document.getElementById('placeDetails');
        const detailsContent = detailsContainer.querySelector('.details-content');
        
        detailsContent.innerHTML = `
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            ${this.audioEnabled ? `
                <button class="audio-btn" data-audio="${place.audio}">
                    <i class="fas fa-volume-up"></i> Listen to Audio Guide
                </button>
            ` : ''}
        `;

        document.getElementById('placesList').style.display = 'none';
        detailsContainer.style.display = 'block';
    }
}

// Initialize the tour guide when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VirtualTourGuide();
}); 