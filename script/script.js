// List of variables
let citySearch = document.querySelector("#city-search");
let area = document.querySelector("#area");
// check if below variable is useful
let locDetails = document.querySelector("#loc-details");
let prevSearch = document.querySelector("#previous-search");
let locArea = document.querySelector("#loc-area");
let locCurDate = document.querySelector("#loc-cur-date");
let locImage = document.querySelector("#loc-image");
let locTemp = document.querySelector("#loc-temp");
let locWind = document.querySelector("#loc-wind");
let locHumid = document.querySelector("#loc-humid");
let fcastResults = document.querySelector("#fcast-results");
// check if below variable is useful
let bigBox = document.querySelector("#big-box");
let results = document.querySelector("#results");
let largeBox = document.querySelector("#large-box");


//The showSearches() function is defined to populate the recent searches list from local storage. 
function showSearches() {
    prevSearch.innerHTML = "";
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (recentSearches && recentSearches.length > 0) {
        recentSearches = [...new Set(recentSearches)];
        recentSearches.forEach((item) => {
            let recentSearchItem = document.createElement("li");
            recentSearchItem.id = "recent-search-li";
            recentSearchItem.textContent = item;
            prevSearch.append(recentSearchItem);
        });
    }
};
showSearches();

// This asynchronous function searchHandle() is defined to handle the weather search. This function is triggered when the form is submitted.
async function searchHandle(e, shouldPushToLs = true) {
    e.preventDefault();
    if (area.value === "") {
        return;
    }

  //Here inside searchHandle(), the input value is retrieved, and an API call is made to fetch location data using the OpenWeatherMap API.
    try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${area.value}&limit=5&appid=a1ae3427b7bdb878344cb4b25e0df8f9`;
        const response = await fetch(url);
        const result = await response.text();
        let locationData = JSON.parse(result);

        const lat = locationData[0].lat;
        const lon = locationData[0].lon;

        
        // After receiving the location data, another API call is made to fetch the weather forecast data.
        const response2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=a1ae3427b7bdb878344cb4b25e0df8f9`
        );
        const result2 = await response2.text();
        const locationData2 = JSON.parse(result2);
        console.log(locationData2);

        let usedDates = [];
        let usedDateData = [];
        for (let i = 0; i < locationData2.list.length; i++) {
            const itemDate = new Date(locationData2.list[i].dt * 1000);
            if (!usedDates.includes(itemDate.getDay()) && locationData2.list[i].weather[0].icon.includes("d")) {
                usedDates.push(itemDate.getDay());
                usedDateData.push(locationData2.list[i]);
            }
        }

        let locCurDate = document.querySelector("#current-date");
        let locImage = document.querySelector("#weather-icon");
        let locTemp = document.querySelector("#location-temp");
        let locWind = document.querySelector("#location-wind");
        let locHumid = document.querySelector("#location-humidity");

        locArea.textContent = locationData2.city.name;
        locCurDate.textContent = ` (${new Date().toLocaleDateString()})`;
        locImage.setAttribute("src", `https://openweathermap.org/img/wn/${usedDateData[0].weather[0].icon}@2x.png`);
        locTemp.textContent = `Temp: ${usedDateData[0].main.temp} °F`;
        locWind.textContent = `Wind: ${usedDateData[0].wind.speed} MPH`;
        locHumid.textContent = `Humidity: ${usedDateData[0].main.humidity} %`;

        // The weather data is then parsed and used to populate various elements in the HTML document to display the current weather and forecast.
        // The recent search is saved to local storage to be displayed later.
        if (shouldPushToLs) {
            let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
            if (recentSearches && recentSearches.length > 0) {
                recentSearches.push(area.value);
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
            } else {
                let newSearches = [];
                newSearches.push(area.value);
                localStorage.setItem("recentSearches", JSON.stringify(newSearches));
            }
        }
        fcastResults.innerHTML = "";

        usedDateData
            .filter((item) => new Date(item.dt * 1000).getDay() !== new Date().getDay())
            .forEach((item) => {
                const forecastItemEl = document.createElement("div");
                const forecastItemDateEl = document.createElement("p");
                const forecastItemIconEl = document.createElement("img");
                const forecastItemTempEl = document.createElement("p");
                const forecastItemWindEl = document.createElement("p");
                const forecastItemHumidityEl = document.createElement("p");

                forecastItemEl.id = "forecast-item-container";
                forecastItemDateEl.id = "forecast-date";
                forecastItemIconEl.id = "weather-icon";
                forecastItemTempEl.id = "forecast-etc";
                forecastItemWindEl.id = "forecast-etc";
                forecastItemHumidityEl.id = "forecast-etc";

                forecastItemDateEl.innerText = ` (${new Date(item.dt * 1000).toLocaleDateString()})`;
                forecastItemIconEl.setAttribute("src", `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`);
                forecastItemTempEl.innerText = `Temp: ${item.main.temp} °F`;
                forecastItemWindEl.innerText = `Wind: ${item.wind.speed} MPH`;
                forecastItemHumidityEl.innerText = `Humidity: ${item.main.humidity} %`;

                forecastItemEl.append(forecastItemDateEl, forecastItemIconEl, forecastItemTempEl, forecastItemWindEl, forecastItemHumidityEl);
                fcastResults.appendChild(forecastItemEl);
            });

        results.classList.add("hidden");
        largeBox.classList.remove("hidden");

        showSearches();

        area.value = "";
    } catch (e) {
        //error message
        window.alert("no location found. please check spelling");
        console.log(e);
    }
}

//Here a event listeners are added to the form submission and recent searches list to trigger the search and populate the input field with the selected recent search, respectively.
citySearch.addEventListener("submit", searchHandle);

prevSearch.addEventListener("click", function (e) {
    if (e.target && e.target.matches("li")) {
        area.value = e.target.innerText;
        searchHandle(e, false);
    }
});
