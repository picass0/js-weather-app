/**
 * aggregates weather handling logic for convenience
 * todo - mb keep weather for city in state and mb cashing
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
        this.state = {};
    }

    /**
     * @param {*} city
     * @param {int} days
     */
    render(city, days) {
        // if (city==='Paris'/*exists in state*/) {
        //     this.weatherList.render(city, weatherList);
        //     return;
        // }

        this.weatherDataProvider.getDataForCity(city, days)
            .then((weatherList) => {
                this.weatherList.render(city, weatherList);
                this.eventDispatcher.publish('weatherForCityDisplayed', city);
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