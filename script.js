const apiKey = '36c7f69aa97a9b8bc5a505bf5a719719'; // Replace with your OpenWeather API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecast = document.getElementById('forecast');
const forecastList = document.getElementById('forecastList');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    fetchForecastData(city);
  }
});

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    alert(error.message);
  }
}

async function fetchForecastData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    displayForecastData(data);
  } catch (error) {
    console.error(error.message);
  }
}

function displayWeatherData(data) {
  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  description.textContent = `Weather: ${data.weather[0].description}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  weatherResult.classList.remove('hidden');
}

function displayForecastData(data) {
  forecastList.innerHTML = '';
  const forecastItems = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

  forecastItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${new Date(item.dt_txt).toLocaleDateString()}: ${item.main.temp}°C, ${item.weather[0].description}`;
    forecastList.appendChild(li);
  });

  forecast.classList.remove('hidden');
}
