export class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.brugesCenter = [51.2093, 3.2247]; // Bruges coordinates
    }

    initialize() {
        try {
            // Initialize the map
            this.map = L.map('bruges-map').setView(this.brugesCenter, 14);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    addMarker(lat, lng, title, description) {
        try {
            const marker = L.marker([lat, lng])
                .addTo(this.map)
                .bindPopup(`<b>${title}</b><br>${description}`);
            
            this.markers.push(marker);
            return marker;
        } catch (error) {
            console.error('Error adding marker:', error);
            return null;
        }
    }

    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }

    setView(lat, lng, zoom = 14) {
        if (this.map) {
            this.map.setView([lat, lng], zoom);
        }
    }
} 