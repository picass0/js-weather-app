import Component from '../Component';
import City from "./City/City";
import WheelPlaceholder from "../wheel/WheelPlaceholder";
import AddCityForm from "./AddCityForm/AddCityForm";

class BaseCitiesContainer extends Component{
    constructor(handlerFactories, eventDispatcher) {
        super();
        this.handlerFactories = handlerFactories;
        this.eventDispatcher = eventDispatcher;
    }

    render(newState) {
        this.clear();
        this.createContent(newState, this.domContainer)
    }

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

    displayWheel() {
        this.wheel.render();
    }

    hideWheel () {
        this.wheel.clear();
    }

    displayValidationErrors (errors) {
        this.addCityForm.displayValidationErrors(errors);
    }
}

export default BaseCitiesContainer