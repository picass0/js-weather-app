import {propertyExists} from '../utils/utils';
import DailyWeather from '../entity/DailyWeather';

/**
 * Provides weather related information
 */
class WeatherDataProvider {

    constructor(apiKey) {
        this.url = 'https://api.apixu.com/v1/forecast.json';
        this.apiKey = apiKey;
    }

    /**
     * @param {*} city
     * @param {int} days
     * @returns {Promise}
     */
    getDataForCity(city, days) {
        const url = `${this.url}?key=${this.apiKey}&q=${city.name}&days=${days}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json()
            }).then((response) => {
                if (!propertyExists(response, 'forecast', 'forecastday') ||
                    !Array.isArray(response.forecast.forecastday)
                ) {
                    throw {msg: "cannot display weather data, unexpected response format, cannot find foreacast.forecastday array", response: response};
                }

                const forecast = response.forecast.forecastday;

                const dailyWeatherCollection = forecast.map(rawForecast => {
                    if (!propertyExists(rawForecast, 'day', 'avgtemp_c')) {
                        throw {
                            msg: "cannot display weather data, undexpected response format, cannot find forecast.forecastday.day.avgtemp_c value",
                            response: response,
                            forecast: rawForecast
                        };
                    }

                    return new DailyWeather(rawForecast.day.avgtemp_c);
                });

                return dailyWeatherCollection;
            });
    }
}

export default WeatherDataProvider;