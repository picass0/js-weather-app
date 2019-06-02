import BaseCitiesContainer from '../BaseCitiesContainer';
import CitiesState from '../../../entity/CitiesState';

import './DesktopCities.scss';

/**
 * Component that render city list for desktop screen width
 */
class DesktopCities extends BaseCitiesContainer {

    /**
     * @param {Object} handlerFactories
     * @param {function} eventDispatcher
     */
    constructor(handlerFactories, eventDispatcher) {
        super(handlerFactories, eventDispatcher);
        this.domContainer.classList.add('desktop-cities');
    }

    /**
     * @param {CitiesState} newState
     */
    render(newState) {
        this.clear();

        const cityListContainer = document.createElement('div');
        this.domContainer.appendChild(cityListContainer);

        super.createContent(newState, cityListContainer);
    }

}

export default DesktopCities;