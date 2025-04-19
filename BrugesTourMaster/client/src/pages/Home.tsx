import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TripPlanner from "@/components/TripPlanner";
import BrugesMap from "@/components/BrugesMap";
import Attractions from "@/components/Attractions";
import Itinerary from "@/components/Itinerary";
import Footer from "@/components/Footer";

const Home = () => {
  const [currentItineraryId, setCurrentItineraryId] = useState<number | null>(null);
  
  const handleItineraryGenerated = (itineraryId: number) => {
    setCurrentItineraryId(itineraryId);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <TripPlanner onItineraryGenerated={handleItineraryGenerated} />
      <BrugesMap />
      <Attractions />
      <Itinerary itineraryId={currentItineraryId} />
      <Footer />
    </div>
  );
};

export default Home;
