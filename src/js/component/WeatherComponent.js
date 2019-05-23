/**
 * aggregates weather handling logic for convenience
 */
class WeatherComponent {

    /**
     * @param {WeatherDataProvider} weatherDataProvider
     * @param {WeatherList} weatherList
     */
    constructor (weatherDataProvider, weatherList) {
        this.weatherDataProvider = weatherDataProvider;
        this.weatherList = weatherList;
    }

    /**
     * @param {*} city
     * @param {int} days
     * @param {Array} weatherList
     */
    render(city, days, weatherList = null) {
        if (!city) {
            return new Promise((resolve, reject) => {
                this.weatherList.render(city, []);
                resolve([]);
            });
        }

        if (weatherList) {
            return new Promise((resolve, reject) => {
                this.weatherList.render(city, weatherList);
                resolve([]);
            });
        }

        return this.weatherDataProvider.getDataForCity(city, days)
            .then((weatherList) => {
                this.weatherList.render(city, weatherList);
                return weatherList;
            }).catch((err) => {
                console.error(err);
                throw err;
            });
    }

    getDomContainer () {
        return this.weatherList.getDomContainer();
    }
}

export default WeatherComponent;