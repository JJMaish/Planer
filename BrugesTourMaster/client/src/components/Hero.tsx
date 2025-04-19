const Hero = () => {
  return (
    <section 
      className="relative h-[500px] bg-cover bg-center flex items-center" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="container mx-auto px-4 relative z-10 text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Discover the Magic of Bruges</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Let our intelligent agent craft your perfect Bruges experience based on your interests and preferences.
        </p>
        <a 
          href="#plan" 
          className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300 inline-flex items-center"
        >
          <span>Start Planning</span>
          <i className="fas fa-arrow-right ml-2"></i>
        </a>
      </div>
    </section>
  );
};

export default Hero;
