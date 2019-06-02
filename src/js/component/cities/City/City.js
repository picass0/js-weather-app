import Component from '../../Component';
import CityModel from '../../../entity/City';

import './City.scss';

class City extends Component {

    constructor() {
        super();
        this.domContainer.classList.add('city')
    }

    /**
     *
     * @param {CityModel} cityModel
     * @param deleteHandler
     * @param clickHandler
     * @param isActiveCity
     */
    render (cityModel, deleteHandler, clickHandler, isActiveCity) {
        this.clear();
        this.domContainer.addEventListener('click', clickHandler);

        const cityName = document.createElement('div');
        cityName.classList.add('city__item');
        cityName.textContent = cityModel.getName();
        this.domContainer.appendChild(cityName);

        let postfix = ',';
        let tagName = 'span';
        if (!cityModel.getName()) {
            tagName = 'div';
            postfix = '';
        }
        const cityState = document.createElement(tagName);
        cityState.classList.add('city__item');
        cityState.textContent = cityModel.getState() + postfix;
        this.domContainer.appendChild(cityState);

        const cityCountry = document.createElement('span');
        cityCountry.classList.add('city__item');
        cityCountry.textContent = cityModel.getCountry();
        this.domContainer.appendChild(cityCountry);

        if (isActiveCity) {
            this.domContainer.classList.add('city--active');
        }

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('city__delete', 'far', 'fa-times-circle');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHandler(e)
        });
        this.domContainer.appendChild(deleteButton);
    }
}

export default City;