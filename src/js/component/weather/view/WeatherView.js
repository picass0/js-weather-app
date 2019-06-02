import Component from '../../Component';
import CurrentWeather from "./CurrentWeather/CurrentWeather";
import WeatherList from "./WeatherList/WeatherList";
import EventDispatcher from "../../../service/EventDispatcher";
import City from '../../../entity/City';
import DailyWeather from '../../../entity/DailyWeather';

/**
 * Component wraps all weather displaiyng logic
 * and handles interaction between weather dispalying components
 */
class WeatherView extends Component{

    constructor () {
        super();
        this.localDispatcher = new EventDispatcher(this.domContainer);
    }

    /**
     *
     * @param {City} city
     * @param {DailyWeather[]} weatherDataCollection
     */
    render(city, weatherDataCollection) {
        this.clear();

        if (!city) {
            const p = document.createElement('p');
            p.textContent = 'Добавь город и все будет';
            p.classList.add('current-weather__no-cities');
            this.domContainer.appendChild(p);
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