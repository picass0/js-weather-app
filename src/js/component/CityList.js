import Component from './Component';
import CityComponent from './CityComponent';
import AddCityForm from './AddCityForm';
import cityNameValidator from '../validator/cityNameValidator';
import WheelPlaceholder from "./WheelPlaceholder";

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
        this.addCityHandler = this.addCityHandler.bind(this);
        this.deleteCityHandler = this.deleteCityHandler.bind(this);
        this.clickCityHandler = this.clickCityHandler.bind(this);

        this.eventDispatcher = eventDispatcher;
        this.cityNameValidator = cityNameValidator;
        this.addCityForm = null;
        this.wheel = null;
        this.cityBeingAdded = false;
    }

    render (newState) {
        this.clear();
        this.cityBeingAdded = false;

        newState.getCities().forEach(cityModel => {
            const cityComponent = new CityComponent();
            cityComponent.render(
                cityModel,
                this.deleteCityHandler.bind(this, cityModel),
                this.clickCityHandler.bind(this, cityModel),
                cityModel.getId() === newState.getActiveCity().getId()
            );
            this.domContainer.appendChild(cityComponent.getDomContainer());
        });

        const wheel = new WheelPlaceholder();
        this.domContainer.appendChild(wheel.getDomContainer());
        this.wheel = wheel;

        const addCityForm = new AddCityForm();
        this.domContainer.appendChild(addCityForm.getDomContainer());
        addCityForm.render(this.addCityHandler);
        this.addCityForm = addCityForm;
    }

    /**
     * @param cityName
     */
    addCityHandler (cityName) {
        const validationResult = this.cityNameValidator(cityName);
        if (!validationResult.success) {
            this.addCityForm.displayValidationErrors(validationResult.errors);
            return;
        }
        this.cityBeingAdded = true;
        this.wheel.render();
        this.eventDispatcher.publish('addCity', cityName);
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
        this.cityBeingAdded = cityBeingAdded
        if (!cityBeingAdded) {
            this.wheel.clear();
        }
    }

    /**
     * @param city
     */
    clickCityHandler (city) {
        this.eventDispatcher.publish('clickCity', city);
    }

    /**
     * @param city
     */
    deleteCityHandler (city) {
        this.eventDispatcher.publish('deleteCity', city);


    }

    displayValidationErrors(errors) {
        this.addCityForm.displayValidationErrors(errors);
        this.wheel.clear();
    }
}

export default CityList;