import Component from './Component';


class WeatherList extends Component{

    constructor() {
        super();
        this.domContainer.classList.add('card')
    }

    render(city, weatherDataCollection) {
        this.clear();

        if (!city) {
            return;
        }

        const header = document.createElement('h3');
        header.textContent = `Погода для города ${city.getNameOrStateIfNotExists()}:`;
        this.domContainer.appendChild(header);

        weatherDataCollection.forEach((weatherData) => {
            const container = document.createElement('div');
            container.classList.add('card');
            this.domContainer.appendChild(container);

            let el = document.createElement('div');
            el.textContent = 'maxTemperature: ' + weatherData.maxTemperature;
            container.appendChild(el);

            el = document.createElement('div');
            el.textContent = 'description: ' + weatherData.description;
            container.appendChild(el);

            el = document.createElement('img');
            el.setAttribute('src', weatherData.icon);
            container.appendChild(el);

            el = document.createElement('div');
            el.textContent = 'date: ' + weatherData.date.toString();
            container.appendChild(el);

            el = document.createElement('div');
            el.textContent = 'minTemperature: ' + weatherData.minTemperature;
            container.appendChild(el);

            el = document.createElement('div');
            el.textContent = 'precipitation: ' + weatherData.precipitation;
            container.appendChild(el);

            el = document.createElement('div');
            el.textContent = 'humidity: ' + weatherData.humidity;
            container.appendChild(el);

            el = document.createElement('div');
            el.textContent = 'wind: ' + weatherData.wind.toFixed(2);
            container.appendChild(el);
        })
    }
}

export default WeatherList;