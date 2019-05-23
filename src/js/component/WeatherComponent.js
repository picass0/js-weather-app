/**
 * aggregates weather handling logic for convenience
 */
import Component from "./Component";
import WeatherList from "./WeatherList";
import WheelPlaceholder from "./WheelPlaceholder";

class WeatherComponent extends Component{

    /**
     * @param container
     * @param {WeatherDataProvider} weatherDataProvider
     */
    constructor (container, weatherDataProvider) {
        super(container);
        this.weatherDataProvider = weatherDataProvider;
        this.weatherList = new WeatherList();
        this.wheel = new WheelPlaceholder();

        this.getDomContainer().appendChild(this.weatherList.getDomContainer());
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

        this.weatherList.clear();
        this.wheel.render();

        return this.weatherDataProvider.getDataForCity(city, days)
            .then((weatherList) => {
                this.wheel.clear();
                this.weatherList.render(city, weatherList);
                return weatherList;
            }).catch((err) => {
                this.wheel.clear();
                console.error(err);
                throw err;
            });
    }
}

export default WeatherComponent;