const apiKey = '28b04b947e47e92ff852f0b2e6abc4b0'; // Your OpenWeather API key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const loadingIndicator = document.getElementById('loading');
const weatherDetails = document.getElementById('weatherDetails');
const forecastItems = document.getElementById('forecastItems');

// On page load, get the user's current location
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoordinates(lat, lon);
    }, (error) => {
      alert('Geolocation error: ' + error.message);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
};

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  loadingIndicator.style.display = 'block';
  weatherDetails.style.display = 'none';
  forecastItems.innerHTML = '';

  try {
    const currentWeather = await fetchWeatherData(city);
    const forecast = await fetchForecastData(city);

    displayWeather(currentWeather);
    displayForecast(forecast);
    changeBackgroundBasedOnWeather(currentWeather.weather[0].description);
  } catch (error) {
    alert('Error fetching data: ' + error.message);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

async function getWeatherByCoordinates(lat, lon) {
  loadingIndicator.style.display = 'block';
  weatherDetails.style.display = 'none';
  forecastItems.innerHTML = '';

  try {
    const currentWeather = await fetchWeatherDataByCoordinates(lat, lon);
    const forecast = await fetchForecastDataByCoordinates(lat, lon);

    displayWeather(currentWeather);
    displayForecast(forecast);
    changeBackgroundBasedOnWeather(currentWeather.weather[0].description);
  } catch (error) {
    alert('Error fetching data: ' + error.message);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

async function fetchWeatherData(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
  if (!response.ok) {
    throw new Error('City not found');
  }
  return await response.json();
}

async function fetchForecastData(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${apiKey}`);
  if (!response.ok) {
    throw new Error('Forecast data not found');
  }
  return await response.json();
}

async function fetchWeatherDataByCoordinates(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
  if (!response.ok) {
    throw new Error('Weather data not found');
  }
  return await response.json();
}

async function fetchForecastDataByCoordinates(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=5&appid=${apiKey}`);
  if (!response.ok) {
    throw new Error('Forecast data not found');
  }
  return await response.json();
}

function displayWeather(data) {
  document.getElementById('cityName').textContent = data.name;
  document.getElementById('currentTemp').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
  document.getElementById('description').textContent = `Weather: ${data.weather[0].description}`;
  weatherDetails.style.display = 'block';
}

function displayForecast(data) {
  data.list.forEach(item => {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecastItem');
    forecastItem.innerHTML = `
      <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
      <p>${item.main.temp}°C</p>
      <p>${item.weather[0].description}</p>
    `;
    forecastItems.appendChild(forecastItem);
  });
}

function changeBackgroundBasedOnWeather(weatherDescription) {
  if (weatherDescription.includes("clear")) {
    document.body.style.backgroundImage =
      "url('https://img.freepik.com/free-photo/blue-sky-with-clouds-reflected-water_1160-460.jpg')";
  } else if (weatherDescription.includes("cloud")) {
    document.body.style.backgroundImage =
      "url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cloudy_Sky_%2841158984%29.jpeg/1280px-Cloudy_Sky_%2841158984%29.jpeg')";
  } else if (weatherDescription.includes("rain")) {
    document.body.style.backgroundImage =
      "url('https://static.vecteezy.com/system/resources/previews/042/195/728/non_2x/ai-generated-rainy-sky-background-free-photo.jpg')";
  } else if (weatherDescription.includes("storm")) {
    document.body.style.backgroundImage =
      "url('https://img.freepik.com/premium-photo/dark-stormy-sky-with-lightning-stormy-sea-lightning-strike-sky-dark-clouds-bad-weather-before-big-storm-rain_924727-117.jpg')";
  } else {
    document.body.style.backgroundImage =
      "linear-gradient(to bottom, #87cefa, #f0f8ff)";
  }
}
