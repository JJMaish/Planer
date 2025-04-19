const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-map-marked-alt text-amber-400 mr-2"></i>
              Bruges Explorer
            </h3>
            <p className="text-gray-400 mb-4">
              Your AI-powered guide to the most beautiful city in Belgium. Discover Bruges like a local with personalized itineraries.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Bruges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  City Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Local Transportation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Weather Forecast
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 w-5 text-center"></i>
                <span>info@brugesexplorer.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-2 w-5 text-center"></i>
                <span>+32 123 456 789</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 w-5 text-center"></i>
                <span>Markt 1, 8000 Bruges, Belgium</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Bruges Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
