import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tripPlannerSchema, locationTypes } from "@shared/schema";
import { z } from "zod";
import { generateItinerary } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all locations
  app.get("/api/locations", async (req: Request, res: Response) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });
  
  // Get locations by type
  app.get("/api/locations/type/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      if (!locationTypes.includes(type as any)) {
        return res.status(400).json({ message: "Invalid location type" });
      }
      
      const locations = await storage.getLocationsByType(type);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations by type" });
    }
  });
  
  // Get location by ID
  app.get("/api/locations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      
      const location = await storage.getLocationById(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });
  
  // Get all events
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  
  // Get events by date range
  app.get("/api/events/date-range", async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const events = await storage.getEventsByDateRange(start, end);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by date range" });
    }
  });
  
  // Get event by ID
  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  // Create a personalized itinerary using Groq AI
  app.post("/api/itineraries", async (req: Request, res: Response) => {
    try {
      // Parse and validate input data
      const tripData = tripPlannerSchema.parse(req.body);
      
      // Convert duration to number of days
      const days = parseInt(tripData.duration);
      
      console.log(`Generating ${days}-day itinerary with interests: ${tripData.interests.join(', ')}`);
      
      // Get all locations and events to provide to the AI
      const locations = await storage.getLocations();
      const events = await storage.getEvents();
      
      // Use Groq AI to generate a personalized itinerary
      const generatedItinerary = await generateItinerary(tripData, locations, events);
      
      console.log(`AI generated itinerary with ${generatedItinerary.days.length} days`);
      
      // Create and save the itinerary
      const newItinerary = await storage.createItinerary({
        days,
        interests: tripData.interests,
        budget: tripData.budget,
        tours: tripData.tours || [],
        additionalInfo: tripData.additionalInfo,
        generatedItinerary
      });
      
      res.json(newItinerary);
    } catch (error) {
      console.error('Error creating itinerary:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create itinerary" });
    }
  });
  
  // Get itinerary by ID
  app.get("/api/itineraries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }
      
      const itinerary = await storage.getItineraryById(id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      res.json(itinerary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to assign time slots based on activity order
function getActivityTime(activityIndex: number): string {
  switch (activityIndex) {
    case 0:
      return "9:00 AM - 11:00 AM";
    case 1:
      return "11:30 AM - 1:30 PM";
    case 2:
      return "2:00 PM - 4:00 PM";
    case 3:
      return "4:30 PM - 6:30 PM";
    default:
      return "12:00 PM - 2:00 PM";
  }
}
