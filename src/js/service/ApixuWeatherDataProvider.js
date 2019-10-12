import {propertyExists} from '../utils/utils';
import DailyWeather from '../entity/DailyWeather';
import City from './../entity/City';

/**
 * Apixu changed the name to https://weatherstack.com/
 * with this change forecast data became a paid service :(
 * so i changed weather data provider to https://openweathermap.org/api
 *
 * This class is not used anymore!
 *
 * Provides weather related information
 * https://www.apixu.com/doc/
 */
class ApixuWeatherDataProvider {

    /**
     * @param {string} apiKey
     */
    constructor(apiKey) {
        this.url = 'https://api.apixu.com/v1/forecast.json';
        this.apiKey = apiKey;
    }

    /**
     * fetches weather for given city for given days amount
     *
     * @param {City} city
     * @param {int} days
     * @returns {Promise}
     */
    getDataForCity(city, days) {
        const query = encodeURI(`${city.getLat()}, ${city.getLong()}`);
        const url = `${this.url}?key=${this.apiKey}&q=${query}&days=${days}&lang=ru`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json()
            }).then((response) => {
                const forecast =  this.getForecast(response);
                const currentWeather = this.getCurrent(response, forecast[0]);
                forecast.shift();
                forecast.unshift(currentWeather);
                return forecast;
            });
    }

    /**
     * @param {*} response
     * @param {DailyWeather|null} firstForecastDay
     * @returns {DailyWeather}
     */
    getCurrent(response, firstForecastDay) {
        if (!response.hasOwnProperty('current')) {
            throw {
                msg: "cannot display weather data, undexpected response format, cannot find 'current' parameter in response",
                response: response
            }
        }

        if (!propertyExists(response, 'location', 'localtime')) {
            throw {
                msg: "cannot display weather data, undexpected response format, cannot find 'location.localtime' parameter in response",
                response: response
            }
        }

        const date = this.parseDateTime(response.location.localtime);
        if (!date) {
            throw {
                msg: "cannot display weather data, undexpected response format, cannot parse 'location.localtime' parameter in response",
                response: response
            }
        }

        const current = response.current;

        if (!current.hasOwnProperty('temp_c')) {
            throw {
                msg: "cannot display weather data, undexpected response format, cannot find 'current.temp_c' parameter in response",
                response: response
            }
        }

        let [description, icon] = this.getIconAndDescription(current.condition);

        let minTemperature = null;
        if (firstForecastDay && firstForecastDay.hasOwnProperty('minTemperature')) {
            minTemperature = firstForecastDay.minTemperature;
        }

        let wind = null;
        if (current.hasOwnProperty('wind_kph')) {
            wind = parseFloat(current.wind_kph) * 1000 / 3600;
        }

        let precipitation = current.hasOwnProperty('precip_mm') ? current.precip_mm : null;
        let humidity = current.hasOwnProperty('humidity') ? current.humidity :  null;

        return new DailyWeather({
            date: date,
            time: date,
            maxTemperature: Math.floor(current.temp_c),
            icon: icon,
            description: description,
            minTemperature: minTemperature,
            precipitation: precipitation,
            humidity: humidity,
            wind: wind
        })
    }

    /**
     *
     * @param {*}response
     * @returns {DailyWeather[]}
     */
    getForecast(response) {
        if (!propertyExists(response, 'forecast', 'forecastday') ||
            !Array.isArray(response.forecast.forecastday)
        ) {
            throw {
                msg: "cannot display weather data, unexpected response format, cannot find foreacast.forecastday array",
                response: response
            };
        }

        const forecast = response.forecast.forecastday;

        const dailyWeatherCollection = forecast.map(rawForecast => {
            if (!rawForecast.hasOwnProperty('date')) {
                throw {msg: "cannot display weather data, no forecast.forecastday.date parameter in response", response}
            }

            const date = new Date(rawForecast.date);

            if (!rawForecast.hasOwnProperty('day')) {
                throw {
                    msg: "cannot display weather data, no forecast.forecastday.day parameter in response",
                    response: response,
                    forecast: rawForecast
                };
            }

            const day = rawForecast.day;

            if (!day.hasOwnProperty('maxtemp_c')) {
                throw {
                    msg: "cannot display weather data, undexpected response format, cannot find forecast.forecastday.day.maxtemp_c value",
                    response: response,
                    forecast: rawForecast
                };
            }

            let [description, icon] = this.getIconAndDescription(day.condition);

            let wind = null;
            if (day.hasOwnProperty('maxwind_kph')) {
                wind = parseFloat(day.maxwind_kph) * 1000 / 3600;
            }

            let minTemp = day.hasOwnProperty('mintemp_c') ? Math.floor(day.mintemp_c) : null;
            let precipitation = day.hasOwnProperty('totalprecip_mm') ? day.totalprecip_mm : null;
            let humidity = day.hasOwnProperty('avghumidity') ? day.avghumidity : null;

            return new DailyWeather({
                date: date,
                maxTemperature: Math.floor(day.maxtemp_c),
                icon: icon,
                description: description,
                minTemperature: minTemp,
                precipitation: precipitation,
                humidity: humidity,
                wind: wind
            });
        });

        return dailyWeatherCollection;
    }

    /**
     * @param {*} condition
     * @returns {[string|null, string|null]}
     */
    getIconAndDescription (condition) {
        let description = null;
        let icon = null;
        if (condition) {
            description = condition.text;
            icon = condition.icon;
        }

        return [description, icon];
    }

    /**
     * parses date in following format:
     * YYYY-MM-DD HH:mm
     * if hour is less then 10 ,then only one hour digit will be present
     *
     * @param localtime
     * @returns {null|Date}
     */
    parseDateTime(localtime) {
        const timeParts = /(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{1,2})/.exec(localtime);
        if (!timeParts || timeParts.length !== 6) {
            return null;
        }

        return new Date(
            parseInt(timeParts[1]),
            (parseInt(timeParts[2]) - 1),
            parseInt(timeParts[3]),
            parseInt(timeParts[4]),
            parseInt(timeParts[5])
        );
    }
}

export default ApixuWeatherDataProvider;