/**
 * aggregates weather handling logic for convenience
 */
class WeatherComponent {

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
     * @param {Array} weatherList
     */
    render(city, days, weatherList = null) {
        if (!city) {
            this.weatherList.render(city, []);
            this.eventDispatcher.publish('weatherForCityDisplayed', {city: city});
            return;
        }

        if (weatherList) {
            this.weatherList.render(city, weatherList);
            this.eventDispatcher.publish('weatherForCityDisplayed', {city: city});
            return;
        }

        this.weatherDataProvider.getDataForCity(city, days)
            .then((weatherList) => {
                this.weatherList.render(city, weatherList);
                this.eventDispatcher.publish('weatherForCityDisplayed', {city: city, weatherList: weatherList});
            }).catch((err) => {
                console.error(err);
                this.eventDispatcher.publish('cannotDisplayWeatherForCity', city)
            });
    }

    getDomContainer () {
        return this.weatherList.getDomContainer();
    }
}

export default WeatherComponent;