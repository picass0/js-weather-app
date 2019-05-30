import Component from './Component';
import cityNameValidator from '../validator/cityNameValidator';
import EventDispatcher from "../service/EventDispatcher";
import DesktopCitiesContainer from "./DesktopCitiesContainer";
import MobileCitiesContainer from "./MobileCitiesContainer";

/**
 *
 */
class CityList extends Component{

    /**
     * @param {EventDispatcher} eventDispatcher
     * @param {cityNameValidator} cityNameValidator
     */
    constructor(eventDispatcher, cityNameValidator) {
        super();

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
            new DesktopCitiesContainer(handlerFactories, this.localEventDispatcher),
            new MobileCitiesContainer(handlerFactories, this.localEventDispatcher)
        ];

        this.containers.forEach((container) => {
            this.domContainer.appendChild(container.getDomContainer());
        });

    }

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
     * @param city
     */
    deleteCityHandlerFactory (city) {
        return () => {
            this.eventDispatcher.publish('deleteCity', city);
        }
    }

    /**
     * @returns {null|string}
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

    displayValidationErrors(errors) {
        this.containers.forEach((container) => {
            container.hideWheel();
            container.displayValidationErrors(errors);
        });
    }
}

export default CityList;