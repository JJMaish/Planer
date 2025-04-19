import { useState } from "react";
import { Link } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <i className="fas fa-map-marked-alt text-2xl text-amber-400 mr-3"></i>
          <h1 className="text-2xl font-bold">Bruges Explorer</h1>
        </div>
        
        <button 
          className="md:hidden absolute right-4 top-4 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
            <li>
              <a 
                href="#plan" 
                className="hover:text-amber-300 transition duration-200 block py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Plan Your Trip
              </a>
            </li>
            <li>
              <a 
                href="#attractions" 
                className="hover:text-amber-300 transition duration-200 block py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Attractions
              </a>
            </li>
            <li>
              <a 
                href="#map" 
                className="hover:text-amber-300 transition duration-200 block py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Map
              </a>
            </li>
            <li>
              <a 
                href="#itinerary" 
                className="hover:text-amber-300 transition duration-200 block py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Your Itinerary
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
