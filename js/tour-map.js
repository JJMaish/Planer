/**
 * Tour Map functionality for the Bruges City Guide
 * Shows distances from city center when tours are selected
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the map container exists
    const mapContainer = document.getElementById('bike-rental-map');
    if (!mapContainer) return;
    
    // Markt Square coordinates (center of Bruges)
    const marktSquare = [51.2093, 3.2247];
    
    // Create the map centered on Markt Square
    const map = L.map('bike-rental-map', {
        center: marktSquare,
        zoom: 15,
        minZoom: 13,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: true
    });
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a marker for Markt Square (city center)
    const marktMarker = L.marker(marktSquare, {
        icon: L.divIcon({
            className: 'city-center-marker',
            html: '<i class="fas fa-map-marker-alt"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        })
    })
    .bindPopup('<strong>Markt Square</strong><br>Center of Bruges')
    .addTo(map);
    
    // Add a circle to highlight the city center
    const cityCenterCircle = L.circle(marktSquare, {
        color: '#4a90e2',
        fillColor: '#4a90e2',
        fillOpacity: 0.2,
        radius: 200
    }).addTo(map);
    
    // Create a distance display element
    const distanceDisplay = document.createElement('div');
    distanceDisplay.className = 'distance-display';
    distanceDisplay.style.display = 'none';
    mapContainer.appendChild(distanceDisplay);
    
    // Store all tour locations
    const tourLocations = {
        boat: [
            {id: 'huidenvettersplein', name: 'Huidenvettersplein Dock', lat: 51.2093, lng: 3.2247},
            {id: 'rozenhoedkaai', name: 'Rozenhoedkaai Dock', lat: 51.2113, lng: 3.2267}
        ],
        horse: [
            {id: 'markt-horse', name: 'Markt Square Carriage Stand', lat: 51.2093, lng: 3.2247}
        ],
        walk: [
            {id: 'free-walking-tour', name: 'Free Walking Tour', lat: 51.2093, lng: 3.2247},
            {id: 'chocolate-walking-tour', name: 'Chocolate Walking Tour', lat: 51.2093, lng: 3.2247},
            {id: 'beer-walking-tour', name: 'Beer Walking Tour', lat: 51.2093, lng: 3.2247}
        ],
        bike: [
            {id: 'city-bike-tour', name: 'City Bike Tour', lat: 51.2093, lng: 3.2247},
            {id: 'countryside-bike-tour', name: 'Countryside Bike Tour', lat: 51.2093, lng: 3.2247}
        ],
        rental: [
            {id: 'fietsen-popelier', name: 'Fietsen Popelier', lat: 51.2093, lng: 3.2247, address: 'Mariastraat 26'},
            {id: 'de-ketting', name: 'De Ketting', lat: 51.2113, lng: 3.2267, address: 'Carmersstraat 7'},
            {id: 'bruges-bike-rental', name: 'Bruges Bike Rental', lat: 51.2133, lng: 3.2287, address: 'Niklaas Desparsstraat 17'}
        ]
    };
    
    // Store markers and lines
    const markers = {};
    const lines = {};
    
    // Function to calculate distance between two points in kilometers
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance.toFixed(1);
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    // Function to show distance from city center
    function showDistanceFromCenter(location) {
        const distance = calculateDistance(marktSquare[0], marktSquare[1], location.lat, location.lng);
        
        // Update distance display
        distanceDisplay.innerHTML = `
            <div class="distance-info">
                <strong>${location.name}</strong> is <span class="distance-value">${distance} km</span> from the city center
            </div>
        `;
        distanceDisplay.style.display = 'block';
        
        // Draw a line from city center to the location
        if (lines[location.id]) {
            map.removeLayer(lines[location.id]);
        }
        
        lines[location.id] = L.polyline([marktSquare, [location.lat, location.lng]], {
            color: '#4a90e2',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(map);
        
        // Pan to show both points
        const bounds = L.latLngBounds([marktSquare, [location.lat, location.lng]]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Function to hide distance display
    function hideDistanceDisplay() {
        distanceDisplay.style.display = 'none';
        
        // Remove all lines
        Object.values(lines).forEach(line => {
            map.removeLayer(line);
        });
        
        // Reset map view to city center
        map.setView(marktSquare, 15);
    }
    
    // Add event listeners to tour selectors
    document.querySelectorAll('.tour-selector').forEach(selector => {
        selector.addEventListener('change', function() {
            const tourId = this.getAttribute('data-id');
            const tourType = this.getAttribute('data-type');
            
            // Find the location
            const location = tourLocations[tourType].find(loc => loc.id === tourId);
            
            if (location) {
                if (this.checked) {
                    showDistanceFromCenter(location);
                } else {
                    hideDistanceDisplay();
                }
            }
        });
    });
    
    // Add event listeners to rental shop cards
    document.querySelectorAll('.rental-shop-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const locationName = this.querySelector('h4').textContent.trim();
            const location = tourLocations.rental.find(loc => loc.name === locationName);
            
            if (location) {
                showDistanceFromCenter(location);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            hideDistanceDisplay();
        });
    });
    
    // Add custom styles for the city center marker
    const style = document.createElement('style');
    style.textContent = `
        .city-center-marker {
            font-size: 30px;
            color: #4a90e2;
            text-shadow: 0 0 3px white;
        }
        
        .distance-display {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        .distance-value {
            color: #4a90e2;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}); 