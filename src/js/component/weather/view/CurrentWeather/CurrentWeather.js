import Component from "../../../Component";
import {addLeadingZeroForTime, getDay} from "../../../../utils/utils";

import './CurrentWeather.scss';

class CurrentWeather extends Component {

    /**
     *
     * @param city
     * @param {DailyWeather} dailyWeather
     */
    render (city, dailyWeather) {
        this.clear();

        const header = document.createElement('h3');
        header.classList.add('current-weather__header', 'current-weather__line');
        header.textContent = `${city.getNameOrStateIfNotExists()}, ${city.getCountry()}`;
        this.domContainer.appendChild(header);

        const dateContainer = document.createElement('div');
        dateContainer.classList.add('current-weather__line');

        const day = document.createElement('span');
        day.textContent = getDay(dailyWeather.date);
        dateContainer.appendChild(day);

        if (dailyWeather.time) {
            const time = document.createElement('span');
            time.textContent = ` ${addLeadingZeroForTime(dailyWeather.time.getHours())}:${addLeadingZeroForTime(dailyWeather.time.getMinutes())}`;
            dateContainer.appendChild(time);
        }
        this.domContainer.appendChild(dateContainer);

        const description = document.createElement('div');
        description.textContent = dailyWeather.description;
        description.classList.add('current-weather__line');
        this.domContainer.appendChild(description);

        const mainPart = document.createElement('div');
        mainPart.classList.add('current-weather__main');


        const weatherLeft = document.createElement('div');
        weatherLeft.classList.add('current-weather__left');

        if (dailyWeather.icon) {
            const img = document.createElement('img');
            img.setAttribute('src', dailyWeather.icon);
            img.classList.add('current-weather__img');
            weatherLeft.appendChild(img);
        }

        const temp = document.createElement('h2');
        temp.textContent = dailyWeather.maxTemperature;
        temp.classList.add('current-weather__temperature');
        weatherLeft.appendChild(temp);

        const celsius = document.createElement('span');
        celsius.textContent = '°C';
        celsius.classList.add('current-weather__celsius');
        weatherLeft.appendChild(celsius);


        const weatherRight = document.createElement('div');
        weatherRight.classList.add('current-weather__right');

        if (dailyWeather.hasOwnProperty('precipitation')) {
            const precipitation = document.createElement('div');
            precipitation.textContent = `Осадки: ${dailyWeather.precipitation}мм`;
            precipitation.classList.add('current-weather__line');
            weatherRight.appendChild(precipitation);
        }

        if (dailyWeather.hasOwnProperty('humidity')) {
            const humidity = document.createElement('div');
            humidity.textContent = `Влажность: ${dailyWeather.humidity}%`;
            humidity.classList.add('current-weather__line');
            weatherRight.appendChild(humidity);
        }

        if (dailyWeather.hasOwnProperty('wind')) {
            const wind = document.createElement('div');
            wind.textContent = `Ветер: ${dailyWeather.wind.toFixed(2)}м/с`;
            wind.classList.add('current-weather__line');
            weatherRight.appendChild(wind);
        }

        mainPart.appendChild(weatherLeft);
        mainPart.appendChild(weatherRight);

        this.domContainer.appendChild(mainPart);
    }
}

export default CurrentWeather;