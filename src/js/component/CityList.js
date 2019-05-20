import Component from './Component';
import CityComponent from './CityComponent';
import AddCityForm from './AddCityForm';
import cityNameValidator from '../validator/cityNameValidator';

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
    }

    render (newState) {
        this.clear();

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

        this.eventDispatcher.publish('addCity', cityName);
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
    }
}

export default CityList;