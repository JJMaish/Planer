import { Location, Event } from "@shared/schema";

// Sample Bruges locations data
export const brugesLocations: Location[] = [
  {
    id: 1,
    name: "Markt (Market Square)",
    description: "The central square of Bruges, surrounded by colorful historic buildings and the famous Belfry tower.",
    type: "attraction",
    address: "Markt, 8000 Brugge",
    latitude: "51.2088",
    longitude: "3.2246",
    budget: "budget",
    imageUrl: "https://images.unsplash.com/photo-1558642912-326ea4a12ef6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["History", "Architecture", "Photography"],
    details: {
      established: "12th century",
      highlights: ["Provincial Court", "Statue of Jan Breydel and Pieter de Coninck", "Colorful guild houses"]
    },
    openingHours: "Open 24 hours",
    price: "Free",
    websiteUrl: "https://visitbruges.be/markt"
  },
  {
    id: 2,
    name: "Belfry of Bruges",
    description: "Medieval bell tower with 366 steps leading to a stunning panoramic view of the city.",
    type: "attraction",
    address: "Markt 7, 8000 Brugge",
    latitude: "51.2087",
    longitude: "3.2247",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1575914801759-46d4bed3ef9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["History", "Architecture", "Culture"],
    details: {
      height: "83 meters",
      built: "13th century",
      notes: "UNESCO World Heritage site"
    },
    openingHours: "9:00 AM - 5:00 PM",
    price: "€14",
    websiteUrl: "https://www.museabrugge.be/en/visit-our-museums/our-museums-and-monuments/belfort"
  },
  {
    id: 3,
    name: "Canals of Bruges",
    description: "Picturesque waterways weaving through the city, earning Bruges the nickname 'Venice of the North'.",
    type: "attraction",
    address: "Throughout the city center",
    latitude: "51.2093",
    longitude: "3.2247",
    budget: "budget",
    imageUrl: "https://images.unsplash.com/photo-1555990730-5d0e82197937?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Nature", "Architecture", "Photography"],
    details: {
      length: "Several kilometers",
      highlights: ["Rozenhoedkaai", "Groenerei", "Dijver"]
    },
    openingHours: "Open 24 hours",
    price: "Free to walk alongside, €10 for boat tours",
    websiteUrl: "https://visitbruges.be/canals"
  },
  {
    id: 4,
    name: "Basilica of the Holy Blood",
    description: "A 12th-century basilica housing a relic of the Holy Blood, believed to contain the blood of Christ.",
    type: "attraction",
    address: "Burg 13, 8000 Brugge",
    latitude: "51.2087",
    longitude: "3.2268",
    budget: "budget",
    imageUrl: "https://images.unsplash.com/photo-1598107123295-1f587f6abe6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["History", "Culture", "Architecture"],
    details: {
      built: "12th century",
      style: "Romanesque and Gothic",
      highlight: "Relic of the Holy Blood"
    },
    openingHours: "9:30 AM - 12:00 PM, 2:00 PM - 5:00 PM",
    price: "€2 (suggested donation)",
    websiteUrl: "https://www.holyblood.com/"
  },
  {
    id: 5,
    name: "Groeningemuseum",
    description: "Museum showcasing six centuries of Flemish and Belgian paintings, including works by Jan van Eyck and Hans Memling.",
    type: "attraction",
    address: "Dijver 12, 8000 Brugge",
    latitude: "51.2046",
    longitude: "3.2258",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Culture", "Art", "History"],
    details: {
      established: "1930",
      collection: "Flemish Primitives, Renaissance, and Modern Art",
      highlight: "Madonna with Canon Joris van der Paele by Jan van Eyck"
    },
    openingHours: "9:30 AM - 5:00 PM, Closed on Mondays",
    price: "€12",
    websiteUrl: "https://www.museabrugge.be/en/visit-our-museums/our-museums-and-monuments/groeningemuseum"
  },
  {
    id: 6,
    name: "De Halve Maan Brewery",
    description: "Historic family brewery offering tours and tastings of their famous Bruges beer.",
    type: "attraction",
    address: "Walplein 26, 8000 Brugge",
    latitude: "51.2024",
    longitude: "3.2253",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Food", "Culture", "History"],
    details: {
      established: "1856",
      specialty: "Brugse Zot and Straffe Hendrik beers",
      unique: "Underground beer pipeline to the bottling plant"
    },
    openingHours: "11:00 AM - 6:00 PM",
    price: "€12 for tour including one beer",
    websiteUrl: "https://www.halvemaan.be/en"
  },
  {
    id: 7,
    name: "Minnewater (Lake of Love)",
    description: "Romantic lake surrounded by trees and a beautiful park, featuring the iconic Lovers Bridge.",
    type: "nature",
    address: "Minnewater, 8000 Brugge",
    latitude: "51.1980",
    longitude: "3.2210",
    budget: "budget",
    imageUrl: "https://images.unsplash.com/photo-1576508834030-6b1c7d6e3ed3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Nature", "Photography", "Romance"],
    details: {
      legend: "Legend says that if you cross the bridge with your loved one, you will experience eternal love",
      features: ["Swans", "Historic Béguinage nearby", "Picturesque views"]
    },
    openingHours: "Open 24 hours",
    price: "Free",
    websiteUrl: "https://visitbruges.be/minnewater"
  },
  {
    id: 8,
    name: "Choco-Story",
    description: "Chocolate museum showcasing the history and production of Belgian chocolate with demonstrations and tastings.",
    type: "attraction",
    address: "Wijnzakstraat 2, 8000 Brugge",
    latitude: "51.2081",
    longitude: "3.2254",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Food", "Culture", "Shopping"],
    details: {
      established: "2004",
      features: ["Chocolate making demonstrations", "History of chocolate", "Tasting area"]
    },
    openingHours: "10:00 AM - 5:00 PM",
    price: "€11",
    websiteUrl: "https://www.choco-story.be/en"
  },
  {
    id: 9,
    name: "The Old Chocolate House",
    description: "Famous chocolate shop and tea room offering the best hot chocolate in Bruges.",
    type: "restaurant",
    address: "Mariastraat 1, 8000 Brugge",
    latitude: "51.2070",
    longitude: "3.2228",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1623653108826-530027910e16?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Food", "Shopping"],
    details: {
      specialty: "Hot chocolate served in a cup with choice of chocolate callets",
      founded: "Early 1900s",
      atmosphere: "Cozy, traditional setting in a historic building"
    },
    openingHours: "10:00 AM - 6:00 PM, Closed on Wednesdays",
    price: "€€",
    websiteUrl: "https://www.oldchocolatehouse.be/"
  },
  {
    id: 10,
    name: "Rozenhoedkaai",
    description: "One of the most photographed spots in Bruges, where the Dijver and Groenerei canals meet.",
    type: "photospot",
    address: "Rozenhoedkaai, 8000 Brugge",
    latitude: "51.2081",
    longitude: "3.2272",
    budget: "budget",
    imageUrl: "https://images.unsplash.com/photo-1563224370-29c5c902f154?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Photography", "Architecture", "Nature"],
    details: {
      bestTime: "Sunset or early morning for best lighting",
      feature: "Historic buildings and canal view with Belfry in the background"
    },
    openingHours: "Open 24 hours",
    price: "Free",
    websiteUrl: "https://visitbruges.be/rozenhoedkaai"
  },
  {
    id: 11,
    name: "Den Dyver",
    description: "Upscale restaurant offering traditional Belgian cuisine with beer pairing for each course.",
    type: "restaurant",
    address: "Dijver 5, 8000 Brugge",
    latitude: "51.2057",
    longitude: "3.2260",
    budget: "luxury",
    imageUrl: "https://images.unsplash.com/photo-1553443175-e1ce8896d8b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Food", "Luxury"],
    details: {
      cuisine: "Belgian, Modern European",
      specialty: "Beer pairing menu",
      atmosphere: "Elegant dining in historic building"
    },
    openingHours: "6:30 PM - 10:30 PM, Closed on Sundays and Mondays",
    price: "€€€",
    websiteUrl: "https://www.dyver.be/en/"
  },
  {
    id: 12,
    name: "Bistro Bruges",
    description: "Charming bistro offering traditional Belgian cuisine including waterzooi and fresh seafood.",
    type: "restaurant",
    address: "Sint-Amandsstraat 27, 8000 Brugge",
    latitude: "51.2096",
    longitude: "3.2211",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Food", "Local Cuisine"],
    details: {
      cuisine: "Belgian, Seafood",
      specialty: "Waterzooi (traditional chicken stew)",
      atmosphere: "Cozy, rustic interior"
    },
    openingHours: "12:00 PM - 2:30 PM, 6:00 PM - 10:00 PM",
    price: "€€",
    websiteUrl: "https://bistrobruges.be"
  },
  {
    id: 13,
    name: "Bruges Lace Center",
    description: "Traditional lace shop showcasing the art of handmade Bruges lace with demonstrations.",
    type: "shopping",
    address: "Peperstraat 3A, 8000 Brugge",
    latitude: "51.2072",
    longitude: "3.2285",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1571388208497-71bedc66e932?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Shopping", "Culture", "History"],
    details: {
      founded: "1970",
      products: "Handmade lace, demonstrations, workshops",
      significance: "Preserving traditional Bruges lace-making techniques"
    },
    openingHours: "10:00 AM - 5:00 PM, Closed on Sundays",
    price: "Free entry, lace products vary in price",
    websiteUrl: "https://www.kantcentrum.eu/en"
  },
  {
    id: 14,
    name: "Dumon Chocolatier",
    description: "Artisanal chocolate shop creating handmade Belgian chocolates using traditional methods.",
    type: "shopping",
    address: "Eiermarkt 6, 8000 Brugge",
    latitude: "51.2094",
    longitude: "3.2240",
    budget: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Shopping", "Food"],
    details: {
      established: "1992",
      specialty: "Handmade pralines and truffles",
      atmosphere: "Small, traditional chocolate shop"
    },
    openingHours: "10:00 AM - 6:00 PM",
    price: "€€",
    websiteUrl: "https://www.dumonchocolatier.be/"
  },
  {
    id: 15,
    name: "Astridpark",
    description: "Beautiful park in the city center featuring a scenic lake, fountains, and lush gardens.",
    type: "nature",
    address: "Minnewaterpark, 8000 Brugge",
    latitude: "51.1976",
    longitude: "3.2164",
    budget: "budget",
    imageUrl: "https://images.unsplash.com/photo-1565165039888-25b6f892f420?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    tags: ["Nature", "Relaxation"],
    details: {
      features: ["Lake", "Gardens", "Walking paths", "Playground"],
      size: "Approximately 3 hectares"
    },
    openingHours: "Open 24 hours",
    price: "Free",
    websiteUrl: "https://visitbruges.be/parks"
  }
];

// Sample Bruges events data
export const brugesEvents: Event[] = [
  {
    id: 1,
    name: "Bruges Beer Festival",
    description: "Annual beer festival featuring over 400 Belgian beers from more than 80 breweries.",
    startDate: new Date("2024-02-03T10:00:00"),
    endDate: new Date("2024-02-04T18:00:00"),
    address: "Beurshal, Hauwerstraat 3, 8000 Brugge",
    latitude: "51.2104",
    longitude: "3.2256",
    imageUrl: "https://images.unsplash.com/photo-1577743401035-5a68513ea365?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    price: "€5 entry, tasting tokens extra",
    websiteUrl: "https://www.brugsbierfestival.be/en"
  },
  {
    id: 2,
    name: "Procession of the Holy Blood",
    description: "Religious procession dating back to the Middle Ages, featuring historical and biblical scenes.",
    startDate: new Date("2024-05-09T09:30:00"),
    endDate: new Date("2024-05-09T12:00:00"),
    address: "Throughout Bruges city center",
    latitude: "51.2093",
    longitude: "3.2247",
    imageUrl: "https://images.unsplash.com/photo-1581372085567-515ef33447ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    price: "Free to watch",
    websiteUrl: "https://www.holyblood.com/en/procession"
  },
  {
    id: 3,
    name: "Bruges Christmas Market",
    description: "Magical Christmas market with stalls, ice skating, and festive decorations throughout the city center.",
    startDate: new Date("2024-11-22T10:00:00"),
    endDate: new Date("2025-01-05T21:00:00"),
    address: "Markt and Simon Stevinplein, 8000 Brugge",
    latitude: "51.2088",
    longitude: "3.2246",
    imageUrl: "https://images.unsplash.com/photo-1544923408-75c5cef46f14?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    price: "Free entry, activities may have costs",
    websiteUrl: "https://www.visitbruges.be/christmas-market"
  },
  {
    id: 4,
    name: "Bruges Triennial",
    description: "Contemporary art and architecture exhibition across the city, taking place every three years.",
    startDate: new Date("2024-04-20T10:00:00"),
    endDate: new Date("2024-09-22T18:00:00"),
    address: "Various locations throughout Bruges",
    latitude: "51.2093",
    longitude: "3.2247",
    imageUrl: "https://images.unsplash.com/photo-1575223970966-76ae61cdeca9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    price: "Free for outdoor installations, some exhibitions €14",
    websiteUrl: "https://www.triennalebrugge.be/en"
  },
  {
    id: 5,
    name: "Bruges Jazz Festival",
    description: "Annual jazz festival featuring international and local jazz musicians at venues across the city.",
    startDate: new Date("2024-08-10T19:00:00"),
    endDate: new Date("2024-08-16T23:00:00"),
    address: "Various venues in Bruges",
    latitude: "51.2093",
    longitude: "3.2247",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
    price: "Varies by concert, some free events",
    websiteUrl: "https://www.jazzbrugge.be"
  }
];
