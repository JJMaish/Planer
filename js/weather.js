document.addEventListener('DOMContentLoaded', function() {
    // Replace with your OpenWeatherMap API key
    const API_KEY = 'YOUR_API_KEY';
    
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherData(position.coords.latitude, position.coords.longitude);
        }, error => {
            console.error('Error getting location:', error);
            // Default to a specific city if location access is denied
            getWeatherData(51.5074, -0.1278); // London coordinates
        });
    }

    async function getWeatherData(lat, lon) {
        try {
            // Get current weather
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const currentData = await currentResponse.json();
            
            // Get 5-day forecast
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const forecastData = await forecastResponse.json();

            updateWeatherUI(currentData, forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    function updateWeatherUI(current, forecast) {
        // Update current weather
        document.getElementById('city').textContent = current.name;
        document.getElementById('temperature').textContent = Math.round(current.main.temp);
        document.getElementById('weather-description').textContent = current.weather[0].description;
        document.getElementById('humidity').textContent = current.main.humidity;
        document.getElementById('wind-speed').textContent = Math.round(current.wind.speed * 3.6); // Convert m/s to km/h
        
        // Update weather icon
        const weatherIcon = getWeatherIcon(current.weather[0].icon);
        document.getElementById('weather-icon').className = weatherIcon;

        // Update forecast
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';

        // Get one forecast per day (excluding today)
        const dailyForecasts = forecast.list.filter(item => {
            const date = new Date(item.dt * 1000);
            return date.getHours() === 12; // Get forecast for 12:00 PM each day
        }).slice(0, 5);

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="date">${dayName}</div>
                <i class="${getWeatherIcon(day.weather[0].icon)}"></i>
                <div class="temp">${Math.round(day.main.temp)}°C</div>
                <div class="description">${day.weather[0].description}</div>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    }

    function getWeatherIcon(code) {
        const icons = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        return icons[code] || 'fas fa-sun';
    }
}); 