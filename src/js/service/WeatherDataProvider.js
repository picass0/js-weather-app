/**
 * Provides weather related information
 */
class WeatherDataProvider {

    /**
     * @param {*} city
     * @param {int} days
     * @returns {Array}
     */
    getDataForCity(city, days) {
        //todo get data from api
        let result = [];
        while (days > 0) {
            result.push({temperature: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random()*10)});
            days--;
        }

        return result;
    }
}

export default WeatherDataProvider;