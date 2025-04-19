import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Location } from "@shared/schema";
import { brugesLocations } from "@/data/bruges-data";

// Filter options
type FilterOption = "all" | "attraction" | "restaurant" | "shopping" | "nature" | "photospot";

const BrugesMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  // Fetch locations from the API
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ["/api/locations"],
    initialData: brugesLocations, // Use the sample data initially
  });

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Check if Leaflet is available
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef.current]);

  // Initialize the Leaflet map
  const initializeMap = () => {
    if (!window.L || !mapRef.current) return;

    const L = window.L;
    
    // Create map centered on Bruges
    const newMap = L.map(mapRef.current).setView([51.2093, 3.2247], 14);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(newMap);

    setMap(newMap);
  };

  // Update markers when locations data or filter changes
  useEffect(() => {
    if (!map || !locations) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    
    // Filter locations based on the active filter
    const filteredLocations = locations.filter(location => 
      activeFilter === "all" || location.type === activeFilter
    );
    
    // Create new markers
    const L = window.L;
    const newMarkers = filteredLocations.map(location => {
      const marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)])
        .addTo(map)
        .bindPopup(`
          <div class="popup-content">
            <h3 class="font-bold">${location.name}</h3>
            <p class="text-sm">${location.address}</p>
            <p class="text-xs mt-1">${location.type.charAt(0).toUpperCase() + location.type.slice(1)}</p>
          </div>
        `);
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Adjust map view to fit all markers if there are any
    if (newMarkers.length > 0) {
      const group = L.featureGroup(newMarkers);
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [map, locations, activeFilter]);

  // Handle filter change
  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

  return (
    <section id="map" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Bruges</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the best attractions, restaurants, and hidden gems throughout the city.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* Filter Bar */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button 
                className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeFilter === "all" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleFilterChange("all")}
              >
                All
              </button>
              <button 
                className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeFilter === "attraction" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleFilterChange("attraction")}
              >
                <i className="fas fa-landmark mr-2"></i>Attractions
              </button>
              <button 
                className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeFilter === "restaurant" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleFilterChange("restaurant")}
              >
                <i className="fas fa-utensils mr-2"></i>Restaurants
              </button>
              <button 
                className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeFilter === "shopping" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleFilterChange("shopping")}
              >
                <i className="fas fa-shopping-bag mr-2"></i>Shopping
              </button>
              <button 
                className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeFilter === "nature" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleFilterChange("nature")}
              >
                <i className="fas fa-tree mr-2"></i>Nature
              </button>
              <button 
                className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeFilter === "photospot" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => handleFilterChange("photospot")}
              >
                <i className="fas fa-camera mr-2"></i>Photo Spots
              </button>
            </div>

            {/* Map View */}
            <div 
              id="brugesMap" 
              ref={mapRef}
              className="map-container h-[450px] rounded-lg border border-gray-200"
            >
              {isLoading && (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-2xl text-primary-600 mb-2"></i>
                    <p>Loading map...</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center text-red-500">
                    <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Error loading map. Please try again later.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add Leaflet type to window
declare global {
  interface Window {
    L: any;
  }
}

export default BrugesMap;
