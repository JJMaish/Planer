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
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading place details:', error);
        showError('Failed to load place details. Please try again.');
    }
}

function centerMap() {
    if (currentMarker) {
        map.setView(currentMarker.getLatLng(), 16);
    } else {
        getCurrentLocation();
    }
}

function toggleAudioGuide() {
    audioGuide = !audioGuide;
    const icon = document.querySelector('#toggleAudio i');
    icon.className = audioGuide ? 'fas fa-volume-up' : 'fas fa-volume-mute';
}

function filterPlaces(filter) {
    // Implementation of filterPlaces function
}

function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                const currentLocation = [position.coords.latitude, position.coords.longitude];
                map.setView(currentLocation, 16);
                    
                    // Add current location marker
                currentMarker = L.marker(currentLocation, {
                        icon: L.divIcon({
                            className: 'current-location-marker',
                            html: '<i class="fas fa-location-dot"></i>',
                            iconSize: [30, 30]
                        })
                }).addTo(map);
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

// Initialize the tour guide when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTourGuide();
}); 