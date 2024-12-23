document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    fetchWeatherData(city);
    fetch5DayForecast(city);
});

document.getElementById('currentLocationButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDataByLocation(lat, lon);
            fetch5DayForecastByLocation(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchWeatherData(city) {
    const apiKey = 'b6010bb2406b0f5e232bc93cada97f36'; // Your weather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            addRecentCity(city);
        })
        .catch(error => {
            document.getElementById('weatherOutput').innerText = 'Error fetching weather data.';
        });
}

function fetchWeatherDataByLocation(lat, lon) {
    const apiKey = 'b6010bb2406b0f5e232bc93cada97f36'; // Your weather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            document.getElementById('weatherOutput').innerText = 'Error fetching weather data.';
        });
}

function fetch5DayForecast(city) {
    const apiKey = 'b6010bb2406b0f5e232bc93cada97f36'; // Your weather API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            display5DayForecast(data);
        })
        .catch(error => {
            document.getElementById('forecastOutput').innerText = 'Error fetching forecast data.';
        });
}

function fetch5DayForecastByLocation(lat, lon) {
    const apiKey = 'b6010bb2406b0f5e232bc93cada97f36'; // Your weather API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            display5DayForecast(data);
        })
        .catch(error => {
            document.getElementById('forecastOutput').innerText = 'Error fetching forecast data.';
        });
}

function displayWeatherData(data) {
    const weatherOutput = document.getElementById('weatherOutput');
    weatherOutput.innerHTML = `
        <h2 class="text-2xl font-bold">${data.name}</h2>
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>${data.weather[0].description}</p>
    `;
}

function display5DayForecast(data) {
    const forecastOutput = document.getElementById('forecastOutput');
    forecastOutput.innerHTML = '<h3 class="text-xl font-bold">5-Day Forecast</h3>';

    const dailyData = data.list.filter((reading) => reading.dt_txt.includes("18:00:00"));

    dailyData.forEach((day) => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        forecastOutput.innerHTML += `
            <div class="forecast-day p-4 bg-white rounded-lg shadow-md">
                <p class="font-bold">${date}</p>
                <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                <p>Temp: ${Math.round(day.main.temp - 273.15)}°C</p>
                <p>Humidity: ${day.main.humidity}%</p>
                <p>Wind: ${day.wind.speed} m/s</p>
            </div>
        `;
    });
}

function addRecentCity(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
    displayRecentCities();
}

function displayRecentCities() {
    const recentCitiesDiv = document.getElementById('recentCities');
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCitiesDiv.innerHTML = `
        <h3 class="text-xl font-bold">Recently Searched Cities</h3>
        <ul class="list-disc list-inside">
            ${recentCities.map(city => `<li class="cursor-pointer" onclick="fetchWeatherData('${city}')">${city}</li>`).join('')}
        </ul>
    `;
}

// Initial display of recent cities
displayRecentCities();