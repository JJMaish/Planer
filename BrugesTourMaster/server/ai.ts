import fetch from 'node-fetch';
import { TripPlannerData } from '@shared/schema';
import { Location, Event } from '@shared/schema';

// Interface for the generated itinerary structure
export interface GeneratedItinerary {
  days: {
    day: number;
    activities: {
      id: number;
      name: string;
      description: string;
      type: string;
      address: string;
      time: string;
      tags: string[];
      price?: string;
      imageUrl: string;
    }[];
  }[];
  description: string;
}

/**
 * Generate a personalized itinerary using Groq API based on user preferences
 */
export async function generateItinerary(
  tripData: TripPlannerData,
  locations: Location[],
  events: Event[]
): Promise<GeneratedItinerary> {
  try {
    // Validate if API key exists
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set in environment variables');
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    
    console.log(`Generating ${tripData.duration}-day itinerary with Groq API...`);
    
    // For debugging: create a mock itinerary for quick testing
    // This will simulate the AI response without making API calls
    console.log('Creating a mock itinerary for testing purposes');
    
    // Build a sample itinerary based on user preferences
    const days = parseInt(tripData.duration);
    const generatedItinerary: GeneratedItinerary = {
      days: [],
      description: `Your personalized ${days}-day ${tripData.budget} itinerary focused on ${tripData.interests.join(", ")}.`
    };
    
    // Filter locations based on user interests
    const matchingLocations = locations.filter(location => 
      location.tags.some(tag => tripData.interests.includes(tag))
    );
    
    // Additional filter by budget
    const budgetLocations = matchingLocations.filter(location => {
      if (tripData.budget === "budget") {
        return location.budget === "budget";
      } else if (tripData.budget === "moderate") {
        return location.budget === "budget" || location.budget === "moderate";
      } else {
        return true; // Luxury includes all
      }
    });
    
    // Create daily activities
    for (let day = 1; day <= days; day++) {
      const dayActivities = [];
      
      // Add 3-4 activities per day from matching locations
      const dailyLocations = budgetLocations.slice((day - 1) * 4, day * 4);
      
      for (let i = 0; i < dailyLocations.length; i++) {
        const location = dailyLocations[i];
        dayActivities.push({
          id: location.id,
          name: location.name,
          description: location.description,
          type: location.type,
          address: location.address,
          time: getActivityTime(i),
          tags: location.tags,
          price: location.price || undefined,
          imageUrl: location.imageUrl
        });
      }
      
      // Add any matching tours if requested
      if (day === 1 && tripData.tours.length > 0) {
        for (const tour of tripData.tours) {
          if (tour === "canal") {
            dayActivities.push({
              id: 9999,
              name: "Canal Tour",
              description: "Experience Bruges from the water with a 30-minute boat tour along the picturesque canals.",
              type: "tour",
              address: "Multiple embarkation points in city center",
              time: "11:00 AM",
              tags: ["Water", "Sightseeing"],
              price: "€10 per person",
              imageUrl: "https://images.unsplash.com/photo-1555990730-5d0e82197937?auto=format&fit=crop&w=500&h=300&q=80"
            });
          } else if (tour === "carriage") {
            dayActivities.push({
              id: 9998,
              name: "Carriage Tour",
              description: "Discover Bruges in style with a traditional horse-drawn carriage tour.",
              type: "tour",
              address: "Markt Square",
              time: "2:00 PM",
              tags: ["Traditional", "Sightseeing"],
              price: "€50 per carriage",
              imageUrl: "https://images.unsplash.com/photo-1528728577305-c1decce21f6a?auto=format&fit=crop&w=500&h=300&q=80"
            });
          } else if (tour === "walking") {
            dayActivities.push({
              id: 9997,
              name: "Walking Tour",
              description: "Explore the hidden corners of Bruges with a knowledgeable local guide.",
              type: "tour",
              address: "Grote Markt",
              time: "10:00 AM",
              tags: ["Walking", "History"],
              price: "€15 per person",
              imageUrl: "https://images.unsplash.com/photo-1553532434-5ab5b6b84993?auto=format&fit=crop&w=500&h=300&q=80"
            });
          }
        }
      }
      
      generatedItinerary.days.push({
        day: day,
        activities: dayActivities
      });
    }
    
    console.log(`Generated itinerary with ${generatedItinerary.days.length} days`);
    return generatedItinerary;
    
    /******************
     * Uncomment the code below to use the actual Groq API when ready
     * and remove the mock itinerary generation above
     ******************/
    
    /*
    // Prepare context data for the AI
    const locationsContext = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      description: loc.description,
      budget: loc.budget,
      address: loc.address,
      tags: loc.tags
    }));

    const eventsContext = events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      address: event.address
    }));

    // Create the prompt for Groq
    const prompt = `
    As a Bruges travel expert, create a personalized ${tripData.duration}-day itinerary for a visitor 
    with the following preferences:
    
    - Interests: ${tripData.interests.join(', ')}
    - Budget: ${tripData.budget}
    - Preferred tours: ${tripData.tours.length > 0 ? tripData.tours.join(', ') : 'None specified'}
    - Additional information: ${tripData.additionalInfo || 'None provided'}
    
    Based on these preferences, select appropriate attractions, restaurants, and activities from the following options:
    
    LOCATIONS:
    ${JSON.stringify(locationsContext, null, 2)}
    
    EVENTS:
    ${JSON.stringify(eventsContext, null, 2)}
    
    Create a detailed day-by-day itinerary with specific times for each activity. Each day should include:
    - Morning activities (breakfast, attractions)
    - Lunch recommendations
    - Afternoon activities
    - Dinner recommendations
    - Evening activities if appropriate
    
    The itinerary should match the specified budget level (${tripData.budget}) and prioritize the user's stated interests.
    Include a mix of the most iconic Bruges attractions as well as some hidden gems based on their preferences.
    
    For the response format, provide a structured JSON object with this exact format:
    {
      "days": [
        {
          "day": 1,
          "activities": [
            {
              "id": 123,
              "name": "Activity Name",
              "description": "Brief description of the activity",
              "type": "attraction/restaurant/event/etc",
              "address": "Address of the location",
              "time": "9:00 AM",
              "tags": ["Historical", "Cultural"],
              "price": "€10 per person",
              "imageUrl": "https://example.com/image.jpg"
            }
          ]
        }
      ],
      "description": "A brief overview of the complete itinerary"
    }
    
    Use realistic timings, allowing for travel between locations. Include only activities that match well with the user's preferences.
    `;

    console.log('Sending request to Groq API...');
    const requestBody = {
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert specialized in creating personalized travel itineraries for Bruges, Belgium.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    };
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error response:', errorData);
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    const generatedContent = data.choices[0].message.content;
    
    // Extract the JSON part from the response
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }
    
    const jsonString = jsonMatch[0];
    const itinerary = JSON.parse(jsonString) as GeneratedItinerary;
    
    return itinerary;
    */
    
  } catch (error) {
    console.error('Error generating itinerary:', error);
    // Return a fallback itinerary with an error message
    return {
      days: [{
        day: 1,
        activities: [{
          id: 0,
          name: "Error Generating Itinerary",
          description: "There was an error connecting to the AI service. Please try again later.",
          type: "error",
          address: "",
          time: "",
          tags: [],
          imageUrl: ""
        }]
      }],
      description: "Failed to generate itinerary due to an error. Please try again."
    };
  }
}

// Helper function to assign time slots based on activity order
function getActivityTime(activityIndex: number): string {
  switch (activityIndex) {
    case 0:
      return "9:00 AM";
    case 1:
      return "11:30 AM";
    case 2:
      return "2:00 PM";
    case 3:
      return "4:30 PM";
    default:
      return "12:00 PM";
  }
}