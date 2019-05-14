import Component from './Component';
import CityComponent from './CityComponent';
import AddCityForm from './AddCityForm';
import cityNameValidator from '../validator/cityNameValidator';

/**
 * todo avoid full rerender in event handlers
 */
class CityList extends Component{

    /**
     * @param {CitiesState} citiesState
     * @param {EventDispatcher} eventDispatcher
     * @param {cityNameValidator} cityNameValidator
     */
    constructor(citiesState, eventDispatcher, cityNameValidator) {
        super();
        this.addCityHandler = this.addCityHandler.bind(this);
        this.deleteCityHandler = this.deleteCityHandler.bind(this);
        this.clickCityHandler = this.clickCityHandler.bind(this);

        this.state = citiesState;
        this.eventDispatcher = eventDispatcher;
        this.cityNameValidator = cityNameValidator;
        this.addCityForm = null;
    }

    render () {
        this.clear();

        this.state.getCities().forEach(cityModel => {
            const cityComponent = new CityComponent();
            cityComponent.render(
                cityModel,
                this.deleteCityHandler.bind(this, cityModel),
                this.clickCityHandler.bind(this, cityModel),
                cityModel.id === this.state.getActiveCity().id,
                cityModel.id === this.state.getHomeCity().id
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

        this.state.addCity({name: cityName});
        this.render();
        this.eventDispatcher.publish('stateChanged', this.state);
        this.eventDispatcher.publish('activeCityChanged', this.state);
    }

    /**
     * @param city
     */
    clickCityHandler (city) {
        this.state.setActiveCity(city);
        this.render();
        this.eventDispatcher.publish('activeCityChanged', this.state);
        this.eventDispatcher.publish('stateChanged', this.state);
    }

    /**
     * @param city
     */
    deleteCityHandler (city) {
        let activeCityDeleted = false;
        if (this.state.getActiveCity().id === city.id) {
            activeCityDeleted = true;
        }
        this.state.removeCity(city);
        this.render();
        this.eventDispatcher.publish('stateChanged', this.state);

        if (activeCityDeleted) {
            this.eventDispatcher.publish('activeCityChanged', this.state);
        }

    }
}

export default CityList;