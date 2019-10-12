import {average, lowest, propertyExists, sum} from "../utils/utils";
import DailyWeather from "../entity/DailyWeather";

/**
 * Provides weather related information
 * https://openweathermap.org/api
 */
class OpenWeatherDataProvider {

    /**
     * @param {string} apiKey
     */
    constructor(apiKey) {
        this.url = 'https://api.openweathermap.org/data/2.5/forecast';
        this.apiKey = apiKey;
    }

    /**
     * fetches weather for given city for given days amount
     *
     * @param {City} city
     * @param {int} days
     * @returns {Promise}
     */
    async getDataForCity(city, days) {
        const queryString = `?lat=${city.getLat()}&lon=${city.getLong()}&APPID=${this.apiKey}&lang=ru&units=metric&cnt=${days * 8}`;
        const url = this.url + queryString;
        const rawResponse = await fetch(url);
        if (!rawResponse.ok) {
            throw rawResponse;
        }
        const parsedResponse = await rawResponse.json();

        if (!Array.isArray(parsedResponse.list) || parsedResponse.list.length === 0) {
            throw {
                msg: "cannot display weather data, invalid 'response.list' parameter",
                response: parsedResponse
            };
        }

        let timeZoneOffsetInSeconds = 0;
        if (propertyExists(parsedResponse, 'city', 'timezone')) {
            timeZoneOffsetInSeconds = +parsedResponse.city.timezone;
        }

        return parsedResponse.list.reduce((result, rawWeatherData) => {
            if (!rawWeatherData.hasOwnProperty('dt') || isNaN(+rawWeatherData.dt)) {
                throw {
                    msg: 'cannot display weather data, invalid or nonexistent dt parameter in one of the response.list elements',
                    response: parsedResponse,
                    listElement: rawWeatherData
                }
            }

            if (!propertyExists(rawWeatherData, 'main', 'temp_max')) {
                throw {
                    msg: 'cannot display weather data, no main.temp_max parameter in one of the response.list elements',
                    response: parsedResponse,
                    listElement: rawWeatherData
                }
            }

            const newDailyWeather = this.convertToDailyWeather(rawWeatherData, timeZoneOffsetInSeconds);

            if (result.length === 0) {
                result.push(newDailyWeather);
                return result;
            }

            const lastDailyWeatherInResult = result[result.length - 1];

            if (lastDailyWeatherInResult.date.getDay() !== newDailyWeather.date.getDay()) {
                if (result.length < days) {
                    result.push(newDailyWeather);
                }

                return result;
            }

            OpenWeatherDataProvider.mergeTwoDailyWeatherIntoFirstOne(lastDailyWeatherInResult, newDailyWeather);
            return result;
        }, []);
    }

    /**
     * @param dailyWeather1
     * @param dailyWeather2
     */
    static mergeTwoDailyWeatherIntoFirstOne(dailyWeather1, dailyWeather2) {
        dailyWeather1.maxTemperature = dailyWeather1.maxTemperature > dailyWeather2.maxTemperature ?
            dailyWeather1.maxTemperature : dailyWeather2.maxTemperature;

        dailyWeather1.minTemperature = lowest(dailyWeather1.minTemperature, dailyWeather2.maxTemperature);
        dailyWeather1.precipitation = sum(dailyWeather1.precipitation, dailyWeather2.precipitation);
        dailyWeather1.humidity = average(dailyWeather1.humidity, dailyWeather2.humidity);
        dailyWeather1.wind = average(dailyWeather1.wind, dailyWeather2.wind);
    }

    /**
     * @param rawWeatherData
     * @param timeZoneOffsetInSeconds
     * @returns {DailyWeather}
     */
    convertToDailyWeather(rawWeatherData, timeZoneOffsetInSeconds) {
        const icon = propertyExists(rawWeatherData, 'weather', '0', 'icon') ?
            this.getUrlByIconKey(rawWeatherData.weather[0].icon) : null;
        const description = propertyExists(rawWeatherData, 'weather', '0', 'description') ?
            rawWeatherData.weather[0].description : null;
        const minTemperature = propertyExists(rawWeatherData, 'main', 'temp_min') ?
            Math.round(rawWeatherData.main.temp_min) : null;
        const precipitation = propertyExists(rawWeatherData, 'rain', '3h') ?
            rawWeatherData.rain['3h'] : 0;
        const humidity = propertyExists(rawWeatherData, 'main', 'humidity') ?
            rawWeatherData.main.humidity : null;
        const wind = propertyExists(rawWeatherData, 'wind', 'speed') ?
            rawWeatherData.wind.speed : null;

        const dateForTimeZoneComparison = new Date();

        return new DailyWeather({
            date: new Date(((timeZoneOffsetInSeconds + dateForTimeZoneComparison.getTimezoneOffset() * 60) + rawWeatherData.dt) * 1000),
            maxTemperature: Math.round(rawWeatherData.main.temp_max),
            icon: icon,
            description: description,
            minTemperature: minTemperature,
            precipitation: precipitation,
            humidity: humidity,
            wind: wind
        });
    }

    /**
     * api has 2 sets of icons 1 for nightly weather and 1 for daily weather.
     *
     * Daily icons look better, so i change all night icons to
     * day by replacing 'n' with 'd' in the icon keys
     *
     * @param {string} icon
     * @returns {string}
     */
    getUrlByIconKey(icon) {
        const changedIcon = icon.replace(/n/, 'd');
        return `https://openweathermap.org/img/wn/${changedIcon}.png`;
    }
}

export default OpenWeatherDataProvider;