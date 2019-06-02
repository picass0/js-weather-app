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
        const url = `${this.url}?key=${this.apiKey}&q=${city.getLat()}, ${city.getLong()}&days=${days}&lang=ru`;
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

        const date = new Date(response.location.localtime);

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
     *
     * @param condition
     * @returns {*[]}
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
}

export default ApixuWeatherDataProvider;