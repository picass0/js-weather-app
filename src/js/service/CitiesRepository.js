import CitiesState from '../entity/CitiesState';
import CitiesStateFactory from './CitiesStateFactory';

/**
 * fetches CitiesState from localStorage
 * and saves CityState to localStorage
 */
class CitiesRepository {

    /**
     * @returns {CitiesState}
     */
    fetchState() {
        const jsonString = localStorage.getItem('CitiesState');

        if (!jsonString) {
            return null;
        }

        const parsedJson = JSON.parse(jsonString);

        return CitiesStateFactory.createFromRawJson(parsedJson);
    }

    /**
     * @param {CitiesState} state
     */
    persisState(state) {
        const json = state.toJson();
        localStorage.setItem('CitiesState', JSON.stringify(json));
    }
}

export default CitiesRepository;