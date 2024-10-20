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
          option.value = city.timezone;
          option.textContent = `${city.name} ${city.emoji}`;
          citiesSelectElement.appendChild(option);
        });

        citiesSelectElement.addEventListener("change", (event) => {
          const selectedValue = event.target.value;
          if (selectedValue) {
            updateCity(selectedValue, cities);
          }
        });

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

  fetchCities();
  setInterval(() => {
    fetch('cities.json')
      .then(response => response.json())
      .then(data => {
        const cities = data.cities;
        updateTime(cities);
      });
  }, 1000);
});
