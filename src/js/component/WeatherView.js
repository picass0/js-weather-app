import Component from './Component';
import CurrentWeather from "./CurrentWeather";
import WeatherList from "./WeatherList";
import EventDispatcher from "../service/EventDispatcher";


class WeatherView extends Component{

    constructor () {
        super();
        this.localDispatcher = new EventDispatcher(this.domContainer);
    }

    render(city, weatherDataCollection) {
        this.clear();

        if (!city) {
            return;
        }

        const currentWeather = new CurrentWeather();
        currentWeather.render(city, weatherDataCollection[0]);
        this.domContainer.appendChild(currentWeather.getDomContainer());

        const weatherList = new WeatherList(this.localDispatcher);
        weatherList.render(weatherDataCollection);
        this.domContainer.appendChild(weatherList.getDomContainer());

        this.localDispatcher.subscribe('displayWeatherForDay', (weatherData) => {
            currentWeather.render(city, weatherData);
        });
    }
}

export default WeatherView;