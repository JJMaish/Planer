/**
 * Map functionality for the Bruges City Guide
 * Uses the local map file from the map folder
 */

// Initialize the map when the page loads
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
    
    // Try different approaches to load the map
    try {
        // Approach 1: Try to load as a static image
        // This assumes the map file is a static image with known bounds
        const imageBounds = [
            [51.1993, 3.2147], // Southwest corner
            [51.2193, 3.2347]  // Northeast corner
        ];
        
        L.imageOverlay('map/map', imageBounds).addTo(map);
    } catch (e) {
        console.error('Failed to load map as static image:', e);
        
        try {
            // Approach 2: Try to load as a tile server
            // This assumes the map file is a directory containing tile images
            L.tileLayer('map/map/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        } catch (e) {
            console.error('Failed to load map as tile server:', e);
            
            // Approach 3: Fallback to OpenStreetMap if local map fails
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }
    }
    
    // Add a marker for Markt Square
    const marktMarker = L.marker(marktSquare)
        .bindPopup('<strong>Markt Square</strong><br>Center of Bruges')
        .addTo(map);
    
    // Add markers for bike rental locations
    const rentalLocations = [
        {name: 'Fietsen Popelier', lat: 51.2093, lng: 3.2247, address: 'Mariastraat 26'},
        {name: 'De Ketting', lat: 51.2113, lng: 3.2267, address: 'Carmersstraat 7'},
        {name: 'Bruges Bike Rental', lat: 51.2133, lng: 3.2287, address: 'Niklaas Desparsstraat 17'}
    ];
    
    // Store markers in a variable to access them later
    const markers = [];
    
    rentalLocations.forEach(location => {
        const marker = L.marker([location.lat, location.lng])
            .bindPopup(`<strong>${location.name}</strong><br>${location.address}`)
            .addTo(map);
        
        // Store marker with its location data
        markers.push({
            marker: marker,
            data: location
        });
        
        // Add click event to highlight the marker
        marker.on('click', function() {
            // Highlight the marker
            markers.forEach(m => m.marker.setIcon(L.Icon.Default));
            marker.setIcon(L.Icon.Red);
        });
    });
    
    // Add tour card interaction
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Get the location from the card
            const locationText = this.querySelector('.location').textContent.trim();
            const locationName = locationText.replace('📍', '').trim();
            
            // Find the corresponding marker
            const marker = markers.find(m => m.data.name.includes(locationName) || 
                                          m.data.address.includes(locationName));
            
            if (marker) {
                // Highlight the marker
                markers.forEach(m => m.marker.setIcon(L.Icon.Default));
                marker.marker.setIcon(L.Icon.Red);
                
                // Pan to the marker
                map.setView([marker.data.lat, marker.data.lng], 15);
            }
        });
    });
    
    // Add rental shop card interaction
    const rentalShopCards = document.querySelectorAll('.rental-shop-card');
    rentalShopCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Get the location from the card
            const locationText = this.querySelector('.location').textContent.trim();
            const locationName = locationText.replace('📍', '').trim();
            
            // Find the corresponding marker
            const marker = markers.find(m => m.data.name.includes(locationName) || 
                                          m.data.address.includes(locationName));
            
            if (marker) {
                // Highlight the marker
                markers.forEach(m => m.marker.setIcon(L.Icon.Default));
                marker.marker.setIcon(L.Icon.Red);
                
                // Pan to the marker
                map.setView([marker.data.lat, marker.data.lng], 15);
            }
        });
    });
    
    // Add custom red icon for highlighted markers
    L.Icon.Red = L.Icon.extend({
        options: {
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }
    });
}); 