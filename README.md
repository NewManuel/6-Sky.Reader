# Sky Reader

## PURPOSE

Need to know the weather for the day before you can take a trip? This applicaton does exactly that using a Thrid-party API the [5 Day Weather Forecast](https://openweathermap.org/forecast5) to retrieve weather data for cities. The base URL should look like the following: `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`.
The use of `localStorage` helps to store any data provided by the API.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN searching for a city's weather
THEN what is presented is the current and future conditions for that city and that city is added to the search history
WHEN viewing current weather conditions for that city
THEN what is presented is the city's name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN viewing future weather conditions for that city
THEN what is presented will be the 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN clicking on a city in the search history
THEN again a presentation is made with the current and future conditions for that city
```

### Gif

The following animation demonstrates the application functionality:
![The weather app includes a search option, a list of cities, and a five-day forecast and current weather conditions for Atlanta.](./Assets/06-server-side-apis-homework-demo.png)


### Url


* The URL of the deployed application: https://newmanuel.github.io/6-Sky.Reader/

* The URL of the GitHub repository: https://github.com/NewManuel/6-Sky.Reader