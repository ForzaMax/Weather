const feelsLikeTemperatureNode = document.querySelector(
  ".weather-temperature-feelslike-value"
);
const weatherTemperatureNode = document.querySelector(
  ".weather-temperature-value"
);
const sunriseTimeNode = document.querySelector(".sunrise-time");
const sunsetTimeNode = document.querySelector(".sunset-time");
const weatherConditionNode = document.querySelector(".weather-condition-text");
const weatherConditionImageNode = document.querySelector(
  ".weather-condition-image"
);
const humidityNode = document.querySelector(".weather-humidity-value");
const pressureNode = document.querySelector(".weather-pressure-value");
const windSpeedNode = document.querySelector(".weather-wind-value");
const uvNode = document.querySelector(".weather-uv-value");
const timeNode = document.querySelector(".time__time");
const dateNode = document.querySelector(".time__date");
const cityNode = document.querySelector(".time__city");
const currentlocationNode = document.querySelector(".location");
const weatherHourlyNode = document.querySelectorAll(".weather__hourly-time");
const weatherHourlyTemperatureNode = document.querySelectorAll(
  ".weather__hourly-temp"
);
const weatherHourlyIconNode = document.querySelectorAll(
  ".weather__hourly-icon"
);
const weatherHourlyArrowNode = document.querySelectorAll(
  ".weather__hourly-arrow"
);
const weatherHourlyWindNode = document.querySelectorAll(
  ".weather__hourly-windspeed"
);

const weatherHourlyWindDirectionNode = document.querySelectorAll(
  ".weather__hourly-arrow"
);

const weatherFiveDaysIconNode = document.querySelectorAll(
  ".weather__fivedays-icon"
);

const weatherFiveDaysTempNode = document.querySelectorAll(
  ".weather__fivedays-card-temp"
);

const weatherFiveDaysDayNode = document.querySelectorAll(
  ".weather__fivedays-card-day"
);

const searchInputNode = document.querySelector(".search__input");

const API_KEY = "6395f05bb41e3806b588cbe36a5907e9";
const API_KEY_IPIFY = "at_gzBTSbas4QvOJlf1M45VivQB30YG3";

async function fetchWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Current Weather Data:", data);
    renderWeatherBlock(data);
    renderTimeBlock(data);
    renderWeatherHourlyBlock(data);
    renderFiveDaysBlock(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderWeatherBlock(data) {
  // Преобразовываю температуру
  const temperatureInCelsius = (data.main.temp - 273.15).toFixed(0);
  const feelsLikeInCelsius = (data.main.feels_like - 273.15).toFixed(0);

  weatherTemperatureNode.textContent = `${temperatureInCelsius}°C`;
  feelsLikeTemperatureNode.textContent = `${feelsLikeInCelsius}°C`;

  // Преобразовываю закаты/рассветы
  const sunriseTimestamp = data.sys.sunrise;
  const sunriseDate = new Date(sunriseTimestamp * 1000);
  const formattedSunriseTime = sunriseDate.toTimeString();
  sunriseTimeNode.textContent = formattedSunriseTime
    .split(" ")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  const sunsetTimestamp = data.sys.sunset;
  const sunsetDate = new Date(sunsetTimestamp * 1000);
  const formattedSunsetTime = sunsetDate.toTimeString();

  sunsetTimeNode.textContent = formattedSunsetTime
    .split(" ")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  // Преобразовываю состояние погоды
  const weatherCondition = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  weatherConditionImageNode.setAttribute("src", iconUrl);
  weatherConditionNode.textContent =
    weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1);

  // Преобразовываю экстра состояния погоды
  humidityNode.textContent = `${data.main.humidity}%`;
  pressureNode.textContent = `${data.main.pressure} hPa`;
  windSpeedNode.textContent = `${Math.round(data.wind.speed)} m/s`;
  uvNode.textContent = `${data.visibility}`;
}

function renderTimeBlock(data) {
  // Преобразовываю город
  cityNode.textContent = data.name;

  // Преобразовываю время
  const time = new Date(data.dt * 1000);
  console.log(time);
  const formattedTime = time.toTimeString();
  console.log(formattedTime);

  timeNode.textContent = formattedTime
    .split(" ")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  // Преобразовываю дату
  const date = new Date(data.dt * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  dateNode.textContent = formattedDate;
}

async function renderWeatherHourlyBlock(data) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    let data = await response.json();
    data = data.list.slice(0, 5);
    console.log(data);

    weatherHourlyNode.forEach((node, index) => {
      const time = data[index].dt_txt
        .split(" ")[1]
        .split(":")
        .slice(0, 2)
        .join(":");
      node.textContent = time;
    });

    weatherHourlyTemperatureNode.forEach((node, index) => {
      const temperatureInCelsius = (data[index].main.temp - 273.15).toFixed(0);
      node.textContent = `${temperatureInCelsius}°C`;
    });

    weatherHourlyIconNode.forEach((node, index) => {
      const iconCode = data[index].weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      node.setAttribute("src", iconUrl);
    });

    weatherHourlyWindNode.forEach((node, index) => {
      const windSpeed = Math.round(data[index].wind.speed);
      node.textContent = `${windSpeed} m/s`;
    });

    weatherHourlyWindDirectionNode.forEach((node, index) => {
      const windDirection = data[index].wind.deg;
      node.style.transform = `rotate(${windDirection}deg)`;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function renderFiveDaysBlock(data) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${API_KEY}`;
  // 7 15 23 31 39

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    console.log(data.list);
    console.log(weatherFiveDaysDayNode);
    console.log(data.list[0].dt);
    console.log(data.list[0].dt * 1000);

    weatherFiveDaysDayNode.forEach((node, index) => {
      let dataIndex = (index + 1) * 8 - 1;
      if (dataIndex > data.list.length) {
        dataIndex = data.list.length - 1;
      }
      const date = new Date(data.list[dataIndex].dt * 1000);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      node.textContent = formattedDate;
    });

    weatherFiveDaysTempNode.forEach((node, index) => {
      let dataIndex = (index + 1) * 8 - 1;
      if (dataIndex > data.list.length) {
        dataIndex = data.list.length - 1;
      }
      const temperatureInCelsius = (
        data.list[dataIndex].main.temp - 273.15
      ).toFixed(0);
      node.textContent = `${temperatureInCelsius}°C`;
    });

    weatherFiveDaysIconNode.forEach((node, index) => {
      let dataIndex = (index + 1) * 8 - 1;
      if (dataIndex > data.list.length) {
        dataIndex = data.list.length - 1;
      }
      const iconCode = data.list[dataIndex].weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      node.setAttribute("src", iconUrl);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchWeatherByCityName(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    fetchWeather(data.coord.lat, data.coord.lon);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getLocationByIP() {
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY_IPIFY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // const country = data.location.country;
    // const city = data.location.city;
    console.log(data);
    console.log(data.location.lat);
    console.log(data.location.lng);

    fetchWeather(data.location.lat, data.location.lng);
  } catch (error) {
    console.error("Error:", error);
  }
}

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
  },
  (error) => {
    console.error(error);
    getLocationByIP();
  }
);

currentlocationNode.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
  });
});

searchInputNode.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const city = searchInputNode.value.toLowerCase();
    fetchWeatherByCityName(city);
    searchInputNode.value = "";
  }
});
