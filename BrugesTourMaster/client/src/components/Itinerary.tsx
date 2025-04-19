import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

// Itinerary types
interface ItineraryActivity {
  id: number;
  name: string;
  description: string;
  type: string;
  address: string;
  time: string;
  tags: string[];
  price?: string;
  imageUrl: string;
}

interface ItineraryDay {
  day: number;
  activities: ItineraryActivity[];
}

interface GeneratedItinerary {
  days: ItineraryDay[];
  description: string;
}

interface ItineraryData {
  id: number;
  days: number;
  interests: string[];
  budget: string;
  tours: string[];
  additionalInfo?: string;
  generatedItinerary: GeneratedItinerary;
}

interface ItineraryProps {
  itineraryId: number | null;
}

const Itinerary = ({ itineraryId }: ItineraryProps) => {
  const [activeDay, setActiveDay] = useState(1);
  
  // Reset active day when a new itinerary is loaded
  useEffect(() => {
    setActiveDay(1);
  }, [itineraryId]);
  
  // Fetch itinerary data
  const { data: itinerary, isLoading, error } = useQuery({
    queryKey: [`/api/itineraries/${itineraryId}`],
    enabled: !!itineraryId,
  });
  
  // Handle day tab click
  const handleDayTabClick = (day: number) => {
    setActiveDay(day);
  };
  
  // Handle PDF download
  const handleDownloadPDF = () => {
    // In a real app, this would trigger a PDF generation and download
    // For now, we'll just show an alert
    alert("PDF download functionality would be implemented here in a production app.");
  };
  
  return (
    <section id="itinerary" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Personalized Itinerary</h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto" 
            id="itineraryDescription"
          >
            {itinerary?.generatedItinerary?.description || "Fill out the form above to generate your custom Bruges experience."}
          </p>
        </div>

        {/* Empty State - No Itinerary */}
        {!itineraryId && (
          <div id="emptyItinerary" className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-6">
              <i className="fas fa-calendar-alt text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Itinerary Generated Yet</h3>
            <p className="text-gray-500 mb-6">Tell us about your preferences and we'll create a personalized plan for you.</p>
            <a 
              href="#plan" 
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 inline-flex items-center"
            >
              <span>Start Planning</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        )}

        {/* Loading State */}
        {itineraryId && isLoading && (
          <div className="text-center py-16">
            <i className="fas fa-spinner fa-spin text-3xl text-primary-600 mb-4"></i>
            <p>Loading your itinerary...</p>
          </div>
        )}

        {/* Error State */}
        {itineraryId && error && (
          <div className="text-center py-16 text-red-500">
            <i className="fas fa-exclamation-circle text-3xl mb-4"></i>
            <p>Failed to load your itinerary. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = "#plan"}
            >
              Return to Planner
            </Button>
          </div>
        )}

        {/* Generated Itinerary */}
        {itineraryId && itinerary && !isLoading && !error && (
          <div id="generatedItinerary">
            {/* Day Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
              {itinerary.generatedItinerary.days.map((day) => (
                <button 
                  key={day.day}
                  className={`day-tab px-4 py-2 whitespace-nowrap ${activeDay === day.day ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleDayTabClick(day.day)}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            {/* Itinerary Timeline */}
            <div className="max-w-4xl mx-auto">
              {itinerary.generatedItinerary.days
                .find(d => d.day === activeDay)?.activities.map((activity, index) => (
                <div key={`${activity.id}-${index}`} className="relative pl-8 pb-8 border-l-2 border-gray-200">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary-600"></div>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="p-5">
                      <span className="text-sm font-medium text-primary-600 block mb-2">{activity.time}</span>
                      <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {activity.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="bg-gray-100 text-gray-700 text-xs font-medium rounded px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <i className="fas fa-map-marker-alt mr-2 text-primary-500"></i>
                        <span>{activity.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {activity.price && (
                          <span className="text-gray-500 text-sm">
                            <i className="fas fa-euro-sign mr-1"></i> {activity.price}
                          </span>
                        )}
                        <button className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                          <span>Details</span>
                          <i className="fas fa-chevron-right ml-1 text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button 
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 inline-flex items-center"
                onClick={handleDownloadPDF}
              >
                <i className="fas fa-download mr-2"></i>
                <span>Download Itinerary PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Itinerary;
