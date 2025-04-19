import { 
  Location, InsertLocation, 
  Event, InsertEvent, 
  Itinerary, InsertItinerary,
  User, InsertUser,
  users, locations, events, itineraries,
  JSONValue
} from "@shared/schema";
import { db } from "./db";
import { eq, between } from "drizzle-orm";
import { brugesLocations, brugesEvents } from "../client/src/data/bruges-data";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location methods
  getLocations(): Promise<Location[]>;
  getLocationsByType(type: string): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Itinerary methods
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  getItineraryById(id: number): Promise<Itinerary | undefined>;

  // Database setup
  initializeWithSampleData(): Promise<void>;
  isInitialized(): Promise<boolean>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Location methods
  async getLocations(): Promise<Location[]> {
    return db.select().from(locations);
  }
  
  async getLocationsByType(type: string): Promise<Location[]> {
    return db.select().from(locations).where(eq(locations.type, type));
  }
  
  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }
  
  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(insertLocation).returning();
    return location;
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return db.select().from(events);
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return db.select().from(events).where(
      between(events.startDate, startDate, endDate)
    );
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }
  
  // Itinerary methods
  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const [itinerary] = await db.insert(itineraries).values(insertItinerary).returning();
    return itinerary;
  }
  
  async getItineraryById(id: number): Promise<Itinerary | undefined> {
    const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.id, id));
    return itinerary;
  }

  // Check if the database has been initialized with sample data
  async isInitialized(): Promise<boolean> {
    const [count] = await db.select({ count: locations.id }).from(locations);
    return count && count.count > 0;
  }

  // Initialize the database with sample data
  async initializeWithSampleData(): Promise<void> {
    // Check if already initialized
    const initialized = await this.isInitialized();
    if (initialized) {
      console.log('Database already initialized with sample data');
      return;
    }

    console.log('Initializing database with sample data...');

    // Add sample locations
    for (const location of brugesLocations) {
      // Clean up the data to match our schema
      const locationData = { 
        name: location.name,
        description: location.description,
        type: location.type,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        budget: location.budget,
        imageUrl: location.imageUrl,
        tags: location.tags,
        // Convert details to a valid JSON value if it exists
        details: location.details as JSONValue,
        openingHours: location.openingHours || null,
        price: location.price || null,
        websiteUrl: location.websiteUrl || null
      };
      await this.createLocation(locationData);
    }
    
    // Add sample events
    for (const event of brugesEvents) {
      // Clean up the data to match our schema
      const eventData = {
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        imageUrl: event.imageUrl,
        price: event.price || null,
        websiteUrl: event.websiteUrl || null
      };
      await this.createEvent(eventData);
    }

    console.log('Database initialized with sample data!');
  }
}

export const storage = new DatabaseStorage();