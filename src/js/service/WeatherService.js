/**
 * aggregates weather handling logic for convenience
 * todo - mb keep weather for city in state and mb cashing
 */
class WeatherService {

    /**
     * @param {WeatherDataProvider} weatherDataProvider
     * @param {WeatherList} weatherList
     * @param {EventDispatcher} eventDispatcher
     */
    constructor (weatherDataProvider, weatherList, eventDispatcher) {
        this.weatherDataProvider = weatherDataProvider;
        this.weatherList = weatherList;
        this.eventDispatcher = eventDispatcher;
    }

    /**
     * @param {*} city
     * @param {int} days
     */
    displayWeatherForCity(city, days) {
        const weatherList = this.weatherDataProvider.getDataForCity(city, days);
        this.weatherList.render(city, weatherList);
        this.eventDispatcher.publish('weatherForCityDisplayed', city);
    }
}

export default WeatherService;