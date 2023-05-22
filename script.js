const apiKey = "8651162ef7120e33aecd149d027c06d5";
const lat = "38.804661";
const lon = "-77.043610";
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
const recentSearch = JSON.parse(localStorage.getItem("recents") || "[]");
const apiKey2 = "8651162ef7120e33aecd149d027c06d5";
const lat2 = "38.804661";
const lon2 = "-77.043610";
const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat2}&lon=${lon2}&appid=${apiKey2}&units=imperial`;

function fetchCoords(search) {
  const apiCoordsUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  fetch(apiCoordsUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("new data",data[0].lat);
    let newLat = data[0].lat
    let newLon = data[0].lon
    const fetchCityUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${newLat}&lon=${newLon}&appid=${apiKey}&units=imperial`;
    fetchWeatherData(fetchCityUrl);
    fetchWeatherData2(fetchCityUrl);
  })
  .catch((error) => console.error(error));
}
// Display the current weather data on the page
function drawWeather(data) {
  console.log("drawWeather",data)
  // Check if data is valid before proceeding
  if (
    data &&
    data.list &&
    data.list[0] &&
    data.list[0].main &&
    data.list[0].main.temp
  ) {
    // Convert temperature from Kelvin to Fahrenheit
    var fahrenheit = Math.round(parseFloat(data.list[0].main.temp));

    const weatherIconURL = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
    const weatherIcon = `<img src="${weatherIconURL}" alt="${data.list[0].weather[0].description}"/>`;

    document.getElementById("location").innerHTML = data.city.name;
    document.getElementById("date").innerHTML = new Date(
      data.list[0].dt * 1000
    ).toLocaleDateString();
    document.getElementById("icon").innerHTML = weatherIcon;
    document.getElementById("temp").innerHTML = fahrenheit + "F" + "&deg;";
    document.getElementById("wind").innerHTML =
      "Wind: " + data.list[0].wind.speed + " mph";
    document.getElementById("humidity").innerHTML =
      "Humidity: " + data.list[0].main.humidity + "%";

    // Change the background image based on the weather conditions
    if (data.list[0].weather[0].description.indexOf("rain") > 0) {
      document.body.className = "rainy";
    } else if (data.list[0].weather[0].description.indexOf("cloud") > 0) {
      document.body.className = "cloudy";
    } else if (data.list[0].weather[0].description.indexOf("sunny") > 0) {
      document.body.className = "sunny";
    }
  } else {
    // Display an error message to the user if weather data is invalid
    console.error("Weather data is invalid:", data);
    document.getElementById("temp").innerHTML =
      "Unable to retrieve temperature data.";
  }
}

function fetchWeatherData(searchInput) {
  fetch(searchInput)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      drawWeather(data);
    })
    .catch((error) => console.error(error));
}

// Display the forecast data on the page
function drawWeather2(data) {
  //  Filter the data to show only forecasts at 12:00 PM
  const forecastHtml = data.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .map((item) => {
      // Convert temperature from Kelvin to Fahrenheit and get weather icon URL
      const fahrenheit = Math.round(parseFloat(item.main.temp));
      const weatherURL = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
      const icon = `<img src="${weatherURL}"/>`;
      return `<div class="forecast-item">
                <div class="forecast-day">${new Date(
                  item.dt_txt
                ).toLocaleDateString("en-US", { Date: "short" })}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">Temp:${fahrenheit}&deg;</div>
                <div class="wind">Wind:${item.wind.speed}</div>
                <div class="humidity">Humidity:${item.main.humidity}</div>
              </div>`;
    })
    .join("");

  document.getElementById("forecast").innerHTML = forecastHtml;
}

function fetchWeatherData2(searchInput) {
  fetch(searchInput)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      drawWeather2(data);
    })
    .catch((error) => console.error(error));
}

// When the page loads, fetch weather data for the default location
window.onload = function () {
  fetchCoords("san diego");
  // fetchWeatherData();
  // fetchWeatherData2();
};

// When the search button is clicked, fetch weather data for the entered city, update the search history, and display the results on the page
document.querySelector("#search-button").addEventListener("click", function () {
  const cityName = document.querySelector("#city-search").value;

  //fetch coordinates from city input
  fetchCoords(cityName);
  // Fetch weather data for the city and display it on the page
  // fetchWeatherData(cityName);
  // fetchWeatherData2(cityName);

  // Update the search history with the entered city
  updateSearchHistory(cityName);
});

// Update the search history and store it in local storage
function updateSearchHistory(cityName) {
  // Get a reference to the search history container
  const searchHistory = document.querySelector("#search-history");

  if (cityName) {
    // Save the entered city to the search history in local storage
    let history = getSearchHistory();
    if (!history.includes(cityName)) {
      history.push(cityName);
      localStorage.setItem("searchHistory", JSON.stringify(history));
    }
  }

  // Clear the search history container and repopulate it with the updated history
  searchHistory.innerHTML = "";
  let history = getSearchHistory();
  history.forEach((city) => {
    // Create a new button for each city in the search history
    const btn = document.createElement("button");
    btn.classList.add(
      "btn",
      "btn-secondary",
      "w-100",
      "text-dark",
      "fw-semibold",
      "my-2"
    );
    btn.textContent = city;

    // Add a click event listener to each button to fetch weather data for the corresponding city and display it on the page
    btn.addEventListener("click", function () {
      fetchCoords(city);
      // fetchWeatherData2(city);
    });

    // Add the new button to the search history container
    searchHistory.appendChild(btn);
  });
}

// Retrieve the search history from local storage
function getSearchHistory() {
  const history = localStorage.getItem("searchHistory");
  return history ? JSON.parse(history) : [];
}

// Call the updateSearchHistory() function without arguments when the page loads to display the search history from local storage
document.addEventListener("DOMContentLoaded", function () {
  updateSearchHistory();
});
