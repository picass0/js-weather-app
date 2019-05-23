import {propertyExists} from '../utils/utils';
import DailyWeather from '../entity/DailyWeather';

/**
 * Provides weather related information
 */
class ApixuWeatherDataProvider {

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
        const url = `${this.url}?key=${this.apiKey}&q=${city.name}&days=${days}&lang=ru`;
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
                    if (!rawForecast.hasOwnProperty('date')) {
                        throw {msg: "cannot display weather data, no forecast.forecastday.date parameter in response", response}
                    }

                    const date = new Date(rawForecast.date);

                    if (!rawForecast.hasOwnProperty('day')) {
                        throw {msg: "cannot display weather data, no forecast.forecastday.day parameter in response", response: response, forecast: rawForecast};
                    }

                    const day = rawForecast.day;

                    if (!day.hasOwnProperty('maxtemp_c')) {
                        throw {msg: "cannot display weather data, undexpected response format, cannot find forecast.forecastday.day.maxtemp_c value", response: response, forecast: rawForecast};
                    }

                    let description = null;
                    let icon = null;
                    if (day.condition) {
                        description = day.condition.text;
                        icon = day.condition.icon;
                    }

                    let wind = null;
                    if (day.hasOwnProperty('maxwind_kph')) {
                        wind = parseFloat(day.maxwind_kph)*1000/3600;
                    }

                    return new DailyWeather({
                        date: date,
                        maxTemperature: day.maxtemp_c,
                        icon: icon,
                        description: description,
                        minTemperature: day.mintemp_c || null,
                        precipitation: day.totalprecip_mm || null,
                        humidity: day.avghumidity || null,
                        wind: wind
                    });
                });

                return dailyWeatherCollection;
            });
    }
}

export default ApixuWeatherDataProvider;