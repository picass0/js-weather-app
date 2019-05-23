import Component from './Component';


class WeatherList extends Component{

    render(city, weatherDataCollection) {
        this.clear();

        if (!city) {
            return;
        }

        const header = document.createElement('h3');
        header.textContent = `Погода для города ${city.getNameOrStateIfNotExists()}:`;
        this.domContainer.appendChild(header);

        weatherDataCollection.forEach((weatherData) => {
            const el = document.createElement('div');
            el.setAttribute('class', 'card');
            el.textContent = weatherData.temperature;
            this.domContainer.appendChild(el);

        })
    }
}

export default WeatherList;