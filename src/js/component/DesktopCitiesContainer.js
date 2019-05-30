import CitiesContainer from "./CitiesContainer";

class DesktopCitiesContainer extends CitiesContainer {

    constructor(handlerFactories, eventDispatcher) {
        super(handlerFactories, eventDispatcher);
        this.domContainer.classList.add('desktop-cities__container');
    }

    render(newState) {
        this.clear();

        const cityListContainer = document.createElement('div');
        cityListContainer.classList.add('city-list');
        this.domContainer.appendChild(cityListContainer);

        super.createContent(newState, cityListContainer);
    }

}

export default DesktopCitiesContainer;