import Component from "../../../Component";
import {getDayShort} from "../../../../utils/utils";

import './WeatherList.scss';
import './WeatherSummary.scss';

class WeatherList extends Component {
    constructor (eventDispatcher, domElement) {
        super(domElement);
        this.eventDispatcher = eventDispatcher;
        this.domContainer.classList.add('weather-list');
        this.items = [];
    }
    render(weatherDataCollection) {
        this.clear();

        weatherDataCollection.forEach((weatherData) => {
            const container = document.createElement('div');
            container.classList.add('weather-summary', 'weather-list__item');


            let el = document.createElement('div');
            el.textContent = getDayShort(weatherData.date);
            container.appendChild(el);

            if (weatherData.icon) {
                el = document.createElement('img');
                el.setAttribute('src', weatherData.icon);
                el.classList.add('weather-summary__item');
                container.appendChild(el);
            }

            const temperatureWrapper = document.createElement('div');
            temperatureWrapper.classList.add('weather-summary__temperature-container');

            el = document.createElement('span');
            el.textContent = weatherData.maxTemperature + '°';
            el.classList.add('weather-summary__main-temperature');
            temperatureWrapper.appendChild(el);

            if (weatherData.hasOwnProperty('minTemperature')) {
                el = document.createElement('span');
                el.textContent = weatherData.minTemperature + '°';
                el.classList.add('weather-summary__secondary-temperature');
                temperatureWrapper.appendChild(el);
            }


            container.appendChild(temperatureWrapper);

            container.addEventListener('click', () => {
                this.items.forEach((item) => {
                    if (item.classList.contains('weather-summary--active')) {
                        item.classList.remove('weather-summary--active');
                    }
                });
                container.classList.add('weather-summary--active');
                this.eventDispatcher.publish('displayWeatherForDay', weatherData);
            });

            this.domContainer.appendChild(container);
            this.items.push(container);
        });

        this.items[0].classList.add('weather-summary--active');

    }
}

export default WeatherList;