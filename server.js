require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq();

// Routes for Google Maps API proxy
app.get('/api/places/nearby', async (req, res) => {
    try {
        const { lat, lng, type } = req.query;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: 1000,
                type: type,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        res.status(500).json({ error: 'Failed to fetch nearby places' });
    }
});

app.get('/api/places/details', async (req, res) => {
    try {
        const { placeId } = req.query;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
            params: {
                place_id: placeId,
                fields: 'name,formatted_address,photos,url,website,opening_hours,formatted_phone_number,review',
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching place details:', error);
        res.status(500).json({ error: 'Failed to fetch place details' });
    }
});

app.post('/api/generate-plan', async (req, res) => {
    try {
        const { duration, interests, preferences } = req.body;

        const prompt = `Create a detailed ${duration}-day travel itinerary for Bruges, Belgium. 
        Interests: ${interests.join(', ')}
        Preferences: ${preferences}
        
        Please provide a day-by-day itinerary including:
        - Morning, afternoon, and evening activities
        - Specific landmarks and attractions in Bruges
        - Recommended local restaurants and cafes
        - Estimated time for each activity
        - Walking directions between locations
        - Local tips and cultural insights
        
        Focus on creating an authentic experience that matches the visitor's interests.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "assistant",
                    content: "I am a knowledgeable travel guide specialized in Bruges, Belgium."
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
        res.json({ itinerary });

    } catch (error) {
        console.error('Error generating travel plan:', error);
        res.status(500).json({ error: 'Failed to generate travel plan' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 