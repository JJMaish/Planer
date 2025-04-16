require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { Groq } = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Bruges attractions and information database
const brugesData = {
    attractions: {
        historical: [
            { name: "Belfry Tower", duration: "1 hour", cost: "€14", accessibility: true },
            { name: "Basilica of the Holy Blood", duration: "30 mins", cost: "Free", accessibility: true },
            { name: "Church of Our Lady", duration: "1 hour", cost: "€7", accessibility: true },
            { name: "Burg Square", duration: "30 mins", cost: "Free", accessibility: true }
        ],
        cultural: [
            { name: "Groeningemuseum", duration: "2 hours", cost: "€14", accessibility: true },
            { name: "Choco-Story Museum", duration: "1.5 hours", cost: "€11", accessibility: true },
            { name: "Bruges Beer Museum", duration: "1.5 hours", cost: "€16", accessibility: true }
        ],
        outdoor: [
            { name: "Minnewater Lake", duration: "1 hour", cost: "Free", accessibility: true },
            { name: "Canal Tour", duration: "30 mins", cost: "€12", accessibility: true },
            { name: "Begijnhof", duration: "1 hour", cost: "Free", accessibility: true }
        ]
    },
    restaurants: {
        traditional: [
            { name: "De Halve Maan Brewery", type: "Belgian", cost: "€€", accessibility: true },
            { name: "Cambrinus", type: "Belgian Beer Restaurant", cost: "€€", accessibility: true }
        ],
        casual: [
            { name: "That's Toast", type: "Breakfast/Lunch", cost: "€", accessibility: true },
            { name: "Books & Brunch", type: "Café", cost: "€", accessibility: true }
        ]
    }
};

// Weather API route
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await axios.get(`${process.env.WEATHER_API_ENDPOINT}`, {
            params: {
                lat,
                lon,
                appid: process.env.WEATHER_API_KEY,
                units: 'metric'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Generate itinerary endpoint
app.post('/api/generate-itinerary', async (req, res) => {
    try {
        const { duration, interests, pace, preferences, specialRequests } = req.body;

        // Create a prompt based on user preferences
        const prompt = `Create a detailed ${duration}-day travel itinerary for Bruges, Belgium.

User Preferences:
- Interests: ${interests.join(', ')}
- Pace: ${pace}
- Special Requirements: ${preferences.join(', ')}
${specialRequests ? `- Additional Requests: ${specialRequests}` : ''}

Please create a detailed day-by-day itinerary that includes:
1. Morning, afternoon, and evening activities
2. Specific landmarks and attractions in Bruges
3. Recommended restaurants and cafes
4. Walking distances and directions between locations
5. Estimated costs and duration for each activity
6. Opening hours and best times to visit
7. Local tips and cultural insights

Consider these Bruges-specific details:
${JSON.stringify(brugesData, null, 2)}

Format the response in a clear, structured way with emojis for better readability.`;

        // Generate response using Groq
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a knowledgeable local guide in Bruges, Belgium, with expertise in creating personalized travel itineraries."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 4096,
        });

        const itinerary = completion.choices[0]?.message?.content;

        // Send the formatted response
        res.json({
            success: true,
            itinerary: itinerary
        });

    } catch (error) {
        console.error('Error generating itinerary:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate itinerary'
        });
    }
});

// Places endpoint
app.get('/api/places', (req, res) => {
    try {
        const places = Object.entries(brugesData.attractions).flatMap(([category, items]) => 
            items.map(item => ({
                id: item.name.toLowerCase().replace(/\s+/g, '-'),
                name: item.name,
                description: `A ${category} attraction in Bruges`,
                type: category,
                distance: 'Within walking distance',
                location: {
                    lat: 51.2093 + (Math.random() - 0.5) * 0.01,
                    lng: 3.2247 + (Math.random() - 0.5) * 0.01
                },
                duration: item.duration,
                cost: item.cost,
                accessibility: item.accessibility
            }))
        );
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 