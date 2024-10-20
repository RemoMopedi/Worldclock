document.addEventListener("DOMContentLoaded", () => {

  function fetchCities() {
    fetch('cities.json')
      .then(response => response.json())
      .then(data => {
        const cities = data.cities;
        const citiesSelectElement = document.querySelector("#city-select");
        const citiesContainer = document.querySelector("#cities");

        cities.forEach(city => {
          const option = document.createElement("option");
          option.value = city.timezone; // Use the timezone for value
          option.textContent = `${city.name} ${city.emoji}`;
          citiesSelectElement.appendChild(option);
        });
        
        citiesSelectElement.addEventListener("change", (event) => {
          const selectedValue = event.target.value;
          if (selectedValue) {
            updateCity(selectedValue, cities);
          }
        });

        // Optionally initialize with the first city
        if (cities.length > 0) {
          updateCity(cities[0].timezone, cities);
        }
      })
      .catch(error => console.error('Error fetching cities:', error));
  }

  function updateTime(cities) {
    cities.forEach(city => {
      let cityElement = document.querySelector(`#${city.name.toLowerCase().replace(" ", "-")}`);
      if (cityElement) {
        let cityDateElement = cityElement.querySelector(".date");
        let cityTimeElement = cityElement.querySelector(".time");
        let cityTime = moment().tz(city.timezone);

        cityDateElement.innerHTML = cityTime.format("MMMM Do YYYY");
        cityTimeElement.innerHTML = cityTime.format("h:mm:ss [<small>]A[</small>]");
      }
    });
  }

  function updateCity(cityTimeZone, cities) {
    const cityName = cityTimeZone.split("/")[1].replace("_", " ");
    const city = cities.find(c => c.timezone === cityTimeZone);
    const cityTime = moment().tz(cityTimeZone);
    const citiesElement = document.querySelector("#cities");

    citiesElement.innerHTML = `
      <div class="city">
        <div>
          <h2>${city.name} ${city.emoji}</h2>
          <div class="date">${cityTime.format("MMMM Do YYYY")}</div>
        </div>
        <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
      </div>
    `;
  }

  function displayUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        
        const userCity = "Your City";
        const userTimezone = moment.tz.guess();
        const userTime = moment().tz(userTimezone);

        const currentLocationElement = document.querySelector("#current-location");
        currentLocationElement.innerHTML = `
          <h2>${userCity} 🌍</h2>
          <div class="date">${userTime.format("MMMM Do YYYY")}</div>
          <div class="time">${userTime.format("h:mm:ss")} <small>${userTime.format("A")}</small></div>
        `;
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  fetchCities();
  setInterval(() => {
    fetch('cities.json')
      .then(response => response.json())
      .then(data => {
        const cities = data.cities;
        updateTime(cities);
        displayUserLocation();
      });
  }, 1000);
});
