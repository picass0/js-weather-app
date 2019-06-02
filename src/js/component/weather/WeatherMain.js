/**
 * aggregates weather handling logic for convenience
 */
import Component from "../Component";
import WeatherView from "./view/WeatherView";
import WheelPlaceholder from "../wheel/WheelPlaceholder";

import './WeatherMain.scss';

class WeatherMain extends Component{

    /**
     * @param container
     * @param {ApixuWeatherDataProvider} weatherDataProvider
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
     * @param {*} city
     * @param {int} days
     * @param {Array} weatherList
     */
    render(city, days, weatherList = null) {
        if (!city) {
            return new Promise((resolve, reject) => {
                this.weatherView.render(city, []);
                resolve([]);
            });
        }

        if (weatherList) {
            return new Promise((resolve, reject) => {
                this.weatherView.render(city, weatherList);
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