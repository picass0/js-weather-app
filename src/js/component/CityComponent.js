import Component from './Component';

class CityComponent extends Component {

    constructor() {
        super();
        this.domContainer.classList.add('card')
    }

    render (cityModel, deleteHandler, clickHandler, isActiveCity, isHomeCity) {
        this.clear();
        this.domContainer.addEventListener('click', clickHandler);

        const cityName = document.createElement('h3');
        cityName.textContent = cityModel.name;
        this.domContainer.appendChild(cityName);

        if (isActiveCity) {
            this.domContainer.style.background = 'red';
        }

        if (!isHomeCity) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHandler(e)
            });
            this.domContainer.appendChild(deleteButton);
        }
    }
}

export default CityComponent;