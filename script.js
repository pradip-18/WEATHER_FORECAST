document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const locationInput = document.getElementById('locationInput');
    const weatherDisplay = document.getElementById('weatherDisplay');

    searchBtn.addEventListener('click', handleSearch);
    locationInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const location = locationInput.value.trim();

        if (location !== '') {
            toggleLoading(true);
            fetchWeatherData(location)
                .then(data => {
                    toggleLoading(false);
                    displayWeather(data.current);
                    displayForecast(data.forecast);
                })
                .catch(error => {
                    toggleLoading(false);
                    console.log('Error fetching weather data:', error);
                    weatherDisplay.innerHTML = '<p>Error: Weather data unavailable</p>';
                });
        }
    }

    function fetchWeatherData(location) {
        const apiKey = '5a52b253fb0840c9b85193239232807'; // Replace this with your actual API key
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5`;

        return fetch(apiUrl).then(response => response.json());
    }

    function displayWeather(currentWeather) {
        const weatherDisplay = document.getElementById('weatherDisplay');

        // Check if 'currentWeather' object exists and contains the 'condition' property
        if (currentWeather && currentWeather.condition) {
            const weatherIconUrl = `https:${currentWeather.condition.icon}`; // Use the icon URL provided by the API
            const weatherIconAlt = currentWeather.condition.text; // Use the weather condition text as alt attribute
    
            weatherDisplay.innerHTML = `
                <h2>${currentWeather.condition.text}</h2>
                <img src="${currentWeather.condition.icon}" alt="${currentWeather.condition.text}">
                <p>Temperature: ${currentWeather.temp_c}°C</p>
                <p>Humidity: ${currentWeather.humidity}%</p>
                <p>Wind: ${currentWeather.wind_kph} km/h</p>
            `;
        } else {
            // Display an error message if the required data is missing or undefined
            weatherDisplay.innerHTML = '<p>Error: Weather data unavailable</p>';
        }
    }

    function displayForecast(forecast) {
        const forecastList = document.getElementById('forecastList');
        forecastList.innerHTML = '';

        forecast.forecastday.forEach(day => {
            const date = new Date(day.date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

            const forecastItem = document.createElement('li');
            forecastItem.innerHTML = `
                <h3>${dayOfWeek}</h3>
                <p>Max Temp: ${day.day.maxtemp_c}°C</p>
                <p>Min Temp: ${day.day.mintemp_c}°C</p>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            `;

            forecastList.appendChild(forecastItem);
        });
    }

    function toggleLoading(showLoading) {
        if (showLoading) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Loading...';
            searchBtn.disabled = true;
        } else {
            searchBtn.innerHTML = 'Search';
            searchBtn.disabled = false;
        }
    }
});
