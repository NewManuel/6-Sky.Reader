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
    let prevSearchRe = JSON.parse(localStorage.getItem("prevSearchRe"));
    if (prevSearchRe && prevSearchRe.length > 0) {
        prevSearchRe = [...new Set(prevSearchRe)];
        prevSearchRe.forEach((item) => {
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
        const secResult = await response2.text();
        const secLocData = JSON.parse(secResult);
        console.log(secLocData);

        let oldDate = [];
        let oldDateData = [];
        for (let i = 0; i < secLocData.list.length; i++) {
            const itemDate = new Date(secLocData.list[i].dt * 1000);
            if (!oldDate.includes(itemDate.getDay()) && secLocData.list[i].weather[0].icon.includes("d")) {
                oldDate.push(itemDate.getDay());
                oldDateData.push(secLocData.list[i]);
            }
        }

        let locCurDate = document.querySelector("#loc-cur-date");
        let locImage = document.querySelector("#loc-image");
        let locTemp = document.querySelector("#loc-temp");
        let locWind = document.querySelector("#loc-wind");
        let locHumid = document.querySelector("#loc-humid");

        locArea.textContent = secLocData.city.name;
        locCurDate.textContent = ` (${new Date().toLocaleDateString()})`;
        locImage.setAttribute("src", `https://openweathermap.org/img/wn/${oldDateData[0].weather[0].icon}@2x.png`);
        locTemp.textContent = `Temp: ${oldDateData[0].main.temp} °F`;
        locWind.textContent = `Wind: ${oldDateData[0].wind.speed} MPH`;
        locHumid.textContent = `Humidity: ${oldDateData[0].main.humidity} %`;

        // The weather data is then parsed and used to populate various elements in the HTML document to display the current weather and forecast.
        // The recent search is saved to local storage to be displayed later.
        if (shouldPushToLs) {
            let prevSearchRe = JSON.parse(localStorage.getItem("prevSearchRe"));
            if (prevSearchRe && prevSearchRe.length > 0) {
                prevSearchRe.push(area.value);
                localStorage.setItem("prevSearchRe", JSON.stringify(prevSearchRe));
            } else {
                let newSearchRe = [];
                newSearchRe.push(area.value);
                localStorage.setItem("prevSearchRe", JSON.stringify(newSearchRe));
            }
        }
        fcastResults.innerHTML = "";

        oldDateData
            .filter((item) => new Date(item.dt * 1000).getDay() !== new Date().getDay())
            .forEach((item) => {
                const fcastReEl = document.createElement("div");
                const fcastReDateEl = document.createElement("p");
                const fcastReImageEl = document.createElement("img");
                const fcastReTempEl = document.createElement("p");
                const fcastReWindEl = document.createElement("p");
                const fcastReHumEl = document.createElement("p");

                fcastReEl.id = "fcast-itm-box";
                fcastReDateEl.id = "forecast-date";
                fcastReImageEl.id = "loc-image";
                fcastReTempEl.id = "fcast-etc";
                fcastReWindEl.id = "fcast-etc";
                fcastReHumEl.id = "forecast-etc";

                fcastReDateEl.innerText = ` (${new Date(item.dt * 1000).toLocaleDateString()})`;
                fcastReImageEl.setAttribute("src", `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`);
                fcastReTempEl.innerText = `Temp: ${item.main.temp} °F`;
                fcastReWindEl.innerText = `Wind: ${item.wind.speed} MPH`;
                fcastReHumEl.innerText = `Humidity: ${item.main.humidity} %`;

                fcastReEl.append(fcastReDateEl, fcastReImageEl, fcastReTempEl, fcastReWindEl, fcastReHumEl);
                fcastResults.appendChild(fcastReEl);
            });

        results.classList.add("hide2");
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
