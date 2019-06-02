import Component from '../Component';
import City from "./City/City";
import WheelPlaceholder from "../wheel/WheelPlaceholder";
import AddCityForm from "./AddCityForm/AddCityForm";
import EventDispatcher from '../../service/EventDispatcher';
import CitiesState from '../../entity/CitiesState';

/**
 * base class for cities container, contains similiar city list rendering logic
 */
class BaseCitiesContainer extends Component{

    /**
     * @param {Object} handlerFactories
     * @param {EventDispatcher} eventDispatcher
     */
    constructor(handlerFactories, eventDispatcher) {
        super();
        this.handlerFactories = handlerFactories;
        this.eventDispatcher = eventDispatcher;
    }

    /**
     * @param {CitiesState} newState
     */
    render(newState) {
        this.clear();
        this.createContent(newState, this.domContainer)
    }

    /**
     * @param {CitiesState} newState
     * @param {HTMLElement} container
     */
    createContent (newState, container) {
        newState.getCities().forEach(cityModel => {
            const cityComponent = new City();
            cityComponent.render(
                cityModel,
                this.handlerFactories.deleteCity(cityModel),
                this.handlerFactories.clickCity(cityModel),
                cityModel.getId() === newState.getActiveCity().getId()
            );

            container.appendChild(cityComponent.getDomContainer());
        });

        const wheel = new WheelPlaceholder();
        container.appendChild(wheel.getDomContainer());
        this.wheel = wheel;

        const addCityForm = new AddCityForm(this.eventDispatcher);
        container.appendChild(addCityForm.getDomContainer());
        addCityForm.render(this.handlerFactories.addCity());
        this.addCityForm = addCityForm;
    }

    /**
     * dispalys loading wheel
     */
    displayWheel() {
        this.wheel.render();
    }

    /**
     * hides loading wheel
     */
    hideWheel () {
        this.wheel.clear();
    }

    /**
     * @param {string[]} errors
     */
    displayValidationErrors (errors) {
        this.addCityForm.displayValidationErrors(errors);
    }
}

export default BaseCitiesContainer