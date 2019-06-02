import Component from '../Component';
import cityNameValidator from '../../validator/cityNameValidator';
import EventDispatcher from "../../service/EventDispatcher";
import DesktopCities from "./DesktopCities/DesktopCities";
import MobileCities from "./MobileCities/MobileCities";
import CitiesState from '../../entity/CitiesState';
import City from '../../entity/City';

import './CitiesMain.scss';

/**
 * Main Cities component, wraps all other city list related components,
 * handles interaction between them and outside
 */
class CitiesMain extends Component{

    /**
     * @param {EventDispatcher} eventDispatcher
     * @param {cityNameValidator} cityNameValidator
     * @param {HTMLElement|null} domContainer
     */
    constructor(eventDispatcher, cityNameValidator, domContainer = null) {
        super(domContainer);
        this.domContainer.classList.add('cities-main');

        this.eventDispatcher = eventDispatcher;
        this.cityNameValidator = cityNameValidator;
        this.cityBeingAdded = false;

        this.localEventDispatcher = new EventDispatcher(this.domContainer);
        const handlerFactories = {
            addCity: this.addCityHandlerFactory.bind(this),
            clickCity: this.clickCityHandlerFactory.bind(this),
            deleteCity: this.deleteCityHandlerFactory.bind(this)
        };
        this.containers = [
            new DesktopCities(handlerFactories, this.localEventDispatcher),
            new MobileCities(handlerFactories, this.localEventDispatcher)
        ];

        this.containers.forEach((container) => {
            this.domContainer.appendChild(container.getDomContainer());
        });
    }

    /**
     * @param {CitiesState} newState
     */
    render (newState) {
        this.cityBeingAdded = false;

        this.containers.forEach(container => {
            container.render(newState)
        });
    }

    /**
     *
     * @returns {Function}
     */
    addCityHandlerFactory () {
        return (cityName) => {
            const validationResult = this.cityNameValidator(cityName);
            if (!validationResult.success) {
                this.containers.forEach((container) => {
                    container.displayValidationErrors(validationResult.errors);
                });
                return;
            }
            this.cityBeingAdded = true;
            this.containers.forEach((container) => {
                container.displayWheel();
            });

            this.eventDispatcher.publish('addCity', cityName);
        };
    }

    /**
     * @returns {Function}
     */
    clickCityHandlerFactory (city) {
        return () => {
            this.eventDispatcher.publish('clickCity', city);
        };
    }

    /**
     * @param {City} city
     */
    deleteCityHandlerFactory (city) {
        return () => {
            this.eventDispatcher.publish('deleteCity', city);
        }
    }

    /**
     * @returns {boolean}
     */
    isCityBeingAdded () {
        return this.cityBeingAdded;
    }

    /**
     * @param {boolean} cityBeingAdded
     */
    setCityBeingAdded (cityBeingAdded) {
        this.cityBeingAdded = cityBeingAdded;
        if (!cityBeingAdded) {
            this.containers.forEach((container) => {
                container.hideWheel();
            });
        }
    }

    /**
     * @param {string[]} errors
     */
    displayValidationErrors(errors) {
        this.containers.forEach((container) => {
            container.hideWheel();
            container.displayValidationErrors(errors);
        });
    }
}

export default CitiesMain;