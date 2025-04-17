class RealTimeService {
    constructor() {
        this.weatherAPI = new WeatherAPI();
        this.venueAPI = new VenueAPI();
        this.transportAPI = new TransportAPI();
    }

    async getRealtimeUpdates() {
        return {
            weather: await this.weatherAPI.getForecast(),
            venues: await this.venueAPI.getStatus(),
            transport: await this.transportAPI.getDelays()
        };
    }
} 