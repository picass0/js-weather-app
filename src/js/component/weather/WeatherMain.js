import Component from "../Component";
import WeatherView from "./view/WeatherView";
import WheelPlaceholder from "../wheel/WheelPlaceholder";
import City from '../../entity/City';
import DailyWeather from '../../entity/DailyWeather';

import './WeatherMain.scss';

/**
 * Main weather related component.
 * Combines data fetching services and weather displaying components
 */
class WeatherMain extends Component{

    /**
     * @param container
     * @param {OpenWeatherDataProvider} weatherDataProvider
     */
    constructor (container, weatherDataProvider) {
        super(container);
        this.weatherDataProvider = weatherDataProvider;
        this.weatherView = new WeatherView();
        this.wheel = new WheelPlaceholder();

        this.getDomContainer().classList.add('weather-main');
        this.getDomContainer().appendChild(this.weatherView.getDomContainer());
        this.getDomContainer().appendChild(this.wheel.getDomContainer());
    }

    /**
     * @param {City} city
     * @param {int} days
     * @param {DailyWeather[]} weatherListCache
     */
    render(city, days, weatherListCache = null) {
        if (!city) {
            return new Promise((resolve, reject) => {
                this.weatherView.render(city, []);
                resolve([]);
            });
        }

        if (weatherListCache) {
            return new Promise((resolve, reject) => {
                this.weatherView.render(city, weatherListCache);
                resolve([]);
            });
        }

        this.weatherView.clear();
        this.wheel.render();

        return this.weatherDataProvider.getDataForCity(city, days)
            .then((weatherList) => {
                this.wheel.clear();
                this.weatherView.render(city, weatherList);
                return weatherList;
            }).catch((err) => {
                this.wheel.clear();
                console.error(err);
                throw err;
            });
    }
}

export default WeatherMain;