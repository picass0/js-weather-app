import BaseCitiesContainer from "../BaseCitiesContainer";

import './DesktopCities.scss';

class DesktopCities extends BaseCitiesContainer {

    constructor(handlerFactories, eventDispatcher) {
        super(handlerFactories, eventDispatcher);
        this.domContainer.classList.add('desktop-cities');
    }

    render(newState) {
        this.clear();

        const cityListContainer = document.createElement('div');
        this.domContainer.appendChild(cityListContainer);

        super.createContent(newState, cityListContainer);
    }

}

export default DesktopCities;