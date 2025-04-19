import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { brugesLocations } from "@/data/bruges-data";
import { Location } from "@shared/schema";

type TabType = "attractions" | "food" | "tours" | "events";

const Attractions = () => {
  const [activeTab, setActiveTab] = useState<TabType>("attractions");
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Fetch locations from API
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ["/api/locations"],
    initialData: brugesLocations, // Use the sample data initially
  });
  
  // Filter locations based on active tab
  const getFilteredLocations = () => {
    if (!locations) return [];
    
    switch (activeTab) {
      case "attractions":
        return locations.filter(loc => loc.type === "attraction");
      case "food":
        return locations.filter(loc => loc.type === "restaurant");
      case "tours":
        // Tours would typically be retrieved from a different endpoint or tagged specifically
        return locations.filter(loc => loc.tags.includes("Tour"));
      case "events":
        // Events would be retrieved from a different endpoint
        return locations.filter(loc => loc.type === "event");
      default:
        return locations;
    }
  };
  
  const filteredLocations = getFilteredLocations();
  const displayedLocations = filteredLocations.slice(0, visibleCount);
  
  // Load more attractions
  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };
  
  return (
    <section id="attractions" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Bruges Highlights</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the best of what Bruges has to offer across various categories.
          </p>
        </div>

        {/* Attraction Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-8 overflow-x-auto">
          <button 
            className={`attraction-tab px-4 py-2 ${activeTab === 'attractions' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('attractions')}
          >
            Top Attractions
          </button>
          <button 
            className={`attraction-tab px-4 py-2 ${activeTab === 'food' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('food')}
          >
            Food & Drink
          </button>
          <button 
            className={`attraction-tab px-4 py-2 ${activeTab === 'tours' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tours')}
          >
            Tours & Activities
          </button>
          <button 
            className={`attraction-tab px-4 py-2 ${activeTab === 'events' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <i className="fas fa-spinner fa-spin text-3xl text-primary-600 mb-4"></i>
            <p>Loading attractions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 text-red-500">
            <i className="fas fa-exclamation-circle text-3xl mb-4"></i>
            <p>Failed to load attractions. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredLocations.length === 0 && (
          <div className="text-center py-16">
            <i className="fas fa-map-marked-alt text-3xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">No attractions found in this category.</p>
          </div>
        )}

        {/* Attraction Grid */}
        {!isLoading && !error && filteredLocations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedLocations.map(location => (
              <div 
                key={location.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <img 
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium rounded px-2 py-1">
                      {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                  <p className="text-gray-600 mb-4">{location.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <i className="fas fa-map-marker-alt mr-2 text-primary-500"></i>
                    <span>{location.address}</span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                    <span>View Details</span>
                    <i className="fas fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && !error && filteredLocations.length > visibleCount && (
          <div className="mt-8 text-center">
            <button 
              className="bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-6 rounded-lg transition duration-200"
              onClick={loadMore}
            >
              Load More Attractions
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Attractions;
